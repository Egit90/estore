import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetProductFiltersQuery } from "../../app/api/agent";
import { useDispatch } from "react-redux";
import { FilterState, resetPageNumber, setOrRemoveBrands, setOrRemoveTypes, setSearchTerm, setSort } from "./filterSloce";
import { useAppSelector } from "../../app/store/configureStore";
import { useDebounce } from "../../app/util/debounce";

const Filter = () => {
  const { data, error } = useGetProductFiltersQuery();
  if (error) {
    toast.error(`Error Getting the filters ${"data" in error && error.data}`);
  }

  return (
    <div className="block mx-auto w-full gap-1  p-1 ">
      <Search />
      <div className="h-2"></div>
      <Sort />
      <div className="h-2"></div>

      {data?.brands && <FilterByList title={"Brands"} myList={data.brands} />}

      <div className="h-2"></div>
      {data?.types && <FilterByList title={"Types"} myList={data?.types} />}
      <div className="h-2"></div>
    </div>
  );
};

const Sort = () => {
  const [isCollapsed, setIsCollapsed] = useState("collapse-open");
  const dispatch = useDispatch();
  const { sort } = useAppSelector((e) => e.filter);

  const handleToggle = () => {
    setIsCollapsed((prev) => (prev === "collapse-close" ? "collapse-open" : "collapse-close"));
  };

  const handleChange = (input: FilterState["sort"]) => {
    dispatch(resetPageNumber());
    dispatch(setSort(input));
  };

  return (
    <div tabIndex={0} className={`collapse collapse-arrow border border-base-300 bg-base-200 cursor-pointer ${isCollapsed} border border-primary`}>
      <div onClick={handleToggle} className={`collapse-title text-lg font-medium`}>
        Sort
      </div>
      <div className="collapse-content ">
        <div className="form-control ">
          <label className="label cursor-pointer">
            <span className="label-text">A-Z</span>
            <input type="radio" name="radio-10" className="radio checked:bg-red-500" onChange={() => handleChange("")} checked={sort === ""} />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Price - High to low</span>
            <input type="radio" name="radio-10" className="radio checked:bg-blue-500" onChange={() => handleChange("PriceDesc")} checked={sort === "PriceDesc"} />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text">Price - low to high</span>
            <input type="radio" name="radio-10" className="radio checked:bg-blue-500" onChange={() => handleChange("Price")} checked={sort === "Price"} />
          </label>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const { debounceValue, isLoading } = useDebounce(search, 1000);

  useEffect(() => {
    dispatch(setSearchTerm(debounceValue));
    dispatch(resetPageNumber());
  }, [dispatch, debounceValue]);

  return (
    <div className="relative rounded-sm">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
      <div className="relative">
        <input
          type="search"
          id="default-search"
          className="bg-base-200 selection:block p-4 ps-1 text-sm border w-full rounded-lg border-primary focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Products"
          required
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading && <span className="loading loading-spinner loading-xs absolute top-1/2 -translate-y-1/2 right-4"></span>}
      </div>
    </div>
  );
};

const FilterByList = ({ myList, title }: { myList: string[]; title: "Brands" | "Types" }) => {
  const [isCollapsed, setIsCollapsed] = useState("collapse-open");
  const dispatch = useDispatch();
  const { brands, types } = useAppSelector((e) => e.filter);

  const handleToggle = () => {
    setIsCollapsed((prev) => (prev === "collapse-close" ? "collapse-open" : "collapse-close"));
  };

  const AddToState = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(resetPageNumber());
    if (title === "Brands") {
      dispatch(setOrRemoveBrands(e.target.value));
      return;
    }
    dispatch(setOrRemoveTypes(e.target.value));
  };

  const isChecked = (i: string) => {
    if (title === "Brands") {
      return brands.includes(i);
    }
    return types.includes(i);
  };

  return (
    <div tabIndex={0} className={`collapse collapse-arrow border border-base-300 bg-base-200 cursor-pointer ${isCollapsed} border border-primary`}>
      <div onClick={handleToggle} className={`collapse-title text-lg font-medium`}>
        Filter {title}
      </div>
      <div className="collapse-content ">
        {myList.map((e, i) => (
          <label key={i} className="cursor-pointer label">
            <span className="label-text">{e}</span>
            <input
              type="checkbox"
              name={e}
              value={e}
              onChange={(e) => {
                AddToState(e);
              }}
              checked={isChecked(e)}
              className="checkbox checkbox-error"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default Filter;
