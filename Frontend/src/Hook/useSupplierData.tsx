import { useEffect, useState } from "react";
import { GetDataSupplier } from "../services/https/index";

export default function useSupplierData() {
  const [suppliers, setSuppliers] = useState<any[]>([]); // กำหนดประเภทเป็น any[]

  useEffect(() => {
    // ดึงข้อมูล Supplier
    GetDataSupplier()
      .then((res) => {
        if (res && res.data && Array.isArray(res.data.data)) {
          const supplierData = transformSupplierData(res.data.data); // เข้าถึง res.data.data ซึ่งเป็นอาร์เรย์
          setSuppliers(supplierData);
        } else {
          console.error("Supplier data is not in expected format", res.data);
          setSuppliers([]); // กำหนดค่าเป็นอาร์เรย์ว่างในกรณีที่ข้อมูลไม่ถูกต้อง
        }
      })
      .catch((error) => {
        console.error("Error fetching supplier data:", error);
        setSuppliers([]); // กำหนดค่าเป็นอาร์เรย์ว่างเมื่อมีข้อผิดพลาด
      });
  }, []);

  return suppliers;
}

function transformSupplierData(data: any[]) {
  return data.map((item, index) => ({
    key: index,                  
    name: item.supplier_name || 'N/A', // ชื่อซัพพลายเออร์
    phone: item.phone || 'N/A',        // เบอร์โทร
    email: item.email || 'N/A',        // อีเมล
    address: item.address || 'N/A',    // ที่อยู่
  }));
}

