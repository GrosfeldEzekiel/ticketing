import Spinner from "../Spinner";

interface ButtonProps {
  text: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button = (props: ButtonProps) => {
  return (
    <button
      className={`m-auto py-2 px-3 flex-row flex self-center bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition duration-500 transform hover:scale-105 focus:outline-none disabled:opacity-50 ${props.className}`}
      disabled={props.disabled}
    >
      {props.loading && <Spinner />}
      {props.text}
    </button>
  );
};

export default Button;
