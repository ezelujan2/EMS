import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <img
        src="/images/logo-image.png"
        alt="logo"
        className="w-16 h-16 md:w-24 md:h-24 m-5  rounded-full"
      />
    </Link>
  );
}
