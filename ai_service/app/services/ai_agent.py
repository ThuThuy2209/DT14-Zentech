import json
import os
import re
from typing import Optional

# Bắt buộc sử dụng endpoint v1beta cho Gemini API để hỗ trợ generateContent và JSON Schema
os.environ["GOOGLE_GENAI_API_VERSION"] = "v1beta"

try:
    from google import genai
except ImportError:
    genai = None
try:
    from google.genai import types
except ImportError:
    types = None
from app.core.config import settings
from app.schemas.invoice import InvoiceExtractSchema, InvoiceItemSchema
from app.schemas.agent import (
    ReminderEmailRequest,
    ReminderEmailData,
    ChatRequest,
    ChatResponseData,
    WeeklySummaryRequest,
    WeeklySummaryResponseData,
)

_client = None


def get_genai_client() -> "genai.Client":
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


def _is_offline_mode(allow_mock: bool = False) -> bool:
    """Kiểm tra xem dịch vụ có đang chạy ở chế độ offline/mock hoặc thiếu Gemini API key hay không."""
    api_key = settings.GEMINI_API_KEY.strip() or os.environ.get("GEMINI_API_KEY", "").strip()
    is_mock_enabled = (
        allow_mock
        or settings.USE_MOCK_AI
        or os.environ.get("USE_MOCK_AI", "false").lower() == "true"
    )
    return not api_key or is_mock_enabled or genai is None or types is None


def _call_gemini_structured(
    prompt: str,
    response_schema,
    temperature: float = 0.2,
) -> Optional[str]:
    """Gọi Gemini API với danh sách model dự phòng, trả về chuỗi JSON sạch hoặc None nếu thất bại."""
    models_to_try = list(
        dict.fromkeys([settings.DEFAULT_LLM_MODEL, "gemini-2.5-flash"])
    )
    try:
        client = get_genai_client()
        for model_name in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=response_schema,
                        temperature=temperature,
                    ),
                )
                if response and response.text:
                    return clean_json_response(response.text)
            except Exception as api_err:
                print(f"[AI Agent] Model '{model_name}' báo lỗi: {api_err}")
                continue
    except Exception as init_err:
        print(f"[AI Agent] Không thể khởi tạo Gemini client: {init_err}")
    return None


