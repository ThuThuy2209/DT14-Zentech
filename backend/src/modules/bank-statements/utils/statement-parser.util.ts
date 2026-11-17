import * as xlsx from 'xlsx';

export interface ExpressMulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface ParsedTransactionRow {
  transactionDate: Date;
  description: string;
  debitAmount: number;
  creditAmount: number;
  balanceAfter: number | null;
  referenceCode: string | null;
  externalTransactionId: string | null;
}

export class StatementParserUtil {
  // Bóc tách toàn bộ file Excel hoặc CSV thành danh sách giao dịch chuẩn
  static parse(buffer: Buffer): ParsedTransactionRow[] {
    const workbook = xlsx.read(buffer, {
      type: 'buffer',
      cellDates: true,
      dateNF: 'dd/mm/yyyy',
    });
    if (!workbook.SheetNames.length) return [];
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    const results: ParsedTransactionRow[] = [];

    for (const raw of rawRows) {
      // 1. raw data => clean data (bỏ dấu, chữ thường)
      const cleanRow: Record<string, any> = {};
      for (const key of Object.keys(raw)) {
        // cleanRow[key(đã clean)] = raw[key]; => cleanRow['ngay gd'] = raw['Ngày GD']
        cleanRow[this.stripAccents(key)] = raw[key];
      }

      // 2. quăng cái clean data vào các pattern
      // Tìm ngày giao dịch
      const rawDate = this.find(cleanRow, [
        'ngay gd',
        'ngay giao dich',
        'ngay hach toan',
        'ngay',
        'date',
        'transaction date',
        'time',
      ]);
      const transactionDate = this.parseDate(rawDate);
      if (!transactionDate) continue;

      // Tìm số tiền vào / tiền ra (bắt buộc có ít nhất 1 số > 0)
      const rawCredit = this.find(cleanRow, [
        'tien vao',
        'so tien ghi co',
        'gui vao',
        'credit',
        'thu',
        'co',
      ]);
      const creditAmount = this.parseNum(rawCredit);

      const rawDebit = this.find(cleanRow, [
        'tien ra',
        'so tien ghi no',
        'rut ra',
        'debit',
        'chi',
        'no',
      ]);
      const debitAmount = this.parseNum(rawDebit);

      if (creditAmount === 0 && debitAmount === 0) continue;

      // Tìm nội dung giao dịch
      const rawDesc = this.find(cleanRow, [
        'noi dung',
        'dien giai',
        'mo ta',
        'description',
        'chi tiet',
        'content',
        'ghi chu',
      ]);
      const description = rawDesc
        ? String(rawDesc).trim()
        : 'Giao dịch chuyển khoản';

      // Tìm số dư và mã tham chiếu (nếu có)
      const rawBalance = this.find(cleanRow, [
        'so du sau gd',
        'so du',
        'balance',
      ]);
      const balanceAfter =
        rawBalance !== null && rawBalance !== undefined && rawBalance !== ''
          ? this.parseNum(rawBalance)
          : null;

      const rawRef = this.find(cleanRow, [
        'ma gd',
        'ma giao dich',
        'so tham chieu',
        'ref',
        'reference',
        'so gd',
      ]);
      const referenceCode = rawRef ? String(rawRef).trim() : null;

      // 6. Đưa vào kết quả
      results.push({
        transactionDate,
        description,
        debitAmount,
        creditAmount,
        balanceAfter,
        referenceCode,
        externalTransactionId: referenceCode,
      });
    }

    return results;
  }

  // Bỏ dấu tiếng Việt, đưa về chữ thường (VD: "Ngày giao dịch" -> "ngay giao dich")
  private static stripAccents(str: string): string {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .trim()
      .toLowerCase();
  }

  // Tìm giá trị ô theo danh sách từ khóa cột
  private static find(row: Record<string, any>, patterns: string[]): any {
    const keys = Object.keys(row);

    // Lượt 1: Khớp chính xác 100%
    for (const pattern of patterns) {
      for (const key of keys) {
        if (key === pattern) return row[key];
      }
    }

    // Lượt 2: Khớp chuỗi con (bỏ qua nếu nhầm 'noi dung' với 'no')
    for (const pattern of patterns) {
      for (const key of keys) {
        if (pattern === 'no' && key.includes('noi dung')) continue;
        if (key.includes(pattern)) return row[key];
      }
    }

    return undefined;
  }

  // Format ngày tháng: hỗ trợ Date object, DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
  // Tại sao cần này vì Excel đôi khi lưu ngày tháng dưới dạng số serial, hoặc chuỗi, hoặc Date object
  // xlsx.read sẽ tự parse thành Date object nếu cellDates=true, nhưng đôi khi sót | sai => vẫn là chuỗi
  private static parseDate(val: any): Date | null {
    if (!val) return null;
    if (val instanceof Date && !isNaN(val.getTime())) {
      const safe = new Date(val.getTime() + 12 * 60 * 60 * 1000);
      return new Date(
        Date.UTC(
          safe.getUTCFullYear(),
          safe.getUTCMonth(),
          safe.getUTCDate(),
          12,
        ),
      );
    }

    const str = String(val).trim();
    // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY -> vd match = ["15-01-2026", "15", "01", "2026"]
    const match = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (match) {
      const day = Number(match[1]);
      const month = Number(match[2]) - 1;
      const year = Number(match[3]);
      const d = new Date(Date.UTC(year, month, day, 12));
      return isNaN(d.getTime()) ? null : d;
    }

    const fallback = new Date(str);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  // Format số tiền
  private static parseNum(val: any): number {
    // 1. Rỗng thì trả 0 | Đã là số sẵn (VD: -100000) thì lấy số dương (100000)
    if (val === null || val === undefined || val === '') return 0;
    if (typeof val === 'number') return Math.abs(val);

    // 2. Gọt sạch chữ và ký hiệu thừa
    // VD: " + 100.000 VNĐ " -> "100.000"
    let s = String(val)
      .trim()
      .replace(/[^\d.,-]/g, '');
    if (!s) return 0;

    // TH: có cả dấu chấm và dấu phẩy (VD: "15,000,000.50" hoặc "15.000.000,50")
    if (s.includes('.') && s.includes(',')) {
      // Dấu chấm nằm cuối
      if (s.lastIndexOf('.') > s.lastIndexOf(',')) {
        // vd "15,000,000.50" -> "15000000.50"
        s = s.replace(/,/g, '');
      } else {
        // "15.000.000,50" -> "15000000.50"
        s = s.replace(/\./g, '').replace(',', '.');
      }
    } else if (
      // TH: Chỉ có dấu chấm (VD: "15.000.000" hoặc cụm 3 số "500.000")
      (s.match(/\./g) || []).length > 1 ||
      /^\d{1,3}(\.\d{3})+$/.test(s)
    ) {
      // Xóa hết dấu chấm -> "15000000" hoặc "500000"
      s = s.replace(/\./g, '');
    } else {
      // TH: Chỉ có dấu phẩy (VD: "15,000,000") hoặc số lẻ (VD: "100.5")
      // Xóa dấu phẩy -> "15000000" (giữ nguyên dấu chấm nếu là "100.5")
      s = s.replace(/,/g, '');
    }

    const num = parseFloat(s);
    return isNaN(num) ? 0 : Math.abs(num);
  }
}
