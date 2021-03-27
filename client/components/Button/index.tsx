interface ButtonProps {
  text: string;
}

const Button = (props: ButtonProps) => {
  return (
    <button className="mx-3 my-4 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-md transition duration-500 transform hover:scale-105 focus:outline-none">
      {props.text}
    </button>
  );
};

export default Button;