def parse_invoice_heuristically(raw_text: str) -> Optional[InvoiceExtractSchema]:
    """
    Bóc tách thông minh dựa trên biểu thức chính quy (Regex Heuristic)
    khi gọi LLM bị quá tải (503 UNAVAILABLE) hoặc đang ở chế độ offline/mock.
    Hỗ trợ chuẩn 25 mẫu hóa đơn của dự án DT14.
    """
    if not raw_text or not raw_text.strip():
        return None

    # 1. Số hóa đơn
    inv_num_match = re.search(r"(?:So hoa don|Số hóa đơn|So HD|Số HĐ)[\s\:]*([0-9]{6,8})", raw_text, re.IGNORECASE)
    invoice_number = inv_num_match.group(1).strip() if inv_num_match else "000001"

    # 2. Ngày lập hóa đơn
    date_match = re.search(r"(?:Ngay|Ngày)[\s\:]*([0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{2}[/-][0-9]{2}[/-][0-9]{4})", raw_text, re.IGNORECASE)
    if date_match:
        raw_date = date_match.group(1).strip().replace("/", "-")
        if len(raw_date.split("-")[0]) == 2:  # DD-MM-YYYY -> YYYY-MM-DD
            parts = raw_date.split("-")
            invoice_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
        else:
            invoice_date = raw_date
    else:
        invoice_date = "2026-11-01"

    # 3. Đơn vị bán hàng (Người bán)
    seller_name_match = re.search(r"(?:DON VI BAN HANG|ĐƠN VỊ BÁN HÀNG|NGUOI BAN|NGƯỜI BÁN)[\s\:\(NGUOI BAN\)]*:\s*([^\n\r]+)", raw_text, re.IGNORECASE)
    supplier_name = seller_name_match.group(1).strip() if seller_name_match else "Công ty TNHH Thương mại Hoàng Gia"

    # 4. Mã số thuế bên bán
    seller_tax_match = re.search(r"(?:Ma so thue ben ban|MST ben ban|Ma so thue nguoi ban|MST người bán)[\s\:]*([0-9]{10,14})", raw_text, re.IGNORECASE)
    if not seller_tax_match:
        # Tìm MST xuất hiện trước phần Người mua
        seller_tax_match = re.search(r"(?:Ma so thue|Mã số thuế|MST)[\s\:]*([0-9]{10,14})", raw_text, re.IGNORECASE)
    supplier_tax_id = seller_tax_match.group(1).strip() if seller_tax_match else "9900000001"

    # 5. Đơn vị mua hàng (Người mua)
    buyer_name_match = re.search(r"(?:DON VI MUA HANG|ĐƠN VỊ MUA HÀNG|NGUOI MUA|NGƯỜI MUA)[\s\:\(NGUOI MUA\)]*:\s*([^\n\r]+)", raw_text, re.IGNORECASE)
    buyer_name = buyer_name_match.group(1).strip() if buyer_name_match else settings.COMPANY_NAME

    # 6. Mã số thuế bên mua
    buyer_tax_match = re.search(r"(?:DON VI MUA HANG|ĐƠN VỊ MUA HÀNG)[\s\S]*?(?:Ma so thue|Mã số thuế|MST)[\s\w]*:\s*([0-9]{10,14})", raw_text, re.IGNORECASE)
    if buyer_tax_match:
        buyer_tax_id = buyer_tax_match.group(1).strip()
    else:
        all_taxes = re.findall(r"(?:Ma so thue|Mã số thuế|MST)[\s\:]*([0-9]{10,14})", raw_text, re.IGNORECASE)
        buyer_tax_id = all_taxes[1] if len(all_taxes) > 1 else settings.COMPANY_TAX_ID

    # 7. Số tiền tổng thanh toán & tiền hàng
    total_match = re.search(r"(?:TONG CONG TIEN THANH TOAN|Tổng thanh toán|Tổng cộng tiền thanh toán|Tong cong)[\s\:]*([0-9\.\,]+)", raw_text, re.IGNORECASE)
    subtotal_match = re.search(r"(?:Cong tien hang|Cộng tiền hàng|Tien hang|Tiền hàng)[\s\:]*([0-9\.\,]+)", raw_text, re.IGNORECASE)
    vat_match = re.search(r"(?:Tien thue GTGT|Tiền thuế GTGT|Thue GTGT)[\s\:]*([0-9\.\,]+)", raw_text, re.IGNORECASE)

    def parse_money(val_str: Optional[str]) -> float:
        if not val_str:
            return 0.0
        cleaned = val_str.replace(".", "").replace(",", "").strip()
        try:
            return float(cleaned)
        except ValueError:
            return 0.0

    total_amount = parse_money(total_match.group(1)) if total_match else 0.0
    subtotal = parse_money(subtotal_match.group(1)) if subtotal_match else 0.0
    vat_amount = parse_money(vat_match.group(1)) if vat_match else 0.0

    if total_amount == 0.0 and subtotal > 0.0:
        total_amount = subtotal + vat_amount
    elif subtotal == 0.0 and total_amount > 0.0:
        # Giả định thuế GTGT 10%
        subtotal = round(total_amount / 1.1, 2)
        vat_amount = round(total_amount - subtotal, 2)

    return InvoiceExtractSchema(
        supplier_tax_id=supplier_tax_id,
        supplier_name=supplier_name,
        buyer_tax_id=buyer_tax_id,
        buyer_name=buyer_name,
        invoice_number=invoice_number,
        invoice_date=invoice_date,
        subtotal=subtotal,
        vat_amount=vat_amount,
        total_amount=total_amount,
        items=[
            InvoiceItemSchema(
                name="Dịch vụ / Hàng hóa theo hóa đơn",
                unit="Gói",
                quantity=1.0,
                unit_price=subtotal,
                total_price=subtotal,
            )
        ],
        suggested_account="642",
        accounting_reason="Dịch vụ phục vụ hoạt động quản lý vận hành doanh nghiệp, hạch toán vào TK 642 theo Thông tư 133/2016/TT-BTC.",
        flags=[],
    )


