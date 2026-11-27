"""Xử lý trích xuất dữ liệu từ file Excel 1.500 chứng từ của người dùng,
tạo 1.500 file PDF hóa đơn thực tế và file benchmark_1500.json.
"""

import csv
import datetime
import json
import os
import pathlib
import re
import sys
import xml.etree.ElementTree as ET
import zipfile

CURRENT_DIR = pathlib.Path(__file__).resolve().parent
INVOICES_DIR = CURRENT_DIR / "invoices_1500"
INVOICES_DIR.mkdir(parents=True, exist_ok=True)
CSV_OUT = CURRENT_DIR / "invoices_1500_dataset.csv"
BENCHMARK_JSON = CURRENT_DIR / "benchmark_1500.json"

XLSX_PATH = r"C:/Users/Yen Vy/.gemini/antigravity/brain/abfa42a8-9d33-4cdd-8a71-99d25af8631b/.user_uploaded/media_1795746077519_0d2e7f37.xlsx"


def excel_date_to_str(val: str) -> str:
    """Chuyển đổi số serial date của Excel sang định dạng chuẩn YYYY-MM-DD."""
    if val and val.isdigit():
        base = datetime.date(1899, 12, 30)
        return (base + datetime.timedelta(days=int(val))).strftime("%Y-%m-%d")
    return val


def parse_xlsx(file_path):
    """Đọc dữ liệu sheet1 từ file xlsx bằng zipfile và xml.etree thuần Python."""
    with zipfile.ZipFile(file_path) as z:
        # 1. Đọc shared strings
        shared_strings = []
        if "xl/sharedStrings.xml" in z.namelist():
            tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
            for si in tree.findall("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si"):
                t = si.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")
                if t is not None and t.text is not None:
                    shared_strings.append(t.text)
                else:
                    texts = [
                        elem.text
                        for elem in si.iter(
                            "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"
                        )
                        if elem.text
                    ]
                    shared_strings.append("".join(texts))

        # 2. Đọc sheet1.xml
        sheet_tree = ET.fromstring(z.read("xl/worksheets/sheet1.xml"))
        rows = []
        for row_elem in sheet_tree.findall(
            ".//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row"
        ):
            cells = {}
            for c in row_elem.findall(
                "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c"
            ):
                cell_ref = c.get("r", "")
                cell_type = c.get("t", "")
                v = c.find("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v")
                val = v.text if v is not None else ""
                if cell_type == "s" and val.isdigit():
                    val = shared_strings[int(val)]

                col_letters = "".join(filter(str.isalpha, cell_ref))
                cells[col_letters] = val
            rows.append(cells)

    if not rows:
        return []

    header_row = rows[0]
    col_mapping = {col: header_row[col].strip() for col in header_row if header_row[col].strip()}

    data_records = []
    for r in rows[1:]:
        rec = {}
        for col, col_name in col_mapping.items():
            val = r.get(col, "").strip()
            if col_name == "Ngày lập":
                val = excel_date_to_str(val)
            rec[col_name] = val

        stt_val = rec.get("STT", "")
        if stt_val and stt_val.isdigit() and int(stt_val) <= 1500:
            data_records.append(rec)

    return data_records


def create_invoice_pdf(data: dict, out_path: pathlib.Path):
    """Tạo 1 file PDF hóa đơn chuẩn thuần Python."""
    inv_no = data.get("Số hóa đơn", "")
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

    try:
        don_gia = float(data.get("Đơn giá (VNĐ)", 0))
    except ValueError:
        don_gia = 0.0

    try:
        subtotal = float(data.get("Tiền trước thuế (VNĐ)", 0))
    except ValueError:
        subtotal = 0.0

    thue_suat = data.get("Thuế suất mô phỏng", "10%")

    try:
        vat = float(data.get("Tiền thuế (VNĐ)", 0))
    except ValueError:
        vat = 0.0

    try:
        total = float(data.get("Tổng thanh toán (VNĐ)", 0))
    except ValueError:
        total = 0.0

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


