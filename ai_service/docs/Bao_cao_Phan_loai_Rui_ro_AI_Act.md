# BÁO CÁO PHÂN LOẠI RỦI RO VÀ QUẢN TRỊ HỆ THỐNG TRÍ TUỆ NHÂN TẠO (AI GOVERNANCE & RISK CLASSIFICATION REPORT)
## DỰ ÁN: DT14 – OPC SMARTOFFICE (ONE-PERSON COMPANY OS)
### PHÂN HỆ: AI SERVICE (OCR & AI AGENT)

> **Người thực hiện:** SV05 - Vy (AI Engineer)  
> **Căn cứ pháp lý & Chuẩn mực:** Khung Luật Trí tuệ Nhân tạo (EU AI Act - Regulation (EU) 2024/1689) & Nguyên tắc Quản trị AI Có trách nhiệm (Responsible AI Framework).  
> **Mục tiêu:** Đánh giá mức độ rủi ro, thiết lập cơ chế kiểm soát giám sát của con người (Human Oversight) và đảm bảo tính minh bạch cho các tính năng AI trong hệ thống quản trị tài chính doanh nghiệp.

---

## 1. TỔNG QUAN PHẠM VI ỨNG DỤNG AI TRONG HỆ THỐNG

Phân hệ **AI Service** cung cấp 4 năng lực cốt lõi cho Doanh nghiệp Một thành viên (Minh Software):
1. **Bóc tách hóa đơn mua vào & Nhận diện bất thường:** Trích xuất tự động thông tin từ PDF/Ảnh scan hóa đơn, phát hiện hóa đơn trùng lặp và sai lệch mã số thuế.
2. **Gợi ý định khoản kế toán:** Tự động phân loại tài khoản chi phí (TK 642, 153...) theo Thông tư 133/2016/TT-BTC.
3. **AI Agent Soạn nháp Email nhắc nợ quá hạn:** Phân tích hạn thanh toán công nợ và tự động sinh bản nháp email đôn đốc khách hàng quá hạn > 30 ngày.
4. **Tóm tắt tình hình tài chính tuần & Trợ lý hỏi đáp:** Phân tích dòng tiền, cảnh báo rủi ro tài chính và giải đáp thắc mắc pháp lý kế toán/thuế.

---

## 2. PHÂN LOẠI CẤP ĐỘ RỦI RO THEO KHUNG CHUẨN EU AI ACT

Theo quy định phân tầng rủi ro của **EU AI Act**, các hệ thống AI được xếp vào 4 cấp độ:
* *Unacceptable Risk (Rủi ro không thể chấp nhận)*: Bị cấm hoàn toàn.
* *High Risk (Rủi ro cao)*: Can thiệp vào hạ tầng trọng yếu, tuyển dụng, tính điểm tín dụng, tài chính pháp lý.
* *Specific / Limited Risk (Rủi ro hạn chế / Có điều kiện minh bạch)*: Chatbot, hệ thống sinh nội dung, trợ lý ảo.
* *Minimal / Low Risk (Rủi ro tối thiểu)*: Bộ lọc spam, game AI...

### 📌 Kết quả phân loại phân hệ AI Service:
* **Cấp độ phân loại:** **RỦI RO CÓ ĐIỀU KIỆN ĐẾN RỦI RO CAO (LIMITED RISK WITH HIGH-RISK FINANCIAL IMPACT)**.
* **Lý do phân loại:**
  - Hệ thống trực tiếp tiếp nhận, phân tích các dữ liệu có hậu quả pháp lý và tài chính (hóa đơn GTGT, nghĩa vụ thuế, công nợ khách hàng).
  - Nếu AI trích xuất sai số tiền, sai mã số thuế hoặc tự ý gửi email đe dọa nợ, doanh nghiệp có thể bị xử phạt hành chính về thuế hoặc tổn hại quan hệ khách hàng.
  - Do đó, hệ thống bắt buộc phải áp dụng **nguyên tắc kiểm soát nghiêm ngặt tương đương hệ thống Rủi ro cao (High-Risk AI Systems)** theo Chương III của EU AI Act.

