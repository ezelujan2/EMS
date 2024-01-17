import Link from 'next/link'
import Image from 'next/image';
import logo from '@/public/images/logo.jpg'

export default function Logo() {
  return (
    <Link href="/">
      
        <Image src={logo} alt="logo" className='w-16 h-16 m-5 border rounded-full'/>
      
    </Link>
  )
}