import pathlib
import sys
from fastapi.testclient import TestClient

# Đảm bảo thư mục ai_service nằm trong sys.path
AI_SERVICE_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

from main import app

client = TestClient(app)


def test_draft_reminder_email_success():
    payload = {
        "customer_name": "Công ty CP Công nghệ Đại Việt",
        "invoice_no": "0000001",
        "overdue_days": 30,
        "amount": 16500000,
        "recipient_email": "accounting@customer.com",
        "due_date": "2026-11-02",
    }
    response = client.post("/api/v1/ai/agent/draft-reminder-email", json=payload)
    assert response.status_code == 200, response.text
    json_body = response.json()
    assert json_body["success"] is True
    data = json_body["data"]

    # Kiểm tra các trường theo API Contract
    for field in [
        "action_type",
        "status",
        "recipient_email",
        "email_subject",
        "email_body",
        "audit_explanation",
    ]:
        assert field in data, f"Thiếu trường '{field}' trong response"

    # Đảm bảo nguyên tắc Human-in-the-Loop: trạng thái luôn là DRAFT
    assert data["status"] == "DRAFT"
    assert data["action_type"] == "DRAFT_EMAIL_REMINDER"
