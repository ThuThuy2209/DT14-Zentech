import json
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Dummy minimal PDF bytes (just header, will likely cause OCR error but we want to see endpoint handling)
pdf_bytes = b"%PDF-1.4\n%%EOF"
files = {"file": ("dummy.pdf", pdf_bytes, "application/pdf")}
resp = client.post("/api/v1/ai/invoices/extract-ocr", files=files)
print('Status code:', resp.status_code)
print('Response body (first 300 chars):')
print(resp.text[:300])
