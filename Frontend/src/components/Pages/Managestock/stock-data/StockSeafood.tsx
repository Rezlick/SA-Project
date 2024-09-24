import StockCategory from "../Category/StockCategory/StockCategory";
import useStockData from "../../../..//Hook/useStockData";
export default function StockSeafood() {
  const id = 3;
  const SeafoodData = useStockData(id);
  return (
    <StockCategory
      categoryTitle="อาหารทะเล"
      initialData={SeafoodData}
      categoryID = {id}
      path = {"Seafood"}
    />
  );
}
