import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";



export default function StockVegetable() {
  const VegetableData = useStockData(2);
  return (
    <StockCategory
      categoryTitle="ผัก (Vegetables)"
      initialData={VegetableData}
      categoryID = {2}
      path = {"Vegetable"}
    />
  );
}
