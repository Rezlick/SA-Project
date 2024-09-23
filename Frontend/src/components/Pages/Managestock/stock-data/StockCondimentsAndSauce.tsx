import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";


export default function StockCondimentsAndSauce() {
  const condimentsAndSauceData = useStockData(5);
  return (
    <StockCategory
      categoryTitle="เครื่องปรุงรสและน้ำจิ้ม (Condiments and Sauce)"
      initialData={condimentsAndSauceData}
      categoryID = {5}
      path = {"CondimentsAndSauce"}
    />
  );
}
