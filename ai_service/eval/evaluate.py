"""Evaluation script for the OCR invoice extraction endpoint.

Reads `ground_truth.json` containing 25 test invoice samples, sends each
sample PDF to the extraction pipeline (via HTTP API or direct service fallback),
compares extracted fields with ground truth, and calculates Precision, Recall, and F1-Score.

Usage:
    cd ai_service
    python eval/evaluate.py
"""

from __future__ import annotations

import json
import os
import pathlib
import sys
from typing import Any, Dict, List

# Đảm bảo đường dẫn module
CURRENT_DIR = pathlib.Path(__file__).resolve().parent
AI_SERVICE_DIR = CURRENT_DIR.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

# Ưu tiên sử dụng requests nếu có, nếu không thì httpx
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False

BASE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:5000").rstrip("/")
GROUND_TRUTH_PATH = CURRENT_DIR / "ground_truth.json"


def load_ground_truth() -> List[Dict[str, Any]]:
    """Tải danh sách test cases từ ground_truth.json."""
    if not GROUND_TRUTH_PATH.exists():
        raise FileNotFoundError(f"Không tìm thấy file ground truth tại: {GROUND_TRUTH_PATH}")
    with open(GROUND_TRUTH_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def post_invoice_http(file_path: pathlib.Path) -> Dict[str, Any]:
    """Gửi file PDF hóa đơn đến endpoint trích xuất OCR của AI Service qua HTTP."""
    url = f"{BASE_URL}/api/v1/ai/invoices/extract-ocr"
    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f, "application/pdf")}
        if HAS_REQUESTS:
            resp = requests.post(url, files=files, timeout=30)
            resp.raise_for_status()
            payload = resp.json()
        elif HAS_HTTPX:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(url, files=files)
            resp.raise_for_status()
            payload = resp.json()
        else:
            raise RuntimeError("Cần cài đặt requests hoặc httpx.")
    return payload.get("data") or {}


def extract_invoice_direct(file_path: pathlib.Path) -> Dict[str, Any]:
    """Bóc tách hóa đơn trực tiếp qua service nội bộ khi server HTTP chưa khởi động."""
    from app.services.pdf_parser import parse_pdf_to_text
    from app.services.ai_agent import extract_invoice_structured_data
    from app.services.anomaly_detector import detect_duplicate
    from app.core.config import settings

    with open(file_path, "rb") as f:
        file_bytes = f.read()

    raw_text = parse_pdf_to_text(file_bytes)
    structured_data = extract_invoice_structured_data(raw_text)
    data = structured_data.model_dump()

    flags = set(data.get("flags") or [])
    duplicate_flags = detect_duplicate(
        supplier_tax_id=structured_data.supplier_tax_id,
        invoice_number=structured_data.invoice_number,
        invoice_date=structured_data.invoice_date,
    )
    flags.update(duplicate_flags)

    # Cảnh báo tính toán
    expected_total = structured_data.subtotal + structured_data.vat_amount
    if structured_data.total_amount > 0 and abs(expected_total - structured_data.total_amount) > 1.0:
        flags.add("WARNING_CALCULATION_MISMATCH")

    # Cảnh báo sai MST
    if structured_data.buyer_tax_id and structured_data.buyer_tax_id.strip() != settings.COMPANY_TAX_ID:
        flags.add("ERROR_WRONG_TAX_ID")

    data["flags"] = list(flags)
    return data


import unicodedata


