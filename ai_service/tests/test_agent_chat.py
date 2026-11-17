import pathlib
import sys
from fastapi.testclient import TestClient

AI_SERVICE_DIR = pathlib.Path(__file__).resolve().parent.parent
if str(AI_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE_DIR))

from main import app

client = TestClient(app)


def test_agent_chat_success():
    payload = {
        "message": "Chi phí mua máy in văn phòng hạch toán vào tài khoản nào theo Thông tư 133?",
        "context_type": "ACCOUNTING",
        "history": [],
    }
    response = client.post("/api/v1/ai/agent/chat", json=payload)
    assert response.status_code == 200, response.text
    json_body = response.json()
    assert json_body["success"] is True
    data = json_body["data"]

    # Kiểm tra các trường dữ liệu bắt buộc theo FR-102 -> FR-107
    for field in ["reply", "source_reference", "disclaimer", "interaction_type"]:
        assert field in data, f"Thiếu trường '{field}' trong response chat"

    assert len(data["reply"]) > 0
    assert len(data["source_reference"]) > 0
    assert "FR-107" in data["disclaimer"] or "tham khảo" in data["disclaimer"]
