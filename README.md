# DT14 – Nền tảng quản trị doanh nghiệp một người (OPC) có trợ lý AI

## 1. Giới thiệu
DT14 là dự án xây dựng nền tảng quản trị dành cho doanh nghiệp một người (One-Person Company – OPC). Hệ thống hỗ trợ chủ doanh nghiệp quản lý khách hàng, báo giá, hợp đồng, hóa đơn, thu chi, công nợ, chứng từ và lịch nghĩa vụ pháp lý trên một nền tảng thống nhất. Trợ lý AI hỗ trợ đọc và trích xuất thông tin chứng từ, đề xuất phân loại chi phí, phát hiện hóa đơn có dấu hiệu trùng hoặc sai thông tin, tạo bản nháp và nhắc việc.

## 2. Bối cảnh giả định
Anh Minh là lập trình viên tự do, mới thành lập Công ty TNHH Một thành viên Minh Software. Anh ký hợp đồng với khách hàng doanh nghiệp, có một cộng tác viên và thường mất khoảng 3–4 ngày để chuẩn bị hợp đồng, hóa đơn và giấy tờ. Anh thuê dịch vụ kế toán nhưng vẫn phải tự gom chứng từ, theo dõi công nợ và thường quên hạn nộp.

## 3. Mục tiêu
- Tập trung thông tin quản trị doanh nghiệp vào một hệ thống.
- Giảm thời gian xử lý giấy tờ từ khoảng 3 ngày xuống dưới nửa ngày đối với quy trình thuộc phạm vi thử nghiệm.
- Hạn chế bỏ sót chứng từ, công nợ và thời hạn nghĩa vụ.
- Dùng AI để hỗ trợ công việc lặp lại nhưng vẫn có người dùng kiểm tra và phê duyệt.
- Có nhật ký để truy vết dữ liệu và hành động quan trọng.

## 4. Phạm vi chức năng cấp cao
1. Khách hàng, báo giá, hợp đồng.
2. Hóa đơn đầu ra, khoản phải thu và nhắc nợ.
3. Thu chi, sổ sách và đối chiếu sao kê ngân hàng.
4. Hộp thư chứng từ và xử lý hóa đơn đầu vào bằng AI.
5. Lịch nghĩa vụ pháp lý và nhắc hạn.
6. Trợ lý AI Agent tạo đề xuất, bản nháp và hỗ trợ tổng hợp.

## 5. Nguyên tắc quan trọng
- AI đưa ra kết quả đề xuất; người dùng có quyền kiểm tra, sửa, chấp nhận hoặc từ chối.
- Không tự gửi email, nộp tờ khai, thanh toán hoặc thực hiện hành động có hậu quả pháp lý/tài chính nếu chưa có xác nhận rõ ràng của người có quyền.
- Dữ liệu mẫu dùng cho phát triển và trình diễn; không đưa dữ liệu cá nhân hoặc bí mật thật lên repository công khai.
- Kết quả AI cần có nguồn dữ liệu, trạng thái xử lý và khả năng truy vết.

## 6. Thành viên và vai trò
- Thủy(BA / Full-stack Lead): Phân tích nghiệp vụ, SRS, điều phối và tích hợp.
- Quỳnh(Backend Business): Khách hàng, báo giá, hợp đồng, hóa đơn, công nợ phải thu. 
- Tiến(Backend Ledger): Thu chi, thanh toán, đối chiếu ngân hàng, sổ sách.
- Đạt(Frontend / Mobile): Giao diện web/di động và màn hình duyệt AI.
- Vy(AI Engineer): Đọc hóa đơn, trích xuất dữ liệu, phân loại chi phí, Agent.
- Trà(QA / DevOps / Security): Kiểm thử, môi trường, CI/CD, bảo mật và nhật ký.

## 7. Công nghệ dự kiến
Công nghệ trong README là đề xuất ban đầu, cần nhóm thống nhất trước khi chốt:
- Backend: ASP.NET Core hoặc NestJS hoặc Spring Boot.
- Database: PostgreSQL hoặc SQL Server.
- Frontend: React + TypeScript.
- AI Service: Python + FastAPI; OCR và mô hình/API AI phù hợp.
- DevOps: Docker, GitHub Actions.

## 8. Kết quả mong đợi
Một phiên bản demo có thể chạy được, thể hiện quy trình từ tiếp nhận chứng từ, AI trích xuất và cảnh báo, người dùng duyệt, lưu dữ liệu, cập nhật thông tin tài chính và tạo đề xuất nhắc việc. Kết quả phải có kiểm thử và tài liệu hướng dẫn.
