import { useEffect, useState } from "react";
import { GetSupplierName } from "../services/https/index";

export default function useSupplierName(){
    const [suppliersName, setSupplierName] = useState<any[]>([]);

    useEffect(() => {
        // ดึงข้อมูล Stock ตาม categoryID ที่ส่งมา
        GetSupplierName()
          .then((res) => {
            if (res && res.data) {
              const data = res.data.data; // เข้าถึงข้อมูลที่เป็นอาร์เรย์
              console.log("API Response:", data);
              if (Array.isArray(data)) { // ตรวจสอบว่าข้อมูลเป็นอาร์เรย์
    
                setSupplierName(data);
              } else {
                console.error("API Response Error: Data is not an array", data);
                setSupplierName([]); // กำหนดค่าเป็นอาร์เรย์ว่าง
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching supplier data:", error);
            setSupplierName([]); // กำหนดค่าเป็นอาร์เรย์ว่างเมื่อมีข้อผิดพลาด
          });
      }, []); // ดึงข้อมูลใหม่เมื่อ categoryID เปลี่ยน
     
      
      return suppliersName;

}

