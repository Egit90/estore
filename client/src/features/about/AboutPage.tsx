import { useState } from "react";
import agent from "../../app/api/agent";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const error400 = async () => {
    try {
      await agent.TestErrors.get400Error();
    } catch (error) {
      console.log(error);
    }
  };
  const error404 = async () => {
    try {
      await agent.TestErrors.get404Error();
    } catch (error) {
      console.log(error);
    }
  };

  const error401 = async () => {
    try {
      await agent.TestErrors.get401Error();
    } catch (error) {
      console.log(error);
    }
  };

  const error500 = async () => {
    try {
      await agent.TestErrors.get500Error();
    } catch (error) {
      console.log(error);
    }
  };
  const errorValidation = async () => {
    try {
      await agent.TestErrors.getValidationError();
    } catch (error: any) {
      setValidationErrors(error);
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
      {validationErrors.length > 0 &&
        validationErrors.map((e, i) => <p key={i}>{e}</p>)}
    </div>
  );
};

export default AboutPage;
