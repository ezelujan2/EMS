import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.jpg";

export default function Logo() {
  return (
    <Link href="/">
      <img
        src="https://res.cloudinary.com/dmoqzhgjk/image/upload/v1705459523/logo_hdyh51.jpg"
        alt="logo"
        className="w-16 h-16 m-5 border rounded-full"
      />
    </Link>
  );
}
