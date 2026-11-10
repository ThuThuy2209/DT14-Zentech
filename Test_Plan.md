# TEST PLAN – DT14 OPC SMARTOFFICE

> **Mã dự án:** DT14  
> **Tên sản phẩm:** OPC SmartOffice – Nền tảng quản trị doanh nghiệp một người có trợ lý AI  
> **Phiên bản tài liệu:** 0.1 – Draft  
> **Người phụ trách:** QA / DevOps / Security  _ Đinh Thị Thu Trà
> **Đơn vị khách hàng giả định:** Công ty TNHH Một thành viên Minh Software  
> **Người dùng nghiệp vụ chính:** Chủ doanh nghiệp  
> **Ngày lập:** 10/11/2026  
> **Trạng thái:** Bản kế hoạch kiểm thử sơ bộ, cần nhóm review và thống nhất trước khi thực thi

---

## 1. Mục đích tài liệu

Tài liệu này xác định kế hoạch kiểm thử sơ bộ cho dự án DT14 – OPC SmartOffice. Đây là cơ sở để nhóm QA phối hợp với BA, Frontend, Backend và AI Engineer chuẩn bị dữ liệu, môi trường, kịch bản kiểm thử, tiêu chí đánh giá và bằng chứng nghiệm thu.

Test Plan được xây dựng dựa trên các tài liệu dự án đã cung cấp:

- Business Requirements Document (BRD).
- Software Requirements Specification (SRS).
- Use Case Diagram.
- Use Case Description.
- Activity Diagram.
- Entity Relationship Diagram (ERD).

**Nguyên tắc:** kiểm thử dựa trên yêu cầu và luồng nghiệp vụ được mô tả trong tài liệu; không xem một màn hình đã hiển thị hoặc một service đã khởi động là bằng chứng đủ để kết luận chức năng đạt.

## 2. Tổng quan sản phẩm

OPC SmartOffice là nền tảng quản trị doanh nghiệp một người, hỗ trợ tập trung dữ liệu và xử lý các nghiệp vụ:

1. Quản lý tài khoản và hồ sơ doanh nghiệp.
2. Quản lý khách hàng, nhà cung cấp và danh mục dịch vụ.
3. Quản lý email, tài liệu và chứng từ.
4. Tiếp nhận, OCR và kiểm tra hóa đơn mua vào.
5. Quản lý báo giá, mẫu hợp đồng, hợp đồng và ký số Sandbox.
6. Quản lý nghiệm thu và hóa đơn bán ra.
7. Quản lý thanh toán, thu chi và công nợ.
8. Nhập sao kê và đối chiếu giao dịch ngân hàng.
9. Quản lý nghĩa vụ pháp lý và thời hạn.
10. Trợ lý AI, tra cứu, phân tích và soạn thảo.
11. Phê duyệt, dashboard, báo cáo, thông báo và nhật ký hoạt động.

### 2.1. Công nghệ dự kiến theo BRD

| Thành phần | Công nghệ |
|---|---|
| Frontend | React + TypeScript |
| Backend | NestJS |
| AI Service | Python + FastAPI |
| Database | PostgreSQL |
| Hạ tầng phát triển | Docker / Docker Compose (nếu được nhóm cấu hình) |
| Kiểm thử API | Postman hoặc công cụ tương đương |
| Quản lý mã nguồn | Git / GitHub |

Các công nghệ trên là công nghệ dự kiến trong tài liệu yêu cầu. Phiên bản cụ thể, port, endpoint, cách chạy và cấu hình triển khai phải được các thành viên phụ trách xác nhận; Test Plan không tự đặt các giá trị này.

## 3. Mục tiêu kiểm thử

- Xác minh các chức năng được triển khai phù hợp với BRD, SRS và Use Case.
- Kiểm tra luồng dữ liệu giữa Frontend, Backend, AI Service và PostgreSQL.
- Kiểm tra tính đúng đắn, đầy đủ và nhất quán của dữ liệu nghiệp vụ.
- Đánh giá khả năng trích xuất dữ liệu OCR và các chức năng phát hiện bất thường theo bộ dữ liệu có nhãn chuẩn.
- Đảm bảo AI chỉ hỗ trợ, đề xuất hoặc tạo bản nháp; không tự phê duyệt các hành động quan trọng.
- Kiểm tra các quy tắc nghiệp vụ tài chính, công nợ, đối chiếu và lịch sử hoạt động.
- Kiểm tra xử lý lỗi, trạng thái dịch vụ bên ngoài và khả năng phục hồi phù hợp.
- Ghi nhận lỗi có thể tái hiện, mức độ ảnh hưởng và bằng chứng để nhóm phát triển xử lý.
- Chuẩn bị bằng chứng phục vụ đánh giá và nghiệm thu.

## 4. Phạm vi kiểm thử

### 4.1. Trong phạm vi (In Scope)

