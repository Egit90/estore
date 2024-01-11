import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center flex-col items-center mt-20 prose">
      <h1>Not Found</h1>
      <Link to="/catalog" className="btn btn-primary rounded-lg w-20">
        Shop
      </Link>
    </div>
  );
};

export default NotFound;
