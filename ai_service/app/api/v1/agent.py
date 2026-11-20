from fastapi import APIRouter
from app.core.response import success_response, error_response
from app.schemas.agent import (
    ReminderEmailRequest,
    ChatRequest,
    WeeklySummaryRequest,
)
from app.services.ai_agent import (
    generate_reminder_email,
    chat_with_assistant,
    generate_weekly_financial_summary,
)

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


@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Trợ lý hỏi đáp AI & Tra cứu pháp lý doanh nghiệp (FR-102 -> FR-107).
    Cho phép chủ doanh nghiệp hỏi đáp về thuế, kế toán TT 133, hóa đơn và công nợ.
    Trả về câu trả lời kèm nguồn tham khảo (source_reference) và cảnh báo (disclaimer)
    để lưu vết lịch sử tương tác vào bảng ai_interactions của Database.
    """
    try:
        chat_data = chat_with_assistant(request)
        return success_response(
            data=chat_data.model_dump(),
            message="Xử lý câu hỏi trợ lý AI thành công",
        )
    except ValueError as ve:
        return error_response(
            "ERR_INVALID_CHAT_REQUEST",
            str(ve),
            status_code=400,
        )
    except Exception as e:
        return error_response(
            "ERR_CHAT_FAILED",
            f"Lỗi phản hồi trợ lý AI: {str(e)}",
            status_code=500,
        )


@router.post("/weekly-financial-summary")
async def weekly_financial_summary_endpoint(request: WeeklySummaryRequest):
    """
    Tóm tắt tình hình tài chính tuần (BR-AI-07) theo nguyên tắc Human-in-the-Loop.
    AI Agent đóng vai trò Giám đốc tài chính (Virtual CFO) phân tích tổng quan
    doanh thu, chi phí, dòng tiền, nợ quá hạn và nghĩa vụ thuế để đưa ra
    nhận định điều hành và kiến nghị hành động cụ thể cho chủ doanh nghiệp.
    """
    try:
        summary_data = generate_weekly_financial_summary(request)
        return success_response(
            data=summary_data.model_dump(),
            message="Tổng hợp tóm tắt tài chính tuần thành công",
        )
    except Exception as e:
        return error_response(
            "ERR_FINANCIAL_SUMMARY_FAILED",
            f"Lỗi phân tích tóm tắt tài chính: {str(e)}",
            status_code=500,
        )

