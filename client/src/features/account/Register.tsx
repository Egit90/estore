import { useForm } from "react-hook-form";
import { useRegisterNewAccountMutation } from "../../app/services/auth";
import { RegisterDto } from "../../app/models/loginDto";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [registerNewAccount] = useRegisterNewAccountMutation();

  const navigate = useNavigate();
  const submitForm = async (data: RegisterDto) => {
    try {
      await registerNewAccount(data)
        .unwrap()
        .then(() => {
          toast.success("User was registerd Please Login");
          navigate("/login");
        });
    } catch (error) {
      if (Array.isArray(error) && error.every((item) => typeof item === "string")) {
        handleApiError(error as string[]);
      }
    }
  };

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
    setError,
  } = useForm<RegisterDto>({
    mode: "onTouched",
  });

  const handleApiError = (error: string[]) => {
    error.forEach((e) => {
      if (e.includes("Password")) {
        setError("password", { message: e });
      } else if (e.includes("Email")) {
        setError("email", { message: e });
      } else if (e.includes("Username")) {
        setError("userName", { message: e });
      }
    });
  };

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-base-300 rounded-md shadow-md lg:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-purple-700">Register</h1>
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
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="email"
              className={`w-full input  input-primary input-bordered ${errors.userName ? "input-error" : ""}`}
              {...register("email", { required: "Email Is Required", pattern: { value: /^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/, message: "Not a valid Email Address" } })}
            />
            {errors.email && <span className="text-sm text-red-400">{errors.email.message as string}</span>}
          </div>

          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={`w-full input input-bordered input-primary ${errors.password ? "input-error" : ""}`}
              {...register("password", {
                required: "Password Is Required",
                pattern: {
                  value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                  message: "Password Does Not meet the Complexity Requirements ",
                },
              })}
            />
            {errors.password && <span className="text-sm text-red-400">{errors.password.message as string}</span>}
          </div>
          <div className="flex justify-between">
            <button className="btn btn-primary" type="submit" disabled={!isValid}>
              {isSubmitting ? <span className="loading loading-spinner loading-md"> </span> : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
