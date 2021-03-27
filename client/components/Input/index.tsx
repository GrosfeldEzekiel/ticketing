import { ChangeEvent } from "react";

interface InputProps {
  type: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const Input = (props: InputProps) => {
  return (
    <div className="p-3">
      <input
        className="w-full rounded p-2 text-center focus:outline-none font-semibold text-gray-700 shadow-md"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default Input;
