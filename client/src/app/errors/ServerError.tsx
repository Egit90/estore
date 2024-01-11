import { useLocation } from "react-router-dom";

const ServerError = () => {
  const { state } = useLocation();

  return (
    <div className="artboard artboard-horizontal ">
      {state?.error ? (
        <>
          <h2 className="text-error">{state.error.title}</h2>{" "}
          <p>{state.error.detail || "Internal Server Error"}</p>
        </>
      ) : (
        <p>Server Error</p>
      )}
    </div>
  );
};

export default ServerError;