| ID | Phân hệ | Nội dung kiểm thử chính |
|---|---|---|
| TS-01 | Tài khoản và doanh nghiệp | Đăng nhập, thông tin tài khoản, hồ sơ doanh nghiệp, quyền truy cập |
| TS-02 | Khách hàng / nhà cung cấp | Tạo, sửa, tìm kiếm, xem chi tiết và kiểm tra dữ liệu |
| TS-03 | Danh mục dịch vụ | Thêm dịch vụ, cập nhật đơn giá và trạng thái kinh doanh |
| TS-04 | Email và tài liệu | Kết nối email, đồng bộ email, lưu trữ, xem và tải tài liệu theo quyền |
| TS-05 | Hóa đơn mua vào | Tiếp nhận file/email, OCR, kiểm tra thiếu dữ liệu, trùng, MST, phân loại chi phí, xác nhận |
| TS-06 | Báo giá | Tạo báo giá, nhiều dòng dịch vụ, tính tiền, gửi và quản lý trạng thái |
| TS-07 | Hợp đồng / ký số | Mẫu hợp đồng, phiên bản, tạo hợp đồng, người ký, gửi Sandbox, trạng thái và lịch sử |
| TS-08 | Nghiệm thu | Tạo hồ sơ, nhiều lần nghiệm thu, kết quả và tài liệu minh chứng |
| TS-09 | Hóa đơn bán ra | Lập hóa đơn, liên kết khách hàng/hợp đồng/nghiệm thu, theo dõi trạng thái |
| TS-10 | Thanh toán / công nợ | Ghi nhận nhiều lần thanh toán, tính số đã trả và số còn nợ, theo dõi quá hạn |
| TS-11 | Nhắc nợ AI | Phát hiện khoản quá hạn, tạo bản nháp, phê duyệt, gửi và lưu lịch sử |
| TS-12 | Thu chi / sao kê ngân hàng | Nhập CSV/Excel, kiểm tra trùng, phân loại tiền vào/ra, đề xuất và xác nhận đối chiếu |
| TS-13 | Nghĩa vụ pháp lý | Danh mục, kỳ hạn, căn cứ, trạng thái, nhắc hạn và bằng chứng hoàn thành |
| TS-14 | Trợ lý AI | Phân tích, tra cứu, tóm tắt, soạn thảo, cảnh báo cần xác minh và lưu lịch sử |
| TS-15 | Phê duyệt | Tạo yêu cầu, duyệt, từ chối, lưu người duyệt/thời gian/lý do |
| TS-16 | Dashboard / báo cáo | Số liệu tổng quan, lọc và xuất báo cáo theo chức năng được hỗ trợ |
| TS-17 | Thông báo / nhật ký | Nội dung, trạng thái đọc, lịch sử thao tác và truy vết |
| TS-18 | Tích hợp / lỗi dịch vụ | Email, OCR, AI, ký số Sandbox; timeout, lỗi kết nối, thử lại và trạng thái phản hồi |

### 4.2. Ngoài phạm vi hoặc cần xác nhận

Các nội dung sau không được tự giả định là đã triển khai:

- Ký số có giá trị pháp lý thực tế: tài liệu mô tả tích hợp ký số ở môi trường Sandbox để mô phỏng.
- Tự động gửi email nhắc nợ khi chưa có phê duyệt: không được phép theo yêu cầu nghiệp vụ.
- AI tự xác nhận hóa đơn, hợp đồng, nghĩa vụ pháp lý hoặc giao dịch tài chính: không thuộc quyền tự quyết của AI.
- Tự động kết luận một nghĩa vụ pháp lý áp dụng cho doanh nghiệp nếu chưa có xác minh của người có trách nhiệm.
- Tích hợp ngân hàng trực tiếp ngoài phạm vi dữ liệu sao kê CSV/Excel được mô tả.
- Các chức năng, định dạng file, trình duyệt, thiết bị hoặc API chưa được BRD/SRS/API Specification xác nhận.

Các mục chưa rõ phải được ghi thành câu hỏi cần BA/nhóm phát triển xác nhận, không tự bổ sung vào tiêu chí Pass/Fail.

## 5. Căn cứ và tài liệu tham chiếu

| Tài liệu | Cách sử dụng trong kiểm thử |
|---|---|
| BRD | Mục tiêu, phạm vi nghiệp vụ, stakeholder, Business Rules, Acceptance Criteria và quy mô dữ liệu nghiệm thu |
| SRS | Yêu cầu chức năng, phi chức năng, tác nhân, ranh giới hệ thống và quy tắc xử lý |
| Use Case Diagram | Xác định tác nhân và các chức năng được hệ thống hỗ trợ |
| Use Case Description | Xây dựng điều kiện tiên quyết, luồng chính, luồng thay thế, ngoại lệ và hậu điều kiện |
| Activity Diagram | Đối chiếu trình tự xử lý, điểm quyết định và trách nhiệm giữa người dùng/hệ thống/dịch vụ |
| ERD | Kiểm tra dữ liệu, khóa, quan hệ và tính nhất quán lưu trữ |

Khi tài liệu có điểm khác nhau hoặc chưa rõ, QA cần ghi nhận và yêu cầu BA/nhóm thống nhất trước khi chốt expected result.

## 6. Chiến lược và phương pháp kiểm thử

### 6.1. Các cấp độ kiểm thử

| Cấp độ | Mục tiêu | Ví dụ |
|---|---|---|
| Unit Testing | Kiểm tra đơn vị logic do developer thực hiện | Hàm tính tổng, kiểm tra MST, phát hiện trùng |
| API Testing | Kiểm tra request/response, status code, dữ liệu và lỗi | API đăng nhập, API hóa đơn, API phê duyệt |
| Integration Testing | Kiểm tra các thành phần trao đổi dữ liệu | Frontend–Backend, Backend–Database, Backend–AI |
| System Testing | Kiểm tra toàn hệ thống theo nghiệp vụ | Từ nhận hóa đơn đến người dùng xác nhận |
| Regression Testing | Kiểm tra chức năng cũ sau khi có thay đổi | Sửa OCR không làm hỏng lưu hóa đơn |
| Acceptance Testing | Đối chiếu tiêu chí nghiệm thu | AC-01 đến AC-44 trong BRD và tiêu chí tương ứng trong tài liệu nghiệm thu |

