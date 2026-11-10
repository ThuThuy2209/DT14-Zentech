from paddleocr import PaddleOCR


ocr_engine = PaddleOCR(use_angle_cls=True, lang="vi")

def parse_image_to_text(file_bytes: bytes) -> str:
    result = ocr_engine.ocr(file_bytes, cls=True)
    extracted_text = []
    
    if result and result[0]:
        for line in result[0]:
            extracted_text.append(line[1][0])
            
    return "\n".join(extracted_text).strip()