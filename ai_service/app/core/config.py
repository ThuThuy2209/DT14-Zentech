import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "DT14 - OPC AI Service"
    API_V1_STR: str = "/api/v1/ai"
    PORT: int = 5000

    # Cấu hình Gemini LLM
    GEMINI_API_KEY: str = ""
    DEFAULT_LLM_MODEL: str = "gemini-3.8-flash"
    USE_MOCK_AI: bool = False

    # Thông tin định danh doanh nghiệp Minh Software (để AI đối chiếu)
    COMPANY_TAX_ID: str = "0318888888"
    COMPANY_NAME: str = "Công ty TNHH Một thành viên Minh Software"
    OVERDUE_DAYS_THRESHOLD: int = 30  # Mốc cảnh báo công nợ quá hạn (ngày)

    # Cấu hình CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Đọc file .env từ cả thư mục chạy hiện tại lẫn thư mục gốc ai_service
    model_config = SettingsConfigDict(
        env_file=(".env", os.path.join(os.path.dirname(__file__), "../../.env")),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
