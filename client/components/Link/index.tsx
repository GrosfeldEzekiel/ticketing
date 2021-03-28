import NextLink from "next/link";

interface LinkProps {
  href: string;
  color?: string;
  text: string;
  className?: string;
}

export default function Link(props) {
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