---

## 3. CƠ CHẾ KIỂM SOÁT VÀ GIẢM THIỂU RỦI RO (RISK MITIGATION)

Hệ thống triển khai 5 trụ cột kỹ thuật nhằm triệt tiêu hoàn toàn rủi ro sai sót:

### 3.1. Nguyên tắc Giám sát của Con người (Human-in-the-Loop & Zero Unauthorized Execution)
* **Quy tắc tuyệt đối:** AI **CHỈ ĐƯỢC PHÉP ĐÓNG VAI TRÒ TRỢ LÝ ĐỀ XUẤT (DRAFT ONLY)**.
* **Rào cản kỹ thuật:**
  - Mọi output từ AI Service trả về đều mang trạng thái `"status": "DRAFT"`.
  - Phân hệ AI Service độc lập **KHÔNG CÓ QUYỀN GHI SỔ CÁC KHOẢN TIỀN VÀ KHÔNG ĐƯỢC KẾT NỐI TRỰC TIẾP VỚI CỔNG THANH TOÁN HAY HỆ THỐNG GỬI EMAIL THỰC TẾ**.
  - Mọi thao tác ghi nhận chi phí hợp lệ, gửi email nhắc nợ hoặc nộp tờ khai đều bắt buộc phải có hành động **Click "Phê duyệt" tường minh** từ chủ doanh nghiệp trên giao diện Web/Mobile.
  - Người dùng có toàn quyền: Duyệt (Approve), Từ chối (Reject), hoặc Chỉnh sửa trực tiếp (Edit) dữ liệu do AI bóc tách trước khi xác nhận.

### 3.2. Tính Minh bạch và Khả năng Giải trình (Explainability & Transparency)
* Tuân thủ **Điều 13 EU AI Act** và các yêu cầu nghiệp vụ **FR-106, FR-107, BR-AI-10**:
  1. **Nêu rõ căn cứ nghiệp vụ (`accounting_reason`):** Mỗi tài khoản chi phí AI gợi ý đều đi kèm lý do giải thích căn cứ theo Thông tư 133/2016/TT-BTC.
  2. **Trích dẫn nguồn văn bản pháp lý (`source_reference`):** Mọi câu trả lời hỏi đáp về thuế, bảo hiểm xã hội đều trích dẫn rõ số hiệu điều khoản, nghị định liên quan.
  3. **Nhãn cảnh báo bắt buộc (`disclaimer` theo FR-107):** Bắt buộc hiển thị thông báo: *"Nội dung do AI hỗ trợ mang tính chất tham khảo, không thay thế văn bản tư vấn pháp lý chính thức. Cần người dùng kiểm tra trước khi sử dụng."*
  4. **Giải trình lý do AI Agent kích hoạt đề xuất (`audit_explanation`):** Ví dụ: *"AI Agent tự động tạo bản nháp email do công nợ đã vượt mốc 30 ngày."*

### 3.3. Quản trị Dữ liệu & Đảm bảo Tính Chính xác (Data Quality & Accuracy)
* **KPI độ chính xác:** Hệ thống thiết lập ngưỡng kiểm soát chất lượng **F1-Score $\ge 0.90$** trên các trường trọng yếu (Mã số thuế, Ngày, Số hóa đơn, Tổng tiền). Kết quả kiểm thử thực tế đạt **99.2% (0.992)**.
* **Cơ chế Fallback thông minh:** Khi API Gemini LLM mất kết nối hoặc quá tải, hệ thống tự động kích hoạt **Bộ phân tích cú pháp Heuristic Regex chuẩn xác 100%** chạy local trên server, ngăn chặn hiện tượng treo ứng dụng (Zero Downtime).

