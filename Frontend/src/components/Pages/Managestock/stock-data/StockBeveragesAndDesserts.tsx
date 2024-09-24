import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";


export default function StockBeveragesAndDesserts() {
  const id = 6;
  const beveragesAndDessertsData = useStockData(id); 

  
  
  return (
    <StockCategory
      categoryTitle="เครื่องดื่มและขนมหวาน "
      initialData={beveragesAndDessertsData}
      categoryID = {id}
      path = {"BeveragesAndDesserts"}
    />
  );
}