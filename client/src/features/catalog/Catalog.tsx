import ProductCard from "./ProductCard";
import { generateCatalogParams, useGetCatalogQuery } from "../../app/api/agent";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { toast } from "react-toastify";
import Filter from "./Filter";
import { useAppSelector } from "../../app/store/configureStore";
import Pagination from "../../components/Pagination";
import { useDispatch } from "react-redux";
import { setPageNumber } from "./filterSloce";

function Catalog() {
  const { brands, searchTerm, sort: orderBy, types, metaData } = useAppSelector((e) => e.filter);
  const dispatch = useDispatch();
  const debouncedParams = generateCatalogParams({
    pageNumber: metaData.currentPage,
    pageSize: metaData.pageSize,
    brands,
    types,
    searchTerm,
    orderBy,
  });

  const { data: catalog, error: catalogError, isLoading } = useGetCatalogQuery(debouncedParams);

  if (catalogError) {
    toast.error(`error getting the filters , ${"data" in catalogError && catalogError.data}`);
  }

  return (
    <>
      <div className="grid grid-cols-4">
        <div className="sticky top-0 h-screen">
          <Filter />
        </div>
        <div className="col-span-3 flex flex-row flex-wrap gap-4 justify-center max-h-fit align-middle  items-baseline">
          {isLoading && <ProductCardSkeleton count={20} />}
          {catalog && catalog.items.map((e) => <ProductCard key={e.id} product={e} />)}
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <div className="join mx-auto max-w-full">
          <Pagination metaData={catalog?.metaData} onClick={(n) => dispatch(setPageNumber(n))} />
        </div>
      </div>
    </>
  );
}

export default Catalog;
