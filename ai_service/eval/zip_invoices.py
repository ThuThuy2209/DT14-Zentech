import os, zipfile, pathlib, sys
src = pathlib.Path(r'C:\Users\Yen Vy\OneDrive\Tài liệu\DT14-app\DT14-Zentech\ai_service\eval\invoices_1500')
zip_path = pathlib.Path(r'C:\Users\Yen Vy\OneDrive\Tài liệu\DT14-app\DT14-Zentech\ai_service\eval\invoices_1500.zip')
if zip_path.exists():
    zip_path.unlink()
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk(src):
        for f in files:
            full_path = pathlib.Path(root) / f
            # store relative path inside zip (keep folder name invoices_1500)
            arcname = full_path.relative_to(src.parent)
            zf.write(full_path, arcname)
print('ZIP created at', zip_path)
