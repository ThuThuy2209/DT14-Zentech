# DT14 – OPC SMARTOFFICE: TÀI LIỆU KỸ THUẬT VÀ QUY CHUẨN PHÂN HỆ AI SERVICE

> **Phụ trách:** Vy (SV05 - AI Engineer)
>
> **Đối tượng chia sẻ:** Thủy (BA/Lead), Quỳnh (Backend Biz), Tiến (Backend Ledger), Đạt (Frontend/Mobile), Trà (QA/DevOps)

## 📌 1. TỔNG QUAN PHÂN HỆ AI SERVICE

Phân hệ **AI Service** đóng vai trò là "bộ não" xử lý tác vụ thông minh trong hệ thống quản trị **DT14 (One-Person Company OS)**. Phân hệ vận hành theo mô hình Microservice độc lập, tuân thủ nghiêm ngặt nguyên tắc **Human-in-the-Loop (/Zero Unauthorized Execution)**: AI chỉ đóng vai trò trợ lý bóc tách, cảnh báo bất thường và tạo bản nháp (Draft); mọi quyết định tài chính/pháp lý đều do người dùng duyệt trực tiếp.

## 🏗️ 2. THÔNG SỐ HẠ TẦNG & TECH STACK CHỐT HẠ

| Thành phần | Công nghệ / Thư viện chốt | Ghi chú & Mục đích | 
| ----- | ----- | ----- | 
| **Language & Engine** | Python 3.11 + FastAPI + Uvicorn | Chạy tại Port `5000` (`http://localhost:5000`) | 
| **PDF Extraction** | `pdfplumber` | Bóc tách 100% text layer từ PDF điện tử gốc (< 0.1s/trang) | 
| **Image OCR** | `paddleocr` | Đọc chữ từ ảnh chụp/scan hóa đơn giấy, chạy local 100% | 
| **LLM Engine** | Google Gemini API (`gemini-1.5-flash`) | Phân tích ngữ cảnh, trích xuất JSON Mode & Tool Calling | 
| **LLM Framework** | `google-genai` & `langchain` | Quản lý Pipeline Prompt và AI Agent Tools | 
| **Data Validation** | `pydantic` | Ép kiểu dữ liệu trả về theo đúng JSON Schema đã thống nhất | 
| **Metrics & Testing** | `scikit-learn` & `pandas` | Chạy script tự động đo đạc chỉ số F1-Score $\ge 0.90$ | 

## 🔌 3. QUY CHUẨN INTEGRATION & DỮ LIỆU CHUYỂN GIAO (API CONTRACT)

Tất cả API trả về từ AI Service cho Backend NestJS đều bọc trong cấu trúc JSON thống nhất theo **Mục 4 của README.md hệ thống**.

### 3.1. Output Endpoint: Bóc tách & Phân loại Hóa đơn Mua vào

* **Endpoint:** `POST /api/v1/ai/invoices/extract-ocr`

* **Content-Type:** `multipart/form-data` (File PDF/PNG/JPG)

```
{
  "success": true,
  "message": "Trích xuất và kiểm tra hóa đơn thành công",
  "data": {
    "supplier_tax_id": "0101234567",
    "supplier_name": "Công ty TNHH Thiết bị Văn phòng MISA",
    "buyer_tax_id": "0318888888",
    "buyer_name": "Công ty TNHH Một thành viên Minh Software",
    "invoice_number": "0001234",
    "invoice_date": "2026-11-06",
    "subtotal": 10000000.0,
    "vat_amount": 1000000.0,
    "total_amount": 11000000.0,
    "items": [
      {
        "name": "Mực in HP LaserJet P1102",
        "quantity": 2.0,
        "unit_price": 500000.0,
        "total_price": 1000000.0
      }
    ],
    "suggested_account": "642",
    "accounting_reason": "Mực in văn phòng được gợi ý phân loại vào Chi phí quản lý doanh nghiệp (TK 642) theo Thông tư 133/2016/TT-BTC.",
    "flags": [
      "WARNING_DUPLICATE",
      "ERROR_WRONG_TAX_ID",
      "WARNING_CALCULATION_MISMATCH"
    ]
  }
}

```

#### Giải thích danh sách Cảnh báo (`flags`):

* `WARNING_DUPLICATE`: Trùng kết hợp (Số hóa đơn + Ngày lập + MST người bán) trong cơ sở dữ liệu.

* `ERROR_WRONG_TAX_ID`: `buyer_tax_id` trên hóa đơn không trùng MST công ty Minh Software (`0318888888`).

* `WARNING_CALCULATION_MISMATCH`: Tiền hàng + Tiền thuế $\neq$ Tổng tiền thanh toán.

### 3.2. Output Endpoint: AI Agent Soạn bản nháp Email Nhắc nợ Quá hạn

* **Endpoint:** `POST /api/v1/ai/agent/draft-reminder-email`

* **Input Body (từ Backend truyền sang):** `{"customer_name": "...", "invoice_no": "...", "overdue_days": 30, "amount": 18000000}`

