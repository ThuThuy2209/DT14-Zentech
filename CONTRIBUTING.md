# DT14 – OPC SmartOffice

> **Quy chuẩn kỹ thuật, quy ước phát triển và tích hợp hệ thống dùng chung cho 6 thành viên.**

---

## 👥 1. BẢNG PHÂN CÔNG VAI TRÒ DỰ ÁN

| Mã       | Thành viên | Vai trò                    | Trách nhiệm chính trong hệ thống                                                |
| :------- | :--------- | :------------------------- | :------------------------------------------------------------------------------ |
| **SV01** | Thủy       | **BA / Full-stack Lead**   | Kiến trúc hệ thống, Auth/RBAC, tích hợp tổng thể, phê duyệt & nhật ký           |
| **SV02** | Quỳnh      | **Backend Business**       | Khách hàng, báo giá, hợp đồng, hóa đơn đầu ra, quản lý công nợ                  |
| **SV03** | Tiến       | **Backend Ledger**         | Quản lý thu chi, sổ quỹ/ngân hàng, đối chiếu sao kê, bản nháp tờ khai           |
| **SV04** | Đạt        | **Frontend / Mobile**      | Giao diện Web/Responsive, dashboard tài chính, luồng duyệt & giao tiếp AI Agent |
| **SV05** | Vy         | **AI Engineer**            | OCR đọc hóa đơn, AI phân loại chi phí, phát hiện bất thường, AI Agent           |
| **SV06** | Trà        | **QA / DevOps / Security** | CI/CD, Docker Compose, bảo mật dữ liệu, kế hoạch kiểm thử & dữ liệu demo        |

---

## 🌐 2. QUY CHUẨN NGÔN NGỮ (LANGUAGE MATRIX)

> **Nguyên tắc cốt lõi:**
>
> - **Kỹ thuật (Code, DB, Git, API, Log):** 100% Tiếng Anh để chuẩn hóa và tránh lỗi encoding UTF-8.
> - **Người dùng (UI, AI Response, Thông báo lỗi):** 100% Tiếng Việt vì đối tượng là doanh nghiệp một người tại Việt Nam (Anh Minh).

| Thành phần                  | Ngôn ngữ quy định             | Ví dụ chuẩn                                          | Không được dùng               |
| :-------------------------- | :---------------------------- | :--------------------------------------------------- | :---------------------------- |
| **Tên biến, hàm, class**    | **Tiếng Anh**                 | `calculateDebt()`, `totalAmount`                     | `tinhCongNo()`, `soTien`      |
| **Tên bảng, tên cột DB**    | **Tiếng Anh**                 | `cash_transactions`, `is_reconciled`                 | `thu_chi`, `da_doi_chieu`     |
| **URL API Endpoint**        | **Tiếng Anh**                 | `/api/v1/ledger/transactions`                        | `/api/v1/thu-chi`             |
| **Git Commit & Branch**     | **Tiếng Anh**                 | `feat: add reconciliation service`                   | `code xong phan thu chi`      |
| **Comment giải thích code** | **Tiếng Anh hoặc Tiếng Việt** | Ngắn gọn, súc tích, giải thích logic khó             | Viết tắt, không dấu, cợt nhả  |
| **Nhãn giao diện (UI)**     | **Tiếng Việt**                | "Ghi nhận thanh toán", "Sổ quỹ tiền mặt"             | "Record payment", "Cash book" |
| **Thông báo lỗi cho User**  | **Tiếng Việt**                | "Số tiền thanh toán vượt quá số nợ còn lại!"         | "Amount exceeds debt limit"   |
| **Phản hồi của AI Chatbot** | **Tiếng Việt**                | "Dạ anh Minh, tháng này công ty chi 12.000.000 đ..." | Văn phong máy móc, tiếng Anh  |

---

## 🏷️ 3. QUY CHUẨN ĐẶT TÊN (NAMING CONVENTIONS)

### 3.1. Database (PostgreSQL)