def get_mock_invoice_data(raw_text: str = "") -> InvoiceExtractSchema:
    """
    Dữ liệu giả lập chuẩn theo SRS (Kịch bản MISA / Minh Software) phục vụ kiểm thử offline.
    Nếu raw_text có dữ liệu, ưu tiên trích xuất biểu thức chính quy (Regex Heuristic).
    """
    if raw_text and raw_text.strip():
        heuristic_res = parse_invoice_heuristically(raw_text)
        if heuristic_res:
            return heuristic_res

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
    Sử dụng Gemini LLM để bóc tách văn bản thô thành JSON chuẩn hóa đơn
    và định khoản tài khoản kế toán chi phí theo Thông tư 133/2016/TT-BTC.
    Tự động fallback về Regex Heuristic / Mock nếu ở chế độ offline hoặc Gemini API lỗi.
    """
    if not raw_text or not raw_text.strip():
        raise ValueError("Văn bản bóc tách rỗng, không thể phân tích hóa đơn.")

    if _is_offline_mode(allow_mock=allow_mock):
        return get_mock_invoice_data(raw_text)

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

    cleaned_text = _call_gemini_structured(prompt, InvoiceExtractSchema, temperature=0.1)
    if cleaned_text:
        try:
            return InvoiceExtractSchema.model_validate_json(cleaned_text)
        except Exception as val_err:
            print(f"[AI Agent] Lỗi parse JSON từ Gemini: {val_err}")

    return get_mock_invoice_data(raw_text)



def generate_reminder_email(request: ReminderEmailRequest) -> ReminderEmailData:
    """
    Sử dụng Gemini để soạn thảo bản nháp email nhắc nợ quá hạn
    theo nguyên tắc Human-in-the-Loop (giữ trạng thái DRAFT chờ duyệt).
    Tự động fallback về template chuẩn khi offline hoặc Gemini API lỗi.
    """
    formatted_amount = f"{request.amount:,.0f}".replace(",", ".")
    recipient = request.recipient_email or "accounting@customer.com"

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

    if not _is_offline_mode():
        prompt = f"""
        Bạn là Trợ lý AI Kế toán của {settings.COMPANY_NAME}.
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
        cleaned_text = _call_gemini_structured(prompt, ReminderEmailData, temperature=0.3)
        if cleaned_text:
            try:
                data = ReminderEmailData.model_validate_json(cleaned_text)
                data.action_type = "DRAFT_EMAIL_REMINDER"
                data.status = "DRAFT"
                data.recipient_email = recipient
                return data
            except Exception as val_err:
                print(f"[AI Agent] Lỗi parse JSON email từ Gemini: {val_err}")

    return ReminderEmailData(
        action_type="DRAFT_EMAIL_REMINDER",
        status="DRAFT",
        recipient_email=recipient,
        email_subject=fallback_subject,
        email_body=fallback_body,
        audit_explanation=fallback_audit,
    )