### 6.2. Kỹ thuật thiết kế kiểm thử

- Phân vùng tương đương: dữ liệu hợp lệ, không hợp lệ, thiếu, sai định dạng.
- Phân tích giá trị biên: số tiền bằng 0, số lượng lớn, ngày đến hạn, ngày thanh toán.
- Bảng quyết định: các điều kiện phát hiện trùng, MST, phê duyệt và đối chiếu.
- Kiểm thử luồng nghiệp vụ: theo Use Case và Activity Diagram.
- Kiểm thử âm tính: thiếu trường bắt buộc, file sai định dạng, thông tin đăng nhập sai, service không khả dụng.
- Kiểm thử dữ liệu: đối chiếu kết quả API với dữ liệu PostgreSQL và dữ liệu chuẩn.
- Kiểm thử phân quyền: truy cập không có quyền và thao tác quan trọng không được phê duyệt.

### 6.3. Nguyên tắc kiểm thử tích hợp

Chỉ thực hiện kiểm thử tích hợp khi các service liên quan đã có hướng dẫn chạy, cấu hình môi trường, endpoint và dữ liệu kiểm thử.

Thứ tự kiểm tra đề xuất:

1. Xác nhận từng service có thể khởi động.
2. Xác nhận Backend kết nối PostgreSQL.
3. Xác nhận Backend gọi được AI Service.
4. Xác nhận Frontend gọi được Backend.
5. Kiểm tra luồng dữ liệu đầu-cuối.
6. Kiểm tra log và trạng thái khi một service gặp lỗi.

Không kết luận tích hợp thành công chỉ dựa trên trạng thái container `Running`.

## 7. Các luồng nghiệp vụ trọng yếu

### 7.1. Luồng hóa đơn mua vào

1. Email nhận hóa đơn hoặc người dùng tải file lên.
2. Hệ thống tiếp nhận và lưu file/chứng từ.
3. OCR trích xuất các trường dữ liệu được hỗ trợ.
4. Hệ thống kiểm tra dữ liệu thiếu/bất thường.
5. Hệ thống kiểm tra hóa đơn trùng và MST người mua.
6. AI đề xuất phân loại chi phí cho trường hợp phù hợp.
7. Hệ thống hiển thị kết quả và cảnh báo.
8. Chủ doanh nghiệp kiểm tra, chỉnh sửa nếu cần và xác nhận.
9. Hệ thống lưu trạng thái, dữ liệu và lịch sử.

**Điểm kiểm thử bắt buộc:**
- Không bỏ sót hóa đơn trùng trong bộ dữ liệu kịch bản.
- Cảnh báo hóa đơn sai MST người mua.
- Không coi 23 hóa đơn không vi phạm hai tiêu chí trùng/MST là mặc nhiên hợp lệ về mọi mặt.
- Kiểm tra dữ liệu OCR với dữ liệu chuẩn.
- Không tự xác nhận hóa đơn thay chủ doanh nghiệp.

### 7.2. Luồng bán hàng, hợp đồng và hóa đơn đầu ra

1. Tạo/chọn khách hàng.
2. Tạo báo giá với một hoặc nhiều dòng dịch vụ.
3. Kiểm tra cách tính số lượng, đơn giá, chiết khấu và thuế nếu có.
4. Gửi báo giá và theo dõi trạng thái.
5. Khi báo giá được chấp nhận, tạo hợp đồng theo mẫu.
6. Kiểm tra phiên bản mẫu hợp đồng được lưu.
7. Kiểm tra thông tin người ký và điều kiện trước khi gửi ký.
8. Gửi yêu cầu đến Sandbox; lưu mã giao dịch và phản hồi.
9. Theo dõi trạng thái ký theo kết quả thực tế từ Sandbox.
10. Tạo hồ sơ nghiệm thu và lưu kết quả/minh chứng.
11. Chủ doanh nghiệp lập hóa đơn đầu ra khi phù hợp.
12. Theo dõi thanh toán và công nợ.

**Điểm kiểm thử bắt buộc:**
- Không gửi ký khi thiếu thông tin bắt buộc.
- Không tạo trạng thái ký thành công giả khi Sandbox lỗi hoặc chưa phản hồi thành công.
- Có thể lưu lịch sử gửi, trạng thái và lỗi.
- Nghiệm thu không tự động phát hành hóa đơn.
- Việc ký/ nghiệm thu không tự động thay thế thao tác lập hóa đơn của chủ doanh nghiệp.

### 7.3. Luồng công nợ và nhắc nợ

1. Ghi nhận hóa đơn/khoản phải thu.
2. Theo dõi hạn thanh toán và số dư còn phải thu.
3. Hệ thống phát hiện khoản đến hạn/quá hạn theo quy tắc.
4. AI tạo bản nháp email nhắc nợ.
5. Chủ doanh nghiệp xem, chỉnh sửa, phê duyệt hoặc từ chối.
6. Chỉ gửi email sau khi được phê duyệt.
7. Lưu nội dung, thời gian phê duyệt và kết quả gửi.

### 7.4. Luồng nhập và đối chiếu sao kê ngân hàng

1. Chủ doanh nghiệp chọn tài khoản ngân hàng.
2. Tải tệp sao kê CSV hoặc Excel.
3. Hệ thống kiểm tra định dạng/cấu trúc.
4. Đọc giao dịch và kiểm tra trùng.
5. Phân loại giao dịch tiền vào/tiền ra.
6. Đề xuất chứng từ có khả năng tương ứng.
7. Chủ doanh nghiệp xác nhận, từ chối hoặc điều chỉnh.
8. Chỉ sau khi xác nhận mới cập nhật số tiền đã thanh toán và công nợ.
9. Lưu lịch sử đối chiếu.

