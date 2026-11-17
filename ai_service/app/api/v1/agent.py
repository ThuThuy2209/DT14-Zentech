from fastapi import APIRouter
from app.core.response import success_response, error_response
from app.schemas.agent import ReminderEmailRequest
from app.services.ai_agent import generate_reminder_email

router = APIRouter(prefix="/agent", tags=["AI Agent"])


@router.post("/draft-reminder-email")
async def draft_reminder_email(request: ReminderEmailRequest):
    """
    AI Agent tự động soạn thảo bản nháp email nhắc nợ khi khoản nợ quá hạn.
    Tuân thủ nguyên tắc Human-in-the-Loop (Zero Unauthorized Execution):
    Trạng thái trả về luôn là 'DRAFT' chờ chủ doanh nghiệp xem xét và bấm duyệt.
    """
    try:
        draft_data = generate_reminder_email(request)
        return success_response(
            data=draft_data.model_dump(),
            message="Tạo bản nháp email nhắc nợ thành công",
        )
    except Exception as e:
        return error_response(
            "ERR_DRAFT_EMAIL_FAILED",
            f"Lỗi tạo bản nháp email nhắc nợ: {str(e)}",
            status_code=500,
        )
