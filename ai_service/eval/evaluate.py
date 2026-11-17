"""Evaluation script for the OCR invoice extraction endpoint.

It reads `ground_truth.json` containing 25 test invoice samples and sends each
sample PDF to the AI service extraction endpoint (`/api/v1/ai/invoices/extract-ocr`),
then compares extracted fields with ground truth and calculates Precision, Recall, and F1.

Usage:
    cd ai_service
    python -m eval.evaluate
    # or
    python eval/evaluate.py
"""

from __future__ import annotations

import json
import os
import pathlib
import sys
from typing import Any, Dict, List

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

if not HAS_REQUESTS and not HAS_HTTPX:
    print("[ERROR] Cần cài đặt thư viện 'requests' hoặc 'httpx'. Hãy chạy: pip install requests", file=sys.stderr)
    sys.exit(1)

BASE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:5000").rstrip("/")
CURRENT_DIR = pathlib.Path(__file__).resolve().parent
GROUND_TRUTH_PATH = CURRENT_DIR / "ground_truth.json"


def load_ground_truth() -> List[Dict[str, Any]]:
    """Tải danh sách test cases từ ground_truth.json."""
    if not GROUND_TRUTH_PATH.exists():
        raise FileNotFoundError(f"Không tìm thấy file ground truth tại: {GROUND_TRUTH_PATH}")
    with open(GROUND_TRUTH_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def post_invoice(file_path: pathlib.Path) -> Dict[str, Any]:
    """Gửi file PDF hóa đơn đến endpoint trích xuất OCR của AI Service."""
    url = f"{BASE_URL}/api/v1/ai/invoices/extract-ocr"
    with open(file_path, "rb") as f:
        files = {"file": (file_path.name, f, "application/pdf")}
        if HAS_REQUESTS:
            resp = requests.post(url, files=files, timeout=30)
            resp.raise_for_status()
            payload = resp.json()
        else:
            with httpx.Client(timeout=30.0) as client:
                resp = client.post(url, files=files)
            resp.raise_for_status()
            payload = resp.json()
    return payload.get("data") or {}


def flatten_invoice(data: Dict[str, Any]) -> Dict[str, Any]:
    """Lọc các trường dữ liệu cấp 1 để so sánh đối chiếu."""
    fields_to_compare = [
        "supplier_tax_id",
        "supplier_name",
        "buyer_tax_id",
        "invoice_number",
        "invoice_date",
        "total_amount",
    ]
    flat = {}
    for k in fields_to_compare:
        val = data.get(k)
        if isinstance(val, (int, float)):
            flat[k] = f"{float(val):.2f}"
        else:
            flat[k] = str(val or "").strip().lower()
    return flat


def compute_metrics(pred: Dict[str, Any], true: Dict[str, Any]) -> Dict[str, float]:
    """Tính Precision, Recall và F1 score cho 1 hóa đơn so với Ground Truth."""
    keys = set(true.keys())
    if not keys:
        return {"precision": 1.0, "recall": 1.0, "f1": 1.0}

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
    print("=" * 65)
    print(" BỘ ĐÁNH GIÁ ĐỘ CHÍNH XÁC AI SERVICE (25 HÓA ĐƠN MẪU)")
    print(f" Target Service URL: {BASE_URL}")
    print("=" * 65)

    try:
        cases = load_ground_truth()
    except Exception as e:
        print(f"[LỖI] Không thể đọc ground truth: {e}", file=sys.stderr)
        return

    scores = []
    print(f"{'Hóa đơn':<18} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10} | {'Trạng thái'}")
    print("-" * 65)

    for case in cases:
        raw_path = case.get("file_path", "")
        # Tìm file theo nhiều cấp thư mục (gốc repo, ai_service, hoặc eval)
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
            result = post_invoice(file_path)
            score = compute_metrics(flatten_invoice(result), flatten_invoice(expected))
            scores.append(score)
            status = "PASS" if score["f1"] >= 0.8 else "WARN"
            print(f"{fn:<18} | {score['precision']:<10.2f} | {score['recall']:<10.2f} | {score['f1']:<10.2f} | [{status}]")
        except Exception as err:
            print(f"{fn:<18} | {'ERR':<10} | {'ERR':<10} | {'ERR':<10} | [{type(err).__name__}]")

    if not scores:
        print("-" * 65)
        print("[!] Không có mẫu nào được đánh giá thành công.")
        print("[Gợi ý] Hãy chắc chắn AI Service đang chạy tại http://127.0.0.1:5000 bằng lệnh:")
        print("        uvicorn main:app --reload --port 5000")
        return

    n = len(scores)
    avg_p = sum(s["precision"] for s in scores) / n
    avg_r = sum(s["recall"] for s in scores) / n
    avg_f1 = sum(s["f1"] for s in scores) / n

    print("-" * 65)
    print(f"Tổng số mẫu kiểm thử thành công: {n}/{len(cases)}")
    print(f"Macro-Averaged Precision: {avg_p:.3f} ({avg_p*100:.1f}%)")
    print(f"Macro-Averaged Recall:    {avg_r:.3f} ({avg_r*100:.1f}%)")
    print(f"Macro-Averaged F1-Score:  {avg_f1:.3f} ({avg_f1*100:.1f}%)")
    print("=" * 65)


if __name__ == "__main__":
    main()
