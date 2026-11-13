import sys
from pathlib import Path

# Tự động thêm thư mục gốc ai_service vào sys.path để Python nhận diện module 'app'
CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.append(str(CURRENT_DIR))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.invoice import router as invoice_router
from app.api.v1.agent import router as agent_router

tags_metadata = [
    {
        "name": "Invoice Processing",
        "description": "Bóc tách hóa đơn đầu vào (PDF/Ảnh) bằng OCR & Gemini 1.5 Flash, phân loại tài khoản theo TT 133/2016/TT-BTC",
    },
    {
        "name": "AI Agent",
        "description": "Trợ lý AI Agent tạo bản nháp email nhắc nợ quá hạn theo nguyên tắc Human-in-the-Loop",
    },
    {
        "name": "System",
        "description": "Kiểm tra trạng thái vận hành của AI Service",
    },
]

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Phân hệ AI Service quản trị hóa đơn và trợ lý thông minh - DT14 OPC SmartOffice",
    openapi_tags=tags_metadata,
)

# Cấu hình CORS toàn diện cho phép Frontend (3000), Swagger UI (5000) và Backend (8080)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "*",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:[0-9]+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các router API theo chuẩn tiền tố /api/v1/ai
app.include_router(invoice_router, prefix=settings.API_V1_STR)
app.include_router(agent_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["System"])
def root():
    return {
        "success": True,
        "message": "DT14 - AI Service đang hoạt động",
        "data": {
            "service": settings.PROJECT_NAME,
            "port": settings.PORT,
            "docs_url": "/docs",
            "version": "1.0.0",
        },
    }


@app.get("/health", tags=["System"])
def health_check():
    return {"status": "ok", "service": "ai_service", "port": settings.PORT}


# Global Exception Handler đảm bảo mọi lỗi 500 bất ngờ đều tuân thủ chuẩn format chung
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "errorCode": "ERR_INTERNAL_SERVER_ERROR",
            "message": f"Lỗi nội bộ AI Service: {str(exc)}",
            "data": None,
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=True,
        app_dir=str(CURRENT_DIR),
    )