import io
import pdfplumber

def parse_pdf_to_text(file_bytes: bytes) -> str:
    extracted_text = ""
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"
    return extracted_text.strip()