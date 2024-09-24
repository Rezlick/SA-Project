import { useEffect, useState } from "react";
import { GetStock } from "../services/https/index";

export default function useStockData(categoryID: number) {
  const [stockData, setStockData] = useState<any[]>([]); // ตั้งค่าเป็นอาร์เรย์

  useEffect(() => {
    // ดึงข้อมูล Stock ตาม categoryID ที่ส่งมา
    GetStock(categoryID)
      .then((res) => {
        if (res && res.data) {
          const data = res.data.data; // เข้าถึงข้อมูลที่เป็นอาร์เรย์
          console.log("API Response:", data);
          if (Array.isArray(data)) { // ตรวจสอบว่าข้อมูลเป็นอาร์เรย์
            const transformedData = transformStockData(data);
            console.log("Transformed Data:", transformedData);
            setStockData(transformedData);
          } else {
            console.error("API Response Error: Data is not an array", data);
            setStockData([]); // กำหนดค่าเป็นอาร์เรย์ว่าง
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching stock data:", error);
        setStockData([]); // กำหนดค่าเป็นอาร์เรย์ว่างเมื่อมีข้อผิดพลาด
      });
  }, [categoryID]); // ดึงข้อมูลใหม่เมื่อ categoryID เปลี่ยน

  return stockData;
}

function transformStockData(data: any[]) {
  return data.map((item: any, index: number) => ({
    key: index + 1,
    stock: item.stock_id, // ใช้ stock_id เป็น key
    code: item.product_code_id || '', // รหัสสินค้า
    name: item.product_name || '', // ชื่อสินค้า
    quantity: item.quantity ? String(item.quantity) : 'N/A', // จำนวนในสต็อก
    price: item.price ? String(item.price) : 'N/A', // ราคา
    supplier: item.supplier_name || 'N/A', // ชื่อผู้จัดส่ง
    importDate: item.date_in ? formatDate(item.date_in) : 'N/A', // วันที่นำเข้า
    expiryDate: item.expiration_date ? formatDate(item.expiration_date) : 'N/A', // วันหมดอายุ
  }));
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false, // ใช้เวลาแบบ 24 ชั่วโมง
  });
}