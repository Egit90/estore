import { Link, useLocation, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { useLoginMutation } from "../../app/services/auth";
import { useEffect } from "react";
import { QueryStatus } from "@reduxjs/toolkit/query";

const Login = () => {
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onTouched",
  });

  const navigate = useNavigate();

  const [login, { status }] = useLoginMutation();

  const submitForm = async (data: FieldValues) => {
    await login(data);
  };

  useEffect(() => {
    if (status === QueryStatus.fulfilled) navigate(location.state?.form || "/catalog");
  }, [status, location.state?.form, navigate]);

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-base-300 rounded-md shadow-md lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-purple-700">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
          <div>
            <label className="label">
              <span className="text-base label-text">User Name</span>
            </label>
            <input
              type="text"
              placeholder="User Name"
              className={`w-full input  input-primary input-bordered ${errors.userName ? "input-error" : ""}`}
              {...register("userName", { required: "UserName Is Required" })}
            />
            {errors.userName && <span className="text-sm text-red-400">{errors.userName.message as string}</span>}
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full input input-bordered input-primary ${errors.password ? "input-error" : ""}`}
              {...register("password", { required: "Password Is Required" })}
            />
            {errors.password && <span className="text-sm text-red-400">{errors.password.message as string}</span>}
          </div>
          <div className="flex justify-between">
            <button className="btn btn-primary" type="submit" disabled={!isValid}>
              {isSubmitting ? <span className="loading loading-spinner loading-md"> </span> : "Login"}
            </button>
            <Link to={"/register"} className="btn btn-primary">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
