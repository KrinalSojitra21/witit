import Link from "next/link";

type Props = {
  name: string;
  redirectTo: string;
  style?: string;
} & Record<string, any>;

const CustomLink = ({ name, redirectTo, style, ...restProps }: Props) => {
  return (
    <Link
      href={redirectTo}
      className={`leading-6 text-link hover:underline ${style}`}
      {...restProps}
    >
      {name}
    </Link>
  );
};

export default CustomLink;
