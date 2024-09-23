import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";




export default function StockMeat() {
  const meatData = useStockData(1);
  return (
    <StockCategory
      categoryTitle="เนื้อสัตว์ (Meats)"
      initialData={meatData}
      categoryID = {1}
      path = {"Meat"}
    />
  );
}
