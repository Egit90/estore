import { ReactNode } from "react";
import { useAppSelector } from "../store/configureStore";

const MaxWidthWrapper = ({ children }: { clasName?: string; children: ReactNode }) => {
  const { isDark } = useAppSelector((e) => e.theme);

  return (
    <div
      className={`min-h-screen mx-auto w-full max-w-screen-3xl px-2.5 md:px-20 ${
        isDark ? "bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600" : "bg-gradient-to-r from-indigo-500 to-blue-500"
      }`}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
