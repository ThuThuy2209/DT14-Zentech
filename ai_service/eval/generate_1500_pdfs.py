"""Script phân tích bảng CSV 1500 chứng từ, sinh 1500 file PDF hóa đơn và file benchmark_1500.json."""

import csv
import json
import os
import pathlib
import re

CURRENT_DIR = pathlib.Path(__file__).resolve().parent
INVOICES_DIR = CURRENT_DIR / "invoices_1500"
INVOICES_DIR.mkdir(parents=True, exist_ok=True)
BENCHMARK_JSON = CURRENT_DIR / "benchmark_1500.json"


def create_invoice_pdf(data: dict, out_path: pathlib.Path):
    """Tạo file PDF hóa đơn chuẩn 1.4 thuần Python, tương thích 100% với pdfplumber."""
    stt = data.get("STT", "")
    inv_no = data.get("Số hóa đơn", f"{int(stt):06d}")
    ky_hieu = data.get("Ký hiệu hóa đơn", "1C26MSV")
    inv_date = data.get("Ngày lập", "2026-01-01")
    seller_name = data.get("Tên bên bán", "")
    seller_tax = data.get("MST bên bán (giả lập)", "")
    seller_addr = data.get("Địa chỉ bên bán (giả lập)", "")
    buyer_name = data.get("Tên bên mua", "Công ty TNHH Một thành viên Minh Software")
    buyer_tax = data.get("MST bên mua", "0319002001")
    buyer_addr = data.get("Địa chỉ bên mua", "Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM")

    item_name = data.get("Tên hàng hóa/dịch vụ", "")
    dvt = data.get("ĐVT", "Gói")
    sl = data.get("Số lượng", "1")
    don_gia = float(data.get("Đơn giá (VNĐ)", 0))
    subtotal = float(data.get("Tiền trước thuế (VNĐ)", 0))
    thue_suat = data.get("Thuế suất mô phỏng", "10%")
    vat = float(data.get("Tiền thuế (VNĐ)", 0))
    total = float(data.get("Tổng thanh toán (VNĐ)", 0))
    ghi_chu = data.get("Ghi chú", "")

    lines = [
        "HOA DON GIA TRI GIA TANG",
        "(HOA DON MUA VAO - DU LIEU MO PHONG)",
        f"Mau so: 01GTKT Ky hieu: {ky_hieu} So hoa don: {inv_no} Ngay: {inv_date}",
        "-" * 85,
        f"DON VI BAN HANG (NGUOI BAN): {seller_name}",
        f"Ma so thue ben ban: {seller_tax}",
        f"Dia chi: {seller_addr}",
        "-" * 85,
        f"DON VI MUA HANG (NGUOI MUA): {buyer_name}",
        f"Ma so thue ben mua: {buyer_tax}",
        f"Dia chi: {buyer_addr}",
        "-" * 85,
        "STT | TEN HANG HOA, DICH VU | DVT | SL | DON GIA | THANH TIEN",
        f"1 | {item_name} | {dvt} | {sl} | {don_gia:,.0f} | {subtotal:,.0f} VND",
        "-" * 85,
        f"Cong tien hang (chua thue): {subtotal:,.0f} VND",
        f"Tien thue GTGT ({thue_suat}): {vat:,.0f} VND",
        f"TONG CONG TIEN THANH TOAN: {total:,.0f} VND",
        "Han thanh toan: 30 ngay ke tu ngay lap hoa don",
    ]
    if ghi_chu:
        lines.append(f"Ghi chu kiem thu: {ghi_chu}")
    lines.append("NGUOI MUA HANG               NGUOI BAN HANG")
    lines.append("(Ky, ghi ro ho ten)          (Ky, ghi ro ho ten)")

    # Xây dựng PDF Stream
    stream_content = "BT\n/F1 9 Tf\n40 800 Td\n15 TL\n"
    for line in lines:
        clean = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        stream_content += f"({clean}) '\n"
    stream_content += "ET"
    stream_bytes = stream_content.encode("latin1", errors="replace")

    pdf = bytearray()
    pdf.extend(b"%PDF-1.4\n")
    offsets = []

    def add_obj(obj_str):
        offsets.append(len(pdf))
        pdf.extend(obj_str.encode("latin1"))

    add_obj("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    add_obj("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    add_obj(
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n"
    )
    add_obj(f"4 0 obj\n<< /Length {len(stream_bytes)} >>\nstream\n")
    pdf.extend(stream_bytes)
    pdf.extend(b"\nendstream\nendobj\n")
    add_obj("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(offsets)+1}\n0000000000 65535 f \n".encode("latin1"))
    for off in offsets:
        pdf.extend(f"{off:010d} 00000 n \n".encode("latin1"))

    pdf.extend(
        f"trailer\n<< /Size {len(offsets)+1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode(
            "latin1"
        )
    )

    with open(out_path, "wb") as f:
        f.write(pdf)