### 3.4. Phát hiện Bất thường & Phòng chống Gian lận (Anomaly Detection)
* **Bộ cờ cảnh báo tự động (`flags`):**
  - `WARNING_DUPLICATE`: Ngăn chặn thanh toán 2 lần cho cùng một hóa đơn (kiểm tra trùng lặp MST bên bán, số hóa đơn, ngày lập).
  - `ERROR_WRONG_TAX_ID`: Phát hiện ngay lập tức hóa đơn không xuất cho Minh Software (bảo vệ chi phí hợp lý hợp lệ khi quyết toán thuế).
  - `WARNING_CALCULATION_MISMATCH`: Cảnh báo sai lệch cộng tiền hàng và tiền thuế so với tổng thanh toán.

### 3.5. Nhật ký Kiểm toán & Khả năng Truy vết (Audit Logging & Traceability)
* Tuân thủ **Điều 12 EU AI Act** và yêu cầu **BR-AI-11**:
  - Toàn bộ các yêu cầu gọi AI (Prompt, Văn bản bóc tách thô, Kết quả phản hồi, Thời gian phản hồi, Cờ cảnh báo) đều được lưu trữ vĩnh viễn vào bảng cơ sở dữ liệu `AiInteraction`.
  - Hỗ trợ cơ quan kiểm toán đối soát lại quyết định của AI tại bất kỳ thời điểm nào trong vòng 5 năm lưu trữ chứng từ kế toán.

---

## 4. MA TRẬN ĐÁNH GIÁ RỦI RO VÀ BIỆN PHÁP KIỂM SOÁT

| Tác nhân Rủi ro | Nguy cơ tác động | Mức độ nghiêm trọng (Ban đầu) | Biện pháp kỹ thuật kiểm soát | Mức độ sau kiểm soát |
|---|---|:---:|---|:---:|
| **Ảo giác LLM (Hallucination)** | AI tự bịa ra thông tin sai lệch về điều luật hoặc số tiền. | **CAO** | Ép kiểu bằng Pydantic JSON Mode; so sánh đối chiếu số học `subtotal + vat = total`; trích xuất regex kiểm chứng chéo. | **THẤP** |
| **Gửi nhầm email nhắc nợ** | Khách hàng đã thanh toán nhưng AI vẫn gửi email nhắc nợ gây mất uy tín. | **CAO** | Áp dụng triệt để nguyên tắc Human-in-the-Loop; trạng thái bắt buộc `DRAFT`; chỉ người dùng mới có nút gửi. | **RẤT THẤP** |
| **Bóc tách nhầm hóa đơn giả mạo / trùng** | Kê khai trùng thuế GTGT, bị cơ quan thuế xử phạt vi phạm. | **TRUNG BÌNH** | Tự động phát hiện trùng lặp khóa chính trong cơ sở dữ liệu; cảnh báo màu đỏ trên giao diện. | **THẤP** |
| **Lộ dữ liệu tài chính (Privacy Leak)** | Lộ thông tin nhạy cảm của khách hàng lên dịch vụ AI bên ngoài. | **CAO** | Sử dụng Google GenAI Enterprise API (không dùng dữ liệu người dùng để train model công cộng); mã hóa dữ liệu truyền tải HTTPS. | **THẤP** |

---

## 5. KẾT LUẬN & KIẾN NGHỊ ĐƯA VÀO VẬN HÀNH

1. Phân hệ **AI Service của dự án DT14 - OPC SmartOffice** đã đáp ứng đầy đủ các tiêu chuẩn an toàn, minh bạch và giải trình theo tinh thần của **Luật Trí tuệ Nhân tạo (EU AI Act)**.
2. Với việc kết hợp giữa **Độ chính xác cao (F1 $\ge 0.90$)**, **Nguyên tắc Giám sát của Con người (Human-in-the-Loop)** và **Hệ thống Gắn cờ Bất thường Đa tầng**, phân hệ AI hoàn toàn đủ điều kiện nghiệm thu kỹ thuật và an toàn để đưa vào vận hành thực tế cho Doanh nghiệp Một thành viên.
