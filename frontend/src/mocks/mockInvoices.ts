// src/mocks/mockInvoices.ts
// Bộ dữ liệu chuẩn 25 hóa đơn kiểm thử cho Dự án DT14 - SoloTech (Minh Software)

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  templateCode: string; // Mẫu số: 01GTKT
  symbol: string;       // Ký hiệu: 1C26TMS
  issueDate: string;
  seller: {
    name: string;
    taxCode: string;
    address: string;
    phone: string;
    bankAccount: string;
    bankName: string;
    representative: string;
  };
  buyer: {
    name: string;
    taxCodeOnInvoice: string; // MST ghi trên hóa đơn
    taxCodeRegistered: string; // MST đăng ký chuẩn trong CSDL
    address: string;
    phone: string;
    email: string;
  };
  serviceDescription: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;       // Tiền trước thuế
  taxRate: number;        // 10%
  taxAmount: number;      // Tiền thuế
  totalAmount: number;    // Tổng thanh toán
  // Trường AI phát hiện lỗi
  status: 'VALID' | 'DUPLICATE' | 'TAX_CODE_MISMATCH';
  warningMessage?: string;
  aiConfidence: number;
}

export const SELLER_INFO = {
  name: "Công ty TNHH Một thành viên Minh Software",
  taxCode: "0319002001",
  address: "Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM",
  phone: "028 3512 2001",
  email: "ketoan@minhsoftware.example",
  bankAccount: "102099000001",
  bankName: "Vietcombank",
  representative: "Nguyễn Minh Tuấn",
  position: "Giám đốc"
};