def main():
    print("=" * 75)
    print(" BẮT ĐẦU XỬ LÝ 1.500 CHỨNG TỪ TỪ FILE EXCEL")
    print(f" Source: {XLSX_PATH}")
    print("=" * 75)

    if not os.path.exists(XLSX_PATH):
        print(f"[LỖI] Không tìm thấy file excel tại: {XLSX_PATH}")
        return

    records = parse_xlsx(XLSX_PATH)
    print(f"Đã trích xuất thành công: {len(records)} chứng từ từ file Excel!")

    # 1. Lưu lại file CSV chuẩn
    if records:
        fieldnames = list(records[0].keys())
        with open(CSV_OUT, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(records)
        print(f"Đã lưu file CSV tại: {CSV_OUT}")

    # 2. Sinh 1.500 file PDF
    print("\nĐang tạo 1.500 file PDF hóa đơn...")
    benchmark_cases = []

    for idx, rec in enumerate(records):
        stt = int(rec.get("STT", idx + 1))
        pdf_name = f"HD_{stt:06d}.pdf"
        pdf_path = INVOICES_DIR / pdf_name

        create_invoice_pdf(rec, pdf_path)

        # Định khoản tài khoản theo nhóm chi phí
        nhom_cp = rec.get("Nhóm chi phí đề xuất", "").lower()
        if any(k in nhom_cp for k in ["máy tính", "công cụ", "thiết bị văn phòng", "tai nghe", "camera", "máy scan"]):
            account = "153"
        elif any(k in nhom_cp for k in ["hạ tầng", "phần mềm bản quyền", "máy chủ"]):
            account = "242"
        else:
            account = "642"

        # Cờ bất thường
        flags = []
        trang_thai = rec.get("Trạng thái kiểm tra", "")
        if stt == 1499 or "sai mst" in trang_thai.lower() or "sai mst" in rec.get("Ghi chú", "").lower():
            flags = ["ERROR_WRONG_TAX_ID"]
        elif stt == 1500 or "trùng" in trang_thai.lower() or "trung" in trang_thai.lower():
            flags = ["WARNING_DUPLICATE"]

        try:
            subtotal = float(rec.get("Tiền trước thuế (VNĐ)", 0))
        except ValueError:
            subtotal = 0.0

        try:
            vat = float(rec.get("Tiền thuế (VNĐ)", 0))
        except ValueError:
            vat = 0.0

        try:
            total = float(rec.get("Tổng thanh toán (VNĐ)", 0))
        except ValueError:
            total = 0.0

        benchmark_cases.append(
            {
                "file_path": f"ai_service/eval/invoices_1500/{pdf_name}",
                "expected": {
                    "supplier_tax_id": rec.get("MST bên bán (giả lập)", ""),
                    "supplier_name": rec.get("Tên bên bán", ""),
                    "buyer_tax_id": rec.get("MST bên mua", ""),
                    "buyer_name": rec.get("Tên bên mua", ""),
                    "invoice_number": rec.get("Số hóa đơn", f"{stt:06d}"),
                    "invoice_date": rec.get("Ngày lập", ""),
                    "subtotal": subtotal,
                    "vat_amount": vat,
                    "total_amount": total,
                    "suggested_account": account,
                    "flags": flags,
                },
            }
        )

        if (idx + 1) % 300 == 0 or (idx + 1) == len(records):
            print(f" -> Đã tạo {idx + 1}/1500 file PDF...")

    # 3. Lưu file benchmark_1500.json
    with open(BENCHMARK_JSON, "w", encoding="utf-8") as f:
        json.dump(benchmark_cases, f, ensure_ascii=False, indent=2)

    print(f"\nĐã tạo thành công file benchmark tại: {BENCHMARK_JSON}")
    print("=" * 75)
    print(">>> HOÀN TẤT 100%: 1.500 FILE PDF VÀ BENCHMARK_1500.JSON ĐÃ SẴN SÀNG! <<<")
    print("=" * 75)


if __name__ == "__main__":
    main()
