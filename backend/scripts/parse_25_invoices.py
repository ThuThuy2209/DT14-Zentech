# -*- coding: utf-8 -*-
import os
import json
import re

raw_text = """
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000001   | Ngày lập: 01/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Thương mại Hoàng Gia   |
| Mã số thuế người bán   | 9900000001   |
| Địa chỉ người bán   | 15 Nguyễn Trãi, P. Bến Thành, TP.HCM   |
| Điện thoại người bán   | 028 3500 0001 (giả lập)   |
| Email người bán   | muahang01@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000001 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế website doanh nghiệp   | Gói   | 1   | 8.000.000   | 8.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 8.000.000 VNĐ   |
| Thuế GTGT (10%)   | 800.000 VNĐ   |
| Tổng thanh toán   | 8.800.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000002   | Ngày lập: 02/11/2026   |
| NGƯỜI BÁN   | Công ty CP Công nghệ Đại Việt   |
| Mã số thuế người bán   | 9900000002   |
| Địa chỉ người bán   | 28 Điện Biên Phủ, P. Gia Định, TP.HCM   |
| Điện thoại người bán   | 028 3500 0002 (giả lập)   |
| Email người bán   | muahang02@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000002 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phát triển phần mềm quản lý   | Gói   | 1   | 15.000.000   | 15.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 15.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.500.000 VNĐ   |
| Tổng thanh toán   | 16.500.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000003   | Ngày lập: 02/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Nội thất Phương Nam   |
| Mã số thuế người bán   | 9900000003   |
| Địa chỉ người bán   | 45 Lê Văn Sỹ, P. Nhiêu Lộc, TP.HCM   |
| Điện thoại người bán   | 028 3500 0003 (giả lập)   |
| Email người bán   | muahang03@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000003 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế website bán hàng   | Gói   | 1   | 9.500.000   | 9.500.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 9.500.000 VNĐ   |
| Thuế GTGT (10%)   | 950.000 VNĐ   |
| Tổng thanh toán   | 10.450.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000004   | Ngày lập: 03/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Dịch vụ An Khang   |
| Mã số thuế người bán   | 9900000004   |
| Địa chỉ người bán   | 62 Cách Mạng Tháng 8, P. Xuân Hòa, TP.HCM   |
| Điện thoại người bán   | 028 3500 0004 (giả lập)   |
| Email người bán   | muahang04@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000004 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Bảo trì hệ thống phần mềm   | Tháng   | 3   | 2.000.000   | 6.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 6.000.000 VNĐ   |
| Thuế GTGT (10%)   | 600.000 VNĐ   |
| Tổng thanh toán   | 6.600.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000005   | Ngày lập: 03/11/2026   |
| NGƯỜI BÁN   | Công ty CP Đầu tư Thành Công   |
| Mã số thuế người bán   | 9900000005   |
| Địa chỉ người bán   | 80 Võ Thị Sáu, P. Xuân Hòa, TP.HCM   |
| Điện thoại người bán   | 028 3500 0005 (giả lập)   |
| Email người bán   | muahang05@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000005 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý nhân sự   | Gói   | 1   | 12.000.000   | 12.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 12.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.200.000 VNĐ   |
| Tổng thanh toán   | 13.200.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000006   | Ngày lập: 04/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Giáo dục Ánh Dương   |
| Mã số thuế người bán   | 9900000006   |
| Địa chỉ người bán   | 19 Nguyễn Văn Cừ, P. Chợ Quán, TP.HCM   |
| Điện thoại người bán   | 028 3500 0006 (giả lập)   |
| Email người bán   | muahang06@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000006 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế hệ thống học trực tuyến   | Gói   | 1   | 18.000.000   | 18.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 18.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.800.000 VNĐ   |
| Tổng thanh toán   | 19.800.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000007   | Ngày lập: 04/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Logistics Đông Nam   |
| Mã số thuế người bán   | 9900000007   |
| Địa chỉ người bán   | 120 Võ Văn Kiệt, P. Cầu Ông Lãnh, TP.HCM   |
| Điện thoại người bán   | 028 3500 0007 (giả lập)   |
| Email người bán   | muahang07@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000007 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý kho   | Gói   | 1   | 11.000.000   | 11.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 11.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.100.000 VNĐ   |
| Tổng thanh toán   | 12.100.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000008   | Ngày lập: 05/11/2026   |
| NGƯỜI BÁN   | Công ty CP Thương mại Hưng Phát   |
| Mã số thuế người bán   | 9900000008   |
| Địa chỉ người bán   | 32 Nguyễn Oanh, P. Gò Vấp, TP.HCM   |
| Điện thoại người bán   | 028 3500 0008 (giả lập)   |
| Email người bán   | muahang08@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000008 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Dịch vụ lưu trữ dữ liệu   | Tháng   | 6   | 1.000.000   | 6.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 6.000.000 VNĐ   |
| Thuế GTGT (10%)   | 600.000 VNĐ   |
| Tổng thanh toán   | 6.600.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000009   | Ngày lập: 05/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Xây dựng Minh Long   |
| Mã số thuế người bán   | 9900000009   |
| Địa chỉ người bán   | 55 Phan Văn Trị, P. Bình Thạnh, TP.HCM   |
| Điện thoại người bán   | 028 3500 0009 (giả lập)   |
| Email người bán   | muahang09@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000009 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý công trình   | Gói   | 1   | 14.000.000   | 14.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 14.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.400.000 VNĐ   |
| Tổng thanh toán   | 15.400.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000010   | Ngày lập: 06/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Truyền thông Sao Mai   |
| Mã số thuế người bán   | 9900000010   |
| Địa chỉ người bán   | 76 Hoàng Văn Thụ, P. Đức Nhuận, TP.HCM   |
| Điện thoại người bán   | 028 3500 0010 (giả lập)   |
| Email người bán   | muahang10@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000010 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế landing page   | Gói   | 1   | 5.000.000   | 5.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 5.000.000 VNĐ   |
| Thuế GTGT (10%)   | 500.000 VNĐ   |
| Tổng thanh toán   | 5.500.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000011   | Ngày lập: 06/11/2026   |
| NGƯỜI BÁN   | Công ty CP Thiết bị Việt Nhật   |
| Mã số thuế người bán   | 9900000011   |
| Địa chỉ người bán   | 91 Tô Hiến Thành, P. Diên Hồng, TP.HCM   |
| Điện thoại người bán   | 028 3500 0011 (giả lập)   |
| Email người bán   | muahang11@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000011 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Cài đặt hệ thống máy chủ   | Lần   | 1   | 4.500.000   | 4.500.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 4.500.000 VNĐ   |
| Thuế GTGT (10%)   | 450.000 VNĐ   |
| Tổng thanh toán   | 4.950.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000012   | Ngày lập: 07/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Thực phẩm Gia Hân   |
| Mã số thuế người bán   | 9900000012   |
| Địa chỉ người bán   | 14 Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, TP.HCM   |
| Điện thoại người bán   | 028 3500 0012 (giả lập)   |
| Email người bán   | muahang12@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000012 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý bán hàng   | Gói   | 1   | 10.000.000   | 10.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 10.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.000.000 VNĐ   |
| Tổng thanh toán   | 11.000.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000013   | Ngày lập: 07/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Dược phẩm Tâm An   |
| Mã số thuế người bán   | 9900000013   |
| Địa chỉ người bán   | 27 Lý Thường Kiệt, P. Diên Hồng, TP.HCM   |
| Điện thoại người bán   | 028 3500 0013 (giả lập)   |
| Email người bán   | muahang13@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000013 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế cơ sở dữ liệu   | Gói   | 1   | 7.000.000   | 7.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 7.000.000 VNĐ   |
| Thuế GTGT (10%)   | 700.000 VNĐ   |
| Tổng thanh toán   | 7.700.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000014   | Ngày lập: 08/11/2026   |
| NGƯỜI BÁN   | Công ty CP Du lịch Biển Xanh   |
| Mã số thuế người bán   | 9900000014   |
| Địa chỉ người bán   | 36 Nguyễn Thị Minh Khai, P. Sài Gòn, TP.HCM   |
| Điện thoại người bán   | 028 3500 0014 (giả lập)   |
| Email người bán   | muahang14@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000014 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Website đặt tour du lịch   | Gói   | 1   | 13.000.000   | 13.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 13.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.300.000 VNĐ   |
| Tổng thanh toán   | 14.300.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000015   | Ngày lập: 08/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Điện tử Hoàng Nam   |
| Mã số thuế người bán   | 9900000015   |
| Địa chỉ người bán   | 105 Cộng Hòa, P. Tân Bình, TP.HCM   |
| Điện thoại người bán   | 028 3500 0015 (giả lập)   |
| Email người bán   | muahang15@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000015 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý thiết bị   | Gói   | 1   | 9.000.000   | 9.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 9.000.000 VNĐ   |
| Thuế GTGT (10%)   | 900.000 VNĐ   |
| Tổng thanh toán   | 9.900.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000016   | Ngày lập: 09/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Thời trang Bella   |
| Mã số thuế người bán   | 9900000016   |
| Địa chỉ người bán   | 22 Nguyễn Huệ, P. Sài Gòn, TP.HCM   |
| Điện thoại người bán   | 028 3500 0016 (giả lập)   |
| Email người bán   | muahang16@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000016 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Website thương mại điện tử   | Gói   | 1   | 16.000.000   | 16.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 16.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.600.000 VNĐ   |
| Tổng thanh toán   | 17.600.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000017   | Ngày lập: 09/11/2026   |
| NGƯỜI BÁN   | Công ty CP Nông sản Việt   |
| Mã số thuế người bán   | 9900000017   |
| Địa chỉ người bán   | 18 Trường Chinh, P. Tân Sơn, TP.HCM   |
| Điện thoại người bán   | 028 3500 0017 (giả lập)   |
| Email người bán   | muahang17@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000017 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý đơn hàng   | Gói   | 1   | 8.500.000   | 8.500.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 8.500.000 VNĐ   |
| Thuế GTGT (10%)   | 850.000 VNĐ   |
| Tổng thanh toán   | 9.350.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000018   | Ngày lập: 10/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Cơ khí Tiến Đạt   |
| Mã số thuế người bán   | 9900000018   |
| Địa chỉ người bán   | 49 Lạc Long Quân, P. Tân Hòa, TP.HCM   |
| Điện thoại người bán   | 028 3500 0018 (giả lập)   |
| Email người bán   | muahang18@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000018 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý sản xuất   | Gói   | 1   | 11.500.000   | 11.500.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 11.500.000 VNĐ   |
| Thuế GTGT (10%)   | 1.150.000 VNĐ   |
| Tổng thanh toán   | 12.650.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000019   | Ngày lập: 10/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Dịch vụ Bảo Minh   |
| Mã số thuế người bán   | 9900000019   |
| Địa chỉ người bán   | 67 Phạm Văn Đồng, P. Hiệp Bình, TP.HCM   |
| Điện thoại người bán   | 028 3500 0019 (giả lập)   |
| Email người bán   | muahang19@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000019 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Dịch vụ bảo trì máy chủ   | Tháng   | 2   | 2.500.000   | 5.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 5.000.000 VNĐ   |
| Thuế GTGT (10%)   | 500.000 VNĐ   |
| Tổng thanh toán   | 5.500.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000020   | Ngày lập: 11/11/2026   |
| NGƯỜI BÁN   | Công ty CP Phát triển Hoàng Phúc   |
| Mã số thuế người bán   | 9900000020   |
| Địa chỉ người bán   | 88 Nguyễn Văn Linh, P. Tân Mỹ, TP.HCM   |
| Điện thoại người bán   | 028 3500 0020 (giả lập)   |
| Email người bán   | muahang20@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000020 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý khách hàng   | Gói   | 1   | 17.000.000   | 17.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 17.000.000 VNĐ   |
| Thuế GTGT (10%)   | 1.700.000 VNĐ   |
| Tổng thanh toán   | 18.700.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000021   | Ngày lập: 11/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Thương mại Kim Ngân   |
| Mã số thuế người bán   | 9900000021   |
| Địa chỉ người bán   | 31 Nguyễn Thị Thập, P. Tân Hưng, TP.HCM   |
| Điện thoại người bán   | 028 3500 0021 (giả lập)   |
| Email người bán   | muahang21@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000021 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế website giới thiệu   | Gói   | 1   | 6.000.000   | 6.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 6.000.000 VNĐ   |
| Thuế GTGT (10%)   | 600.000 VNĐ   |
| Tổng thanh toán   | 6.600.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000022   | Ngày lập: 12/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Giải pháp Số Việt   |
| Mã số thuế người bán   | 9900000022   |
| Địa chỉ người bán   | 73 Nguyễn Văn Trỗi, P. Phú Nhuận, TP.HCM   |
| Điện thoại người bán   | 028 3500 0022 (giả lập)   |
| Email người bán   | muahang22@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000022 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Tư vấn chuyển đổi số   | Gói   | 1   | 20.000.000   | 20.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 20.000.000 VNĐ   |
| Thuế GTGT (10%)   | 2.000.000 VNĐ   |
| Tổng thanh toán   | 22.000.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000023   | Ngày lập: 12/11/2026   |
| NGƯỜI BÁN   | Công ty CP Đầu tư Phú Thành   |
| Mã số thuế người bán   | 9900000023   |
| Địa chỉ người bán   | 16 Bạch Đằng, P. Gia Định, TP.HCM   |
| Điện thoại người bán   | 028 3500 0023 (giả lập)   |
| Email người bán   | muahang23@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000023 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phần mềm quản lý tài chính   | Gói   | 1   | 12.500.000   | 12.500.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 12.500.000 VNĐ   |
| Thuế GTGT (10%)   | 1.250.000 VNĐ   |
| Tổng thanh toán   | 13.750.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: Thông tin giả lập theo danh sách nguồn.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000024   | Ngày lập: 01/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Thương mại Hoàng Gia   |
| Mã số thuế người bán   | 9900000001   |
| Địa chỉ người bán   | 15 Nguyễn Trãi, P. Bến Thành, TP.HCM   |
| Điện thoại người bán   | 028 3500 0024 (giả lập)   |
| Email người bán   | muahang24@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000024 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Thiết kế website doanh nghiệp   | Gói   | 1   | 8.000.000   | 8.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 8.000.000 VNĐ   |
| Thuế GTGT (10%)   | 800.000 VNĐ   |
| Tổng thanh toán   | 8.800.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: MST người bán 9900000001 bị trùng với MST nhà cung cấp số 1.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
HÓA ĐƠN GIÁ TRỊ GIA TĂNG
(HÓA ĐƠN MUA VÀO – DỮ LIỆU MÔ PHỎNG)
| Mẫu số: 01GTKT   | Ký hiệu: 1C26TMS   |
| Số hóa đơn: 000025   | Ngày lập: 13/11/2026   |
| NGƯỜI BÁN   | Công ty TNHH Xuất nhập khẩu Thành Đạt   |
| Mã số thuế người bán   | 9999999999   |
| Địa chỉ người bán   | 39 Nguyễn Văn Quá, P. Đông Hưng Thuận, TP.HCM   |
| Điện thoại người bán   | 028 3500 0025 (giả lập)   |
| Email người bán   | muahang25@company.example (giả lập)   |
| Người đại diện   | Nguyễn Văn An (giả lập) – Giám đốc   |
| Tài khoản ngân hàng   | 190099000025 – BIDV (giả lập)   |
| NGƯỜI MUA   | Công ty TNHH Một thành viên Minh Software   |
| Mã số thuế người mua   | 0319002001   |
| Địa chỉ người mua   | Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM   |
| Điện thoại người mua   | 028 3512 2001 (giả lập)   |
| Email người mua   | ketoan@minhsoftware.example   |
| STT   | Tên hàng hóa, dịch vụ   | ĐVT   | SL   | Đơn giá   | Thành tiền   | Thuế suất   |
| 1   | Phát triển phần mềm quản lý kho   | Gói   | 1   | 9.000.000   | 9.000.000   | 10%   |
| Cộng tiền hàng (trước thuế)   | 9.000.000 VNĐ   |
| Thuế GTGT (10%)   | 900.000 VNĐ   |
| Tổng thanh toán   | 9.900.000 VNĐ   |
| Hạn thanh toán (quy ước)   | 30 ngày kể từ ngày lập hóa đơn   |
Ghi chú kiểm thử: MST người bán đang ghi 9999999999 (sai); MST theo danh mục là 9900000025.
| NGƯỜI MUA(Ký, ghi rõ họ tên)   | NGƯỜI BÁN(Ký, ghi rõ họ tên)   |
"""

