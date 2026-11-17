from typing import Any
from fastapi.responses import JSONResponse


def success_response(data: Any, message: str = "Thành công") -> dict:
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(error_code: str, message: str, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "errorCode": error_code,
            "message": message,
            "data": None
        }
    )
