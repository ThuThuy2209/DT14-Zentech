from fastapi import FastAPI

app = FastAPI(title="DT14 - OPC AI Service", version="1.0.0")

@app.get("/")
def root():
    return {"message": "AI Service đang chạy mượt mà!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "OCR & Agent Engine"}