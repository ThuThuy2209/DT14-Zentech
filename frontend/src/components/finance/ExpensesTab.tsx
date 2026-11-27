// src/components/finance/ExpensesTab.tsx
import React from 'react';
import { RefreshCw, Receipt, Trash2, X } from 'lucide-react';
import type { CreateExpensePayload, ExpenseItem } from '../../services/financeService';
import './ExpensesTab.css';

interface ExpensesTabProps {
  expenses: ExpenseItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onDeleteExpense: (id: number) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  expenseForm: CreateExpensePayload;
  onChangeExpenseForm: (form: CreateExpensePayload) => void;
  onSubmitExpense: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  formatVND: (num: number) => string;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses,
  isLoading,
  onRefresh,
  onDeleteExpense,
  isModalOpen,
  onCloseModal,
  expenseForm,
  onChangeExpenseForm,
  onSubmitExpense,
  isSubmitting,
  formatVND,
}) => {
  return (
    <>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sổ theo dõi khoản chi phí phát sinh</h3>
              <p className="text-xs text-slate-500">Đồng bộ trực tiếp với module Expenses (PostgreSQL)</p>
            </div>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Làm mới</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">DANH MỤC CHI PHÍ</th>
                  <th className="py-3 px-4">DIỄN GIẢI NỘI DUNG</th>
                  <th className="py-3 px-4 text-right">SỐ TIỀN</th>
                  <th className="py-3 px-4 text-center">NGÀY PHÁT SINH</th>
                  <th className="py-3 px-4 text-center">TRẠNG THÁI</th>
                  <th className="py-3 px-4 text-center">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                      <p className="text-xs">Đang tải danh sách chi phí...</p>
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Chưa có bản ghi chi phí nào</p>
                      <p className="text-xs text-slate-400 mt-1">Bấm &quot;Tạo phiếu chi mới&quot; ở góc trên để ghi nhận</p>
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="expenses-table-row transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{exp.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{exp.category}</td>
                      <td className="py-3.5 px-4 text-slate-600">{exp.description || '—'}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-blue-700 text-sm">
                        {formatVND(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500">
                        {new Date(exp.expenseDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {exp.status === 'PAID' ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Đã chi
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Chưa chi
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                          title="Xóa khoản chi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal tạo phiếu chi mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Ghi nhận khoản chi phí mới</h3>
                  <p className="text-xs text-slate-400">Đồng bộ vào Sổ chi phí & Báo cáo thuế</p>
                </div>
              </div>
              <button onClick={onCloseModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitExpense} className="pt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục chi phí <span className="text-rose-500">*</span>
                </label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => onChangeExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Chi phí dịch vụ mua ngoài (TK 6427)">Chi phí dịch vụ mua ngoài (TK 6427)</option>
                  <option value="Chi phí công cụ dụng cụ (TK 6423)">Chi phí công cụ dụng cụ (TK 6423)</option>
                  <option value="Chi phí máy chủ & Hạ tầng Internet (TK 6427)">Chi phí máy chủ & Hạ tầng Internet (TK 6427)</option>
                  <option value="Chi phí bản quyền phần mềm (TK 6428)">Chi phí bản quyền phần mềm (TK 6428)</option>
                  <option value="Chi phí tiếp khách & Văn phòng (TK 6428)">Chi phí tiếp khách & Văn phòng (TK 6428)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Diễn giải nội dung</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thanh toán chi phí máy chủ AWS tháng 11/2026"
                  value={expenseForm.description}
                  onChange={(e) => onChangeExpenseForm({ ...expenseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số tiền chi (VNĐ) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={expenseForm.amount || ''}
                    onChange={(e) => onChangeExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày phát sinh</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.expenseDate}
                    onChange={(e) => onChangeExpenseForm({ ...expenseForm, expenseDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trạng thái thanh toán</label>
                <select
                  value={expenseForm.status}
                  onChange={(e) => onChangeExpenseForm({ ...expenseForm, status: e.target.value as 'PAID' | 'UNPAID' })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="PAID">Đã thanh toán (PAID)</option>
                  <option value="UNPAID">Chưa thanh toán (UNPAID)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? 'Đang lưu...' : 'Ghi nhận chi phí'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
