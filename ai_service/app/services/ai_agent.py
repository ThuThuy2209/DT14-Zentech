import json
import os
import re

# Bắt buộc sử dụng endpoint v1beta cho Gemini API để hỗ trợ generateContent và JSON Schema
os.environ["GOOGLE_GENAI_API_VERSION"] = "v1beta"

from google import genai
from google.genai import types
from app.core.config import settings
from app.schemas.invoice import InvoiceExtractSchema, InvoiceItemSchema
from app.schemas.agent import ReminderEmailRequest, ReminderEmailData

_client = None


def get_genai_client() -> genai.Client:
    """
    Khởi tạo lười (lazy load) client Gemini API để tránh crash app khi chưa có API key.
    Chỉ định api_version='v1beta' để hỗ trợ generateContent và Structured JSON Output.
    """
    global _client
    api_key = settings.GEMINI_API_KEY.strip() or os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm API Key vào file ai_service/.env"
        )
    if _client is None:
        _client = genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(api_version="v1beta"),
        )
    return _client


def clean_json_response(text: str) -> str:
    """
    Làm sạch chuỗi JSON trả về từ LLM (loại bỏ markdown block ```json ... ``` nếu có).
    """
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()


def get_mock_invoice_data(raw_text: str = "") -> InvoiceExtractSchema:
    """
    Dữ liệu giả lập chuẩn theo SRS (Kịch bản MISA / Minh Software) phục vụ kiểm thử offline.
    """
    return InvoiceExtractSchema(
        supplier_tax_id="0101234567",
        supplier_name="Công ty TNHH Thiết bị Văn phòng MISA",
        buyer_tax_id=settings.COMPANY_TAX_ID,
        buyer_name=settings.COMPANY_NAME,
        invoice_number="0001234",
        invoice_date="2026-11-06",
        subtotal=10000000.0,
        vat_amount=1000000.0,
        total_amount=11000000.0,
        items=[
            InvoiceItemSchema(
                name="Mực in HP LaserJet P1102",
                unit="Hộp",
                quantity=2.0,
                unit_price=500000.0,
                total_price=1000000.0,
            )
        ],
        suggested_account="642",
        accounting_reason="Mực in văn phòng được gợi ý phân loại vào Chi phí quản lý doanh nghiệp (TK 642) theo Thông tư 133/2016/TT-BTC.",
        flags=[],
    )


