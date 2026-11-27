// src/utils/format.ts
export const formatVND = (amount?: number | null): string => {
  return `${(amount || 0).toLocaleString('vi-VN')} đ`;
};

export const formatDateVN = (dateInput?: string | Date | null): string => {
  if (!dateInput) return '—';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return String(dateInput);
  return date.toLocaleDateString('vi-VN');
};