```
{
  "success": true,
  "message": "Tạo bản nháp email nhắc nợ thành công",
  "data": {
    "action_type": "DRAFT_EMAIL_REMINDER",
    "status": "DRAFT",
    "recipient_email": "accounting@customer.com",
    "email_subject": "[Thông báo] Nhắc nợ quá hạn thanh toán - Hóa đơn #HD-00123",
    "email_body": "Kính gửi Quý khách hàng,\n\nCông ty Minh Software xin thông báo hóa đơn số #HD-00123 phát sinh ngày 06/10/2026 với số tiền 18.000.000 VNĐ đã quá hạn thanh toán 30 ngày. Rất mong Quý công ty sắp xếp thanh toán trước ngày...",
    "audit_explanation": "AI Agent tự động đề xuất tạo bản nháp email do khoản công nợ vượt mốc quy định 30 ngày. Cần người dùng phê duyệt trước khi gửi."
  }
}

```

## 🔄 4. LUỒNG PHỐI HỢP NHAU VẬN HÀNH (END-TO-END FLOW)

```
[1. User Upload File trên Mobile/Web] (Đạt - SV04)
                │
                ▼
[2. NestJS Backend tiếp nhận & gửi sang Port 5000] (Quỳnh/Tiến - SV02/03)
                │
                ▼
[3. AI Service OCR + LLM + Anomaly Engine Processing] (Vy - SV05)
                │ (Trả về JSON dữ liệu + Flags cảnh báo)
                ▼
[4. NestJS lưu Database ở trạng thái DRAFT + Ghi Audit Log] (Trà - SV06)
                │
                ▼
[5. Display UI Màn hình Duyệt đề xuất AI] (Đạt - SV04)
                │ (Chủ doanh nghiệp kiểm tra & click "Phê duyệt")
                ▼
[6. NestJS chính thức chuyển trạng thái APPROVED & Ghi sổ Kế toán] (Tiến - SV03)

```

## 📂 5. CẤU TRÚC REPOSITORY & GIT BRANCHING MODEL

Mã nguồn AI Service nằm hoàn toàn tại thư mục `ai_service/` của repository tổng:

```
ai_service/
├── .env.example                  # File cấu hình biến môi trường mẫu
├── .gitignore                    # Chặn push .env, __pycache__, file hóa đơn test
├── Dockerfile                    # File đóng gói container (Phối hợp với Trà - Port 5000)
├── requirements.txt              # Khai báo thư viện (fastapi, pydantic, pdfplumber, paddleocr...)
├── main.py                       # FastAPI entrypoint (chạy tại port 5000)
├── evaluate.py                   # Script tự động đo chỉ số F1-Score nghiệm thu
├── ground_truth.json             # Dataset đáp án chuẩn 1.500 chứng từ
└── app/
    ├── api/v1/                   # Endpoints (/invoices/extract-ocr, /agent/...)
    ├── core/                     # config.py & response.py (API Contract)
    ├── schemas/                  # invoice.py (Pydantic Models)
    └── services/                 # ocr_engine.py, anomaly_detector.py, gemini_agent.py

```

* **Quy ước Nhánh Git:** Phát triển trên nhánh `feat/ai-ocr` hoặc `feat/ai-agent`.

* **Quy ước Commit:** Theo chuẩn Conventional Commit (`feat: ...`, `fix: ...`, `docs: ...`).

## 📊 6. YÊU CẦU NGHIỆM THU & PHÂN CÔNG CHUẨN BỊ DỮ LIỆU

1. **Bộ Dữ liệu Thử nghiệm:** 20 doanh nghiệp giả lập, dữ liệu 12 tháng với **1.500 chứng từ mua vào** (PDF và Ảnh scan). *(Vy chịu trách nhiệm tập file + file `ground_truth.json`)*.

2. **KPI Độ chính xác AI:** Đạt chỉ số **F1-Score** $\ge 0.90$ trên các trường trọng yếu (MST, Ngày, Số hóa đơn, Tiền). *(Vy đo và xuất báo cáo qua script `evaluate.py`)*.

3. **Kịch bản Demo Bắt buộc (Tình huống 1 & 2):**

   * **25 Hóa đơn Mua vào:** AI tự động gắn cờ phát hiện đúng **1 hóa đơn trùng** (`WARNING_DUPLICATE`), **1 hóa đơn sai MST người mua** (`ERROR_WRONG_TAX_ID`), và phân loại chi phí cho **23 hóa đơn hợp lệ**.

   * **Công nợ Quá hạn 30 ngày:** AI Agent soạn bản nháp email nhắc nợ, giữ trạng thái `DRAFT` chờ bấm duyệt.

4. **Báo cáo AI Governance:** Viết **Báo cáo Phân loại Rủi ro AI** theo Khung chuẩn Luật Trí tuệ Nhân tạo (EU AI Act Framework). *(Vy phối hợp cùng Trà - QA/DevOps/Security)*.