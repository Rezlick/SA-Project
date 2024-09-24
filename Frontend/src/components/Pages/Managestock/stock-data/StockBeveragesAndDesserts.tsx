import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";
import useGetProductByCodeID from "../../../..//Hook/useGetProductByCodeID";
//import useSupplierData from '../../Hook/useSupplierData';

export default function StockBeveragesAndDesserts() {
  const id = 6;
  const beveragesAndDessertsData = useStockData(id); // ดึงข้อมูล Stock ด้วย categoryID = 6
  //const SupplierData = useSupplierData(); // ดึงข้อมูล Supplier
  console.log("beveragesAndDessertsData : ",beveragesAndDessertsData);
  console.log("useGetProductByCodeID",useGetProductByCodeID("B001"));
  
  
  return (
    <StockCategory
      categoryTitle="เครื่องดื่มและขนมหวาน (Beverages and Desserts)"
      initialData={beveragesAndDessertsData}
      categoryID = {id}
      path = {"BeveragesAndDesserts"}
    />
  );
}