**Quy tắc dữ liệu cần kiểm tra theo ERD/BRD:**
- Mỗi bản ghi đối chiếu chỉ tham chiếu một trong ba loại: hóa đơn bán ra, hóa đơn mua vào hoặc khoản chi.
- Một giao dịch có thể được đối chiếu với nhiều chứng từ bằng nhiều bản ghi.
- Tổng số tiền đã đối chiếu được xác nhận không vượt quá số tiền giao dịch.
- Hỗ trợ đối chiếu một phần.
- Giao dịch chưa khớp phải giữ trạng thái chưa đối chiếu.
- Ghi nhận lịch sử xác nhận/từ chối/điều chỉnh.

### 7.5. Luồng nghĩa vụ pháp lý

1. Thiết lập loại nghĩa vụ và căn cứ.
2. Xác định khả năng áp dụng, kỳ thực hiện và hạn pháp lý.
3. Theo dõi trạng thái và nhắc hạn.
4. Chủ doanh nghiệp thực hiện nghĩa vụ.
5. Cập nhật kết quả và lưu tài liệu bằng chứng.

AI có thể hỗ trợ tra cứu/giải thích nhưng không tự kết luận cuối cùng về tính áp dụng hoặc hạn pháp lý khi cần người có trách nhiệm xác minh.

## 8. Kiểm thử AI và OCR

### 8.1. Các trường OCR cần đối chiếu

Danh sách trường cụ thể phải căn cứ định dạng hóa đơn và phạm vi OCR được AI Engineer xác nhận. Nhóm trường cần xem xét theo nghiệp vụ gồm:

- Tên người bán và mã số thuế người bán.
- Tên người mua và mã số thuế người mua.
- Số hóa đơn.
- Ngày lập hóa đơn.
- Nội dung/diễn giải hàng hóa hoặc dịch vụ nếu được hỗ trợ.
- Tiền trước thuế.
- Tiền thuế.
- Tổng tiền thanh toán.

Với từng hóa đơn, QA cần có dữ liệu chuẩn (Ground Truth) được kiểm tra trước. Cần thống nhất quy tắc chuẩn hóa ngày tháng, khoảng trắng, dấu phân cách số, định dạng MST và trường trống.

### 8.2. Chỉ số đánh giá

BRD nêu mục tiêu độ chính xác OCR **F1 tối thiểu 0,90 trên bộ đánh giá theo yêu cầu nghiệm thu**. Cần thống nhất với AI Engineer cách tính F1 cho từng tác vụ và cách tổng hợp kết quả.

Với tác vụ phân loại/phát hiện nhị phân:

- `TP`: dự đoán có lỗi và thực tế có lỗi.
- `FP`: dự đoán có lỗi nhưng thực tế không có lỗi.
- `FN`: không phát hiện lỗi trong khi thực tế có lỗi.
- `TN`: dự đoán không lỗi và thực tế không lỗi.

```text
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
F1        = 2 * Precision * Recall / (Precision + Recall)
```

Quy ước xử lý khi mẫu số bằng 0 phải được thống nhất trước khi báo cáo; không tự gán F1 = 1.

**Lưu ý phương pháp:**
- OCR trích xuất trường dữ liệu là bài toán trích xuất/so khớp trường; không mặc nhiên dùng TP/FP/FN ở cấp hóa đơn cho toàn bộ trường. Cần thống nhất cách tính theo trường (ví dụ exact match hoặc quy tắc chuẩn hóa) và báo cáo tỷ lệ đúng từng trường.
- Phát hiện hóa đơn trùng và phát hiện sai MST là hai tác vụ phân loại riêng; tính Precision, Recall, F1 riêng cho từng tác vụ.
- Phân loại chi phí là tác vụ riêng; cần nhãn chuẩn và cách tính phù hợp.
- Báo cáo số lượng mẫu, số mẫu từng lớp, TP/FP/FN/TN (nếu áp dụng), kết quả từng trường/lớp và ví dụ lỗi.
- Không gộp kết quả OCR, trùng hóa đơn và sai MST thành một F1 duy nhất nếu chưa có phương pháp tổng hợp được thống nhất.

### 8.3. Bộ dữ liệu đánh giá và kiểm thử

BRD mô tả hai quy mô/kịch bản cần giữ riêng:

**A. Kịch bản 25 hóa đơn mua vào**

| Nhóm | Số lượng | Mục đích |
|---|---:|---|
| Hóa đơn trùng | 1 | Kiểm tra cảnh báo trùng |
| Hóa đơn sai MST người mua | 1 | Kiểm tra cảnh báo MST |
| Hóa đơn còn lại | 23 | Kiểm tra xử lý và đề xuất phân loại chi phí |
| **Tổng** | **25** | **Kịch bản chức năng theo BRD** |

23 hóa đơn còn lại chỉ là nhóm không được gắn nhãn trùng/sai MST theo kịch bản này; không được diễn giải thành chứng từ đã hợp lệ toàn diện.

**B. Bộ dữ liệu nghiệm thu quy mô lớn theo BRD**

| Hạng mục | Quy mô |
|---|---:|
| Doanh nghiệp giả lập | 20 |
| Khoảng thời gian dữ liệu | 12 tháng |
| Chứng từ mua vào | 1.500 |
| Dữ liệu AI | Có dữ liệu chuẩn để đối chiếu OCR và phân loại |

