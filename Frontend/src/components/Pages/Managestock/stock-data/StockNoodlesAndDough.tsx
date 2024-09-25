import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";

export default function StockNoodlesAndDough() {
  const id = 4;
  const noodlesAndDoughData = useStockData(id);
  return (
    <StockCategory
      categoryTitle="เส้นและแป้ง"
      initialData={noodlesAndDoughData}
      categoryID = {id}
      path = {"NoodlesAndDough"}
    />
  );
}
