from fastapi import APIRouter, UploadFile, File
from app.core.response import success_response, error_response
from app.services.pdf_parser import parse_pdf_to_text
from app.services.ocr_service import parse_image_to_text

router = APIRouter(prefix="/invoices", tags=["Invoice Processing"])

@router.post("/extract-ocr")
async def extract_invoice(file: UploadFile = File(...)):
    filename = file.filename.lower()
    file_bytes = await file.read()
    
    raw_text = ""
    if filename.endswith(".pdf"):
        raw_text = parse_pdf_to_text(file_bytes)
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        raw_text = parse_image_to_text(file_bytes)
    else:
        return error_response("ERR_INVALID_FILE_TYPE", "Định dạng file không hỗ trợ (.pdf, .jpg, .png)")

    return success_response(
        data={"raw_text": raw_text, "filename": file.filename},
        message="Trích xuất văn bản thô thành công"
    )