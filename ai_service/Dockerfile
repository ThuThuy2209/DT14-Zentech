
FROM python:3.10-slim

WORKDIR /app

# Cài các thư viện hệ thống cần thiết cho OCR và xử lý hình ảnh
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    libglib2.0-0 \
    libgl1 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Cài thư viện Python
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Sao chép mã nguồn AI Service
COPY . .

ENV PYTHONUNBUFFERED=1
ENV PORT=5000

EXPOSE 5000

# Khởi chạy FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
