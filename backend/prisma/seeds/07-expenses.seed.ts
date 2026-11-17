export async function seedExpenses(prisma: any) {
  console.log('[7/8] Đang nạp danh mục Khoản chi phí (Expenses) mẫu...');

  const count = await prisma.expense.count();
  if (count === 0) {
    await prisma.expense.createMany({
      data: [
        {
          category: 'Văn phòng',
          description: 'Tiền thuê văn phòng làm việc tháng 10/2026',
          amount: 8000000,
          expenseDate: new Date('2026-10-01'),
          dueDate: new Date('2026-10-05'),
          status: 'PAID',
        },
        {
          category: 'Tiện ích',
          description: 'Cước Internet cáp quang Viettel tháng 10',
          amount: 550000,
          expenseDate: new Date('2026-10-10'),
          dueDate: new Date('2026-10-15'),
          status: 'PAID',
        },
        {
          category: 'Tiếp khách',
          description: 'Chi phí cà phê & ăn trưa tiếp đối tác Hoàng Gia',
          amount: 2000000,
          expenseDate: new Date('2026-10-15'),
          dueDate: null,
          status: 'PAID',
        },
        {
          category: 'Văn phòng phẩm',
          description: 'Mua giấy in và mực in hợp đồng',
          amount: 650000,
          expenseDate: new Date('2026-10-18'),
          dueDate: null,
          status: 'PAID',
        },
        {
          category: 'Cộng tác viên',
          description: 'Thù lao hỗ trợ lập trình cho CTV tháng 10',
          amount: 7000000,
          expenseDate: new Date('2026-10-31'),
          dueDate: new Date('2026-11-05'),
          status: 'PAID',
        },
      ],
    });
    console.log('   Đã tạo 5 khoản chi phí mẫu');
  }
}
