import NextLink from "next/link";

interface LinkProps {
  href?: string;
  color?: string;
  text: string;
  className?: string;
  onClick?(): void;
}

export default function Link(props: LinkProps) {
  if (props.onClick) {
    return (
      <a
        className={`text-${
          props.color ?? "bg-purple-600"
        } no-underline font-semibold cursor-pointer ${props.className}`}
        onClick={props.onClick}
      >
        {props.text}
      </a>
    );
  }
  return (
    <NextLink href={props.href} passHref>
      <a
        className={`text-${
          props.color ?? "bg-purple-600"
        } no-underline font-semibold ${props.className}`}
      >
        {props.text}
      </a>
    </NextLink>
  );
}
