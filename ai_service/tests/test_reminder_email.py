from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_draft_reminder_email():
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
    # Kiểm tra các trường cần có
    for field in [
        "action_type",
        "status",
        "recipient_email",
        "email_subject",
        "email_body",
        "audit_explanation",
    ]:
        assert field in data
    assert data["status"] == "DRAFT"