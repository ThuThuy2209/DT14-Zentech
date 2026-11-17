export async function seedServices(prisma: any) {
  console.log('[2/8] Đang nạp danh mục Dịch vụ mẫu...');

  const count = await prisma.service.count();
  if (count === 0) {
    await prisma.service.createMany({
      data: [
        {
          serviceName: 'Tư vấn & Thiết kế giải pháp phần mềm',
          description: 'Khảo sát yêu cầu, thiết kế kiến trúc hệ thống và cơ sở dữ liệu',
          unit: 'Gói',
          unitPrice: 15000000,
          status: 'ACTIVE',
        },
        {
          serviceName: 'Lập trình ứng dụng Web & Mobile',
          description: 'Phát triển giao diện và API theo chức năng đã duyệt',
          unit: 'Tính năng',
          unitPrice: 25000000,
          status: 'ACTIVE',
        },
        {
          serviceName: 'Bảo trì & Vận hành hệ thống',
          description: 'Theo dõi máy chủ, sao lưu dữ liệu và hỗ trợ kỹ thuật',
          unit: 'Tháng',
          unitPrice: 5000000,
          status: 'ACTIVE',
        },
      ],
    });
    console.log('   Đã tạo 3 dịch vụ kinh doanh mẫu');
  }
}