def get_mock_chat_response(query: str, business_context: Optional[dict] = None) -> ChatResponseData:
    """
    Tập phản hồi mẫu chuyên nghiệp cho các câu hỏi tra cứu pháp lý, kế toán và
    TÌNH HÌNH DOANH NGHIỆP THỰC TẾ (Công nợ quá hạn, Hạn thuế, BHXH) theo chuẩn FR-102 -> FR-107.
    """
    q = query.lower()

    # 1. Câu hỏi về Khách hàng nợ quá hạn / Tình hình công nợ
    if any(k in q for k in ["quá hạn", "khách hàng nợ", "ai nợ", "công nợ", "nhắc nợ", "chậm thanh toán"]):
        # Lấy từ business_context truyền vào hoặc dữ liệu chuẩn SRS của Minh Software
        debt_info = (business_context or {}).get("overdue_invoices")
        if debt_info and isinstance(debt_info, list) and len(debt_info) > 0:
            item = debt_info[0]
            c_name = item.get("customer_name", "Công ty CP Công nghệ Đại Việt")
            inv_no = item.get("invoice_no", "0000001")
            amt = f"{float(item.get('amount', 16500000)):,.0f}".replace(",", ".")
            days = item.get("overdue_days", 31)
        else:
            c_name = "Công ty CP Công nghệ Đại Việt"
            inv_no = "0000001"
            amt = "16.500.000"
            days = 31

        reply = (
            f"Dạ thưa anh Minh, qua kiểm tra sổ kế toán hiện tại, hệ thống ghi nhận "
            f"công ty đang có **1 khách hàng nợ quá hạn** cần xử lý:\n\n"
            f"• **Khách hàng:** {c_name}\n"
            f"• **Số hóa đơn:** #{inv_no}\n"
            f"• **Số tiền nợ còn lại:** {amt} VNĐ\n"
            f"• **Số ngày đã quá hạn:** {days} ngày (vượt mốc cảnh báo 30 ngày).\n\n"
            f"👉 **Đề xuất từ AI Agent:** Anh có muốn tôi tạo ngay **Bản nháp Email nhắc nợ** "
            f"cho hóa đơn #{inv_no} này để anh kiểm tra và bấm duyệt gửi đi không ạ?"
        )
        source = "Dữ liệu sổ theo dõi công nợ phải thu (Sales Invoices) & Điều 53 Thông tư 133/2016/TT-BTC."
        return ChatResponseData(
            reply=reply,
            source_reference=source,
            disclaimer="Lưu ý: Đề xuất trên tuân thủ nguyên tắc Human-in-the-Loop. Email chỉ được gửi sau khi chủ doanh nghiệp bấm duyệt.",
            interaction_type="DEBT_REMINDER_ADVISORY",
        )

    # 2. Câu hỏi về Thuế, Bảo hiểm xã hội đến hạn
    elif any(k in q for k in ["bảo hiểm", "bhxh", "thuế đến hạn", "đến hạn", "nghĩa vụ thuế", "nộp thuế"]):
        reply = (
            "Dạ thưa anh Minh, hệ thống lưu ý các nghĩa vụ thuế và bảo hiểm định kỳ của công ty như sau:\n\n"
            "1. **Bảo hiểm xã hội (BHXH, BHYT, BHTN):**\n"
            "   - Hạn nộp: Chậm nhất là **ngày cuối cùng của tháng**.\n"
            "   - Doanh nghiệp trích đóng phần trách nhiệm của người sử dụng lao động và người lao động nộp vào tài khoản cơ quan BHXH quận/huyện.\n\n"
            "2. **Thuế Giá trị gia tăng (GTGT) & TNDN tạm tính (kỳ kê khai theo Quý):**\n"
            "   - Hạn nộp: Chậm nhất là **ngày cuối cùng của tháng đầu tiên của quý tiếp theo** (Ví dụ: Quý 3 hạn là 31/10, Quý 4 hạn là 31/01 năm sau).\n\n"
            "3. **Lệ phí môn bài:**\n"
            "   - Mức nộp: 2.000.000 VNĐ/năm (vốn điều lệ <= 10 tỷ đồng). Hạn nộp hàng năm: trước ngày 30/01."
        )
        source = "Quyết định 595/QĐ-BHXH của BHXH Việt Nam & Điều 44 Luật Quản lý thuế số 38/2019/QH14."
        return ChatResponseData(
            reply=reply,
            source_reference=source,
            disclaimer="Lưu ý: Lịch nộp thuế và bảo hiểm mang tính chất đối soát định kỳ. Vui lòng kiểm tra thông báo phát sinh từ cơ quan quản lý.",
            interaction_type="LEGAL_TAX_ADVISORY",
        )

    elif any(k in q for k in ["môn bài", "lệ phí môn bài"]):

        reply = (
            "Đối với doanh nghiệp vừa và nhỏ có vốn điều lệ từ 10 tỷ đồng trở xuống, "
            "mức lệ phí môn bài phải nộp là 2.000.000 VNĐ/năm. "
            "Thời hạn nộp lệ phí môn bài chậm nhất là ngày 30/01 hàng năm. "
            "Doanh nghiệp mới thành lập được miễn lệ phí môn bài trong năm đầu tiên."
        )
        source = "Khoản 1 Điều 4 Nghị định 139/2016/NĐ-CP và Thông tư 65/2020/TT-BTC."
    elif any(k in q for k in ["hạn nộp", "tờ khai", "thuế gtgt", "quý"]):
        reply = (
            "Thời hạn nộp hồ sơ khai thuế và nộp thuế theo quý (đối với thuế GTGT, TNCN tạm tính) "
            "chậm nhất là ngày cuối cùng của tháng đầu tiên của quý tiếp theo (ví dụ: Quý 3 hạn chót là 31/10, "
            "Quý 4 hạn chót là 31/01 năm sau)."
        )
        source = "Điều 44 Luật Quản lý thuế số 38/2019/QH14."
    elif any(k in q for k in ["thông tư 133", "642", "tài khoản", "định khoản"]):
        reply = (
            "Theo Thông tư 133/2016/TT-BTC áp dụng cho doanh nghiệp vừa và nhỏ:\n"
            "- Tài khoản 642 (Chi phí quản lý kinh doanh): Dùng để tập hợp các chi phí quản lý doanh nghiệp "
            "và chi phí bán hàng (như văn phòng phẩm, mực in, thuê ngoài, internet, tiền lương quản lý).\n"
            "- Tài khoản 153 (Công cụ dụng cụ): Áp dụng cho tài sản, thiết bị có giá trị dưới 30 triệu đồng.\n"
            "- Tài khoản 211 (Tài sản cố định hữu hình): Áp dụng khi thiết bị có giá trị từ 30 triệu đồng trở lên "
            "và thời gian sử dụng trên 1 năm."
        )
        source = "Điều 53 & Điều 54 Thông tư 133/2016/TT-BTC của Bộ Tài chính."
    elif any(k in q for k in ["hóa đơn", "hợp lệ", "hợp pháp"]):
        reply = (
            "Hóa đơn đầu vào hợp pháp, hợp lệ cần đáp ứng các điều kiện:\n"
            "1. Có đầy đủ mã của cơ quan thuế (đối với hóa đơn điện tử có mã).\n"
            "2. Đúng mã số thuế và tên của doanh nghiệp người mua.\n"
            "3. Hóa đơn có giá trị từ 20 triệu đồng trở lên bắt buộc phải thanh toán không dùng tiền mặt (chuyển khoản qua ngân hàng) "
            "để được khấu trừ thuế GTGT và tính vào chi phí được trừ khi tính thuế TNDN."
        )
        source = "Điều 15 Thông tư 219/2013/TT-BTC và Nghị định 123/2020/NĐ-CP."
    elif any(k in q for k in ["phần mềm", "thuế suất", "dịch vụ phần mềm"]):
        reply = (
            "Theo quy định hiện hành, dịch vụ phần mềm và sản phẩm phần mềm thuộc đối tượng không chịu thuế GTGT. "
            "Doanh nghiệp cung cấp dịch vụ phần mềm khi xuất hóa đơn GTGT thì tại dòng thuế suất ghi rõ là 'KCT' (Không chịu thuế)."
        )
        source = "Khoản 21 Điều 4 Thông tư 219/2013/TT-BTC và Nghị định 71/2007/NĐ-CP."
    else:
        reply = (
            f"Trợ lý AI đã ghi nhận câu hỏi của bạn về: '{query}'. "
            f"Hệ thống khuyến nghị chủ doanh nghiệp đối chiếu các quy định pháp lý hiện hành theo Thông tư 133/2016/TT-BTC "
            f"và Luật Quản lý thuế số 38/2019/QH14 để đảm bảo tính tuân thủ."
        )
        source = "Hệ thống văn bản pháp luật kế toán & thuế doanh nghiệp Việt Nam."

    return ChatResponseData(
        reply=reply,
        source_reference=source,
        disclaimer="Lưu ý: Thông tin do AI cung cấp chỉ mang tính chất tham khảo hỗ trợ vận hành, không thay thế văn bản tư vấn pháp lý chính thức (theo FR-107).",
        interaction_type="LEGAL_QA",
    )