Hai bộ dữ liệu phục vụ mục đích khác nhau: 25 hóa đơn cho kịch bản kiểm tra nghiệp vụ trọng tâm; bộ dữ liệu lớn cho đánh giá nghiệm thu quy mô và chất lượng AI. Không dùng bộ 25 hóa đơn làm bằng chứng duy nhất để kết luận F1 đạt 0,90.

### 8.4. Bảng ghi nhận kết quả AI đề xuất

| Run ID | Invoice ID | Field/Task | Ground Truth | AI Output | Match | Confidence (nếu có) | Ghi chú |
|---|---|---|---|---|---|---|---|
| RUN-001 | INV-001 | Buyer MST | ... | ... | Yes/No | ... | ... |

Chỉ sử dụng confidence nếu AI Service thực sự trả về trường này. Không tự tạo hoặc suy diễn confidence.

## 9. Kiểm thử phi chức năng

| Nhóm | Nội dung cần kiểm tra | Căn cứ/ghi chú |
|---|---|---|
| Hiệu năng | Các thao tác dữ liệu nhỏ, thông thường; thời gian phản hồi | BRD/SRS nêu mục tiêu khoảng 3 giây cho thao tác thông thường, không tính thời gian dịch vụ ngoài; xác nhận điều kiện đo |
| Khả dụng / lỗi dịch vụ | Mất kết nối email, OCR, AI, Sandbox, Database; hiển thị lỗi và trạng thái xử lý | Theo yêu cầu xử lý dịch vụ ngoài và SRS |
| Tính nhất quán dữ liệu | Không ghi nhận sai/mất dữ liệu; cập nhật công nợ đúng thời điểm | Đặc biệt sau phê duyệt và đối chiếu |
| Bảo mật | Mật khẩu được băm; thông tin kết nối bên ngoài được bảo vệ; kiểm tra quyền truy cập | Không lưu mật khẩu dạng rõ |
| Kiểm soát nghiệp vụ | Không tự thực hiện hành động tài chính/pháp lý quan trọng khi chưa duyệt | Business Rules |
| Khả năng truy vết | Ghi nhận người thực hiện, hành động, thời điểm, kết quả và dữ liệu liên quan khi phù hợp | Activity Logs / Approval / Email Logs |
| Khả năng phục hồi | Kiểm tra backup/restore theo quy trình nhóm cung cấp | Không tự giả định lịch backup hoặc RPO/RTO |
| Trạng thái xử lý | OCR/AI/ký số có trạng thái đang xử lý; không báo thành công trước khi có kết quả | SRS/BRD |

## 10. Kiểm thử bảo mật (Security Testing)

Phạm vi kiểm tra tối thiểu:

1. Đăng nhập với thông tin hợp lệ và không hợp lệ.
2. Kiểm tra truy cập khi chưa đăng nhập.
3. Kiểm tra endpoint yêu cầu xác thực.
4. Kiểm tra người dùng không có quyền không thể thực hiện thao tác bị hạn chế.
5. Kiểm tra AI không thể tự phê duyệt hoặc tự gửi email nhắc nợ.
6. Kiểm tra không thể xác nhận đối chiếu ngân hàng nếu chưa có thao tác/quyền phê duyệt phù hợp.
7. Kiểm tra mật khẩu không lưu dạng văn bản thuần trong cơ sở dữ liệu.
8. Kiểm tra file cấu hình bí mật (`.env`, token, API key) không bị commit lên GitHub hoặc ghi vào log.
9. Kiểm tra tài liệu được xem/tải theo quyền truy cập.
10. Kiểm tra nhật ký đối với thao tác xác nhận, từ chối, điều chỉnh và hành động quan trọng.

Các phép thử bảo mật chỉ thực hiện trên môi trường và tài khoản được nhóm cho phép; không thực hiện kiểm thử phá hoại trên dữ liệu thật.

## 11. Kiểm thử DevOps và môi trường

### 11.1. Điều kiện chuẩn bị

- Có quyền truy cập repository và branch được nhóm thống nhất.
- Có hướng dẫn chạy từng service hoặc README.
- Có file mẫu biến môi trường (`.env.example`) nếu dự án sử dụng.
- Có Dockerfile / Compose nếu nhóm triển khai bằng Docker.
- Có phiên bản Node.js, npm, Python và PostgreSQL phù hợp được xác nhận.
- Có endpoint, port, tài khoản test và dữ liệu test.
- Có hướng dẫn seed/reset dữ liệu test và cách xem log.

### 11.2. Checklist môi trường

| ID | Hạng mục | Tiêu chí xác nhận | Trạng thái |
|---|---|---|---|
| ENV-01 | Git | Clone/pull đúng repository và branch | Chưa kiểm tra |
| ENV-02 | Frontend | Khởi động được theo README | Chưa kiểm tra |
| ENV-03 | Backend | Khởi động được theo README | Chưa kiểm tra |
| ENV-04 | AI Service | Khởi động được theo README | Chưa kiểm tra |
| ENV-05 | PostgreSQL | Service hoạt động, truy cập được | Chưa kiểm tra |
| ENV-06 | Backend–Database | Kết nối và truy vấn được | Chưa kiểm tra |
| ENV-07 | Backend–AI | Backend gọi được AI endpoint | Chưa kiểm tra |
| ENV-08 | Frontend–Backend | Frontend gọi được API | Chưa kiểm tra |
| ENV-09 | Docker | Compose config hợp lệ và service có log | Chưa kiểm tra |
| ENV-10 | Logs | Có thể xem log và xác định lỗi service | Chưa kiểm tra |
| ENV-11 | Secrets | Không commit/hiển thị thông tin bí mật | Chưa kiểm tra |
| ENV-12 | Test data | Có dữ liệu chuẩn và cách reset | Chưa kiểm tra |

