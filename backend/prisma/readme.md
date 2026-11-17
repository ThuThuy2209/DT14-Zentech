1/ Nạp các file migration có sẵn vào database(lúc mới tạo) trống:
npx prisma migrate dev

2/ chạy lệnh để sinh data test:
npm run db:seed

3/ Tạo hoặc cập nhật model mới trong file schema.prisma
lưu và cập nhật lại vào Database:
npx prisma migrate dev --name ten_thay_doi

4/ Xóa sạch dữ liệu:
npx prisma migrate reset

5/ Chạy cập nhật Prisma Client:
npx prisma generate