def parse_invoices(text):
    blocks = text.split("HÓA ĐƠN GIÁ TRỊ GIA TĂNG")
    invoices = []
    
    for block in blocks:
        if "Số hóa đơn:" not in block:
            continue
        
        # Regex extraction
        inv_no_m = re.search(r"Số hóa đơn:\s*(\w+)", block)
        date_m = re.search(r"Ngày lập:\s*([\d/]+)", block)
        template_m = re.search(r"Mẫu số:\s*([\w]+)", block)
        symbol_m = re.search(r"Ký hiệu:\s*([\w]+)", block)
        seller_m = re.search(r"NGƯỜI BÁN\s*\|\s*([^|\n]+)", block)
        seller_tax_m = re.search(r"Mã số thuế người bán\s*\|\s*([^|\n]+)", block)
        seller_addr_m = re.search(r"Địa chỉ người bán\s*\|\s*([^|\n]+)", block)
        seller_phone_m = re.search(r"Điện thoại người bán\s*\|\s*([^|\n]+)", block)
        seller_email_m = re.search(r"Email người bán\s*\|\s*([^|\n]+)", block)
        buyer_m = re.search(r"NGƯỜI MUA\s*\|\s*([^|\n]+)", block)
        buyer_tax_m = re.search(r"Mã số thuế người mua\s*\|\s*([^|\n]+)", block)
        buyer_addr_m = re.search(r"Địa chỉ người mua\s*\|\s*([^|\n]+)", block)
        
        subtotal_m = re.search(r"Cộng tiền hàng \(trước thuế\)\s*\|\s*([\d.]+)", block)
        vat_m = re.search(r"Thuế GTGT \(\d+%\)\s*\|\s*([\d.]+)", block)
        total_m = re.search(r"Tổng thanh toán\s*\|\s*([\d.]+)", block)
        note_m = re.search(r"Ghi chú kiểm thử:\s*([^|\n]+)", block)
        
        # Item description
        item_m = re.search(r"\|\s*1\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*(\d+)\|\s*([\d.]+)\|\s*([\d.]+)\|\s*(\d+%)", block)

        inv_num = inv_no_m.group(1).strip() if inv_no_m else ""
        date_str = date_m.group(1).strip() if date_m else ""
        
        # Parse date to YYYY-MM-DD
        iso_date = ""
        if date_str:
            parts = date_str.split("/")
            if len(parts) == 3:
                iso_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
        
        subtotal_val = float(subtotal_m.group(1).replace(".", "")) if subtotal_m else 0
        vat_val = float(vat_m.group(1).replace(".", "")) if vat_m else 0
        total_val = float(total_m.group(1).replace(".", "")) if total_m else 0
        
        inv_data = {
            "invoiceNumber": inv_num,
            "templateCode": template_m.group(1).strip() if template_m else "01GTKT",
            "invoiceSeries": symbol_m.group(1).strip() if symbol_m else "1C26TMS",
            "invoiceDate": iso_date,
            "sellerName": seller_m.group(1).strip() if seller_m else "",
            "sellerTaxCode": seller_tax_m.group(1).strip() if seller_tax_m else "",
            "sellerAddress": seller_addr_m.group(1).strip() if seller_addr_m else "",
            "sellerPhone": seller_phone_m.group(1).strip() if seller_phone_m else "",
            "sellerEmail": seller_email_m.group(1).strip() if seller_email_m else "",
            "buyerName": buyer_m.group(1).strip() if buyer_m else "Công ty TNHH Một thành viên Minh Software",
            "buyerTaxCode": buyer_tax_m.group(1).strip() if buyer_tax_m else "0319002001",
            "buyerAddress": buyer_addr_m.group(1).strip() if buyer_addr_m else "",
            "itemName": item_m.group(1).strip() if item_m else "Dịch vụ phần mềm",
            "itemUnit": item_m.group(2).strip() if item_m else "Gói",
            "itemQuantity": int(item_m.group(3).strip()) if item_m else 1,
            "itemUnitPrice": float(item_m.group(4).replace(".", "")) if item_m else subtotal_val,
            "subtotal": subtotal_val,
            "taxAmount": vat_val,
            "totalAmount": total_val,
            "testNote": note_m.group(1).strip() if note_m else "",
            "duplicateStatus": "DUPLICATE" if inv_num == "000024" else "VALID",
            "buyerTaxStatus": "MATCHED", # Minh Software is buyer
            "sellerTaxStatus": "INVALID" if inv_num == "000025" else "VALID",
            "fileName": f"HD_{inv_num}.pdf"
        }
        invoices.append(inv_data)
        
    return invoices

