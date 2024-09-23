export interface StockInterface {
    stock_id: number;
    category_id: number;      // รหัสประเภท
    product_code_id: string;   // รหัสสินค้า
    product_name: string;     // ชื่อสินค้า
    quantity: number;        // จำนวนสินค้า
    price: number;           // ราคา
    date_in: string;          // วันที่นำเข้า
    expiration_date: string;  // วันหมดอายุ
    supplier_id: number;      // รหัสผู้จัดจำหน่าย
    employee_id: number;      // รหัสพนักงาน
  }