export async function seedBankAccounts(prisma: any) {
  console.log('[3/8] Đang nạp Tài khoản ngân hàng mẫu...');

  const count = await prisma.bankAccount.count();
  if (count === 0) {
    await prisma.bankAccount.create({
      data: {
        bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)',
        accountNumber: '102099000001',
        accountHolder: 'CONG TY TNHH MOT THANH VIEN MINH SOFTWARE',
        currency: 'VND',
        status: 'ACTIVE',
      },
    });
    console.log('   Đã tạo tài khoản ngân hàng mặc định: Vietcombank - 102099000001');
  }
}
