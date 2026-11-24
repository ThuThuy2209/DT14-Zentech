import dayjs from 'dayjs';
import {
  ReconciliationConfidence,
  BUSINESS_STOP_WORDS,
  EXPENSE_STOP_WORDS,
  MatchStatus,
} from '../constants/bank.constant.js';

export interface MatchSuggestionItem {
  type: 'SALES_INVOICE' | 'PURCHASE_INVOICE' | 'EXPENSE';
  document: Record<string, any>;
  suggestedAmount: number; // tiền đề xuất gạch nợ
  confidence: ReconciliationConfidence;
  reasons: string[];
}

export interface TransactionMatchResult {
  transaction: any;
  suggestions: MatchSuggestionItem[];
}

export class ReconciliationMatcherUtil {
  // 1. Chuẩn hóa chuỗi: bỏ dấu tiếng Việt, chữ thường, giữ lại chữ cái, số và khoảng trắng
  static normalizeText(str: string): string {
    if (!str) return '';
    return str
      .normalize('NFD') // Tách dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, '') // Xóa các dấu thanh/mũ
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ') // Giữ lại chữ, số và khoảng trắng
      .replace(/\s+/g, ' ') // Gom nhiều khoảng trắng thành 1
      .trim();
  }

  // 2. Xóa sạch khoảng trắng và ký tự đặc biệt (chuyên dùng so mã hóa đơn)
  static stripAll(str: string): string {
    return this.normalizeText(str).replace(/\s+/g, '');
  }

  // 3. Trích xuất các từ khóa trong tên đối tác (lọc bỏ các từ chung chung như công ty, tnhh...)
  static extractNameKeywords(name: string): string[] {
    const normalized = this.normalizeText(name || '');
    if (!normalized) return [];
    return normalized
      .split(' ')
      .filter((w) => w.length >= 2 && !BUSINESS_STOP_WORDS.has(w));
  }

  // 4. So khớp tên đối tác (Khách hàng / Nhà cung cấp)
  static checkPartnerNameMatch(
    name: string,
    desc: string,
    descNoSpace: string,
  ): boolean {
    const nameWords = this.extractNameKeywords(name);
    if (nameWords.length === 0) return false;

    // A. Khớp nguyên cụm tên có dấu cách
    // VD ['hoang', 'gia'] → "hoang gia"
    const cleanName = nameWords.join(' ');
    if (cleanName.length >= 3 && desc.includes(cleanName)) {
      return true;
    }

    // B. Khớp cụm tên viết liền không dấu không cách
    // VD ['hoang', 'gia'] → "hoanggia"
    const cleanNameNoSpace = nameWords.join('');
    if (
      cleanNameNoSpace.length >= 3 &&
      descNoSpace.includes(cleanNameNoSpace)
    ) {
      return true;
    }

    // C. Nếu tên có từ 2 từ trở lên:
    // hoang có trong desc, gia có trong desc --> true
    if (nameWords.length >= 2) {
      return nameWords.every((word) => desc.includes(word));
    }

    // D. Nếu tên chỉ có 1 từ duy nhất
    // "Hoang" --> cắt chuỗi desc thành mảng --> tìm tên trong mảng đó
    if (nameWords.length === 1 && nameWords[0].length >= 3) {
      const descWordList = desc.split(' ');
      return descWordList.includes(nameWords[0]);
    }

    return false;
  }

  // 5. So khớp mô tả khoản chi phí
  static checkExpenseMatch(expenseDesc: string, desc: string): boolean {
    // VD: "Chi tiền thuê văn phòng T10" --> ['thue', 'van', 'phong', 't10']
    const normalized = this.normalizeText(expenseDesc || '');
    if (!normalized) return false;

    const keywords = normalized
      .split(' ')
      .filter((w) => w.length >= 2 && !EXPENSE_STOP_WORDS.has(w));

    if (keywords.length === 0) return false;

    // A. Khớp nguyên cụm từ khóa có dấu cách
    // VD: ['thue', 'van', 'phong'] --> "thue van phong" nằm trọn trong desc --> true
    const phrase = keywords.join(' ');
    if (phrase.length >= 3 && desc.includes(phrase)) {
      return true;
    }

    // B. Nếu có từ 2 từ khóa trở lên (không đứng cạnh nhau):
    // Bắt buộc TẤT CẢ từ khóa đều phải có mặt trong desc
    // VD: "thue" có trong desc VÀ "van" có trong desc VÀ "phong" có trong desc --> true
    if (keywords.length >= 2) {
      return keywords.every((w) => desc.includes(w));
    }

    // C. Nếu chỉ có 1 từ khóa duy nhất:
    // VD: ['internet'] --> cắt chuỗi desc thành mảng --> tìm đúng nguyên từ "internet" trong mảng đó
    if (keywords.length === 1 && keywords[0].length >= 3) {
      return desc.split(' ').includes(keywords[0]);
    }

    return false;
  }

