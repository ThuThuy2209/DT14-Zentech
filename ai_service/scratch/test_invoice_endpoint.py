import pathlib
import sys
from fastapi.testclient import TestClient

AI_SERVICE_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

from main import app

client = TestClient(app)

pdf_sample = AI_SERVICE_DIR / "samples" / "invoice1.pdf"
if pdf_sample.exists():
    with open(pdf_sample, "rb") as f:
        files = {"file": ("invoice1.pdf", f, "application/pdf")}
        resp = client.post("/api/v1/ai/invoices/extract-ocr", files=files)
    print("Status code:", resp.status_code)
    print("Response body:")
    print(resp.text[:500])
else:
    print("Sample not found.")
