import bcrypt from 'bcrypt';

export async function seedUsersAndCompany(prisma: any) {
  console.log('[1/9] Nap tai khoan Admin va Doanh nghiep...');

  const userCount = await prisma.user.count();
  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash,
        email: 'ketoan@minhsoftware.example',
        fullName: 'Nguyễn Minh Tuấn',
        status: 'ACTIVE',
      },
    });
    console.log('   Da tao tai khoan: admin / Admin@123');
  }

  const companyCount = await prisma.company.count();
  if (companyCount === 0) {
    await prisma.company.create({
      data: {
        companyName: 'Công ty TNHH Một thành viên Minh Software',
        taxCode: '0319002001',
        address: 'Số 2 Võ Oanh, P. Thạnh Mỹ Tây, TP.HCM',
        email: 'ketoan@minhsoftware.example',
        phone: '02835122001',
        representative: 'Nguyễn Minh Tuấn',
      },
    });
    console.log(
      '   Da tao thong tin Doanh nghiep: Minh Software (MST: 0319002001)',
    );
  }
}