**Lưu ý:** hiện trạng môi trường chưa được xác nhận trong Test Plan này. Các mục trên đều để `Chưa kiểm tra` cho đến khi thực hiện và có bằng chứng.

## 12. Dữ liệu kiểm thử

| Nhóm dữ liệu | Dữ liệu cần có | Ghi chú |
|---|---|---|
| Tài khoản | Tài khoản test hợp lệ, sai mật khẩu, chưa xác thực (nếu có) | Không dùng tài khoản/mật khẩu thật trong tài liệu |
| Doanh nghiệp | Hồ sơ doanh nghiệp, MST cấu hình | Dữ liệu giả lập |
| Khách hàng / nhà cung cấp | Tên, MST, email, địa chỉ | Có dữ liệu hợp lệ và trường hợp trùng |
| Hóa đơn mua vào | PDF/ảnh hóa đơn và dữ liệu chuẩn | Có 25 hóa đơn theo kịch bản BRD |
| Báo giá / hợp đồng | Khách hàng, dòng dịch vụ, mẫu và phiên bản hợp đồng | Bao gồm trạng thái khác nhau |
| Nghiệm thu / hóa đơn bán | Hợp đồng, nghiệm thu, hóa đơn và thanh toán | Kiểm tra liên kết dữ liệu |
| Sao kê ngân hàng | CSV/Excel hợp lệ và không hợp lệ | Có giao dịch trùng, khớp, khớp một phần, không khớp |
| Nghĩa vụ pháp lý | Loại nghĩa vụ, kỳ, hạn, căn cứ và bằng chứng | Trạng thái cần xác minh nếu phù hợp |
| AI Ground Truth | Nhãn chuẩn cho OCR và phân loại | Do BA/QA/AI Engineer thống nhất và xác minh |

Dữ liệu phải là dữ liệu giả lập hoặc đã được phép sử dụng. Không đưa dữ liệu cá nhân, thông tin ngân hàng hoặc bí mật doanh nghiệp thật vào môi trường kiểm thử nếu chưa được cho phép.

## 13. Môi trường và công cụ kiểm thử

| Công cụ / môi trường | Mục đích | Trạng thái |
|---|---|---|
| VS Code | Xem mã nguồn, cấu hình và log | Cần xác nhận |
| Git / GitHub | Quản lý phiên bản, branch, commit | Cần xác nhận |
| Docker Desktop / Docker Compose | Khởi chạy các service nếu dự án dùng Docker | Cần xác nhận |
| PostgreSQL client | Kiểm tra dữ liệu và kết nối DB | Cần xác nhận |
| Postman | Gửi request và kiểm thử API | Cần xác nhận |
| Browser | Kiểm thử giao diện Frontend | Cần xác nhận |
| Test Plan / Test Case / Bug Log | Quản lý hoạt động QA | Chuẩn bị |

Thông tin cấu hình cần Backend/DevOps cung cấp: phiên bản runtime, port, API base URL, endpoint health check (nếu có), tên service Compose, biến môi trường bắt buộc và cách reset dữ liệu. Không ghi giá trị bí mật vào tài liệu này.

## 14. Tiêu chí bắt đầu và kết thúc kiểm thử

### 14.1. Entry Criteria – Điều kiện bắt đầu

- Yêu cầu hoặc Use Case của chức năng đã được xác định.
- Có bản build/branch được nhóm chỉ định để kiểm thử.
- Có hướng dẫn chạy và cấu hình môi trường cần thiết.
- Service phụ thuộc đã sẵn sàng hoặc đã xác định rõ phần nào đang bị Blocked.
- Có tài khoản và dữ liệu kiểm thử phù hợp.
- Expected Result đã được đối chiếu với tài liệu hoặc BA xác nhận.

### 14.2. Exit Criteria – Điều kiện kết thúc

- Các Test Case trong phạm vi đã được chạy hoặc ghi rõ lý do Blocked/Not Run.
- Kết quả Pass/Fail có bằng chứng phù hợp.
- Lỗi được ghi nhận, phân loại mức độ và chuyển người phụ trách.
- Lỗi nghiêm trọng ảnh hưởng dữ liệu, bảo mật hoặc phê duyệt đã được xử lý/được chấp nhận rủi ro chính thức.
- Các tiêu chí nghiệm thu liên quan có kết quả thực tế.
- Kết quả kiểm thử AI có bộ dữ liệu chuẩn và cách tính chỉ số được thống nhất.
- Báo cáo QA nêu rõ phần đã đạt, chưa đạt, chưa kiểm thử và rủi ro còn lại.

Không tự tuyên bố toàn hệ thống đạt nghiệm thu nếu các tiêu chí bắt buộc chưa có bằng chứng.

## 15. Phân loại mức độ lỗi

| Mức độ | Ý nghĩa | Ví dụ |
|---|---|---|
| Critical | Rủi ro nghiêm trọng, mất dữ liệu hoặc thao tác tài chính trái phép | Gửi email nhắc nợ khi chưa duyệt; cập nhật công nợ sai diện rộng |
| High | Chức năng nghiệp vụ chính sai hoặc dữ liệu quan trọng sai | Không phát hiện hóa đơn trùng; sai MST không được cảnh báo |
| Medium | Một phần chức năng sai nhưng có cách xử lý thay thế | Bộ lọc hoặc trạng thái hiển thị không đúng |
| Low | Lỗi giao diện hoặc nội dung ít ảnh hưởng nghiệp vụ | Sai nhãn, căn lề, thông báo chưa rõ |

