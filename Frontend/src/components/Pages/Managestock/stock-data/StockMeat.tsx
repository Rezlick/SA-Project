import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";

export default function StockMeat() {
  const id = 1;

  const meatData = useStockData(id);

  return (
    <StockCategory
      categoryTitle="เนื้อสัตว์ "
      initialData={meatData}
      categoryID = {id}
      path = {"Meat"}
    />
  );
}