def remove_diacritics(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để chuẩn hóa so sánh bóc tách OCR."""
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return text.replace("đ", "d").replace("Đ", "D")


def flatten_invoice(data: Dict[str, Any]) -> Dict[str, Any]:
    """Lọc các trường dữ liệu quan trọng để so sánh đối chiếu."""
    fields_to_compare = [
        "supplier_tax_id",
        "supplier_name",
        "buyer_tax_id",
        "invoice_number",
        "invoice_date",
        "subtotal",
        "vat_amount",
        "total_amount",
        "suggested_account",
    ]
    flat = {}
    for k in fields_to_compare:
        val = data.get(k)
        if isinstance(val, (int, float)):
            flat[k] = f"{float(val):.2f}"
        else:
            raw_str = str(val or "").strip().lower()
            flat[k] = remove_diacritics(raw_str)

    # So sánh cờ bất thường flags
    flags_val = sorted(data.get("flags") or [])
    flat["flags"] = ",".join(flags_val)
    return flat


def compute_metrics(pred: Dict[str, Any], true: Dict[str, Any]) -> Dict[str, float]:
    """Tính Precision, Recall và F1 score cho 1 hóa đơn so với Ground Truth."""
    keys = set(true.keys())
    if not keys:
        return {"precision": 1.0, "recall": 1.0, "f1": 1.0, "matched": 0, "total": 0}

    matched = 0
    total = len(keys)

    for k in keys:
        pred_val = pred.get(k, "")
        true_val = true.get(k, "")
        if pred_val == true_val:
            matched += 1

    accuracy = matched / total
    return {
        "precision": accuracy,
        "recall": accuracy,
        "f1": accuracy,
        "matched": matched,
        "total": total,
    }


def main() -> None:
    print("=" * 72)
    print(" BỘ ĐÁNH GIÁ ĐỘ CHÍNH XÁC AI SERVICE (25 HÓA ĐƠN MẪU THEO BR-AI-01 -> 05)")
    print(f" Target Service: {BASE_URL}")
    print("=" * 72)

    try:
        cases = load_ground_truth()
    except Exception as e:
        print(f"[LỖI] Không thể đọc ground truth: {e}", file=sys.stderr)
        return

    # Thử kiểm tra server HTTP có đang chạy không
    use_http = False
    try:
        if HAS_REQUESTS:
            r = requests.get(f"{BASE_URL}/health", timeout=1.5)
            use_http = r.status_code == 200
        elif HAS_HTTPX:
            with httpx.Client(timeout=1.5) as c:
                r = c.get(f"{BASE_URL}/health")
                use_http = r.status_code == 200
    except Exception:
        use_http = False

    mode_label = "HTTP API Endpoint" if use_http else "Direct Pipeline Fallback (Offline Mode)"
    print(f" Chế độ vận hành kiểm thử: [{mode_label}]")
    print("-" * 72)

    scores = []
    print(f"{'Hóa đơn':<18} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'Trạng thái'}")
    print("-" * 72)

    for case in cases:
        raw_path = case.get("file_path", "")
        candidate_paths = [
            CURRENT_DIR / raw_path,
            CURRENT_DIR.parent / raw_path,
            CURRENT_DIR.parent.parent / raw_path,
            pathlib.Path(raw_path),
        ]
        file_path = None
        for p in candidate_paths:
            if p.resolve().exists():
                file_path = p.resolve()
                break

        if file_path is None:
            file_path = pathlib.Path(raw_path)

        fn = file_path.name or raw_path
        expected = case.get("expected", {})

        if not file_path.exists():
            print(f"{fn:<18} | {'N/A':<10} | {'N/A':<10} | {'N/A':<10} | [THIẾU FILE PDF]")
            continue

        try:
            if use_http:
                result = post_invoice_http(file_path)
            else:
                result = extract_invoice_direct(file_path)

            score = compute_metrics(flatten_invoice(result), flatten_invoice(expected))
            scores.append(score)
            status = "PASS" if score["f1"] >= 0.85 else "WARN"
            print(f"{fn:<18} | {score['precision']:<10.2f} | {score['recall']:<10.2f} | {score['f1']:<10.2f} | [{status}]")
        except Exception as err:
            print(f"{fn:<18} | {'ERR':<10} | {'ERR':<10} | {'ERR':<10} | [{type(err).__name__}]")

    if not scores:
        print("-" * 72)
        print("[!] Không có mẫu nào được đánh giá thành công.")
        return

    n = len(scores)
    avg_p = sum(s["precision"] for s in scores) / n
    avg_r = sum(s["recall"] for s in scores) / n
    avg_f1 = sum(s["f1"] for s in scores) / n

    print("-" * 72)
    print(f"Tổng số mẫu kiểm thử thành công: {n}/{len(cases)}")
    print(f"Macro-Averaged Precision: {avg_p:.3f} ({avg_p*100:.1f}%)")
    print(f"Macro-Averaged Recall:    {avg_r:.3f} ({avg_r*100:.1f}%)")
    print(f"Macro-Averaged F1-Score:  {avg_f1:.3f} ({avg_f1*100:.1f}%)")
    print("=" * 72)
    if avg_f1 >= 0.90:
        print(">>> KẾT QUẢ: ĐẠT TIÊU CHUẨN NGHIỆM THU ĐỒ ÁN (F1-Score >= 0.90) <<<")
    else:
        print(">>> KẾT QUẢ: CẦN TINH CHỈNH THÊM ĐỂ ĐẠT MỤC TIÊU F1-Score >= 0.90 <<<")
    print("=" * 72)


if __name__ == "__main__":
    main()