export const MOCK_INVOICES: InvoiceItem[] = [
  {
    id: "INV-01",
    invoiceNumber: "000001",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "01/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Thương mại Hoàng Gia",
      taxCodeOnInvoice: "9900000001",
      taxCodeRegistered: "9900000001",
      address: "15 Nguyễn Trãi, P. Bến Thành, TP.HCM",
      phone: "028 3500 0001",
      email: "muahang01@company.example"
    },
    serviceDescription: "Thiết kế website doanh nghiệp",
    unit: "Gói",
    quantity: 1,
    unitPrice: 8000000,
    subtotal: 8000000,
    taxRate: 10,
    taxAmount: 800000,
    totalAmount: 8800000,
    status: "VALID",
    aiConfidence: 0.98
  },
  {
    id: "INV-02",
    invoiceNumber: "000002",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "02/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Công nghệ Đại Việt",
      taxCodeOnInvoice: "9900000002",
      taxCodeRegistered: "9900000002",
      address: "28 Điện Biên Phủ, P. Gia Định, TP.HCM",
      phone: "028 3500 0002",
      email: "muahang02@company.example"
    },
    serviceDescription: "Phát triển phần mềm quản lý",
    unit: "Gói",
    quantity: 1,
    unitPrice: 15000000,
    subtotal: 15000000,
    taxRate: 10,
    taxAmount: 1500000,
    totalAmount: 16500000,
    status: "VALID",
    aiConfidence: 0.97
  },
  {
    id: "INV-03",
    invoiceNumber: "000003",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "02/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Nội thất Phương Nam",
      taxCodeOnInvoice: "9900000003",
      taxCodeRegistered: "9900000003",
      address: "45 Lê Văn Sỹ, P. Nhiêu Lộc, TP.HCM",
      phone: "028 3500 0003",
      email: "muahang03@company.example"
    },
    serviceDescription: "Thiết kế website bán hàng",
    unit: "Gói",
    quantity: 1,
    unitPrice: 9500000,
    subtotal: 9500000,
    taxRate: 10,
    taxAmount: 950000,
    totalAmount: 10450000,
    status: "VALID",
    aiConfidence: 0.95
  },
  {
    id: "INV-04",
    invoiceNumber: "000004",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "03/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Dịch vụ An Khang",
      taxCodeOnInvoice: "9900000004",
      taxCodeRegistered: "9900000004",
      address: "62 Cách Mạng Tháng 8, P. Xuân Hòa, TP.HCM",
      phone: "028 3500 0004",
      email: "muahang04@company.example"
    },
    serviceDescription: "Bảo trì hệ thống phần mềm",
    unit: "Tháng",
    quantity: 3,
    unitPrice: 2000000,
    subtotal: 6000000,
    taxRate: 10,
    taxAmount: 600000,
    totalAmount: 6600000,
    status: "VALID",
    aiConfidence: 0.96
  },
  {
    id: "INV-05",
    invoiceNumber: "000005",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "03/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Đầu tư Thành Công",
      taxCodeOnInvoice: "9900000005",
      taxCodeRegistered: "9900000005",
      address: "80 Võ Thị Sáu, P. Xuân Hòa, TP.HCM",
      phone: "028 3500 0005",
      email: "muahang05@company.example"
    },
    serviceDescription: "Phần mềm quản lý nhân sự",
    unit: "Gói",
    quantity: 1,
    unitPrice: 12000000,
    subtotal: 12000000,
    taxRate: 10,
    taxAmount: 1200000,
    totalAmount: 13200000,
    status: "VALID",
    aiConfidence: 0.94
  },
  {
    id: "INV-06",
    invoiceNumber: "000006",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "04/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Giáo dục Ánh Dương",
      taxCodeOnInvoice: "9900000006",
      taxCodeRegistered: "9900000006",
      address: "19 Nguyễn Văn Cừ, P. Chợ Quán, TP.HCM",
      phone: "028 3500 0006",
      email: "muahang06@company.example"
    },
    serviceDescription: "Thiết kế hệ thống học trực tuyến",
    unit: "Gói",
    quantity: 1,
    unitPrice: 18000000,
    subtotal: 18000000,
    taxRate: 10,
    taxAmount: 1800000,
    totalAmount: 19800000,
    status: "VALID",
    aiConfidence: 0.99
  },
  {
    id: "INV-07",
    invoiceNumber: "000007",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "04/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Logistics Đông Nam",
      taxCodeOnInvoice: "9900000007",
      taxCodeRegistered: "9900000007",
      address: "120 Võ Văn Kiệt, P. Cầu Ông Lãnh, TP.HCM",
      phone: "028 3500 0007",
      email: "muahang07@company.example"
    },
    serviceDescription: "Phần mềm quản lý kho",
    unit: "Gói",
    quantity: 1,
    unitPrice: 11000000,
    subtotal: 11000000,
    taxRate: 10,
    taxAmount: 1100000,
    totalAmount: 12100000,
    status: "VALID",
    aiConfidence: 0.93
  },
  {
    id: "INV-08",
    invoiceNumber: "000008",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "05/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Thương mại Hưng Phát",
      taxCodeOnInvoice: "9900000008",
      taxCodeRegistered: "9900000008",
      address: "32 Nguyễn Oanh, P. Gò Vấp, TP.HCM",
      phone: "028 3500 0008",
      email: "muahang08@company.example"
    },
    serviceDescription: "Dịch vụ lưu trữ dữ liệu",
    unit: "Tháng",
    quantity: 6,
    unitPrice: 1000000,
    subtotal: 6000000,
    taxRate: 10,
    taxAmount: 600000,
    totalAmount: 6600000,
    status: "VALID",
    aiConfidence: 0.95
  },
  {
    id: "INV-09",
    invoiceNumber: "000009",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "05/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Xây dựng Minh Long",
      taxCodeOnInvoice: "9900000009",
      taxCodeRegistered: "9900000009",
      address: "55 Phan Văn Trị, P. Bình Thạnh, TP.HCM",
      phone: "028 3500 0009",
      email: "muahang09@company.example"
    },
    serviceDescription: "Phần mềm quản lý công trình",
    unit: "Gói",
    quantity: 1,
    unitPrice: 14000000,
    subtotal: 14000000,
    taxRate: 10,
    taxAmount: 1400000,
    totalAmount: 15400000,
    status: "VALID",
    aiConfidence: 0.96
  },
  {
    id: "INV-10",
    invoiceNumber: "000010",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "06/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Truyền thông Sao Mai",
      taxCodeOnInvoice: "9900000010",
      taxCodeRegistered: "9900000010",
      address: "76 Hoàng Văn Thụ, P. Đức Nhuận, TP.HCM",
      phone: "028 3500 0010",
      email: "muahang10@company.example"
    },
    serviceDescription: "Thiết kế landing page",
    unit: "Gói",
    quantity: 1,
    unitPrice: 5000000,
    subtotal: 5000000,
    taxRate: 10,
    taxAmount: 500000,
    totalAmount: 5500000,
    status: "VALID",
    aiConfidence: 0.97
  },
  {
    id: "INV-11",
    invoiceNumber: "000011",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "06/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Thiết bị Việt Nhật",
      taxCodeOnInvoice: "9900000011",
      taxCodeRegistered: "9900000011",
      address: "91 Tô Hiến Thành, P. Diên Hồng, TP.HCM",
      phone: "028 3500 0011",
      email: "muahang11@company.example"
    },
    serviceDescription: "Cài đặt hệ thống máy chủ",
    unit: "Lần",
    quantity: 1,
    unitPrice: 4500000,
    subtotal: 4500000,
    taxRate: 10,
    taxAmount: 450000,
    totalAmount: 4950000,
    status: "VALID",
    aiConfidence: 0.92
  },
  {
    id: "INV-12",
    invoiceNumber: "000012",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "07/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Thực phẩm Gia Hân",
      taxCodeOnInvoice: "9900000012",
      taxCodeRegistered: "9900000012",
      address: "14 Nguyễn Ảnh Thủ, P. Trung Mỹ Tây, TP.HCM",
      phone: "028 3500 0012",
      email: "muahang12@company.example"
    },
    serviceDescription: "Phần mềm quản lý bán hàng",
    unit: "Gói",
    quantity: 1,
    unitPrice: 10000000,
    subtotal: 10000000,
    taxRate: 10,
    taxAmount: 1000000,
    totalAmount: 11000000,
    status: "VALID",
    aiConfidence: 0.98
  },
  {
    id: "INV-13",
    invoiceNumber: "000013",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "07/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Dược phẩm Tâm An",
      taxCodeOnInvoice: "9900000013",
      taxCodeRegistered: "9900000013",
      address: "27 Lý Thường Kiệt, P. Diên Hồng, TP.HCM",
      phone: "028 3500 0013",
      email: "muahang13@company.example"
    },
    serviceDescription: "Thiết kế cơ sở dữ liệu",
    unit: "Gói",
    quantity: 1,
    unitPrice: 7000000,
    subtotal: 7000000,
    taxRate: 10,
    taxAmount: 700000,
    totalAmount: 7700000,
    status: "VALID",
    aiConfidence: 0.94
  },
  {
    id: "INV-14",
    invoiceNumber: "000014",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "08/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Du lịch Biển Xanh",
      taxCodeOnInvoice: "9900000014",
      taxCodeRegistered: "9900000014",
      address: "36 Nguyễn Thị Minh Khai, P. Sài Gòn, TP.HCM",
      phone: "028 3500 0014",
      email: "muahang14@company.example"
    },
    serviceDescription: "Website đặt tour du lịch",
    unit: "Gói",
    quantity: 1,
    unitPrice: 13000000,
    subtotal: 13000000,
    taxRate: 10,
    taxAmount: 1300000,
    totalAmount: 14300000,
    status: "VALID",
    aiConfidence: 0.95
  },
  {
    id: "INV-15",
    invoiceNumber: "000015",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "08/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Điện tử Hoàng Nam",
      taxCodeOnInvoice: "9900000015",
      taxCodeRegistered: "9900000015",
      address: "105 Cộng Hòa, P. Tân Bình, TP.HCM",
      phone: "028 3500 0015",
      email: "muahang15@company.example"
    },
    serviceDescription: "Phần mềm quản lý thiết bị",
    unit: "Gói",
    quantity: 1,
    unitPrice: 9000000,
    subtotal: 9000000,
    taxRate: 10,
    taxAmount: 900000,
    totalAmount: 9900000,
    status: "VALID",
    aiConfidence: 0.93
  },
  {
    id: "INV-16",
    invoiceNumber: "000016",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "09/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Thời trang Bella",
      taxCodeOnInvoice: "9900000016",
      taxCodeRegistered: "9900000016",
      address: "22 Nguyễn Huệ, P. Sài Gòn, TP.HCM",
      phone: "028 3500 0016",
      email: "muahang16@company.example"
    },
    serviceDescription: "Website thương mại điện tử",
    unit: "Gói",
    quantity: 1,
    unitPrice: 16000000,
    subtotal: 16000000,
    taxRate: 10,
    taxAmount: 1600000,
    totalAmount: 17600000,
    status: "VALID",
    aiConfidence: 0.97
  },
  {
    id: "INV-17",
    invoiceNumber: "000017",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "09/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Nông sản Việt",
      taxCodeOnInvoice: "9900000017",
      taxCodeRegistered: "9900000017",
      address: "18 Trường Chinh, P. Tân Sơn, TP.HCM",
      phone: "028 3500 0017",
      email: "muahang17@company.example"
    },
    serviceDescription: "Phần mềm quản lý đơn hàng",
    unit: "Gói",
    quantity: 1,
    unitPrice: 8500000,
    subtotal: 8500000,
    taxRate: 10,
    taxAmount: 850000,
    totalAmount: 9350000,
    status: "VALID",
    aiConfidence: 0.95
  },
  {
    id: "INV-18",
    invoiceNumber: "000018",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "10/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Cơ khí Tiến Đạt",
      taxCodeOnInvoice: "9900000018",
      taxCodeRegistered: "9900000018",
      address: "49 Lạc Long Quân, P. Tân Hòa, TP.HCM",
      phone: "028 3500 0018",
      email: "muahang18@company.example"
    },
    serviceDescription: "Phần mềm quản lý sản xuất",
    unit: "Gói",
    quantity: 1,
    unitPrice: 11500000,
    subtotal: 11500000,
    taxRate: 10,
    taxAmount: 1150000,
    totalAmount: 12650000,
    status: "VALID",
    aiConfidence: 0.96
  },
  {
    id: "INV-19",
    invoiceNumber: "000019",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "10/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Dịch vụ Bảo Minh",
      taxCodeOnInvoice: "9900000019",
      taxCodeRegistered: "9900000019",
      address: "67 Phạm Văn Đồng, P. Hiệp Bình, TP.HCM",
      phone: "028 3500 0019",
      email: "muahang19@company.example"
    },
    serviceDescription: "Dịch vụ bảo trì máy chủ",
    unit: "Tháng",
    quantity: 2,
    unitPrice: 2500000,
    subtotal: 5000000,
    taxRate: 10,
    taxAmount: 500000,
    totalAmount: 5500000,
    status: "VALID",
    aiConfidence: 0.92
  },
  {
    id: "INV-20",
    invoiceNumber: "000020",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "11/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Phát triển Hoàng Phúc",
      taxCodeOnInvoice: "9900000020",
      taxCodeRegistered: "9900000020",
      address: "88 Nguyễn Văn Linh, P. Tân Mỹ, TP.HCM",
      phone: "028 3500 0020",
      email: "muahang20@company.example"
    },
    serviceDescription: "Phần mềm quản lý khách hàng",
    unit: "Gói",
    quantity: 1,
    unitPrice: 17000000,
    subtotal: 17000000,
    taxRate: 10,
    taxAmount: 1700000,
    totalAmount: 18700000,
    status: "VALID",
    aiConfidence: 0.97
  },
  {
    id: "INV-21",
    invoiceNumber: "000021",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "11/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Thương mại Kim Ngân",
      taxCodeOnInvoice: "9900000021",
      taxCodeRegistered: "9900000021",
      address: "31 Nguyễn Thị Thập, P. Tân Hưng, TP.HCM",
      phone: "028 3500 0021",
      email: "muahang21@company.example"
    },
    serviceDescription: "Thiết kế website giới thiệu",
    unit: "Gói",
    quantity: 1,
    unitPrice: 6000000,
    subtotal: 6000000,
    taxRate: 10,
    taxAmount: 600000,
    totalAmount: 6600000,
    status: "VALID",
    aiConfidence: 0.94
  },
  {
    id: "INV-22",
    invoiceNumber: "000022",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "12/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Giải pháp Số Việt",
      taxCodeOnInvoice: "9900000022",
      taxCodeRegistered: "9900000022",
      address: "73 Nguyễn Văn Trỗi, P. Phú Nhuận, TP.HCM",
      phone: "028 3500 0022",
      email: "muahang22@company.example"
    },
    serviceDescription: "Tư vấn chuyển đổi số",
    unit: "Gói",
    quantity: 1,
    unitPrice: 20000000,
    subtotal: 20000000,
    taxRate: 10,
    taxAmount: 2000000,
    totalAmount: 22000000,
    status: "VALID",
    aiConfidence: 0.98
  },
  {
    id: "INV-23",
    invoiceNumber: "000023",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "12/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty CP Đầu tư Phú Thành",
      taxCodeOnInvoice: "9900000023",
      taxCodeRegistered: "9900000023",
      address: "16 Bạch Đằng, P. Gia Định, TP.HCM",
      phone: "028 3500 0023",
      email: "muahang23@company.example"
    },
    serviceDescription: "Phần mềm quản lý tài chính",
    unit: "Gói",
    quantity: 1,
    unitPrice: 12500000,
    subtotal: 12500000,
    taxRate: 10,
    taxAmount: 1250000,
    totalAmount: 13750000,
    status: "VALID",
    aiConfidence: 0.96
  },
  // ==========================================
  // HÓA ĐƠN SỐ 24: LỖI TRÙNG HÓA ĐƠN (🔴 ĐỎ)
  // ==========================================
  {
    id: "INV-24",
    invoiceNumber: "000001", // TRÙNG SỐ HÓA ĐƠN SỐ 1
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "01/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Thương mại Hoàng Gia",
      taxCodeOnInvoice: "9900000001",
      taxCodeRegistered: "9900000001",
      address: "15 Nguyễn Trãi, P. Bến Thành, TP.HCM",
      phone: "028 3500 0001",
      email: "muahang01@company.example"
    },
    serviceDescription: "Thiết kế website doanh nghiệp",
    unit: "Gói",
    quantity: 1,
    unitPrice: 8000000,
    subtotal: 8000000,
    taxRate: 10,
    taxAmount: 800000,
    totalAmount: 8800000,
    status: "DUPLICATE",
    warningMessage: "⚠️ CẢNH BÁO: Hóa đơn bị trùng số 000001 và trùng toàn bộ thông tin với HĐ số 1 ngày 01/11/2026!",
    aiConfidence: 0.99
  },
  // ==========================================
  // HÓA ĐƠN SỐ 25: LỖI SAI MÃ SỐ THUẾ (🟠 CAM)
  // ==========================================
  {
    id: "INV-25",
    invoiceNumber: "000025",
    templateCode: "01GTKT",
    symbol: "1C26TMS",
    issueDate: "13/11/2026",
    seller: SELLER_INFO,
    buyer: {
      name: "Công ty TNHH Xuất nhập khẩu Thành Đạt",
      taxCodeOnInvoice: "9999999999", // SAI MST TRÊN HÓA ĐƠN!
      taxCodeRegistered: "9900000025", // MST ĐÚNG TRONG CSDL
      address: "39 Nguyễn Văn Quá, P. Đông Hưng Thuận, TP.HCM",
      phone: "028 3500 0025",
      email: "muahang25@company.example"
    },
    serviceDescription: "Phát triển phần mềm quản lý kho",
    unit: "Gói",
    quantity: 1,
    unitPrice: 9000000,
    subtotal: 9000000,
    taxRate: 10,
    taxAmount: 900000,
    totalAmount: 9900000,
    status: "TAX_CODE_MISMATCH",
    warningMessage: "⚠️ CẢNH BÁO: Mã số thuế trên hóa đơn (9999999999) không khớp với MST trong hồ sơ khách hàng (9900000025)!",
    aiConfidence: 0.95
  }
];