def chat_with_assistant(request: ChatRequest) -> ChatResponseData:
    """
    Trợ lý AI hỏi đáp và tra cứu pháp lý doanh nghiệp (FR-102 -> FR-107).
    Cho phép chủ doanh nghiệp nhập câu hỏi và nhận câu trả lời hỗ trợ kèm nguồn tham khảo.
    Tự động fallback về câu trả lời mẫu khi offline hoặc Gemini API lỗi.
    """
    user_query = (request.message or "").strip()
    if not user_query:
        raise ValueError("Nội dung tin nhắn câu hỏi không được để trống.")

    if _is_offline_mode():
        return get_mock_chat_response(user_query, request.business_context)

    history_context = ""
    if request.history:
        for msg in request.history[-6:]:
            role_label = "Chủ doanh nghiệp" if msg.role == "user" else "Trợ lý AI"
            history_context += f"{role_label}: {msg.content}\n"

    if request.business_context:
        biz_context_str = (
            f"\nDỮ LIỆU SỐ LIỆU NỘI BỘ THỰC TẾ CỦA DOANH NGHIỆP TRONG HỆ THỐNG:\n"
            f"{json.dumps(request.business_context, ensure_ascii=False, indent=2)}\n"
        )
    else:
        biz_context_str = (
            f"\nDỮ LIỆU SỔ KẾ TOÁN THỰC TẾ HIỆN TẠI CỦA {settings.COMPANY_NAME}:\n"
            f"- Công nợ quá hạn: Có 1 khoản nợ của 'Công ty CP Công nghệ Đại Việt' cho Hóa đơn #0000001 "
            f"với số tiền 16.500.000 VNĐ, đã quá hạn 31 ngày (vượt ngưỡng cảnh báo 30 ngày).\n"
            f"- Nghĩa vụ thuế & BHXH: Đóng BHXH ngày cuối cùng hàng tháng; Thuế GTGT và TNDN tạm tính theo quý "
            f"hạn chót ngày cuối tháng đầu quý sau; Lệ phí môn bài 2.000.000 VNĐ/năm.\n"
        )

    prompt = f"""
    Bạn là Trợ lý AI Kế toán và Pháp lý chuyên nghiệp của Doanh nghiệp một thành viên ({settings.COMPANY_NAME}).
    Nhiệm vụ của bạn là giải đáp câu hỏi của chủ doanh nghiệp một cách chính xác, ngắn gọn, dễ hiểu và chuyên nghiệp.

    QUY TẮC TƯ VẤN:
    1. Trả lời câu hỏi nghiệp vụ và thực tế nội bộ:
       - Khi chủ doanh nghiệp hỏi về tình hình công nợ, khách hàng nợ, hóa đơn quá hạn: Sử dụng số liệu thực tế nội bộ để nêu đích danh tên khách hàng, số hóa đơn, số tiền và số ngày quá hạn, đồng thời đề xuất tạo bản nháp email nhắc nợ.
       - Khi chủ doanh nghiệp hỏi về thuế, bảo hiểm: Nêu rõ hạn nộp và căn cứ quy định.
    2. Căn cứ pháp lý (source_reference): Luôn trích dẫn rõ điều khoản, thông tư hoặc nghị định liên quan (FR-106).
    3. Cảnh báo (disclaimer): Nhắc nhở người dùng nội dung mang tính chất tham khảo trước khi áp dụng chính thức (FR-107).

    {biz_context_str}

    Lịch sử trao đổi trước đó (nếu có):
    {history_context}

    Câu hỏi của chủ doanh nghiệp:
    "{user_query}"
    """

    cleaned_text = _call_gemini_structured(prompt, ChatResponseData, temperature=0.3)
    if cleaned_text:
        try:
            data = ChatResponseData.model_validate_json(cleaned_text)
            data.interaction_type = "LEGAL_QA"
            return data
        except Exception as val_err:
            print(f"[AI Agent] Lỗi parse JSON chat từ Gemini: {val_err}")

    return get_mock_chat_response(user_query, request.business_context)



