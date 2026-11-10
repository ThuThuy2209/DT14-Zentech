# DT14 – OPC SmartOffice

> **Hướng dẫn làm việc chung của nhóm.**

---

## 1. QUY CHUẨN LÀM VIỆC VỚI GIT

### 1.1. Các loại nhánh

```
feat/ledger-cashbook      ──PR──►  develop  ──(sau buổi review tuần)──►  main
feat/biz-customer         ──PR──►  develop
fix/52-null-invoice-id    ──PR──►  develop
```

| Nhánh                 | Vai trò                                                                           |
| :-------------------- | :-------------------------------------------------------------------------------- |
| `main`                | Chỉ nhận merge từ `develop` sau mỗi buổi review tuần.                             |
| `develop`             | Nhánh tích hợp, mọi PR đều đi vào đây.                                            |
| `feat/...`, `fix/...` | Các nhánh phụ, mỗi nhánh làm 1 việc: tạo từ `develop`, xong thì PR vào `develop`. |

### 1.2. Quy ước Commit

Đặt đúng cú pháp, khi approve pr tự close: `<type>(<module>): <mô tả ngắn bằng tiếng Anh | tiếng việt> (#<issue>)`

- phần type, module ghi cho tường minh là được bắt buộc tiếng anh

- Ví dụ: refactor(auth): xử lí đăng nhập (#13).

#### Tham khảo Type

| Type        | Ý nghĩa           | Ví dụ                                                       |
| :---------- | :---------------- | :---------------------------------------------------------- |
| `feat:`     | Tính năng mới     | `feat(cashbook): add cash transaction create api (#12)`     |
| `fix:`      | Sửa lỗi           | `fix(reconcile): handle null invoice_id (#31)`              |
| `docs:`     | Tài liệu          | `docs(ba): update ledger erd (#8)`                          |
| `refactor:` | Tối ưu code       | `refactor(invoice): extract invoice validation logic (#27)` |
| `test:`     | Thêm test         | `test(reconcile): add unit test for matching service (#40)` |
| `chore:`    | Cài đặt, cấu hình | `chore(deps): add prisma and configure database`            |

#### Tham khảo Module

**Có thể ghi theo tính năng:**

- `auth`: đăng nhập, đăng xuất, phân quyền
- `customer`, `quote`, `contract`, `invoice`: khách hàng, báo giá, hợp đồng, hóa đơn
- `debt`: công nợ
- `cashbook`: thu chi, sổ quỹ
- `reconcile`: đối chiếu sao kê ngân hàng
- `tax-draft`: bản nháp tờ khai
- `ocr`, `classifier`, `agent`: OCR, phân loại chi phí, AI Agent
- `approval`, `audit-log`: phê duyệt, nhật ký hoạt động
- `dashboard`: tổng quan tài chính

**Có thể ghi theo tầng / công nghệ:**

- `fe`: chỉ sửa giao diện
- `be`: sửa code xử lý phía server
- `ai`: sửa AI service (Python)
- `db`: tác động vào cơ sở dữ liệu, migration

**Có thể ghi theo hệ thống chung:**

- `config`: sửa file cấu hình dự án
- `deps`: thêm hoặc cập nhật thư viện
- `ci`: CI/CD, Docker
- `ba`: tài liệu phân tích nghiệp vụ (BRD, SRS, ERD, Use Case)

### 1.3. Quy trình làm việc (từng bước)

#### ① Bắt đầu làm 1 tính năng mới

```bash
# Lấy code mới nhất từ develop về máy
git checkout develop
git pull origin develop

# Tạo nhánh mới cho tính năng
git checkout -b feat/ledger-cashbook
```

#### ② Trong lúc code, commit thường xuyên

```bash
git add .
git commit -m "feat(cashbook): add cash transaction create api (#12)"
git commit -m "feat(cashbook): add transaction list with pagination (#12)"
git commit -m "fix(cashbook): validate amount must be positive (#12)"
```

#### ③ Mỗi sáng, đồng bộ code mới từ develop (tránh lệch code)

```bash
git checkout develop
git pull origin develop
git checkout feat/ledger-cashbook   # quay lại nhánh đang làm
git merge develop                   # hút code mới vào nhánh của mình
```

#### ④ Làm xong, push lên nhánh phụ và tạo Pull Request: nhánh phụ --> nhánh develop

```bash
# push commit lên nhánh phụ
git push origin feat/ledger-cashbook

# Vào GitHub, tạo Pull Request:
# feat/ledger-cashbook  →  develop
# Mô tả ghi "Closes #<số issue>" để issue tự đóng khi merge
# Báo 1 bạn trong nhóm vào review và Approve
```

#### ⑤ Sau khi PR được merge

```bash
git checkout develop
git pull origin develop              # lấy code vừa merge về
git branch -d feat/ledger-cashbook   # xóa nhánh cũ ở local hoặc để đó
# Bắt đầu lại từ bước ① với tính năng mới
```

### 1.4. Pull Request

- Thủy (Lead) là người review chính, các bạn cũng review chéo cho nhau.
- Thủy là người merge `develop` vào `main` sau buổi review tuần.
- Tạo PR vào `develop`. Cần thêm 2 chỗ: 1/ `Add a title` cuối phần tiêu đề gõ (#số) vd: (#3) 2/`Add a description` cuối phần nội dung gõ Closes #số vd: Closes #3
- Cần **ít nhất 1 bạn khác** review và Approve, và **CI xanh** mới được merge.

### 1.5. Definition of Done

Một việc được coi là xong khi đủ các điều sau:

- Đã merge vào `develop` và CI xanh.
- Có unit test cho logic nghiệp vụ (backend), hoặc chạy được với API thật (frontend).
- Khớp đặc tả trong tài liệu phân tích nghiệp vụ (BRD/SRS). Nếu khác đặc tả thì phải báo Lead (Thủy) trước khi merge.
- Đóng issue kèm ảnh chụp hoặc lệnh kiểm tra.

## 2. CÁCH LÀM VIỆC CHUNG

- Mỗi việc tạo 1 issue trên GitHub, làm trên 1 nhánh riêng rồi mở PR vào `develop` (chi tiết ở mục 1).
- Code theo quy chuẩn ngôn ngữ, đặt tên và API ở mục 3, 4, 5 để các module ghép được với nhau.
- Backend của SV02 và SV03 dùng chung 1 project NestJS, mỗi người làm trong module của mình (xem mục 6).
- Mỗi sáng đồng bộ code mới từ `develop` về nhánh đang làm.
- Việc nào khác đặc tả trong BRD/SRS thì báo Thủy trước khi merge.

## 3. QUY CHUẨN NGÔN NGỮ

- **Kỹ thuật (tên biến/hàm/class, tên bảng/cột DB, URL API, Git commit & branch, log):** tiếng Anh, để tránh lỗi encoding.
- **Giao diện, thông báo lỗi, AI trả lời:** tiếng Việt.
- **Comment trong code:** tiếng Việt.

## 4. QUY CHUẨN ĐẶT TÊN (NAMING CONVENTIONS)

### 4.1. Database (Tham khảo)

- **Tên bảng:** `snake_case`, danh từ **số nhiều**.
  _Ví dụ:_ `payment_accounts`, `invoices`, `cash_transactions`, `bank_statements`
- **Tên cột:** `snake_case`.
  _Ví dụ:_ `account_number`, `current_balance`, `created_at`, `name`, `age`.
- **Khóa chính (PK):** Luôn đặt tên là `id` .
- **Khóa ngoại (FK):** `<tên_bảng_số_ít>_id`.
  _Ví dụ:_ `account_id`, `invoice_id`, `user_id`
- **Cột boolean:** Bắt đầu bằng `is_` hoặc `has_`.
  _Ví dụ:_ `is_reconciled`, `is_active`

### 4.2. Mã nguồn (Tham khảo)

- **Class / Interface / Type / Component:** `PascalCase` _Ví dụ:_ `UserService, IUser`
- **Hàm & Biến trong TS/JS:** `camelCase` _Ví dụ:_ `userName`
- **Hàm & Biến trong Python (AI Service):** `snake_case`
- **Hằng số & Enum:** `UPPER_SNAKE_CASE`

## 5. API Phản hồi

### 5.1. Phản hồi thành công (HTTP 200, 201)

```json
{
  "success": true,
  "message": "Ghi nhận giao dịch thành công",
  "data": {
    "transactionId": "tx-12345",
    "amount": 12000000,
    "transactionDate": "2026-11-06"
  }
}
```

### 5.2. Phản hồi lỗi (HTTP 400, 401, 403, 404, 500)

```json
{
  "success": false,
  "errorCode": "ERR_PAYMENT_EXCEEDS_DEBT",
  "message": "Số tiền thanh toán vượt quá số nợ còn lại của hóa đơn!",
  "data": null
}
```

## 6. PHÂN BỔ CỔNG (PORT MAPPING)

| Module                    | Phụ trách        | Port     | URL Local               |
| :------------------------ | :--------------- | :------- | :---------------------- |
| **Frontend Web**          | SV04             | **3000** | `http://localhost:3000` |
| **Backend (NestJS)**      | SV01, SV02, SV03 | **8080** | `http://localhost:8080` |
| **AI Service (FastAPI)**  | SV05             | **5000** | `http://localhost:5000` |
| **Database (PostgreSQL)** | SV06             | **5432** | `localhost:5432`        |
