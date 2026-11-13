from typing import List, Optional
from pydantic import BaseModel, Field


class InvoiceItemSchema(BaseModel):
    name: str = Field(description="Tên hàng hóa, dịch vụ")
    unit: Optional[str] = Field(default="", description="Đơn vị tính (nếu có)")
    quantity: Optional[float] = Field(default=1.0, description="Số lượng")
    unit_price: Optional[float] = Field(default=0.0, description="Đơn giá")
    total_price: Optional[float] = Field(default=0.0, description="Thành tiền chưa thuế của mặt hàng")


class InvoiceExtractSchema(BaseModel):
    supplier_tax_id: str = Field(default="", description="Mã số thuế bên bán / nhà cung cấp")
    supplier_name: str = Field(default="", description="Tên đơn vị bán hàng / nhà cung cấp")
    buyer_tax_id: str = Field(default="", description="Mã số thuế bên mua")
    buyer_name: str = Field(default="", description="Tên đơn vị mua hàng")
    invoice_number: str = Field(default="", description="Số hóa đơn")
    invoice_date: str = Field(default="", description="Ngày lập hóa đơn (định dạng YYYY-MM-DD)")
    subtotal: float = Field(default=0.0, description="Cộng tiền hàng (chưa thuế)")
    vat_amount: float = Field(default=0.0, description="Tiền thuế GTGT")
    total_amount: float = Field(default=0.0, description="Tổng cộng tiền thanh toán")
    items: List[InvoiceItemSchema] = Field(
        default=[], description="Danh sách chi tiết hàng hóa, dịch vụ"
    )
    suggested_account: str = Field(
        default="642",
        description="Mã tài khoản kế toán chi phí gợi ý theo Thông tư 133/2016/TT-BTC (ví dụ: 642, 153, 152, 242...)",
    )
    accounting_reason: str = Field(
        default="",
        description="Giải thích lý do gợi ý định khoản tài khoản kế toán theo quy định Thông tư 133/2016/TT-BTC",
    )
    flags: List[str] = Field(
        default=[],
        description="Danh sách cảnh báo bất thường: WARNING_DUPLICATE, ERROR_WRONG_TAX_ID, WARNING_CALCULATION_MISMATCH",
    )