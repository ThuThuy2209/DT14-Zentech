import pathlib
import sys
from fastapi.testclient import TestClient

AI_SERVICE_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

from main import app

client = TestClient(app)


def test_weekly_financial_summary_endpoint():
    payload = {
        "period": "Tuần 47/2026 (17/11 - 23/11/2026)",
        "total_revenue": 125000000.0,
        "total_expense": 45000000.0,
        "net_cashflow": 80000000.0,
        "overdue_receivables": [
            {
                "customer_name": "Công ty TNHH Phần mềm Ánh Dương",
                "invoice_no": "HD-00123",
                "amount": 18000000.0,
                "overdue_days": 32,
            }
        ],
        "upcoming_obligations": [
            {
                "title": "Thuế GTGT Quý 4",
                "deadline": "2026-11-30",
                "estimated_amount": 12000000.0,
            }
        ],
    }

    response = client.post("/api/v1/ai/agent/weekly-financial-summary", json=payload)
    assert response.status_code == 200, response.text
    json_body = response.json()
    assert json_body["success"] is True
    data = json_body["data"]

    # Kiểm tra các trường dữ liệu quan trọng theo yêu cầu BR-AI-07 và BR-AI-10
    required_fields = [
        "period",
        "executive_summary",
        "key_metrics",
        "risks_and_alerts",
        "action_recommendations",
        "disclaimer",
        "audit_explanation",
    ]
    for field in required_fields:
        assert field in data, f"Thiếu trường '{field}' trong response tóm tắt tài chính"

    assert len(data["executive_summary"]) > 0
    assert len(data["risks_and_alerts"]) > 0
    assert len(data["action_recommendations"]) > 0
    assert "FR-107" in data["disclaimer"]
    assert "BR-AI-07" in data["audit_explanation"]
