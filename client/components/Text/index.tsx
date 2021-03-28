interface TextProps {
  text: string;
  variant: "h1" | undefined;
  color?: string;
  marginBottom?: number;
  className?: string;
}

const Text = (props: TextProps) => {
  if (props.variant === "h1") {
    return (
      <h1
        className={`text-2xl font-semibold tracking-wide mb-${
          props.marginBottom ?? "0"
        } text-${props.color ?? "purple-900"} ${props.className}`}
      >
        {props.text}
      </h1>
    );
  }
  return null;
};

export default Text;
