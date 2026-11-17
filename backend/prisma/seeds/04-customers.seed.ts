export async function seedCustomers(prisma: any) {
  console.log('[4/8] Đang nạp danh sách Khách hàng mẫu (từ hồ sơ đề tài)...');

  const count = await prisma.customer.count();
  if (count === 0) {
    await prisma.customer.createMany({
      data: [
        {
          customerName: 'Công ty TNHH Thương mại Hoàng Gia',
          taxCode: '9900000001',
          address: '15 Nguyễn Trãi, P. Bến Thành, TP.HCM',
          email: 'contact@hoanggia.example',
          phone: '0901111111',
          contactPerson: 'Trần Hoàng Gia',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty CP Công nghệ Đại Việt',
          taxCode: '9900000002',
          address: '28 Điện Biên Phủ, P. Gia Định, TP.HCM',
          email: 'info@daiviet.example',
          phone: '0902222222',
          contactPerson: 'Lê Đại Việt',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty TNHH Nội thất Phương Nam',
          taxCode: '9900000003',
          address: '45 Lê Văn Sỹ, P. Nhiêu Lộc, TP.HCM',
          email: 'support@phuongnam.example',
          phone: '0903333333',
          contactPerson: 'Phạm Phương Nam',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty TNHH Dịch vụ An Khang',
          taxCode: '9900000004',
          address: '62 Cách Mạng Tháng 8, P. Xuân Hòa, TP.HCM',
          email: 'contact@ankhang.example',
          phone: '0904444444',
          contactPerson: 'Nguyễn An Khang',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty CP Đầu tư Thành Công',
          taxCode: '9900000005',
          address: '80 Võ Thị Sáu, P. Xuân Hòa, TP.HCM',
          email: 'ceo@thanhcong.example',
          phone: '0905555555',
          contactPerson: 'Vũ Thành Công',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty TNHH Giáo dục Ánh Dương',
          taxCode: '9900000006',
          address: '19 Nguyễn Văn Cừ, P. Chợ Quán, TP.HCM',
          email: 'edu@anhduong.example',
          phone: '0906666666',
          contactPerson: 'Bùi Ánh Dương',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty TNHH Logistics Đông Nam',
          taxCode: '9900000007',
          address: '120 Võ Văn Kiệt, P. Cầu Ông Lãnh, TP.HCM',
          email: 'logistics@dongnam.example',
          phone: '0907777777',
          contactPerson: 'Đỗ Đông Nam',
          status: 'ACTIVE',
        },
        {
          customerName: 'Công ty CP Thương mại Hưng Phát',
          taxCode: '9900000008',
          address: '32 Nguyễn Oanh, P. An Hội, TP.HCM',
          email: 'sale@hungphat.example',
          phone: '0908888888',
          contactPerson: 'Hoàng Hưng Phát',
          status: 'ACTIVE',
        },
      ],
    });
    console.log('   Đã tạo 8 khách hàng mẫu');
  }
}