Mức độ cuối cùng cần được QA và nhóm thống nhất dựa trên ảnh hưởng thực tế.

## 16. Quy trình quản lý lỗi (Defect Management)

Mỗi Bug Report tối thiểu gồm:

- Bug ID.
- Tiêu đề ngắn, mô tả đúng lỗi.
- Module / chức năng.
- Môi trường, branch hoặc phiên bản build.
- Mức độ nghiêm trọng và độ ưu tiên (nếu nhóm sử dụng).
- Điều kiện tiên quyết.
- Các bước tái hiện.
- Dữ liệu đầu vào đã dùng (không chứa bí mật).
- Kết quả mong đợi.
- Kết quả thực tế.
- Ảnh/video/log hoặc response API đã che thông tin nhạy cảm.
- Người phụ trách xử lý.
- Trạng thái: New, Assigned, In Progress, Fixed, Retest, Closed hoặc Reopened (nhóm có thể điều chỉnh quy ước).

Quy trình đề xuất:

`New → Assigned → In Progress → Fixed → Retest → Closed`

Nếu kiểm thử lại vẫn còn lỗi: `Retest → Reopened`.

## 17. Phân công phối hợp

Theo phân công nhóm đã cung cấp:

| Thành viên / vai trò | Trách nhiệm phối hợp kiểm thử |
|---|---|
| Thủy – BA / Full-stack Lead | Làm rõ yêu cầu, xác nhận expected result, điều phối và review phạm vi |
| Quỳnh – Backend Business | API và logic nghiệp vụ phía Backend |
| Tiến – Backend Ledger | API và logic hóa đơn, thanh toán, thu chi, công nợ/ledger |
| Đạt – Frontend / Mobile | Giao diện, tích hợp API và trạng thái hiển thị |
| Vy – AI Engineer | OCR, trích xuất, phân loại, phát hiện bất thường và cung cấp kết quả AI |
| QA / DevOps / Security | Lập kế hoạch, chuẩn bị môi trường, kiểm thử API/tích hợp/nghiệp vụ, bảo mật, ghi lỗi và báo cáo |

Phân công trên là đầu mối phối hợp; không thay thế trách nhiệm review hoặc phê duyệt của nhóm.

## 18. Rủi ro và biện pháp xử lý

| Rủi ro | Ảnh hưởng | Hướng xử lý |
|---|---|---|
| Chưa có API Specification hoặc endpoint ổn định | Không thể kiểm thử API/tích hợp chính xác | Yêu cầu Backend cung cấp API docs, request/response mẫu và trạng thái API |
| Các service chưa chạy đồng thời | Chưa thể kiểm thử end-to-end | Kiểm tra từng service riêng, ghi Blocked cho kiểm thử tích hợp |
| Thiếu `.env.example` hoặc hướng dẫn cấu hình | Mất thời gian dựng môi trường, sai cấu hình | Yêu cầu người phụ trách cung cấp mẫu không chứa secrets |
| OCR phụ thuộc chất lượng file | Kết quả trích xuất không ổn định | Chuẩn bị nhiều dạng file/mức chất lượng và Ground Truth |
| Bộ dữ liệu quá nhỏ | Chỉ số F1 thiếu tin cậy | Dùng 25 hóa đơn cho smoke/functional; dùng bộ nghiệm thu quy mô lớn để đánh giá theo BRD |
| AI trả kết quả nhưng không có nguồn/độ tin cậy rõ | Khó đánh giá và giải thích | Thống nhất response schema và thông tin cần lưu với AI Engineer |
| Dịch vụ ngoài bị lỗi/timeout | Luồng nghiệp vụ bị gián đoạn | Kiểm thử trạng thái lỗi, retry và không báo thành công giả |
| AI vượt quyền phê duyệt | Rủi ro tài chính/pháp lý | Kiểm thử chặn thao tác chưa được người dùng duyệt |
| Thay đổi code liên tục | Kết quả test không ổn định | Ghi branch, commit/build và thời điểm kiểm thử |
| Dữ liệu test bị dùng chung hoặc thay đổi | Không tái hiện được lỗi | Có bộ dữ liệu chuẩn, quy trình reset và ghi nhận dữ liệu sử dụng |

## 19. Lịch thực hiện sơ bộ

Lịch dưới đây là đề xuất theo thứ tự phụ thuộc; ngày thực tế cần căn cứ tiến độ phát triển của nhóm.

| Giai đoạn | Công việc | Đầu ra |
|---|---|---|
| 1. Phân tích | Review BRD, SRS, Use Case, Activity Diagram, ERD | Test Plan và danh sách câu hỏi |
| 2. Chuẩn bị | Kiểm tra Git, công cụ, Docker, biến môi trường, test data | Environment Checklist |
| 3. Kiểm tra service | Chạy Frontend, Backend, AI, Database độc lập | Kết quả service readiness |
| 4. Tích hợp | Kiểm tra Backend–DB, Backend–AI, Frontend–Backend | Integration Test Results |
| 5. Chức năng | Kiểm thử theo từng module và Use Case | Test Execution / Bug Reports |
| 6. AI/OCR | Đối chiếu Ground Truth, tính chỉ số | AI Evaluation Report |
| 7. Regression / Security | Kiểm thử lại lỗi và quyền truy cập/phê duyệt | Regression & Security Results |
| 8. Nghiệm thu | Đối chiếu Acceptance Criteria, tổng hợp bằng chứng | QA Summary Report |

