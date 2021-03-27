interface TextProps {
  text: string;
  variant: "h1" | undefined;
}

const Text = (props: TextProps) => {
  if (props.variant === "h1") {
    return (
      <h1 className="text-2xl font-semibold tracking-wide mb-5 text-purple-900">
        {props.text}
      </h1>
    );
  }
  return null;
};

export default Text;
