import { useEffect, useState } from "react";
import { GetProductByCodeID } from "../services/https/index";

export default function useGetProductByCodeID(Product_code_id: string) {
  const [dataApi, setDataApi] = useState("");

  useEffect(() => {
    if (Product_code_id) {  
      GetProductByCodeID(Product_code_id)
        .then((res) => {
          if (res && res.data) {
            const data = res.data;
            console.log("API Response:", data);
            setDataApi(data);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }
  }, [Product_code_id]);

  return dataApi;
}
