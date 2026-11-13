from fastapi import APIRouter, UploadFile, File
from app.core.config import settings
from app.core.response import success_response, error_response
from app.services.pdf_parser import parse_pdf_to_text
from app.services.ocr_service import parse_image_to_text
from app.services.ai_agent import extract_invoice_structured_data

router = APIRouter(prefix="/invoices", tags=["Invoice Processing"])


@router.post("/extract-ocr")
async def extract_invoice(file: UploadFile = File(...)):
    filename = (file.filename or "").lower()

    # 1. Kiểm tra định dạng file
    if not filename.endswith((".pdf", ".png", ".jpg", ".jpeg")):
        return error_response(
            "ERR_INVALID_FILE_TYPE",
            "Định dạng file không hỗ trợ (.pdf, .jpg, .png, .jpeg)",
            status_code=400,
        )

    file_bytes = await file.read()
    if not file_bytes:
        return error_response("ERR_EMPTY_FILE", "File tải lên không có dữ liệu", status_code=400)

    # 2. Bóc tách văn bản thô (PDF / OCR Ảnh)
    raw_text = ""
    try:
        if filename.endswith(".pdf"):
            raw_text = parse_pdf_to_text(file_bytes)
        elif filename.endswith((".png", ".jpg", ".jpeg")):
            raw_text = parse_image_to_text(file_bytes)
    except RuntimeError as ocr_err:
        return error_response("ERR_OCR_UNAVAILABLE", str(ocr_err), status_code=503)
    except Exception as parse_err:
        return error_response(
            "ERR_PARSING_FAILED", f"Lỗi đọc file: {str(parse_err)}", status_code=400
        )

    if not raw_text.strip():
        return error_response(
            "ERR_EMPTY_TEXT",
            "Không thể trích xuất văn bản từ tài liệu. Với hóa đơn scan dạng ảnh bọc trong PDF, vui lòng chuyển sang dạng ảnh (.png, .jpg).",
            status_code=400,
        )

    # 3. Trích xuất dữ liệu có cấu trúc bằng Gemini AI & Gợi ý tài khoản TT 133
    try:
        structured_data = extract_invoice_structured_data(raw_text)
        invoice_data = structured_data.model_dump()

        # 4. Kiểm tra tự động các cờ cảnh báo bất thường (flags)
        flags = set(invoice_data.get("flags") or [])

        # Cảnh báo 1: Sai lệch số học (Tiền hàng + Thuế != Tổng tiền)
        expected_total = structured_data.subtotal + structured_data.vat_amount
        if (
            structured_data.total_amount > 0
            and abs(expected_total - structured_data.total_amount) > 1.0
        ):
            flags.add("WARNING_CALCULATION_MISMATCH")

        # Cảnh báo 2: Sai MST bên mua (không trùng 0318888888 của Minh Software)
        if (
            structured_data.buyer_tax_id
            and structured_data.buyer_tax_id.strip() != settings.COMPANY_TAX_ID
        ):
            flags.add("ERROR_WRONG_TAX_ID")

        invoice_data["flags"] = list(flags)

        # Trả về đúng API Contract cho Backend NestJS
        return success_response(
            data=invoice_data,
            message="Trích xuất và kiểm tra hóa đơn thành công",
        )
    except ValueError as ve:
        import traceback
        traceback.print_exc()
        return error_response("ERR_CONFIG_OR_VALIDATION", str(ve), status_code=400)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return error_response(
            "ERR_AI_EXTRACTION_FAILED", f"Lỗi bóc tách AI: {str(e)}", status_code=500
        )