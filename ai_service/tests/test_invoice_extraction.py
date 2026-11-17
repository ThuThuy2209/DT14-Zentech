import pathlib
import sys
from fastapi.testclient import TestClient

# Đảm bảo thư mục ai_service nằm trong sys.path
AI_SERVICE_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

from main import app

client = TestClient(app)

SAMPLE_PDF = AI_SERVICE_DIR / "samples" / "invoice1.pdf"
if not SAMPLE_PDF.exists():
    # Dự phòng đường dẫn từ backend uploads
    SAMPLE_PDF = AI_SERVICE_DIR.parent / "backend" / "uploads" / "mock_invoices" / "HD_000001.pdf"


def test_extract_invoice_success():
    assert SAMPLE_PDF.exists(), f"Sample PDF không tồn tại tại: {SAMPLE_PDF}"
    with open(SAMPLE_PDF, "rb") as f:
        files = {"file": (SAMPLE_PDF.name, f, "application/pdf")}
        response = client.post("/api/v1/ai/invoices/extract-ocr", files=files)

    assert response.status_code == 200, response.text
    json_body = response.json()
    assert json_body["success"] is True
    data = json_body["data"]

    # Kiểm tra các trường dữ liệu quan trọng theo API Contract
    for field in [
        "supplier_tax_id",
        "supplier_name",
        "buyer_tax_id",
        "invoice_number",
        "invoice_date",
        "total_amount",
        "suggested_account",
        "flags",
    ]:
        assert field in data, f"Thiếu trường '{field}' trong response"
