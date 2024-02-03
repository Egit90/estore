import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  className?: string;
}
const AppTextInput = (props: Props) => {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });

  return (
    <>
      <input {...props} placeholder={props.label} {...field} className={`${props.className} ${fieldState.error ? "border border-amber-700" : ""}`}></input>
      {fieldState.error?.message && <p className="text-red-400">{fieldState.error?.message}</p>}
    </>
  );
};

export default AppTextInput;
