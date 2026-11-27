// src/components/finance/BankTab.tsx
import React from 'react';
import { RefreshCw, FileSpreadsheet, Trash2, X } from 'lucide-react';
import type {
  BankAccountItem,
  BankStatementItem,
  BankTransactionItem,
} from '../../services/financeService';
import './BankTab.css';

interface BankTabProps {
  bankAccounts: BankAccountItem[];
  transactions: BankTransactionItem[];
  bankStatements: BankStatementItem[];
  isLoading: boolean;
  showUploadModal: boolean;
  onOpenUploadModal: () => void;
  onCloseUploadModal: () => void;
  uploadAccountId: string;
  onChangeUploadAccountId: (id: string) => void;
  uploadFile: File | null;
  onChangeUploadFile: (file: File | null) => void;
  isUploadingStatement: boolean;
  onSubmitUpload: (e: React.FormEvent) => void;
  onDeleteStatement: (id: number) => void;
  formatVND: (num: number) => string;
}

export const BankTab: React.FC<BankTabProps> = ({
  bankAccounts,
  transactions,
  bankStatements,
  isLoading,
  showUploadModal,
  onOpenUploadModal,
  onCloseUploadModal,
  uploadAccountId,
  onChangeUploadAccountId,
  uploadFile,
  onChangeUploadFile,
  isUploadingStatement,
  onSubmitUpload,
  onDeleteStatement,
  formatVND,
}) => {
  return (
    <>
      <div className="space-y-4">
        {/* Danh sách tài khoản ngân hàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="p-8 text-center bg-white rounded-2xl border col-span-2">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Đang tải dữ liệu ngân hàng...</p>
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 col-span-2 text-center text-slate-500 text-xs">
              Chưa có tài khoản ngân hàng nào trong hệ thống.
            </div>
          ) : (
            bankAccounts.map((acc) => (
              <div
                key={acc.id}
                className="bank-account-card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700">{acc.bankName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                      {acc.status}
                    </span>
                  </div>
                  <p className="text-lg font-mono font-extrabold text-slate-900 mt-1">{acc.accountNumber}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {acc.accountHolder} • {acc.branch || 'Hội sở'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Số dư hiện tại</span>
                  <p className="text-base font-extrabold text-emerald-600 mt-0.5">{formatVND(acc.currentBalance)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bảng giao dịch ngân hàng */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Giao dịch ngân hàng & Đối soát tự động</h3>
              <p className="text-xs text-slate-500">Đối chiếu sao kê với hóa đơn bán ra / mua vào</p>
            </div>
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Tải lên sao kê</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">NGÀY GD</th>
                  <th className="py-3 px-4">NỘI DUNG CHUYỂN KHOẢN</th>
                  <th className="py-3 px-4 text-right">SỐ TIỀN</th>
                  <th className="py-3 px-4 text-center">LOẠI GD</th>
                  <th className="py-3 px-4 text-center">ĐỐI SOÁT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      Chưa có giao dịch sao kê nào. Tải lên sao kê để AI tự động đối chiếu!
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {new Date(tx.transactionDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{tx.description}</td>
                      <td
                        className={`py-3.5 px-4 text-right font-extrabold ${
                          tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? `+${formatVND(tx.amount)}` : `-${formatVND(tx.amount)}`}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tx.type === 'CREDIT' ? 'Tiền vào' : 'Tiền ra'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {tx.reconciliationStatus === 'RECONCILED' ? '✓ Đã gạch nợ' : 'Chờ đối soát'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danh sách đợt sao kê đã tải lên */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lịch sử tệp sao kê đã tải lên</h3>
              <p className="text-xs text-slate-500">Quản lý các đợt import file Excel/CSV ngân hàng</p>
            </div>
            <span className="text-xs font-bold text-slate-500">{bankStatements.length} đợt</span>
          </div>
          <div className="divide-y divide-slate-100">
            {bankStatements.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Chưa có tệp sao kê nào được tải lên.
              </div>
            ) : (
              bankStatements.map((stmt) => (
                <div key={stmt.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{stmt.fileName}</p>
                      <p className="text-[11px] text-slate-500">
                        TK #{stmt.bankAccountId} • {stmt.totalTransactions} giao dịch •{' '}
                        {new Date(stmt.uploadedAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      {stmt.status}
                    </span>
                    <button
                      onClick={() => onDeleteStatement(stmt.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Xóa đợt sao kê"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal upload file sao kê */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Tải lên File Sao kê Ngân hàng</h3>
                  <p className="text-xs text-slate-400">Hỗ trợ định dạng .xlsx, .xls, .csv</p>
                </div>
              </div>
              <button onClick={onCloseUploadModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={onSubmitUpload} className="pt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn Tài khoản Ngân hàng <span className="text-rose-500">*</span>
                </label>
                <select
                  value={uploadAccountId}
                  onChange={(e) => onChangeUploadAccountId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {bankAccounts.length === 0 ? (
                    <option value="1">Tài khoản mặc định (#1)</option>
                  ) : (
                    bankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bankName} - {acc.accountNumber} ({acc.accountHolder})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tệp sao kê (.xlsx, .xls, .csv) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  required
                  onChange={(e) => onChangeUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseUploadModal}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isUploadingStatement || !uploadFile}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  {isUploadingStatement && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploadingStatement ? 'Đang tải lên...' : 'Tải lên & Bóc tách'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
