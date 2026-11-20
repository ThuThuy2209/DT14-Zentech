from typing import List, Optional
from pydantic import BaseModel, Field


class ReminderEmailRequest(BaseModel):
    customer_name: str = Field(description="Tên khách hàng hoặc doanh nghiệp cần nhắc nợ")
    invoice_no: str = Field(description="Mã số hóa đơn nợ (ví dụ: HD-00123)")
    overdue_days: int = Field(default=30, description="Số ngày đã quá hạn thanh toán")
    amount: float = Field(description="Số tiền quá hạn thanh toán (VNĐ)")
    recipient_email: Optional[str] = Field(
        default="accounting@customer.com",
        description="Email người nhận / phòng kế toán bên mua",
    )
    due_date: Optional[str] = Field(
        default="", description="Ngày hết hạn ban đầu (định dạng YYYY-MM-DD nếu có)"
    )


class ReminderEmailData(BaseModel):
    action_type: str = Field(
        default="DRAFT_EMAIL_REMINDER", description="Loại hành động mà AI Agent thực hiện"
    )
    status: str = Field(
        default="DRAFT",
        description="Trạng thái đề xuất (luôn là DRAFT chờ người dùng phê duyệt)",
    )
    recipient_email: str = Field(
        default="accounting@customer.com", description="Email người nhận"
    )
    email_subject: str = Field(description="Tiêu đề email nhắc nợ")
    email_body: str = Field(description="Nội dung chi tiết thư nhắc nợ")
    audit_explanation: str = Field(
        description="Giải trình nhật ký kiểm toán (Audit Log) về lý do AI Agent kích hoạt đề xuất"
    )


# ============================================================================
# CÁC SCHEMA CHO TÍNH NĂNG TRỢ LÝ HỎI ĐÁP & TRA CỨU PHÁP LÝ (FR-102 -> FR-107)
# ============================================================================

class ChatMessage(BaseModel):
    role: str = Field(default="user", description="Vai trò phát ngôn: 'user' hoặc 'model'")
    content: str = Field(description="Nội dung tin nhắn")


class ChatRequest(BaseModel):
    message: str = Field(description="Câu hỏi của chủ doanh nghiệp cần hỗ trợ hoặc tra cứu")
    history: Optional[List[ChatMessage]] = Field(
        default=[], description="Lịch sử đối thoại trước đó (nếu có) để duy trì ngữ cảnh"
    )
    context_type: Optional[str] = Field(
        default="GENERAL",
        description="Ngữ cảnh câu hỏi: GENERAL, LEGAL_TAX, ACCOUNTING, DEBT, INVOICE",
    )
    business_context: Optional[dict] = Field(
        default=None,
        description="Dữ liệu nghiệp vụ thực tế truyền từ Backend (công nợ quá hạn, lịch thuế, bảo hiểm...)",
    )



class ChatResponseData(BaseModel):
    reply: str = Field(description="Nội dung phản hồi hỗ trợ của Trợ lý AI")
    source_reference: Optional[str] = Field(
        default="",
        description="Căn cứ pháp lý, thông tư, điều luật trích dẫn (theo FR-106)",
    )
    disclaimer: str = Field(
        default="Lưu ý: Thông tin do AI cung cấp chỉ mang tính chất tham khảo hỗ trợ vận hành, không thay thế văn bản tư vấn pháp lý chính thức (theo FR-107).",
        description="Cảnh báo nội dung chưa xác minh theo FR-107",
    )
    interaction_type: str = Field(
        default="LEGAL_QA",
        description="Loại tương tác để lưu vào bảng ai_interactions của Database",
    )


# ============================================================================
# CÁC SCHEMA CHO TÍNH NĂNG TÓM TẮT TÌNH HÌNH TÀI CHÍNH TUẦN (BR-AI-07)
# ============================================================================

class OverdueReceivableItem(BaseModel):
    customer_name: str = Field(description="Tên khách hàng nợ")
    invoice_no: Optional[str] = Field(default="", description="Mã hóa đơn liên quan")
    amount: float = Field(description="Số tiền nợ quá hạn (VNĐ)")
    overdue_days: int = Field(description="Số ngày đã quá hạn thanh toán")


class UpcomingObligationItem(BaseModel):
    title: str = Field(description="Tên nghĩa vụ pháp lý/thuế (ví dụ: Thuế GTGT Quý 4, Đóng BHXH)")
    deadline: str = Field(description="Hạn chót thực hiện (YYYY-MM-DD)")
    estimated_amount: Optional[float] = Field(
        default=0.0, description="Số tiền ước tính phải nộp (nếu có)"
    )


class WeeklySummaryRequest(BaseModel):
    period: Optional[str] = Field(
        default="Tuần này",
        description="Kỳ tóm tắt, ví dụ: 'Tuần 47/2026 (17/11 - 23/11/2026)'",
    )
    total_revenue: float = Field(default=0.0, description="Tổng doanh thu phát sinh trong tuần (VNĐ)")
    total_expense: float = Field(default=0.0, description="Tổng chi phí hóa đơn đầu vào phát sinh trong tuần (VNĐ)")
    net_cashflow: Optional[float] = Field(
        default=None, description="Dòng tiền ròng trong tuần (Doanh thu - Chi phí)"
    )
    overdue_receivables: Optional[List[OverdueReceivableItem]] = Field(
        default=[], description="Danh sách các khoản công nợ khách hàng đang quá hạn"
    )
    upcoming_obligations: Optional[List[UpcomingObligationItem]] = Field(
        default=[], description="Danh sách các nghĩa vụ thuế, bảo hiểm sắp đến hạn tuần tới"
    )


class WeeklySummaryResponseData(BaseModel):
    period: str = Field(description="Kỳ báo cáo tóm tắt")
    executive_summary: str = Field(
        description="Tóm tắt nhận định điều hành tổng quan về sức khỏe tài chính trong tuần"
    )
    key_metrics: dict = Field(
        description="Các chỉ số tài chính cơ bản trong tuần (doanh thu, chi phí, dòng tiền ròng, tỷ suất)"
    )
    risks_and_alerts: List[str] = Field(
        default=[], description="Danh sách các rủi ro, cảnh báo cần chú ý (nợ xấu, hạn thuế cận kề...)"
    )
    action_recommendations: List[str] = Field(
        default=[], description="Đề xuất hành động cụ thể cho chủ doanh nghiệp trong tuần tới"
    )
    disclaimer: str = Field(
        default="Lưu ý (FR-107): Báo cáo tóm tắt được khởi tạo tự động bởi AI nhằm mục đích tham khảo hỗ trợ quản trị, không thay thế cho báo cáo tài chính chính thức.",
        description="Cảnh báo pháp lý và miễn trừ trách nhiệm theo FR-107",
    )
    audit_explanation: str = Field(
        default="AI Agent tự động tổng hợp tình hình tài chính tuần theo quy tắc nghiệp vụ BR-AI-07 và BR-AI-10.",
        description="Giải trình nhật ký kiểm toán (Audit Trail)",
    )

