const ProductCardSkeleton = ({ count }: { count: number }) => {
  return Array(count)
    .fill(0)
    .map((_, i) => (
      <div className="card card-compact w-80 bg-base-100 shadow-xl" key={i}>
        <div className="skeleton h-72 w-full"></div>
        <div className="card-body">
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-20"></div>
          <div>
            <div className="skeleton h-4 w-20"></div>
          </div>
          <div className="card-actions justify-between">
            <div className="skeleton h-4 w-20"></div>
          </div>
        </div>
      </div>
    ));
};

export default ProductCardSkeleton;
