export async function seedQuotesAndContracts(prisma: any) {
  console.log('[5/8] Đang nạp Báo giá, Mẫu hợp đồng & Hồ sơ nghiệm thu...');

  // 1. Lấy khách hàng đầu tiên (Hoàng Gia)
  const customer = await prisma.customer.findFirst({
    where: { taxCode: '9900000001' },
  });
  if (!customer) return;

  // 2. Lấy dịch vụ đầu tiên
  const service = await prisma.service.findFirst();

  // 3. Tạo Báo giá mẫu
  let quotation = await prisma.quotation.findFirst({
    where: { quotationCode: 'BG-2026-001' },
  });

  if (!quotation) {
    quotation = await prisma.quotation.create({
      data: {
        quotationCode: 'BG-2026-001',
        customerId: customer.id,
        createdDate: new Date('2026-09-01'),
        validUntil: new Date('2026-09-30'),
        subtotal: 50000000,
        discountAmount: 0,
        taxAmount: 5000000,
        totalAmount: 55000000,
        status: 'ACCEPTED',
        note: 'Báo giá phát triển phần mềm quản lý kho cho Cty Hoàng Gia',
        items: {
          create: [
            {
              serviceId: service?.id,
              description: 'Phát triển phần mềm quản lý kho và bán hàng',
              quantity: 1,
              unitPrice: 50000000,
              discountAmount: 0,
              taxRate: 10,
              lineTotal: 55000000,
            },
          ],
        },
      },
    });
    console.log('   Đã tạo Báo giá BG-2026-001 (ACCEPTED)');
  }

  // 4. Tạo Mẫu hợp đồng (Template)
  let template = await prisma.contractTemplate.findFirst({
    where: { templateName: 'Mẫu hợp đồng cung cấp dịch vụ phần mềm' },
  });

  if (!template) {
    template = await prisma.contractTemplate.create({
      data: {
        templateName: 'Mẫu hợp đồng cung cấp dịch vụ phần mềm',
        description: 'Mẫu chuẩn dùng cho khách hàng doanh nghiệp cung cấp dịch vụ CNTT',
        status: 'ACTIVE',
        versions: {
          create: [
            {
              versionNumber: 1,
              content: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\nHỢP ĐỒNG CUNG CẤP DỊCH VỤ PHẦN MỀM...',
              placeholderConfig: {
                fields: ['customerName', 'taxCode', 'contractValue', 'startDate', 'endDate'],
              },
            },
          ],
        },
      },
      include: { versions: true },
    });
    console.log('   Đã tạo Mẫu hợp đồng & Phiên bản v1');
  }

  const templateVersion = await prisma.contractTemplateVersion.findFirst({
    where: { templateId: template.id },
  });

  // 5. Tạo Hợp đồng mẫu
  let contract = await prisma.contract.findFirst({
    where: { contractCode: 'HD-2026-001' },
  });

  if (!contract) {
    contract = await prisma.contract.create({
      data: {
        contractCode: 'HD-2026-001',
        quotationId: quotation.id,
        customerId: customer.id,
        templateVersionId: templateVersion?.id,
        contractName: 'Hợp đồng phát triển phần mềm quản lý kho Hoàng Gia',
        contractValue: 55000000,
        startDate: new Date('2026-09-05'),
        endDate: new Date('2026-10-05'),
        contractContent: 'Nội dung hợp đồng chi tiết phát triển hệ thống phần mềm...',
        status: 'SIGNED',
        signers: {
          create: [
            {
              signerName: 'Nguyễn Minh Tuấn',
              signerEmail: 'ketoan@minhsoftware.example',
              signerRole: 'Đại diện Bên A (Giám đốc)',
              signingOrder: 1,
              signingStatus: 'SIGNED',
            },
            {
              signerName: 'Trần Hoàng Gia',
              signerEmail: 'contact@hoanggia.example',
              signerRole: 'Đại diện Bên B (Giám đốc)',
              signingOrder: 2,
              signingStatus: 'SIGNED',
            },
          ],
        },
      },
    });
    console.log('   Đã tạo Hợp đồng HD-2026-001 (SIGNED) kèm 2 người ký');
  }

  // 6. Tạo Biên bản nghiệm thu
  let acceptance = await prisma.acceptanceRecord.findFirst({
    where: { acceptanceCode: 'NT-2026-001' },
  });

  if (!acceptance) {
    acceptance = await prisma.acceptanceRecord.create({
      data: {
        contractId: contract.id,
        acceptanceCode: 'NT-2026-001',
        acceptanceDate: new Date('2026-10-05'),
        content: 'Nghiệm thu toàn bộ tính năng quản lý kho theo đúng tiến độ và cam kết',
        result: 'PASSED',
        issues: 'Không có lỗi tồn đọng',
      },
    });
    console.log('   Đã tạo Biên bản nghiệm thu NT-2026-001 (PASSED)');
  }
}
