import { MetaData } from "../app/models/pagination";

interface Props {
  metaData: MetaData | undefined;
  onClick: (e: number) => void;
}

const Pagination = ({ metaData, onClick }: Props) => {
  return (
    <div>
      {Array.from({ length: metaData?.totalPages || 0 }, (_, index) => (
        <button key={index + 1} className={`join-item btn ${metaData?.currentPage === index + 1 ? "btn-active" : ""}`} onClick={() => onClick(index + 1)}>
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
