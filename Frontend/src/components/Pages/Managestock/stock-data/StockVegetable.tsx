import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";
export default function StockVegetable() {
  const id = 2;
  const VegetableData = useStockData(id);
  return (
    <StockCategory
      categoryTitle="ผัก"
      initialData={VegetableData}
      categoryID = {id}
      path = {"Vegetable"}
    />
  );
}
