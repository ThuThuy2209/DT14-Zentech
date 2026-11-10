import sys
import os
from pathlib import Path

# Tự động thêm thư mục gốc vào sys.path để Python nhận diện module 'app'
sys.path.append(str(Path(__file__).resolve().parent))

from fastapi import FastAPI
from app.core.config import settings
from app.api.v1.invoice import router as invoice_router

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# Thêm router theo đúng tiền tố /api/v1/ai
app.include_router(invoice_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"message": "DT14 - AI Service running on port 5000"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)