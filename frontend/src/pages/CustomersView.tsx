import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  FileSignature, 
  X,
  TrendingUp,
  Layers,
  Edit,
  Building2,
  Phone,
  Mail,
  MapPin,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type CustomerItem,
  type CreateCustomerPayload,
} from '../services/customerService';

interface Contract {
  id: string;
  code: string;
  customerName: string;
  taxId: string;
  representative: string;
  phone: string;
  email: string;
  service: string;
  value: number;
  paid: number;
  debt: number;
  status: 'cho_duyet' | 'dang_thuc_hien' | 'hoan_tat' | 'cho_nghiem_thu';
  statusText: string;
  createdAt: string;
  milestone: {
    name: string;
    percent: number;
    subtext: string;
  };
  aiInsight?: string;
  attachment?: string;
}

export const CustomersView: React.FC = () => {
  // Chế độ xem: 'customers' (Quản lý khách hàng từ API) | 'contracts' (Hợp đồng & Ký số VNPT-CA)
  const [mainViewMode, setMainViewMode] = useState<'customers' | 'contracts'>('customers');

  // ================= Quản lý API Khách hàng =================
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(false);
  const [customerSearch, setCustomerSearch] = useState<string>('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [customerPage, setCustomerPage] = useState<number>(1);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [apiNotice, setApiNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal Thêm khách hàng mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateCustomerPayload>({
    customerName: '',
    taxCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    status: 'ACTIVE',
  });
  const [isSubmittingCreate, setIsSubmittingCreate] = useState<boolean>(false);

  // Modal Sửa khách hàng (API)
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [editCustomerForm, setEditCustomerForm] = useState<CreateCustomerPayload>({
    customerName: '',
    taxCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    status: 'ACTIVE',
  });
  const [isSubmittingEdit, setIsSubmittingEdit] = useState<boolean>(false);

  // Modal Xác nhận xóa khách hàng
  const [deletingCustomer, setDeletingCustomer] = useState<CustomerItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // ================= Hàm gọi API Khách hàng =================
  const fetchCustomerList = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await getCustomers({
        search: customerSearch.trim() || undefined,
        status: customerStatusFilter === 'ALL' ? undefined : customerStatusFilter,
        page: customerPage,
        limit: 10,
      });

      if (res.success && res.data) {
        setCustomers(res.data.items || []);
        setTotalCustomers(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setApiNotice({
          type: 'error',
          message: res.message || 'Không thể tải danh sách khách hàng từ máy chủ',
        });
      }
    } catch {
      setApiNotice({
        type: 'error',
        message: 'Lỗi kết nối Backend. Hãy chắc chắn Backend đang chạy tại http://localhost:8080',
      });
    } finally {
      setIsLoadingCustomers(false);
    }
  }, [customerSearch, customerStatusFilter, customerPage]);

  useEffect(() => {
    fetchCustomerList();
  }, [fetchCustomerList]);

  // Xử lý tạo mới khách hàng qua API
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.customerName.trim()) {
      alert('Vui lòng nhập tên khách hàng');
      return;
    }

    setIsSubmittingCreate(true);
    try {
      const res = await createCustomer({
        customerName: createForm.customerName.trim(),
        taxCode: createForm.taxCode?.trim() || undefined,
        contactPerson: createForm.contactPerson?.trim() || undefined,
        phone: createForm.phone?.trim() || undefined,
        email: createForm.email?.trim() || undefined,
        address: createForm.address?.trim() || undefined,
        status: createForm.status || 'ACTIVE',
      });

      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Thêm mới khách hàng "${createForm.customerName}" thành công!`,
        });
        setIsCreateModalOpen(false);
        setCreateForm({
          customerName: '',
          taxCode: '',
          contactPerson: '',
          phone: '',
          email: '',
          address: '',
          status: 'ACTIVE',
        });
        fetchCustomerList();
      } else {
        alert(res.message || 'Thêm khách hàng thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi thêm khách hàng!');
    } finally {
      setIsSubmittingCreate(false);
    }
  };

  // Mở modal sửa khách hàng
  const handleOpenEditCustomer = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setEditCustomerForm({
      customerName: customer.customerName,
      taxCode: customer.taxCode || '',
      contactPerson: customer.contactPerson || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
      status: customer.status,
    });
  };

  // Xử lý lưu sửa đổi khách hàng qua API
  const handleUpdateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    setIsSubmittingEdit(true);
    try {
      const res = await updateCustomer(editingCustomer.id, {
        customerName: editCustomerForm.customerName.trim(),
        taxCode: editCustomerForm.taxCode?.trim() || undefined,
        contactPerson: editCustomerForm.contactPerson?.trim() || undefined,
        phone: editCustomerForm.phone?.trim() || undefined,
        email: editCustomerForm.email?.trim() || undefined,
        address: editCustomerForm.address?.trim() || undefined,
        status: editCustomerForm.status,
      });

      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Cập nhật khách hàng #${editingCustomer.id} thành công!`,
        });
        setEditingCustomer(null);
        fetchCustomerList();
      } else {
        alert(res.message || 'Cập nhật thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi cập nhật khách hàng!');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Xử lý xóa hoặc ngừng hoạt động khách hàng
  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    setIsDeleting(true);
    try {
      const res = await deleteCustomer(deletingCustomer.id);
      if (res.success) {
        setApiNotice({
          type: 'success',
          message: `Đã cập nhật trạng thái/ngừng hoạt động khách hàng #${deletingCustomer.id}`,
        });
        setDeletingCustomer(null);
        fetchCustomerList();
      } else {
        alert(res.message || 'Xóa thất bại');
      }
    } catch {
      alert('Lỗi kết nối khi xóa khách hàng!');
    } finally {
      setIsDeleting(false);
    }
  };

  // ================= State Quản lý Hợp đồng & Ký số VNPT-CA =================
  const [activeTab, setActiveTab] = useState<string>('tat_ca');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedContractForSign, setSelectedContractForSign] = useState<Contract | null>(null);
  const [selectedContractForEdit, setSelectedContractForEdit] = useState<Contract | null>(null);

  // Form dữ liệu chỉnh sửa hợp đồng
  const [editForm, setEditForm] = useState({
    customerName: '',
    taxId: '',
    representative: '',
    phone: '',
    email: '',
    service: ''
  });

  // Dữ liệu hợp đồng kinh tế
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      code: 'HĐ-04/2026/MS-VNPT',
      customerName: 'Công ty TNHH Dịch vụ An Khang',
      taxId: '9900000004',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0004',
      email: 'muahang04@company.example',
      service: 'Bảo trì hệ thống phần mềm 3 tháng',
      value: 6600000,
      paid: 4000000,
      debt: 2600000,
      status: 'cho_duyet',
      statusText: 'Chờ duyệt điều khoản & Ký số',
      createdAt: '03/11/2026',
      milestone: {
        name: 'Giai đoạn 1: Thiết lập hạ tầng',
        percent: 50,
        subtext: 'Chờ ký số để kích hoạt'
      },
      aiInsight: '✓ Điều khoản phạt hợp đồng phù hợp, cam kết SLA 99.9% hợp chuẩn, chưa phát hiện rủi ro pháp lý.'
    },
    {
      id: '2',
      code: 'HĐ-22/2026/MS-FPT',
      customerName: 'Công ty TNHH Giải pháp Số Việt',
      taxId: '9900000022',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0022',
      email: 'muahang22@company.example',
      service: 'Tư vấn chuyển đổi số',
      value: 22000000,
      paid: 0,
      debt: 22000000,
      status: 'cho_duyet',
      statusText: 'Chờ duyệt nghiệm thu Giai đoạn 1',
      createdAt: '12/11/2026',
      milestone: {
        name: 'Nghiệm thu phần mềm kho',
        percent: 60,
        subtext: 'Đã có biên bản bàn giao'
      },
      attachment: 'Biên bản bàn giao kỹ thuật đợt 1 đã có chữ ký số khách hàng, sẵn sàng ký đối soát.'
    },
    {
      id: '3',
      code: 'HĐ-02/2026/MS-ĐV',
      customerName: 'Công ty CP Công nghệ Đại Việt',
      taxId: '9900000002',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0004',
      email: 'muahang02@company.example',
      service: 'Phát triển phần mềm quản lý',
      value: 16500000,
      paid: 12000000,
      debt: 4500000,
      status: 'dang_thuc_hien',
      statusText: 'Đang triển khai - Quá hạn 30 ngày',
      createdAt: '02/11/2026',
      milestone: {
        name: 'Đợt 1: Nghiệm thu hoàn tất 100%',
        percent: 100,
        subtext: 'Giá trị đợt: 30.000.000 đ'
      }
    },
    {
      id: '4',
      code: 'HĐ-01/2026/MS-HG',
      customerName: 'Công ty TNHH Thương mại Hoàng Gia',
      taxId: '9900000001',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0001',
      email: 'muahang01@company.example',
      service: 'Thiết kế website doanh nghiệp',
      value: 8800000,
      paid: 8800000,
      debt: 0,
      status: 'hoan_tat',
      statusText: 'Đã quyết toán đủ 100%',
      createdAt: '01/11/2026',
      milestone: {
        name: 'Bàn giao & Nghiệm thu 100%',
        percent: 100,
        subtext: 'Biên bản số: BB-01/MS-HG'
      }
    },
    {
      id: '5',
      code: 'HĐ-05/2026/MS-TC',
      customerName: 'Công ty CP Đầu tư Thành Công',
      taxId: '9900000005',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0005',
      email: 'muahang05@company.example',
      service: 'Phần mềm quản lý nhân sự',
      value: 13200000,
      paid: 8200000,
      debt: 5000000,
      status: 'dang_thuc_hien',
      statusText: 'Đang chạy thử nghiệm',
      createdAt: '03/11/2026',
      milestone: {
        name: 'Giai đoạn 2: Đang chạy thử nghiệm 60%',
        percent: 60,
        subtext: 'Hạn chót: 03/12/2026'
      }
    },
    {
      id: '6',
      code: 'HĐ-04/2026/MS-PN',
      customerName: 'Công ty TNHH Nội thất Phương Nam',
      taxId: '9900000003',
      representative: 'Nguyễn Văn An',
      phone: '028 3500 0003',
      email: 'muahang03@company.example',
      service: 'Thiết kế website bán hàng',
      value: 10450000,
      paid: 0,
      debt: 10450000,
      status: 'cho_nghiem_thu',
      statusText: 'Đã duyệt wireframe',
      createdAt: '02/11/2026',
      milestone: {
        name: 'Giai đoạn 1: Đã duyệt wireframe 25%',
        percent: 25,
        subtext: 'Khởi tạo mốc đợt 1'
      }
    }
  ]);

  const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' đ';

  // Lọc danh sách hợp đồng
  const filteredContracts = contracts.filter(c => {
    const matchSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.taxId.includes(searchTerm);
    if (activeTab === 'tat_ca') return matchSearch;
    if (activeTab === 'cho_duyet') return matchSearch && c.status === 'cho_duyet';
    if (activeTab === 'dang_thuc_hien') return matchSearch && c.status === 'dang_thuc_hien';
    if (activeTab === 'hoan_tat') return matchSearch && c.status === 'hoan_tat';
    if (activeTab === 'cho_nghiem_thu') return matchSearch && c.status === 'cho_nghiem_thu';
    return matchSearch;
  });

  const handleOpenEditContract = (contract: Contract) => {
    setSelectedContractForEdit(contract);
    setEditForm({
      customerName: contract.customerName,
      taxId: contract.taxId,
      representative: contract.representative,
      phone: contract.phone,
      email: contract.email,
      service: contract.service
    });
  };

  const handleSaveContractEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContractForEdit) {
      setContracts(prev => prev.map(c => 
        c.id === selectedContractForEdit.id 
          ? { 
              ...c, 
              customerName: editForm.customerName,
              taxId: editForm.taxId,
              representative: editForm.representative,
              phone: editForm.phone,
              email: editForm.email,
              service: editForm.service
            }
          : c
      ));
      setSelectedContractForEdit(null);
    }
  };

  const handleSignConfirm = () => {
    if (selectedContractForSign) {
      setContracts(prev => prev.map(c => 
        c.id === selectedContractForSign.id 
          ? { ...c, status: 'dang_thuc_hien', statusText: 'Đã ký số VNPT-CA thành công' }
          : c
      ));
      setSelectedContractForSign(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Trang & Các nút thao tác */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Quản lý Khách hàng & Hợp đồng kinh tế
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kết nối API PostgreSQL NestJS • Theo dõi vòng đời khách hàng, hợp đồng và ký số VNPT-CA Sandbox
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMainViewMode(mainViewMode === 'customers' ? 'contracts' : 'customers')}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold shadow-sm transition-all ${
              mainViewMode === 'customers' 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>{mainViewMode === 'customers' ? 'Đang xem: DS Khách hàng' : 'Xem DS Khách hàng'}</span>
          </button>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Thêm khách hàng mới</span>
          </button>

          <button 
            onClick={() => setMainViewMode('contracts')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Hợp đồng & Ký số</span>
          </button>
        </div>
      </div>

      {/* Thông báo API Toast */}
      {apiNotice && (
        <div className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          apiNotice.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {apiNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span className="font-semibold">{apiNotice.message}</span>
          </div>
          <button 
            onClick={() => setApiNotice(null)} 
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Hàng 5 Thẻ chỉ số tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div 
          onClick={() => setMainViewMode('customers')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-300 transition-colors"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng khách hàng</p>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">API</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-extrabold text-slate-900">{totalCustomers || 24}</span>
              <span className="text-xs font-medium text-slate-500">Doanh nghiệp</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hợp đồng chờ duyệt</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-extrabold text-amber-600">3</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Cần xử lý</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đang thực hiện</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-extrabold text-slate-900">5</span>
              <span className="text-xs font-medium text-slate-500">Hợp đồng</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đã ký số Sandbox</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-2xl font-extrabold text-emerald-600">12</span>
              <span className="text-xs font-medium text-slate-500">Hợp đồng</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng giá trị HĐ</p>
            <div className="flex items-baseline gap-1 mt-1.5">
              <span className="text-xl font-extrabold text-blue-600">350.000.000</span>
              <span className="text-xs font-bold text-blue-600">đ</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Lũy kế 2026</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs chuyển đổi giữa "Danh sách Khách hàng (API)" và "Hợp đồng & Ký số VNPT-CA" */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setMainViewMode('customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainViewMode === 'customers'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Danh sách Khách hàng (API Backend)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
            mainViewMode === 'customers' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {totalCustomers}
          </span>
        </button>

        <button
          onClick={() => setMainViewMode('contracts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mainViewMode === 'contracts'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSignature className="w-4 h-4" />
          <span>Hợp đồng & Ký số VNPT SmartCA</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
            mainViewMode === 'contracts' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            3 chờ ký
          </span>
        </button>
      </div>

      {/* ================= PHẦN 1: MÀN HÌNH DANH SÁCH KHÁCH HÀNG (API) ================= */}
      {mainViewMode === 'customers' && (
        <div className="space-y-4">
          {/* Thanh công cụ tìm kiếm và lọc */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative w-80">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, MST, SĐT, Email..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setCustomerPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Lọc trạng thái */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setCustomerStatusFilter(st);
                      setCustomerPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      customerStatusFilter === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {st === 'ALL' && 'Tất cả'}
                    {st === 'ACTIVE' && 'Hoạt động'}
                    {st === 'INACTIVE' && 'Ngừng'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchCustomerList()}
                disabled={isLoadingCustomers}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingCustomers ? 'animate-spin' : ''}`} />
                <span>Làm mới</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm khách hàng</span>
              </button>
            </div>
          </div>

          {/* Bảng dữ liệu Khách hàng từ API */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">TÊN KHÁCH HÀNG & MST</th>
                    <th className="py-3 px-4">NGƯỜI LIÊN HỆ & SĐT</th>
                    <th className="py-3 px-4">ĐỊA CHỈ</th>
                    <th className="py-3 px-4 text-center">GIAO DỊCH</th>
                    <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                    <th className="py-3 px-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoadingCustomers ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                          <p className="text-xs font-medium">Đang tải dữ liệu khách hàng từ PostgreSQL...</p>
                        </div>
                      </td>
                    </tr>
                  ) : customers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-semibold text-slate-600">Chưa có khách hàng nào phù hợp</p>
                        <p className="text-xs text-slate-400 mt-1">Hãy bấm "Thêm khách hàng" hoặc kiểm tra bộ lọc tìm kiếm</p>
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center">
                          #{c.id}
                        </td>

                        {/* Tên khách hàng & MST */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{c.customerName}</p>
                              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                                MST: <span className="font-semibold text-slate-700">{c.taxCode || 'Chưa cập nhật'}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Người liên hệ & SĐT & Email */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-medium text-slate-900">{c.contactPerson || '—'}</p>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              {c.phone && (
                                <span className="flex items-center gap-1 font-mono">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {c.phone}
                                </span>
                              )}
                              {c.email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  {c.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Địa chỉ */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <p className="text-[11px] text-slate-600 line-clamp-2 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{c.address || 'Chưa có địa chỉ'}</span>
                          </p>
                        </td>

                        {/* Số lượng giao dịch (_count) */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                            <span title="Hợp đồng" className="font-semibold text-blue-600">
                              {c._count?.contracts ?? 0} HĐ
                            </span>
                            <span className="text-slate-300">•</span>
                            <span title="Hóa đơn" className="font-semibold text-emerald-600">
                              {c._count?.salesInvoices ?? 0} HĐơn
                            </span>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3.5 px-4 text-center">
                          {c.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                              Ngừng
                            </span>
                          )}
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditCustomer(c)}
                              className="p-1.5 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition-colors border border-slate-200"
                              title="Chỉnh sửa thông tin khách hàng"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingCustomer(c)}
                              className="p-1.5 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg transition-colors border border-slate-200"
                              title="Ngừng hoạt động / Xóa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Hiển thị {customers.length} trên tổng số <strong>{totalCustomers}</strong> khách hàng
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={customerPage <= 1}
                  onClick={() => setCustomerPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCustomerPage(pg)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      customerPage === pg
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  disabled={customerPage >= totalPages}
                  onClick={() => setCustomerPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= PHẦN 2: MÀN HÌNH HỢP ĐỒNG & KÝ SỐ VNPT-CA ================= */}
      {mainViewMode === 'contracts' && (
        <div className="space-y-6">
          {/* KHỐI CẢNH BÁO: Hợp đồng chờ Anh Minh phê duyệt & Ký số */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileSignature className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">Hợp đồng chờ Anh Minh phê duyệt & Ký số</h2>
                    <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold rounded-full">
                      3 cần xử lý
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tích hợp thẩm định điều khoản tự động bởi AI Copilot & Chứng thư số VNPT-CA Sandbox
                  </p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all self-start sm:self-auto">
                <span>⚡ Ký duyệt hàng loạt</span>
              </button>
            </div>

            <div className="space-y-3">
              {/* HĐ 1 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700">HĐ-04/2026/MS-VNPT</span>
                      <span className="text-xs font-bold text-slate-900">• Công ty TNHH Dịch vụ An Khang</span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-200">
                        Chờ duyệt điều khoản & Ký số
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Dịch vụ: Bảo trì hệ thống phần mềm • Giá trị: <span className="font-bold text-slate-900">6.600.000 đ</span> • Ngày tạo: 03/11/2026
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>AI Copilot soát xét: ✓ Điều khoản phạt hợp đồng phù hợp, cam kết SLA 99.9% hợp chuẩn, chưa phát hiện rủi ro pháp lý.</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button 
                    onClick={() => setSelectedContractForSign(contracts[0])}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <span>⚡ Duyệt & Ký số VNPT-CA</span>
                  </button>
                  <button 
                    onClick={() => handleOpenEditContract(contracts[0])}
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                    <span>Yêu cầu sửa đổi</span>
                  </button>
                </div>
              </div>

              {/* HĐ 2 */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700">HĐ-22/2026/MS-FPT</span>
                      <span className="text-xs font-bold text-slate-900">• Công ty TNHH Giải pháp Số Việt</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                        Chờ duyệt nghiệm thu Giai đoạn 1
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Dịch vụ: Tư vấn chuyển đổi số • Giá trị: <span className="font-bold text-slate-900">22.000.000 đ</span> • Ngày tạo: 12/11/2026
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Hồ sơ kèm theo: Biên bản bàn giao kỹ thuật đợt 1 đã có chữ ký số khách hàng, sẵn sàng ký đối soát.</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button 
                    onClick={() => setSelectedContractForSign(contracts[1])}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    <span>⚡ Duyệt & Ký số VNPT-CA</span>
                  </button>
                  <button 
                    onClick={() => handleOpenEditContract(contracts[1])}
                    className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                    <span>Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bộ lọc tìm kiếm & Tab phân loại Hợp đồng */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm overflow-x-auto">
              {[
                { key: 'tat_ca', label: 'Tất cả trạng thái', count: 18 },
                { key: 'cho_duyet', label: 'Chờ duyệt', count: 3, alert: true },
                { key: 'dang_thuc_hien', label: 'Đang thực hiện', count: 5 },
                { key: 'hoan_tat', label: 'Đã hoàn tất', count: 10 },
                { key: 'cho_nghiem_thu', label: 'Chờ nghiệm thu', count: 3 },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeTab === tab.key
                      ? 'bg-white/20 text-white'
                      : tab.alert
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên KH, mã HĐ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Thời gian</span>
              </button>
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ký số Sandbox
              </span>
            </div>
          </div>

          {/* Bảng danh sách Hợp đồng kinh tế */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">MÃ HĐ</th>
                    <th className="py-3 px-4">KHÁCH HÀNG & DỊCH VỤ</th>
                    <th className="py-3 px-4 text-right">GIÁ TRỊ (VNĐ)</th>
                    <th className="py-3 px-4">MỐC NGHIỆM THU</th>
                    <th className="py-3 px-4 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredContracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <span>{c.code}</span>
                            <p className="text-[10px] font-normal text-slate-400">Lập: {c.createdAt}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{c.customerName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500">MST: {c.taxId}</span>
                          <span className="text-[11px] text-slate-400">• {c.service}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 text-sm">{formatVND(c.value)}</span>
                        <div className="text-[11px] mt-0.5">
                          {c.debt > 0 ? (
                            <span className="text-rose-600 font-semibold">Còn nợ: {formatVND(c.debt)} ⚠</span>
                          ) : (
                            <span className="text-emerald-600 font-semibold">Đã thu: 100% ✓</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 min-w-[220px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-slate-800">{c.milestone.name}</span>
                          <span className="font-bold text-blue-600">{c.milestone.percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${c.milestone.percent === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${c.milestone.percent}%` }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{c.milestone.subtext}</p>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenEditContract(c)}
                            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3 text-slate-400" />
                            <span>Sửa</span>
                          </button>
                          {c.status === 'cho_duyet' ? (
                            <button
                              onClick={() => setSelectedContractForSign(c)}
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                            >
                              Ký số
                            </button>
                          ) : (
                            <button className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors">
                              Chi tiết
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phân trang hợp đồng */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hiển thị 1 - {filteredContracts.length} trên 24 hợp đồng kinh tế</span>
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Trước</button>
                <button className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold">1</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">2</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">3</button>
                <button className="px-2.5 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Tiếp</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL THÊM MỚI KHÁCH HÀNG (POST /api/v1/customers) ================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Thêm mới khách hàng doanh nghiệp</h3>
                  <p className="text-xs text-slate-400">Đồng bộ trực tiếp vào cơ sở dữ liệu PostgreSQL</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="pt-4 space-y-3.5">
              {/* Tên khách hàng */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên doanh nghiệp / Khách hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty TNHH Đầu tư & Phát triển ABC"
                  value={createForm.customerName}
                  onChange={(e) => setCreateForm({ ...createForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Hàng 2: Mã số thuế & Người liên hệ */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã số thuế (MST)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0319888999"
                    value={createForm.taxCode}
                    onChange={(e) => setCreateForm({ ...createForm, taxCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Người liên hệ / Đại diện
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Trần Văn Nam"
                    value={createForm.contactPerson}
                    onChange={(e) => setCreateForm({ ...createForm, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Hàng 3: Điện thoại & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0909123456"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    placeholder="contact@abc.vn"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Địa chỉ trụ sở */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123 Đường Điện Biên Phủ, P. 15, Q. Bình Thạnh, TP.HCM"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái hoạt động</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                  <option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option>
                </select>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCreate}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingCreate && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingCreate ? 'Đang lưu...' : 'Thêm khách hàng'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL SỬA KHÁCH HÀNG (PATCH /api/v1/customers/:id) ================= */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Chỉnh sửa khách hàng #{editingCustomer.id}</h3>
                  <p className="text-xs text-slate-400">Cập nhật qua API PATCH /api/v1/customers/{editingCustomer.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingCustomer(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomerSubmit} className="pt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên doanh nghiệp / Khách hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editCustomerForm.customerName}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã số thuế (MST)</label>
                  <input
                    type="text"
                    value={editCustomerForm.taxCode || ''}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, taxCode: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người liên hệ</label>
                  <input
                    type="text"
                    value={editCustomerForm.contactPerson || ''}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editCustomerForm.phone || ''}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editCustomerForm.email || ''}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  value={editCustomerForm.address || ''}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái</label>
                <select
                  value={editCustomerForm.status}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                  <option value="INACTIVE">Ngừng hoạt động (INACTIVE)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingEdit && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmittingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL XÁC NHẬN XÓA / NGỪNG HOẠT ĐỘNG (DELETE /api/v1/customers/:id) ================= */}
      {deletingCustomer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Xác nhận ngừng hoạt động</h3>
                <p className="text-xs text-slate-500">Khách hàng #{deletingCustomer.id}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Bạn có chắc chắn muốn xóa hoặc chuyển trạng thái khách hàng <strong>"{deletingCustomer.customerName}"</strong> sang <strong>Ngừng hoạt động (INACTIVE)</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Đang xử lý...' : 'Xác nhận xóa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KÝ SỐ VNPT-CA ================= */}
      {selectedContractForSign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Phê duyệt & Ký số Hợp đồng kinh tế</h3>
                  <p className="text-xs text-slate-400">Mã HĐ: {selectedContractForSign.code} • VNPT-CA Sandbox 2026</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedContractForSign(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Khách hàng / Đối tác</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedContractForSign.customerName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">MST: {selectedContractForSign.taxId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Tổng giá trị HĐ</p>
                  <p className="text-base font-extrabold text-blue-600 mt-0.5">{formatVND(selectedContractForSign.value)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Thanh toán theo đợt (50% - 50%)</p>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    AI Copilot - Kết quả thẩm định pháp lý hợp đồng
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                    An toàn 100%
                  </span>
                </div>
                <div className="text-xs text-emerald-900 space-y-1.5 pt-1">
                  <p className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span><strong>Điều khoản bảo mật (NDA):</strong> Đầy đủ quyền sở hữu trí tuệ thuộc về bên B (OPC).</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span><strong>Tiến độ thanh toán:</strong> Tạm ứng 50% ngay sau ký, quyết toán 50% sau nghiệm thu. Không có rủi ro dòng tiền.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-bold text-emerald-700">✓</span>
                    <span><strong>Điều khoản tranh chấp:</strong> Trọng tài thương mại TP.HCM, tuân thủ Luật Thương mại 2005.</span>
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileSignature className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Chứng thư số VNPT SmartCA (Sandbox Cá nhân/OPC)</p>
                    <p className="text-[11px] text-slate-500">Chủ thể: NGUYEN VAN MINH (Minh Software OPC) • Hạn dùng: 2028</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  ✓ Sẵn sàng ký
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button 
                onClick={() => {
                  const contractToEdit = selectedContractForSign;
                  setSelectedContractForSign(null);
                  handleOpenEditContract(contractToEdit);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Yêu cầu chỉnh sửa
              </button>
              <button 
                onClick={() => setSelectedContractForSign(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={handleSignConfirm}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Phê duyệt & Ký số ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SỬA HỢP ĐỒNG ================= */}
      {selectedContractForEdit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Chỉnh sửa thông tin hợp đồng & đối tác</h3>
              </div>
              <button 
                onClick={() => setSelectedContractForEdit(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContractEdit} className="pt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên doanh nghiệp / Khách hàng <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.customerName}
                  onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã số thuế (MST) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.taxId}
                    onChange={(e) => setEditForm({ ...editForm, taxId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người đại diện</label>
                  <input
                    type="text"
                    value={editForm.representative}
                    onChange={(e) => setEditForm({ ...editForm, representative: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dịch vụ phụ trách chính</label>
                <input
                  type="text"
                  value={editForm.service}
                  onChange={(e) => setEditForm({ ...editForm, service: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedContractForEdit(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