## 20. Ma trận truy vết sơ bộ (Requirement Traceability)

| Nhóm yêu cầu / Acceptance Criteria trong BRD | Phạm vi Test Plan |
|---|---|
| AC-01 | TS-01 – Đăng nhập |
| AC-02 đến AC-04 | TS-01 đến TS-03 – Doanh nghiệp, khách hàng, dịch vụ |
| AC-05 đến AC-07 | TS-04 – Email và tài liệu |
| AC-08 đến AC-11 | TS-05 – OCR, trùng, MST, xác nhận hóa đơn |
| AC-12 đến AC-15 | TS-06 – Báo giá |
| AC-16 đến AC-27 | TS-07 – Hợp đồng và ký Sandbox |
| AC-28 đến AC-31 | TS-08 – Nghiệm thu |
| AC-32 đến AC-35 | TS-09, TS-10 – Hóa đơn đầu ra và thanh toán/công nợ |
| AC-36 đến AC-38 | TS-11 – Nhắc nợ AI và phê duyệt |
| AC-39 đến AC-42 | TS-13, TS-14 – Nghĩa vụ pháp lý và AI tra cứu |
| AC-43 đến AC-44 | TS-16 – Dashboard và báo cáo |

Ma trận này là ánh xạ sơ bộ theo các Acceptance Criteria AC-01 đến AC-44 trong BRD. Cần bổ sung mã yêu cầu SRS và mã Use Case cụ thể sau khi BA xác nhận danh sách ID chính thức.

## 21. Các câu hỏi cần nhóm xác nhận trước khi chốt Test Plan

### Với BA / Full-stack Lead
- Phiên bản BRD/SRS nào là baseline dùng để nghiệm thu?
- Có thay đổi hoặc yêu cầu mới nào chưa cập nhật vào tài liệu không?
- Quy tắc nhận diện hóa đơn trùng chính xác dựa trên trường nào?
- Quy tắc xác định MST người mua đúng/sai lấy từ hồ sơ doanh nghiệp nào?
- Trạng thái nghiệp vụ và quyền phê duyệt chính thức là gì?

### Với Backend
- API Specification / Swagger hoặc Postman Collection ở đâu?
- Endpoint, port, auth mechanism và response schema đã ổn định chưa?
- Cách seed/reset database test?
- Quy tắc validate, duplicate detection và cập nhật công nợ được triển khai ở đâu?

### Với AI Engineer
- OCR hỗ trợ loại file và trường dữ liệu nào?
- Response OCR có confidence hoặc trạng thái lỗi không?
- Ground Truth do ai chuẩn bị và xác minh?
- F1 được tính theo trường, theo tác vụ hay theo cách tổng hợp nào?
- Có tập dữ liệu đánh giá độc lập với dữ liệu phát triển không?

### Với Frontend
- API Base URL được cấu hình ở đâu?
- Các màn hình nào đã tích hợp API?
- Cách thể hiện loading, lỗi, retry và trạng thái chờ phê duyệt?

### Với DevOps / người quản lý môi trường
- Cách chạy từng service và toàn bộ Docker Compose?
- Phiên bản runtime, port, biến môi trường và health check?
- Cách xem log, backup/restore và reset môi trường test?

## 22. Biểu mẫu kết quả thực thi

Dùng bảng sau khi bắt đầu chạy Test Case:

| Test Case ID | Module | Build / Commit | Tester | Actual Result | Status | Evidence | Bug ID |
|---|---|---|---|---|---|---|---|
| TC-001 | Login | TBD | QA | Chưa chạy | Not Run | — | — |
| TC-002 | Purchase Invoice | TBD | QA | Chưa chạy | Not Run | — | — |
| TC-003 | OCR | TBD | QA | Chưa chạy | Not Run | — | — |

Quy ước trạng thái:

- `Pass`: kết quả thực tế khớp expected result.
- `Fail`: kết quả thực tế không khớp expected result.
- `Blocked`: không thể chạy do thiếu môi trường, dữ liệu, API hoặc phụ thuộc.
- `Not Run`: chưa thực hiện.

## 23. Kết luận và trạng thái tài liệu

Test Plan này là bản sơ bộ, được lập để chuẩn bị cho hoạt động QA / DevOps / Security của DT14 – OPC SmartOffice.

**Chưa thể kết luận hệ thống sẵn sàng kiểm thử tích hợp** cho đến khi nhóm xác nhận repository/branch, hướng dẫn chạy, cấu hình môi trường, API, Database, AI Service và dữ liệu kiểm thử.

Trước khi thực thi chính thức, cần:

1. BA review phạm vi và expected result.
2. Backend xác nhận API, quy tắc nghiệp vụ và dữ liệu.
3. AI Engineer xác nhận trường OCR, Ground Truth và phương pháp đo F1.
4. Frontend xác nhận các màn hình và API đã tích hợp.
5. Nhóm xác nhận môi trường và cách chạy/reset dữ liệu.

---

## Lịch sử phiên bản

| Phiên bản | Ngày | Người soạn | Nội dung |
|---|---|---|---|
| 0.1 | 10/11/2026 | QA / DevOps / Security _ Đinh Thị Thu Trà | Tạo Test Plan sơ bộ dựa trên BRD, SRS, Use Case, Activity Diagram và ERD |
