import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";

export default function StockSeafood() {
  const SeafoodData = useStockData(3);
  return (
    <StockCategory
      categoryTitle="อาหารทะเล (Seafood)"
      initialData={SeafoodData}
      categoryID = {3}
      path = {"Seafood"}
    />
  );
}
