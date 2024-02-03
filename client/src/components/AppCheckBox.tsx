import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  className?: string;
}
const AppCheckBox = (props: Props) => {
  const { field } = useController({ ...props, defaultValue: false });

  return (
    <label className="flex items-center text-sm group text-heading">
      <input {...props} {...field} type="checkbox" className="w-5 h-5 border border-gray-300 rounded focus:outline-none focus:ring-1" />
      <span className="ml-2">{props.label}</span>
    </label>
  );
};

export default AppCheckBox;
