import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href={'/'} className="flex gap-1">
     <div className="">
<Image src="/zlogo.png" width={80} height={80} ></Image>
     </div>
      <span className=" mt-5">
          تصفیه آب زمزم
        </span>
    </Link>
  );
}