FROM node:20-alpine

WORKDIR /app

# Copy package.json và cài thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ code
COPY . .

# Mở cổng cho Vite
EXPOSE 3000

# Chạy Vite dev server lắng nghe từ bên ngoài (0.0.0.0)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]