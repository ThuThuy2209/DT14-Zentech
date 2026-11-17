export async function seedInvoices(prisma: any) {
  console.log('[6/8] Đang nạp Hóa đơn bán ra & Bộ dữ liệu 25 Hóa đơn mua vào mẫu...');

  const customer = await prisma.customer.findFirst({
    where: { taxCode: '9900000001' },
  });
  const contract = await prisma.contract.findFirst({
    where: { contractCode: 'HD-2026-001' },
  });
  const acceptance = await prisma.acceptanceRecord.findFirst({
    where: { acceptanceCode: 'NT-2026-001' },
  });

  // 1. HÓA ĐƠN BÁN RA - TÌNH HUỐNG 2 TRONG BRD (Chậm thanh toán 30 ngày)
  // Tổng tiền: 30.000.000đ | Đã trả: 12.000.000đ | Còn nợ: 18.000.000đ
  const existingSalesInvoice = await prisma.salesInvoice.findFirst({
    where: { invoiceNumber: 'HD-BAN-2026-001' },
  });

  if (!existingSalesInvoice && customer) {
    const salesInvoice = await prisma.salesInvoice.create({
      data: {
        invoiceNumber: 'HD-BAN-2026-001',
        customerId: customer.id,
        contractId: contract?.id,
        acceptanceId: acceptance?.id,
        issueDate: new Date('2026-09-13'),
        invoiceDate: new Date('2026-09-13'),
        dueDate: new Date('2026-10-13'), // Quá hạn 30 ngày tính đến 13/11/2026!
        subtotal: 27272727,
        taxAmount: 2727273,
        totalAmount: 30000000,
        paidAmount: 12000000,
        outstandingAmount: 18000000,
        invoiceStatus: 'PARTIALLY_PAID',
        paymentStatus: 'OVERDUE',
      },
    });

    // Tạo bản ghi thanh toán 12.000.000đ
    await prisma.payment.create({
      data: {
        salesInvoiceId: salesInvoice.id,
        paymentDate: new Date('2026-09-20'),
        amount: 12000000,
        paymentMethod: 'BANK_TRANSFER',
        transactionReference: 'FT260920001',
        paymentStatus: 'CONFIRMED',
        note: 'Khách hàng Hoàng Gia tạm ứng đợt 1',
      },
    });
    console.log('   Đã tạo Hóa đơn bán ra HD-BAN-2026-001 (Nợ 18tr quá hạn 30 ngày - Tình huống 2 BRD)');
  }

  // 2. BỘ 25 HÓA ĐƠN MUA VÀO (TÌNH HUỐNG 1 TRONG BRD)
  // Gồm: 1 hóa đơn trùng + 1 hóa đơn sai MST người mua + 23 hóa đơn hợp lệ
  const purchaseCount = await prisma.purchaseInvoice.count();
  if (purchaseCount === 0) {
    const buyerTaxCodeMinhSoftware = '0319002001';

    const purchaseInvoicesData = [
      // 1. Hóa đơn gốc
      {
        supplierName: 'Công ty Cổ phần Viễn thông FPT',
        invoiceNumber: 'FPT-INV-001',
        sellerTaxCode: '0101778163',
        buyerTaxCode: buyerTaxCodeMinhSoftware,
        invoiceDate: new Date('2026-10-01'),
        dueDate: new Date('2026-10-20'),
        totalAmount: 5500000,
        paidAmount: 0,
        outstandingAmount: 5500000,
        duplicateStatus: 'UNIQUE',
        buyerTaxStatus: 'VALID',
        ocrStatus: 'COMPLETED',
        paymentStatus: 'UNPAID',
      },
      // 2. HÓA ĐƠN BỊ TRÙNG LẶP (Trùng nhà cung cấp và số hóa đơn với hóa đơn 1 - Demo KPI03)
      {
        supplierName: 'Công ty Cổ phần Viễn thông FPT',
        invoiceNumber: 'FPT-INV-001',
        sellerTaxCode: '0101778163',
        buyerTaxCode: buyerTaxCodeMinhSoftware,
        invoiceDate: new Date('2026-10-01'),
        dueDate: new Date('2026-10-20'),
        totalAmount: 5500000,
        paidAmount: 0,
        outstandingAmount: 5500000,
        duplicateStatus: 'DUPLICATE', // CẢNH BÁO TRÙNG
        buyerTaxStatus: 'VALID',
        ocrStatus: 'COMPLETED',
        paymentStatus: 'UNPAID',
      },
      // 3. HÓA ĐƠN SAI MÃ SỐ THUẾ NGƯỜI MUA (Demo KPI03)
      {
        supplierName: 'Tập đoàn Công nghiệp - Viễn thông Quân đội Viettel',
        invoiceNumber: 'VTT-INV-002',
        sellerTaxCode: '0100109106',
        buyerTaxCode: '9999999999', // SAI MST DOANH NGHIỆP
        invoiceDate: new Date('2026-10-02'),
        dueDate: new Date('2026-10-22'),
        totalAmount: 3300000,
        paidAmount: 0,
        outstandingAmount: 3300000,
        duplicateStatus: 'UNIQUE',
        buyerTaxStatus: 'INVALID', // CẢNH BÁO SAI MST
        ocrStatus: 'COMPLETED',
        paymentStatus: 'UNPAID',
      },
    ];

    // Tạo thêm 22 hóa đơn mua vào hợp lệ còn lại (tổng đủ 25 hóa đơn)
    const suppliers = [
      { name: 'Công ty TNHH Phần mềm Quản trị MISA', tax: '0101243150', amount: 2200000 },
      { name: 'Công ty TNHH Microsoft Việt Nam', tax: '0106208392', amount: 6500000 },
      { name: 'Công ty TNHH Google Cloud Việt Nam', tax: '0315482910', amount: 4800000 },
      { name: 'Tổng công ty Điện lực TP.HCM (EVN HCMC)', tax: '0300951119', amount: 1850000 },
      { name: 'Công ty Cổ phần Cấp nước Gia Định', tax: '0304344558', amount: 320000 },
      { name: 'Công ty CP Bưu chính Viettel (Viettel Post)', tax: '0104093672', amount: 450000 },
      { name: 'Công ty CP Văn phòng phẩm Hồng Hà', tax: '0100100867', amount: 890000 },
      { name: 'Công ty CP Thế Giới Di Động', tax: '0303217354', amount: 15400000 },
      { name: 'Công ty TNHH Thiết bị Công nghệ Phong Vũ', tax: '0304998358', amount: 8900000 },
      { name: 'Công ty CP Dịch vụ Di động Trực tuyến (MoMo)', tax: '0305364967', amount: 600000 },
      { name: 'Công ty CP Giải pháp Thanh toán VNPay', tax: '0102182292', amount: 750000 },
    ];

    for (let i = 4; i <= 25; i++) {
      const sup = suppliers[(i - 4) % suppliers.length];
      purchaseInvoicesData.push({
        supplierName: sup.name,
        invoiceNumber: `INV-2026-${String(i).padStart(3, '0')}`,
        sellerTaxCode: sup.tax,
        buyerTaxCode: buyerTaxCodeMinhSoftware,
        invoiceDate: new Date(`2026-10-${String((i % 25) + 1).padStart(2, '0')}`),
        dueDate: new Date('2026-11-10'),
        totalAmount: sup.amount,
        paidAmount: 0,
        outstandingAmount: sup.amount,
        duplicateStatus: 'UNIQUE',
        buyerTaxStatus: 'VALID',
        ocrStatus: 'COMPLETED',
        paymentStatus: 'UNPAID',
      });
    }

    await prisma.purchaseInvoice.createMany({
      data: purchaseInvoicesData,
    });
    console.log('   Đã nạp trọn bộ 25 Hóa đơn mua vào (1 trùng, 1 sai MST, 23 hợp lệ - Tình huống 1 BRD)');
  }
}