invoices = parse_invoices(raw_text)
print("Parsed invoices count:", len(invoices))

# Create directory
out_dir = r"d:/DT_14/DT14-Zentech/backend/uploads/mock_invoices"
data_dir = r"d:/DT_14/DT14-Zentech/backend/src/modules/invoices/data"
os.makedirs(out_dir, exist_ok=True)
os.makedirs(data_dir, exist_ok=True)

# Save JSON data
json_path = os.path.join(data_dir, "mock-invoices-25.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(invoices, f, ensure_ascii=False, indent=2)
print("Saved JSON data to:", json_path)

# Helper to escape text for PDF literal strings (latin1 / ascii safe)
def to_pdf_ascii(text):
    # Vietnamese transliteration mapping for PDF Helvetica standard font
    trans_map = {
        'à':'a','á':'a','ả':'a','ã':'a','ạ':'a','ă':'a','ằ':'a','ắ':'a','ẳ':'a','ẵ':'a','ặ':'a','â':'a','ầ':'a','ấ':'a','ẩ':'a','ẫ':'a','ậ':'a',
        'đ':'d','è':'e','é':'e','ẻ':'e','ẽ':'e','ẹ':'e','ê':'e','ề':'e','ế':'e','ể':'e','ễ':'e','ệ':'e',
        'ì':'i','í':'i','ỉ':'i','ĩ':'i','ị':'i',
        'ò':'o','ó':'o','ỏ':'o','õ':'o','ọ':'o','ô':'o','ồ':'o','ố':'o','ổ':'o','ỗ':'o','ộ':'o','ơ':'o','ờ':'o','ớ':'o','ở':'o','ỡ':'o','ợ':'o',
        'ù':'u','ú':'u','ủ':'u','ũ':'u','ụ':'u','ư':'u','ừ':'u','ứ':'u','ử':'u','ữ':'u','ự':'u',
        'ỳ':'y','ý':'y','ỷ':'y','ỹ':'y','ỵ':'y',
        'À':'A','Á':'A','Ả':'A','Ã':'A','Ạ':'A','Ă':'A','Ằ':'A','Ắ':'A','Ẳ':'A','Ẵ':'A','Ặ':'A','Â':'A','Ầ':'A','Ấ':'A','Ẩ':'A','Ẫ':'A','Ậ':'A',
        'Đ':'D','È':'E','É':'E','Ẻ':'E','Ẽ':'E','Ẹ':'E','Ê':'E','Ề':'E','Ế':'E','Ể':'E','Ễ':'E','Ệ':'E',
        'Ì':'I','Í':'I','Ỉ':'I','Ĩ':'I','Ị':'I',
        'Ò':'O','Ó':'O','Ỏ':'O','Õ':'O','Ọ':'O','Ô':'O','Ồ':'O','Ố':'O','Ổ':'O','Ỗ':'O','Ộ':'O','Ơ':'O','Ờ':'O','Ớ':'O','Ở':'O','Ỡ':'O','Ợ':'O',
        'Ù':'U','Ú':'U','Ủ':'U','Ũ':'U','Ụ':'U','Ư':'U','Ừ':'U','Ứ':'U','Ử':'U','Ữ':'U','Ự':'U',
        'Ỳ':'Y','Ý':'Y','Ỷ':'Y','Ỹ':'Y','Ỵ':'Y'
    }
    res = []
    for c in text:
        if c in trans_map:
            res.append(trans_map[c])
        elif ord(c) < 128:
            res.append(c)
        else:
            res.append('?')
    out = ''.join(res)
    return out.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

# Generate 25 PDF files
for inv in invoices:
    num = inv['invoiceNumber']
    seller = to_pdf_ascii(inv['sellerName'])
    seller_tax = to_pdf_ascii(inv['sellerTaxCode'])
    seller_addr = to_pdf_ascii(inv['sellerAddress'])
    buyer = to_pdf_ascii(inv['buyerName'])
    buyer_tax = to_pdf_ascii(inv['buyerTaxCode'])
    date = to_pdf_ascii(inv['invoiceDate'])
    item = to_pdf_ascii(inv['itemName'])
    subtotal = f"{int(inv['subtotal']):,}".replace(",", ".")
    vat = f"{int(inv['taxAmount']):,}".replace(",", ".")
    total = f"{int(inv['totalAmount']):,}".replace(",", ".")
    note = to_pdf_ascii(inv['testNote'])
    
    stream_content = f"""BT
/F1 18 Tf
180 790 Td
(HOA DON GIA TRI GIA TANG) Tj
/F1 10 Tf
-40 -20 Td
((HOA DON MUA VAO - DU LIEU MO PHONG)) Tj
/F1 11 Tf
-90 -30 Td
(Mau so: 01GTKT       Ky hieu: 1C26TMS       So hoa don: {num}       Ngay: {date}) Tj
0 -25 Td
(--------------------------------------------------------------------------------------------------------------------) Tj
/F1 12 Tf
0 -20 Td
(DON VI BAN HANG (NGUOI BAN): {seller}) Tj
/F1 11 Tf
0 -18 Td
(Ma so thue ben ban: {seller_tax}) Tj
0 -18 Td
(Dia chi: {seller_addr}) Tj
0 -20 Td
(--------------------------------------------------------------------------------------------------------------------) Tj
/F1 12 Tf
0 -20 Td
(DON VI MUA HANG (NGUOI MUA): {buyer}) Tj
/F1 11 Tf
0 -18 Td
(Ma so thue ben mua: {buyer_tax}) Tj
0 -18 Td
(Dia chi: So 2 Vo Oanh, P. Thanh My Tay, TP.HCM) Tj
0 -20 Td
(--------------------------------------------------------------------------------------------------------------------) Tj
/F1 11 Tf
0 -25 Td
(STT | TEN HANG HOA, DICH VU              | DVT | SL | DON GIA       | THANH TIEN) Tj
0 -18 Td
( 1  | {item:<35} | Goi |  1 | {subtotal:>12} | {subtotal:>12} VND) Tj
0 -25 Td
(--------------------------------------------------------------------------------------------------------------------) Tj
0 -20 Td
(Cong tien hang (chua thue): {subtotal:>15} VND) Tj
0 -18 Td
(Tien thue GTGT (10%):       {vat:>15} VND) Tj
/F1 12 Tf
0 -22 Td
(TONG CONG TIEN THANH TOAN:  {total:>15} VND) Tj
/F1 10 Tf
0 -30 Td
(Han thanh toan: 30 ngay ke tu ngay lap hoa don) Tj
0 -18 Td
(Ghi chu kiem thu: {note}) Tj
0 -60 Td
(   NGUOI MUA HANG                              NGUOI BAN HANG) Tj
0 -15 Td
( (Ky, ghi ro ho ten)                         (Ky, ghi ro ho ten)) Tj
ET"""

    stream_bytes = stream_content.encode('latin1')
    stream_len = len(stream_bytes)
    
    pdf_text = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length {stream_len} >>
stream
{stream_content}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
{305 + 80 + stream_len}
%%EOF"""

    pdf_file_path = os.path.join(out_dir, f"HD_{num}.pdf")
    with open(pdf_file_path, "wb") as f:
        f.write(pdf_text.encode('latin1'))

print("Generated 25 PDF files successfully in:", out_dir)
