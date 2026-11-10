FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở cổng kết nối
EXPOSE 8080

# Chạy ở chế độ dev (có hot-reload)
CMD ["npm", "run", "start:dev"]

