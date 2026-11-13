from typing import Optional
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