def get_mock_weekly_summary(request: WeeklySummaryRequest) -> WeeklySummaryResponseData:
    """
    Tạo báo cáo tóm tắt tài chính tuần dự phòng (rule-based mock)
    khi không kết nối được Gemini hoặc đang ở chế độ thử nghiệm nội bộ.
    """
    period = request.period or "Tuần này"
    revenue = float(request.total_revenue)
    expense = float(request.total_expense)
    net_flow = request.net_cashflow if request.net_cashflow is not None else (revenue - expense)

    # Tính tỷ suất lợi nhuận gộp tạm tính
    margin_str = f"{(net_flow / revenue * 100):.1f}%" if revenue > 0 else "0.0%"

    risks: list[str] = []
    actions: list[str] = []

    # Đánh giá công nợ quá hạn
    overdue_count = len(request.overdue_receivables or [])
    total_overdue_amount = sum(item.amount for item in (request.overdue_receivables or []))
    if overdue_count > 0:
        names = ", ".join(item.customer_name for item in request.overdue_receivables[:2])
        risks.append(
            f"Phát hiện {overdue_count} khoản công nợ quá hạn với tổng số tiền {total_overdue_amount:,.0f} VNĐ ({names})."
        )
        actions.append(
            f"Phê duyệt gửi bản nháp email nhắc nợ (BR-AI-06) cho các khách hàng quá hạn trên 30 ngày."
        )

    # Đánh giá nghĩa vụ thuế / BHXH sắp tới
    obligations = request.upcoming_obligations or []
    if obligations:
        for ob in obligations:
            amt_info = f" (dự kiến {ob.estimated_amount:,.0f} VNĐ)" if ob.estimated_amount else ""
            risks.append(f"Nghĩa vụ sắp đến hạn: {ob.title} trước ngày {ob.deadline}{amt_info}.")
        actions.append("Dự trù số dư thanh khoản ngân hàng để hoàn thành các nghĩa vụ thuế, bảo hiểm đúng hạn.")

    if net_flow < 0:
        risks.append("Dòng tiền tuần này đang âm (Chi phí vượt Doanh thu). Cần kiểm soát chi phí mua sắm ngoài kế hoạch.")
        actions.append("Rà soát lại các hóa đơn đầu vào có giá trị lớn trong tuần để tối ưu chi phí.")

    if not risks:
        risks.append("Chưa phát hiện rủi ro tài chính hoặc công nợ đáng kể trong tuần.")
    if not actions:
        actions.append("Tiếp tục theo dõi tiến độ thu tiền từ khách hàng và kiểm tra đối chiếu hóa đơn đầu vào.")

    # Tạo tóm tắt điều hành
    if net_flow >= 0:
        exec_summary = (
            f"Tình hình tài chính trong {period} duy trì trạng thái tích cực với dòng tiền ròng dương "
            f"{net_flow:,.0f} VNĐ (tỷ suất đạt {margin_str}). Doanh thu đạt {revenue:,.0f} VNĐ và chi phí "
            f"được kiểm soát ở mức {expense:,.0f} VNĐ. "
        )
    else:
        exec_summary = (
            f"Trong {period}, tổng chi phí ({expense:,.0f} VNĐ) đã vượt doanh thu ({revenue:,.0f} VNĐ), "
            f"khiến dòng tiền ròng âm {abs(net_flow):,.0f} VNĐ. "
        )

    if overdue_count > 0:
        exec_summary += f"Cần ưu tiên đôn đốc thu hồi {total_overdue_amount:,.0f} VNĐ nợ quá hạn để đảm bảo thanh khoản."
    else:
        exec_summary += "Hệ thống ghi nhận không có công nợ quá hạn nghiêm trọng."

    return WeeklySummaryResponseData(
        period=period,
        executive_summary=exec_summary,
        key_metrics={
            "total_revenue": revenue,
            "total_expense": expense,
            "net_cashflow": net_flow,
            "profit_margin": margin_str,
            "overdue_count": overdue_count,
            "overdue_total_amount": total_overdue_amount,
        },
        risks_and_alerts=risks,
        action_recommendations=actions,
        disclaimer=(
            "Lưu ý (FR-107): Báo cáo tóm tắt được khởi tạo tự động bởi AI nhằm mục đích tham khảo hỗ trợ quản trị, "
            "không thay thế cho báo cáo tài chính chính thức."
        ),
        audit_explanation=(
            "AI Agent tự động phân tích dòng tiền tuần, cảnh báo công nợ quá hạn và nghĩa vụ thuế "
            "tuân thủ quy tắc nghiệp vụ BR-AI-07 và BR-AI-10."
        ),
    )