- **Tên bảng:** `snake_case`, danh từ **số nhiều**.
  _Ví dụ:_ `payment_accounts`, `invoices`, `cash_transactions`, `bank_statements`
- **Tên cột:** `snake_case`.
  _Ví dụ:_ `account_number`, `current_balance`, `created_at`
- **Khóa chính (PK):** Luôn đặt tên là `id` (kiểu `UUID` hoặc `BIGINT`).
- **Khóa ngoại (FK):** `<tên_bảng_số_ít>_id`.
  _Ví dụ:_ `account_id`, `invoice_id`, `category_id`
- **Cột boolean:** Bắt đầu bằng `is_` hoặc `has_`.
  _Ví dụ:_ `is_reconciled`, `is_active`

### 3.2. Mã nguồn (Backend & Frontend)

- **Class / Interface / Type / Component:** `PascalCase`
- **Hàm & Biến trong TS/JS:** `camelCase`
- **Hàm & Biến trong Python (AI Service):** `snake_case`
- **Hằng số & Enum:** `UPPER_SNAKE_CASE`

### 3.3. RESTful API Endpoint

Chữ thường, `kebab-case`, danh từ số nhiều:

```
GET    /api/v1/ledger/payment-accounts
POST   /api/v1/ledger/cash-transactions
GET    /api/v1/business/invoices/:id
POST   /api/v1/ai/invoices/extract-ocr
```

### 3.4. Đặt tên File

- **Backend NestJS:** `kebab-case.role.ts` → `transaction.controller.ts`, `transaction.service.ts`
- **Frontend React:** `PascalCase.tsx` → `TransactionList.tsx`, `AccountSummaryCard.tsx`
- **Frontend Utils/Hooks:** `camelCase.ts` → `useTransaction.ts`, `formatCurrency.ts`
- **AI Service Python:** `snake_case.py` → `ocr_extractor.py`, `expense_classifier.py`
- **Database Migration:** tiền tố ngày → `20261106_01_create_payment_accounts.sql`

---

## 📦 4. CHUẨN HÓA API (API CONTRACT)

Tất cả API trả về **bọc trong cấu trúc JSON thống nhất**:

### 4.1. Phản hồi thành công (HTTP 200, 201)

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

### 4.2. Phản hồi lỗi (HTTP 400, 401, 403, 404, 500)

```json
{
  "success": false,
  "errorCode": "ERR_PAYMENT_EXCEEDS_DEBT",
  "message": "Số tiền thanh toán vượt quá số nợ còn lại của hóa đơn!",
  "data": null
}
```

### 4.3. Quy ước kiểu dữ liệu

- **Tiền tệ (VNĐ):** Lưu `DECIMAL(15,2)` hoặc `BIGINT`. Frontend tự format hiển thị `12.000.000 đ`.
- **Thời gian:** Chuẩn ISO-8601 `YYYY-MM-DDTHH:mm:ssZ`.

---

## 🔌 5. PHÂN BỔ CỔNG (PORT MAPPING)

| Module                    | Phụ trách        | Port     | URL Local               |
| :------------------------ | :--------------- | :------- | :---------------------- |
| **Frontend Web**          | SV04             | **3000** | `http://localhost:3000` |
| **Backend (NestJS)**      | SV01, SV02, SV03 | **8080** | `http://localhost:8080` |
| **AI Service (FastAPI)**  | SV05             | **5000** | `http://localhost:5000` |
| **Database (PostgreSQL)** | SV06             | **5432** | `localhost:5432`        |

> **Kiến trúc Backend:** SV02 và SV03 dùng chung 1 project NestJS (Monolith Modular), chia theo module:
>
> - `src/business/...` (SV02 – Quỳnh)
> - `src/ledger/...` (SV03 – Tiến)

---

## 🌿 6. QUY CHUẨN LÀM VIỆC VỚI GIT

### 6.1. Hiểu về 2 loại nhánh

Dự án chỉ có **2 loại nhánh**, đơn giản nhất có thể:

