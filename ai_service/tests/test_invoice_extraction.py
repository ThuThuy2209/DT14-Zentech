'''python
import pathlib
from fastapi.testclient import TestClient

# Import the FastAPI app
from app.main import app

client = TestClient(app)

# Ensure sample file exists (you may need to place an actual PDF in samples/ folder)
SAMPLE_PDF = pathlib.Path(__file__).parent.parent / "samples" / "invoice1.pdf"


def test_extract_invoice_success():
    # Skip test if sample PDF does not exist
    assert SAMPLE_PDF.exists(), f"Sample PDF not found at {SAMPLE_PDF}"
    with open(SAMPLE_PDF, "rb") as f:
        files = {"file": (SAMPLE_PDF.name, f, "application/pdf")}
        response = client.post("/api/v1/ai/invoices/extract-ocr", files=files)
    assert response.status_code == 200, response.text
    json_body = response.json()
    assert json_body["success"] is True
    data = json_body["data"]
    # Basic field presence checks
    for field in ["supplier_tax_id", "supplier_name", "buyer_tax_id", "invoice_number", "total_amount"]:
        assert field in data

'''