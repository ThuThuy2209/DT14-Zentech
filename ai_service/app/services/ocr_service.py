import io

ocr_engine = None


def get_ocr_engine():
    global ocr_engine
    if ocr_engine is None:
        try:
            from paddleocr import PaddleOCR
            ocr_engine = PaddleOCR(use_angle_cls=True, lang="vi")
        except ImportError:
            raise RuntimeError(
                "Thư viện 'paddleocr' chưa được cài đặt. Hãy chạy: pip install paddleocr paddlepaddle"
            )
    return ocr_engine


def parse_image_to_text(file_bytes: bytes) -> str:
    """
    Sử dụng PaddleOCR nhận diện văn bản tiếng Việt từ ảnh chụp/scan.
    """
    engine = get_ocr_engine()

    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        raise RuntimeError("Cần cài đặt 'pillow' và 'numpy' để xử lý ảnh.")

    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    image_np = np.array(image)

    result = engine.ocr(image_np, cls=True)
    extracted_text = []

    if result and result[0]:
        for line in result[0]:
            extracted_text.append(line[1][0])

    return "\n".join(extracted_text).strip()
