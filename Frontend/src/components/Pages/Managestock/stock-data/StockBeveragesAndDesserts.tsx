import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";
//import useSupplierData from '../../Hook/useSupplierData';

export default function StockBeveragesAndDesserts() {
  const id = 6;
  const beveragesAndDessertsData = useStockData(id); // ดึงข้อมูล Stock ด้วย categoryID = 6
  //const SupplierData = useSupplierData(); // ดึงข้อมูล Supplier
  console.log("beveragesAndDessertsData : ",beveragesAndDessertsData);
  
  return (
    <StockCategory
      categoryTitle="เครื่องดื่มและขนมหวาน (Beverages and Desserts)"
      initialData={beveragesAndDessertsData}
      categoryID = {id}
      path = {"BeveragesAndDesserts"}
    />
  );
}