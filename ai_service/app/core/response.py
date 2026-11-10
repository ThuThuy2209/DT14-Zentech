from typing import Any

def success_response(data: Any, message: str = "Thành công") -> dict:
    return {
        "success": True,
        "message": message,
        "data": data
    }

def error_response(error_code: str, message: str) -> dict:
    return {
        "success": False,
        "errorCode": error_code,
        "message": message,
        "data": None
    }