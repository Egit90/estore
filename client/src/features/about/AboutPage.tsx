import { useState } from "react";
import { useLazyGet400ErrorQuery, useLazyGet401ErrorQuery, useLazyGet404ErrorQuery, useLazyGet500ErrorQuery, useLazyGetValidationErrorQuery } from "../../app/api/errorApi";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [get400Error] = useLazyGet400ErrorQuery();
  const [get404Error] = useLazyGet404ErrorQuery();
  const [get401Error] = useLazyGet401ErrorQuery();
  const [get500Error] = useLazyGet500ErrorQuery();
  const [getValidationError] = useLazyGetValidationErrorQuery();

  const error400 = async () => {
    try {
      await get400Error();
    } catch (error) {
      console.log(error);
    }
  };
  const error404 = async () => {
    try {
      await get404Error();
    } catch (error) {
      console.log(error);
    }
  };

  const error401 = async () => {
    try {
      await get401Error();
    } catch (error) {
      console.log(error);
    }
  };

  const error500 = async () => {
    try {
      await get500Error();
    } catch (error) {
      console.log(error);
    }
  };
  const errorValidation = async () => {
    try {
      await getValidationError();
    } catch (error) {
      if (Array.isArray(error) && error.every((e) => typeof e === "string")) setValidationErrors(error);
    }
  };

  return (
    <div className="flex flex-row justify-evenly gap-3 flex-wrap">
      <button className="btn btn-primary" onClick={error400}>
        test 400 Error
      </button>
      <button className="btn btn-primary" onClick={error401}>
        test 401 Error
      </button>
      <button className="btn btn-primary" onClick={error404}>
        test 404 Error
      </button>
      <button className="btn btn-primary" onClick={error500}>
        test 500 Error
      </button>
      <button className="btn btn-primary" onClick={errorValidation}>
        getValidationError
      </button>
      {validationErrors.length > 0 && validationErrors.map((e, i) => <p key={i}>{e}</p>)}
    </div>
  );
};

export default AboutPage;