  // 6. Thuật toán so khớp thông minh trên bộ nhớ (In-memory matching)
  static match(
    transaction: any,
    salesInvoices: any[] = [],
    purchaseInvoices: any[] = [],
    expenses: any[] = [],
  ): TransactionMatchResult {
    const txCredit = Number(transaction.creditAmount || 0); // tiền vào
    const txDebit = Number(transaction.debitAmount || 0); // tiền ra
    const isMoneyIn = txCredit > 0;

    // Tính tổng số tiền đã đối chiếu (nếu có)
    const alreadyMatched = (transaction.reconciliations || [])
      .filter((r: any) => r.matchStatus === MatchStatus.CONFIRMED)
      .reduce((sum: number, r: any) => sum + Number(r.matchedAmount || 0), 0);

    // tiền còn lại
    const availableAmount = Math.max(
      (isMoneyIn ? txCredit : txDebit) - alreadyMatched,
      0,
    );

    if (availableAmount <= 0) {
      return { transaction, suggestions: [] };
    }

    const desc = this.normalizeText(transaction.description || '');
    const descNoSpace = this.stripAll(transaction.description || '');
    const suggestions: MatchSuggestionItem[] = [];

    // TRƯỜNG HỢP 1: Tiền vào -> Tìm Hóa đơn bán ra (Sales Invoices)
    if (isMoneyIn) {
      for (const inv of salesInvoices) {
        const debt = Number(inv.outstandingAmount || 0);
        if (debt <= 0) continue;

        const isExactAmount = Math.abs(debt - availableAmount) < 1;

        // So mã hóa đơn không khoảng trắng (VD: "HD-BAN-2026-001" khớp "hdban2026001")
        const invNumberNoSpace = this.stripAll(inv.invoiceNumber || '');
        const hasInvoiceCode =
          invNumberNoSpace.length > 2 && descNoSpace.includes(invNumberNoSpace);

        // So tên đối tác (khách hàng)
        const hasCustomerName = this.checkPartnerNameMatch(
          inv.customer?.customerName || '',
          desc,
          descNoSpace,
        );

        // Khoảng cách ngày giữa ngày giao dịch và ngày lập hóa đơn
        const daysDiff = Math.abs(
          dayjs(transaction.transactionDate).diff(inv.invoiceDate, 'day'),
        );

        let confidence: ReconciliationConfidence = 'LOW';
        const reasons: string[] = [];

        if (isExactAmount && (hasInvoiceCode || hasCustomerName)) {
          confidence = 'HIGH';
          reasons.push(
            'Khớp chính xác số tiền và thông tin khách hàng/số hóa đơn',
          );
        } else if (hasInvoiceCode) {
          confidence = isExactAmount ? 'HIGH' : 'MEDIUM';
          reasons.push(`Nội dung có số hóa đơn ${inv.invoiceNumber}`);
        } else if (isExactAmount) {
          confidence = 'MEDIUM';
          reasons.push(
            `Khớp chính xác số tiền nợ (${debt.toLocaleString('vi-VN')} đ)`,
          );
        } else if (availableAmount < debt && hasCustomerName) {
          confidence = 'MEDIUM';
          reasons.push(
            `Khớp tên khách hàng (${inv.customer?.customerName}) và thanh toán một phần`,
          );
        } else if (daysDiff <= 7 && (hasInvoiceCode || hasCustomerName)) {
          confidence = 'MEDIUM';
          reasons.push('Gần ngày tạo hóa đơn và khớp thông tin đối tác');
        } else if (daysDiff <= 7) {
          confidence = 'LOW';
          reasons.push('Gần thời điểm phát hành hóa đơn');
        }

        // Chỉ thêm gợi ý nếu có ít nhất 1 căn cứ xác đáng
        if (isExactAmount || hasInvoiceCode || hasCustomerName) {
          suggestions.push({
            type: 'SALES_INVOICE',
            document: {
              id: inv.id,
              invoiceNumber: inv.invoiceNumber,
              customerName: inv.customer?.customerName,
              totalAmount: Number(inv.totalAmount),
              outstandingAmount: debt,
              invoiceDate: inv.invoiceDate,
              dueDate: inv.dueDate,
            },
            suggestedAmount: Math.min(availableAmount, debt),
            confidence,
            reasons,
          });
        }
      }
    } else {
      // TRƯỜNG HỢP 2: Tiền ra -> Tìm Hóa đơn mua vào hoặc Khoản chi phí
      for (const pi of purchaseInvoices) {
        const debt = Number(pi.outstandingAmount || 0);
        if (debt <= 0) continue;

        const isExact = Math.abs(debt - availableAmount) < 1;

        const piNumberNoSpace = this.stripAll(pi.invoiceNumber || '');
        const hasInvoiceCode =
          piNumberNoSpace.length > 2 && descNoSpace.includes(piNumberNoSpace);

        const hasSupplier = this.checkPartnerNameMatch(
          pi.supplierName || '',
          desc,
          descNoSpace,
        );

        let confidence: ReconciliationConfidence = 'LOW';
        const reasons: string[] = [];

        if (isExact && (hasSupplier || hasInvoiceCode)) {
          confidence = 'HIGH';
          reasons.push('Khớp chính xác số tiền và nhà cung cấp/mã hóa đơn');
        } else if (hasInvoiceCode) {
          confidence = isExact ? 'HIGH' : 'MEDIUM';
          reasons.push(`Nội dung có số hóa đơn ${pi.invoiceNumber}`);
        } else if (isExact) {
          confidence = 'MEDIUM';
          reasons.push(
            `Khớp chính xác số tiền còn phải trả (${debt.toLocaleString('vi-VN')} đ)`,
          );
        } else if (availableAmount < debt && hasSupplier) {
          confidence = 'MEDIUM';
          reasons.push(
            `Khớp tên nhà cung cấp (${pi.supplierName}) và thanh toán một phần`,
          );
        } else if (hasSupplier) {
          confidence = 'LOW';
          reasons.push('Nội dung nhắc đến tên nhà cung cấp');
        }

        if (isExact || hasSupplier || hasInvoiceCode) {
          suggestions.push({
            type: 'PURCHASE_INVOICE',
            document: {
              id: pi.id,
              invoiceNumber: pi.invoiceNumber,
              supplierName: pi.supplierName,
              totalAmount: Number(pi.totalAmount),
              outstandingAmount: debt,
              invoiceDate: pi.invoiceDate,
            },
            suggestedAmount: Math.min(availableAmount, debt),
            confidence,
            reasons,
          });
        }
      }

      for (const exp of expenses) {
        const expAmount = Number(exp.amount || 0);
        if (expAmount <= 0) continue;

        const isExact = Math.abs(expAmount - availableAmount) < 1;

        const hasKeyword = this.checkExpenseMatch(exp.description || '', desc);

        let confidence: ReconciliationConfidence = 'LOW';
        const reasons: string[] = [];

        if (isExact && hasKeyword) {
          confidence = 'HIGH';
          reasons.push('Khớp chính xác số tiền và nội dung khoản chi');
        } else if (isExact) {
          confidence = 'MEDIUM';
          reasons.push(
            `Khớp đúng số tiền chi (${expAmount.toLocaleString('vi-VN')} đ)`,
          );
        } else if (hasKeyword) {
          confidence = 'LOW';
          reasons.push('Nội dung có từ khóa khớp với khoản chi');
        }

        if (isExact || hasKeyword) {
          suggestions.push({
            type: 'EXPENSE',
            document: {
              id: exp.id,
              category: exp.category,
              description: exp.description,
              amount: expAmount,
              expenseDate: exp.expenseDate,
            },
            suggestedAmount: Math.min(availableAmount, expAmount),
            confidence,
            reasons,
          });
        }
      }
    }

    const priority: Record<string, number> = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    suggestions.sort((a, b) => priority[a.confidence] - priority[b.confidence]);

    return {
      transaction,
      suggestions,
    };
  }
}
