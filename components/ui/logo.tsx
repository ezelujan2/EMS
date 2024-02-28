import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";

export default function Logo() {
  return (
    <Link href="/">
      <img
        src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1706960695/logo_j5zufy_kenlzd.png"
        alt="logo"
        className="w-14 h-14 md:w-24 md:h-24 m-5  rounded-full"
      />
    </Link>
  );
}
