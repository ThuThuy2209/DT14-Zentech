export async function seedLegalObligations(prisma: any) {
  console.log('[8/8] Đang nạp Nghĩa vụ pháp lý & Lịch hạn nộp...');

  const typeCount = await prisma.legalObligationType.count();
  if (typeCount === 0) {
    // 1. Tạo các loại nghĩa vụ
    const taxType = await prisma.legalObligationType.create({
      data: {
        typeName: 'Thuế và Ngân sách nhà nước',
        description: 'Các loại thuế GTGT, TNDN, TNCN và lệ phí môn bài',
        occurrenceType: 'PERIODIC',
        isActive: true,
      },
    });

    const insType = await prisma.legalObligationType.create({
      data: {
        typeName: 'Bảo hiểm xã hội & Lao động',
        description: 'Trích nộp BHXH, BHYT, BHTN hàng tháng',
        occurrenceType: 'PERIODIC',
        isActive: true,
      },
    });

    const reportType = await prisma.legalObligationType.create({
      data: {
        typeName: 'Báo cáo tài chính & Kiểm toán',
        description: 'Nộp báo cáo tài chính năm và quyết toán thuế năm',
        occurrenceType: 'PERIODIC',
        isActive: true,
      },
    });

    // 2. Tạo nghĩa vụ cụ thể kèm kỳ thực hiện
    await prisma.legalObligation.create({
      data: {
        obligationName: 'Kê khai & nộp thuế GTGT Quý 3/2026',
        obligationTypeId: taxType.id,
        frequencyType: 'QUARTERLY',
        description: 'Tờ khai thuế GTGT Mẫu 01/GTGT theo Thông tư 80/2021/TT-BTC',
        legalBasis: 'Luật Quản lý thuế số 38/2019/QH14',
        applicability: 'APPLICABLE',
        status: 'ACTIVE',
        periods: {
          create: [
            {
              periodName: 'Quý 3/2026',
              startDate: new Date('2026-07-01'),
              dueDate: new Date('2026-10-31'),
              status: 'PENDING',
              note: 'Hạn cuối ngày 31/10/2026',
            },
          ],
        },
      },
    });

    await prisma.legalObligation.create({
      data: {
        obligationName: 'Tạm nộp thuế TNDN Quý 3/2026',
        obligationTypeId: taxType.id,
        frequencyType: 'QUARTERLY',
        description: 'Tạm nộp thuế Thu nhập doanh nghiệp tối thiểu 80% số thuế phải nộp cả năm',
        legalBasis: 'Nghị định 91/2022/NĐ-CP',
        applicability: 'APPLICABLE',
        status: 'ACTIVE',
        periods: {
          create: [
            {
              periodName: 'Quý 3/2026',
              startDate: new Date('2026-07-01'),
              dueDate: new Date('2026-10-30'),
              status: 'PENDING',
            },
          ],
        },
      },
    });

    await prisma.legalObligation.create({
      data: {
        obligationName: 'Nộp báo cáo tài chính năm 2026',
        obligationTypeId: reportType.id,
        frequencyType: 'ANNUALLY',
        description: 'Báo cáo tài chính theo Chế độ kế toán Doanh nghiệp nhỏ và vừa TT 133/2016/TT-BTC',
        legalBasis: 'Thông tư 133/2016/TT-BTC',
        applicability: 'APPLICABLE',
        status: 'ACTIVE',
        periods: {
          create: [
            {
              periodName: 'Năm tài chính 2026',
              startDate: new Date('2026-01-01'),
              dueDate: new Date('2027-03-31'),
              status: 'PENDING',
              note: 'Hạn nộp chậm nhất là ngày thứ 90 kể từ ngày kết thúc năm tài chính',
            },
          ],
        },
      },
    });

    // Ghi chú: insType được tạo nhưng chưa gán nghĩa vụ cụ thể (có thể mở rộng sau)
    void insType;

    console.log('   Đã nạp danh mục Nghĩa vụ pháp lý & Lịch hạn Thuế / BCTC');
  }
}