def extract_invoice_structured_data(
    raw_text: str, allow_mock: bool = False
) -> InvoiceExtractSchema:
    """
    Sử dụng Gemini 1.5 Flash để bóc tách văn bản thô thành JSON chuẩn hóa đơn
    và định khoản tài khoản kế toán chi phí theo Thông tư 133/2016/TT-BTC.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Văn bản bóc tách rỗng, không thể phân tích hóa đơn.")

    # Nếu chưa có API key và cho phép mock -> trả về dữ liệu mẫu chuẩn SRS
    api_key = settings.GEMINI_API_KEY.strip() or os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        if allow_mock or os.environ.get("USE_MOCK_AI", "false").lower() == "true":
            return get_mock_invoice_data(raw_text)
        raise ValueError(
            "GEMINI_API_KEY chưa được cấu hình. Vui lòng cấu hình khóa trong file ai_service/.env"
        )

    client = get_genai_client()

    prompt = f"""
    Bạn là chuyên gia kế toán Việt Nam chuyên nghiệp cho doanh nghiệp vừa và nhỏ (áp dụng Thông tư 133/2016/TT-BTC).
    Nhiệm vụ của bạn là đọc kỹ văn bản thô trích xuất từ hóa đơn mua vào dưới đây, bóc tách chính xác các trường dữ liệu và định khoản tài khoản chi phí phù hợp.

    THÔNG TIN CÔNG TY NGƯỜI MUA (ĐỐI CHIẾU):
    - Tên công ty: {settings.COMPANY_NAME}
    - Mã số thuế: {settings.COMPANY_TAX_ID}

    QUY TẮC BÓC TÁCH & ĐỊNH KHOẢN:
    1. Thông tin hóa đơn:
       - Số hóa đơn (invoice_number): định dạng chuỗi số hoặc ký hiệu hóa đơn (VD: 0001234, 1234).
       - Ngày hóa đơn (invoice_date): chuẩn YYYY-MM-DD (VD: 2026-11-06).
       - Bên bán / Nhà cung cấp (supplier_name, supplier_tax_id): đơn vị phát hành hóa đơn.
       - Bên mua / Khách hàng (buyer_name, buyer_tax_id): đơn vị mua nhận hóa đơn.
       - Tiền hàng (subtotal): tổng tiền hàng chưa thuế (số thực nguyên thủy, không dấu chấm/phẩy phân cách hàng nghìn).
       - Tiền thuế (vat_amount): thuế GTGT.
       - Tổng tiền (total_amount): tổng thanh toán đã bao gồm thuế.
       - Chi tiết hàng hóa (items): danh sách các mặt hàng gồm name, unit, quantity, unit_price, total_price.

    2. Gợi ý tài khoản chi phí (suggested_account) theo Thông tư 133/2016/TT-BTC:
       - "642" (Chi phí quản lý doanh nghiệp): Văn phòng phẩm, mực in, internet, điện thoại, tiếp khách, thuê ngoài thông thường, chi phí quản trị chung...
       - "153" (Công cụ, dụng cụ): Trang thiết bị văn phòng, máy in, linh kiện máy tính, bàn ghế... giá trị < 30 triệu đồng.
       - "152" (Nguyên liệu, vật liệu): Linh kiện, vật tư phục vụ trực tiếp kỹ thuật/sản xuất.
       - "242" (Chi phí trả trước): Bản quyền phần mềm năm, server cloud/hosting nhiều tháng, thuê văn phòng trả trước.
       - "211" (Tài sản cố định): Thiết bị, máy móc có giá trị >= 30 triệu đồng và dùng trên 1 năm.
       - "635" (Chi phí tài chính): Phí chuyển tiền, lãi vay...

    3. Diễn giải kế toán (accounting_reason):
       - Nêu ngắn gọn, rõ ràng căn cứ phân loại mặt hàng này vào tài khoản đã chọn theo Thông tư 133/2016/TT-BTC.

    4. Cờ cảnh báo (flags):
       - Để mảng rỗng [] mặc định.

    Văn bản hóa đơn thô:
    ---
    {raw_text}
    ---
    """

    models_to_try = [
        settings.DEFAULT_LLM_MODEL,
        "gemini-3.8-flash",
        "gemini-3.8-pro",
        "models/gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
    ]
    # Loại bỏ trùng lặp giữ thứ tự
    models_to_try = list(dict.fromkeys(models_to_try))

    print(f"\n[AI Agent] === BẮT ĐẦU BÓC TÁCH HÓA ĐƠN ({len(raw_text)} ký tự) ===")
    last_error = None
    response = None

    for model_name in models_to_try:
        print(f"[AI Agent] Đang thử kết nối model: '{model_name}'...")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InvoiceExtractSchema,
                    temperature=0.1,
                ),
            )
            if response and response.text:
                print(f"[AI Agent] >>> THÀNH CÔNG với model: '{model_name}'! <<<\n")
                break
        except Exception as api_err:
            print(f"[AI Agent] Model '{model_name}' báo lỗi: {api_err}")
            last_error = api_err
            continue

    if not response or not response.text:
        # Nếu đã cấu hình USE_MOCK_AI=true hoặc allow_mock=True, tự động fallback về Mock
        if allow_mock or os.environ.get("USE_MOCK_AI", "false").lower() == "true":
            print(f"[AI Agent] Cảnh báo: Gọi Gemini thất bại ({last_error}). Đang trả về Mock Data chuẩn SRS...")
            return get_mock_invoice_data(raw_text)

        print(f"[AI Agent] Lỗi: Tất cả các model đều thất bại. Lỗi cuối cùng: {last_error}\n")
        raise RuntimeError(f"Lỗi khi gọi Gemini API ({models_to_try}): {str(last_error)}")

    cleaned_text = clean_json_response(response.text)
    return InvoiceExtractSchema.model_validate_json(cleaned_text)


def generate_reminder_email(request: ReminderEmailRequest) -> ReminderEmailData:
    """
    Sử dụng Gemini 1.5 Flash để soạn thảo bản nháp email nhắc nợ quá hạn
    theo nguyên tắc Human-in-the-Loop (giữ trạng thái DRAFT chờ duyệt).
    """
    formatted_amount = f"{request.amount:,.0f}".replace(",", ".")
    recipient = request.recipient_email or "accounting@customer.com"

    # Template fallback chất lượng cao khi offline hoặc chưa có API key
    fallback_subject = f"[Thông báo] Nhắc nợ quá hạn thanh toán - Hóa đơn #{request.invoice_no}"
    fallback_body = (
        f"Kính gửi Quý khách hàng {request.customer_name},\n\n"
        f"Công ty TNHH Một thành viên Minh Software xin trân trọng thông báo về khoản công nợ của hóa đơn số "
        f"#{request.invoice_no} với số tiền {formatted_amount} VNĐ hiện đã quá hạn thanh toán {request.overdue_days} ngày.\n\n"
        f"Chúng tôi hiểu rằng việc thanh toán có thể bị chậm trễ do các nguyên nhân khách quan. "
        f"Rất mong Quý công ty sắp xếp đối chiếu và hoàn tất thanh toán trong thời gian sớm nhất.\n\n"
        f"Nếu Quý khách hàng đã thực hiện thanh toán trước đó, xin vui lòng bỏ qua thư này hoặc gửi lại phản hồi kèm ủy nhiệm chi để chúng tôi cập nhật hệ thống.\n\n"
        f"Trân trọng cảm ơn sự hợp tác của Quý công ty,\n"
        f"Bộ phận Kế toán - Công ty TNHH Một thành viên Minh Software"
    )
    fallback_audit = (
        f"AI Agent tự động đề xuất tạo bản nháp email do khoản công nợ của khách hàng '{request.customer_name}' "
        f"vượt mốc quy định {request.overdue_days} ngày. Cần người dùng phê duyệt trước khi gửi."
    )

    api_key = settings.GEMINI_API_KEY.strip() or os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return ReminderEmailData(
            action_type="DRAFT_EMAIL_REMINDER",
            status="DRAFT",
            recipient_email=recipient,
            email_subject=fallback_subject,
            email_body=fallback_body,
            audit_explanation=fallback_audit,
        )

    client = get_genai_client()

    prompt = f"""
    Bạn là Trợ lý AI Kế toán của Công ty TNHH Một thành viên Minh Software.
    Nhiệm vụ của bạn là soạn thảo một BẢN NHÁP EMAIL NHẮC NỢ QUÁ HẠN gửi cho khách hàng.

    THÔNG TIN CÔNG NỢ:
    - Đơn vị gửi: {settings.COMPANY_NAME}
    - Khách hàng nợ: {request.customer_name}
    - Mã hóa đơn: #{request.invoice_no}
    - Số tiền quá hạn: {formatted_amount} VNĐ
    - Số ngày quá hạn: {request.overdue_days} ngày
    - Email người nhận: {recipient}

    YÊU CẦU NỘI DUNG:
    1. Giọng văn: Lịch sự, trang trọng, chuyên nghiệp nhưng rõ ràng và dứt khoát về nghĩa vụ thanh toán.
    2. Nêu rõ mã số hóa đơn, số tiền cần thanh toán và số ngày đã quá hạn.
    3. Đề nghị khách hàng sắp xếp thanh toán hoặc phản hồi nếu đã chuyển tiền.
    4. Trạng thái hành động luôn là "DRAFT" (bản nháp).
    5. Cung cấp audit_explanation nêu rõ căn cứ AI Agent đề xuất bản nháp này để phục vụ nhật ký kiểm toán (Audit Log).
    """

    models_to_try = [
        settings.DEFAULT_LLM_MODEL,
        "gemini-3.8-flash",
        "gemini-3.8-pro",
        "models/gemini-3.8-flash",
    ]

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ReminderEmailData,
                    temperature=0.3,
                ),
            )
            if response and response.text:
                cleaned_text = clean_json_response(response.text)
                data = ReminderEmailData.model_validate_json(cleaned_text)
                data.action_type = "DRAFT_EMAIL_REMINDER"
                data.status = "DRAFT"
                data.recipient_email = recipient
                return data
        except Exception:
            continue

    return ReminderEmailData(
        action_type="DRAFT_EMAIL_REMINDER",
        status="DRAFT",
        recipient_email=recipient,
        email_subject=fallback_subject,
        email_body=fallback_body,
        audit_explanation=fallback_audit,
    )