```
feat/biz-customer    ──PR──►  main
feat/ledger-cashbook ──PR──►  main
feat/ui-dashboard    ──PR──►  main
feat/ai-ocr          ──PR──►  main
```

| Nhánh      | Vai trò                                                                          |
| :--------- | :------------------------------------------------------------------------------- |
| `main`     | Nhánh chính, tổng hợp tất cả code của cả nhóm.                                   |
| `feat/...` | Nhánh tạm thời cho từng tính năng. Mỗi bạn tự tạo khi bắt đầu làm, xong thì xóa. |

---

### 6.2. Quy ước đặt tên nhánh

Mỗi nhánh = 1 tính năng. Ví dụ theo từng bạn:

| Thành viên   | Nhánh tính năng (ví dụ)                                                        |
| :----------- | :----------------------------------------------------------------------------- |
| SV01 – Thủy  | `feat/auth-login`, `feat/auth-rbac`                                            |
| SV02 – Quỳnh | `feat/biz-customer`, `feat/biz-quote`, `feat/biz-contract`, `feat/biz-invoice` |
| SV03 – Tiến  | `feat/ledger-cashbook`, `feat/ledger-bank-reconcile`, `feat/ledger-tax-draft`  |
| SV04 – Đạt   | `feat/ui-dashboard`, `feat/ui-invoice-approval`, `feat/ui-ledger`              |
| SV05 – Vy    | `feat/ai-ocr`, `feat/ai-classifier`, `feat/ai-agent`                           |
| SV06 – Trà   | `ci/docker-setup`, `test/backend-cases`                                        |

---

### 6.3. Quy trình làm việc (từng bước)

#### ① Bắt đầu làm 1 tính năng mới

```bash
# Lấy code mới nhất từ main về máy
git checkout main
git pull origin main

# Tạo nhánh mới cho tính năng
git checkout -b feat/biz-customer
```

#### ② Trong lúc code — commit thường xuyên

```bash
git add .
git commit -m "feat: add customer create api"
git commit -m "feat: add customer list with pagination"
git commit -m "fix: validate phone number format"
```

#### ③ Mỗi sáng — đồng bộ code mới từ main (tránh lệch code)

```bash
git checkout main
git pull origin main
git checkout feat/biz-customer   # quay lại nhánh đang làm
git merge main                   # hút code mới vào nhánh của mình
```

#### ④ Làm xong — push và tạo Pull Request

```bash
# Push nhánh lên GitHub
git push origin feat/biz-customer

# Vào GitHub → tạo Pull Request:
# feat/biz-customer  →  main
# Báo 1 bạn trong nhóm vào review và Approve
```

#### ⑤ Sau khi PR được merge — dọn dẹp và bắt đầu tính năng mới

```bash
git checkout main
git pull origin main             # lấy code vừa merge về
git branch -d feat/biz-customer  # xóa nhánh cũ ở local
# Bắt đầu lại từ bước ① với tính năng mới
```

---

### 6.4. Quy ước Commit (Conventional Commits)

Format: `<type>: <mô tả ngắn bằng tiếng Anh>`

| Type        | Ý nghĩa           | Ví dụ                                            |
| :---------- | :---------------- | :----------------------------------------------- |
| `feat:`     | Tính năng mới     | `feat: add cash transaction create api`          |
| `fix:`      | Sửa lỗi           | `fix: handle null invoice_id in ledger`          |
| `docs:`     | Tài liệu          | `docs: update contributing guide`                |
| `refactor:` | Tối ưu code       | `refactor: extract invoice validation logic`     |
| `test:`     | Thêm test         | `test: add unit test for reconciliation service` |
| `chore:`    | Cài đặt, cấu hình | `chore: add prisma and configure database`       |

---

### 6.5. Ai review Pull Request?

- Mỗi PR cần **ít nhất 1 bạn khác** vào xem và bấm **Approve** trên GitHub thì mới được merge.
- Không tự review code của chính mình.
- Thủy (Lead) là người review chính, các bạn cũng có thể review chéo cho nhau.
