import { NavLink } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="mx-auto w-11/12 ">
        <div className="grid grid-cols-1 gap-14 items-center">
          <div className="max-w-xl mx-auto xl:max-w-2xl xl:-mt-8">
            <h1 className="text-3xl xl:text-5xl font-semibold xl:leading-snug 2xl:text-6xl 2xl:leading-snug">
              Get Amazing <span className="text-purple-500">Products</span> for your Business and Home
            </h1>
            <p className="xl:leading-9 text-base xl:text-lg mt-3 mb-10">
              Discover the latest trends, find timeless classics, and indulge in a seamless shopping experience. We curate a diverse collection of high-quality products to meet
              your every need. From fashion-forward apparel to cutting-edge electronics, we have something for everyone.
            </p>
            <NavLink to={"/catalog"} className="bg-purple-500 text-white rounded-lg py-3.5 px-5 tracking-wider text-sm hover:bg-purple-800 shadow-lg inline-block">
              Catalog
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