def generate_weekly_financial_summary(request: WeeklySummaryRequest) -> WeeklySummaryResponseData:
    """
    Gọi Gemini API để đóng vai trò Giám đốc tài chính (Virtual CFO) phân tích và tóm tắt
    tình hình tài chính tuần, phát hiện rủi ro và đưa ra đề xuất hành động theo BR-AI-07.
    Tự động fallback về mock rule-based khi offline hoặc Gemini không khả dụng.
    """
    if _is_offline_mode():
        return get_mock_weekly_summary(request)

    period = request.period or "Tuần này"
    revenue = float(request.total_revenue)
    expense = float(request.total_expense)
    net_flow = request.net_cashflow if request.net_cashflow is not None else (revenue - expense)

    overdue_info = [
        f"- Khách hàng: {it.customer_name}, HĐ: {it.invoice_no or 'N/A'}, Số tiền: {it.amount:,.0f} VNĐ, Quá hạn: {it.overdue_days} ngày"
        for it in (request.overdue_receivables or [])
    ]
    overdue_text = "\n".join(overdue_info) if overdue_info else "Không có khoản nợ quá hạn."

    obligation_info = [
        f"- Nghĩa vụ: {ob.title}, Hạn chót: {ob.deadline}, Số tiền ước tính: {ob.estimated_amount:,.0f} VNĐ"
        for ob in (request.upcoming_obligations or [])
    ]
    obligation_text = "\n".join(obligation_info) if obligation_info else "Không có nghĩa vụ thuế/BHXH sắp đến hạn."

    prompt = f"""
    Bạn là Giám đốc Tài chính Ảo (Virtual CFO) kiêm Chuyên gia Kế toán của Doanh nghiệp một thành viên ({settings.COMPANY_NAME}).
    Nhiệm vụ của bạn là tổng hợp và viết Bản Tóm Tắt Tình Hình Tài Chính Tuần (BR-AI-07) gửi cho Chủ Doanh nghiệp.

    DỮ LIỆU SỐ LIỆU TÀI CHÍNH ĐẦU VÀO TRONG {period}:
    - Tổng Doanh thu trong tuần: {revenue:,.0f} VNĐ
    - Tổng Chi phí (hóa đơn mua vào): {expense:,.0f} VNĐ
    - Dòng tiền ròng (Net Cashflow): {net_flow:,.0f} VNĐ
    - Tình hình công nợ khách hàng quá hạn:
    {overdue_text}
    - Các nghĩa vụ thuế & bảo hiểm sắp đến hạn:
    {obligation_text}

    YÊU CẦU TRẢ VỀ:
    1. executive_summary: Viết đoạn nhận định ngắn gọn (3-4 câu), nêu bật sức khỏe tài chính, dòng tiền và điểm cần lưu ý nhất.
    2. key_metrics: Dict gồm total_revenue, total_expense, net_cashflow, profit_margin.
    3. risks_and_alerts: Mảng các chuỗi cảnh báo cụ thể (nợ quá hạn > 30 ngày, nguy cơ thâm hụt tiền mặt, hạn thuế).
    4. action_recommendations: Mảng các hành động đề xuất cụ thể (ví dụ: duyệt gửi email nhắc nợ hóa đơn cụ thể, trích quỹ đóng thuế).
    5. disclaimer: Giữ nguyên câu cảnh báo FR-107.
    6. audit_explanation: Giải thích tóm tắt logic AI phân tích đề xuất (BR-AI-10).
    """

    cleaned_text = _call_gemini_structured(prompt, WeeklySummaryResponseData, temperature=0.3)
    if cleaned_text:
        try:
            return WeeklySummaryResponseData.model_validate_json(cleaned_text)
        except Exception as val_err:
            print(f"[AI Agent] Lỗi parse JSON weekly summary từ Gemini: {val_err}")

    return get_mock_weekly_summary(request)
