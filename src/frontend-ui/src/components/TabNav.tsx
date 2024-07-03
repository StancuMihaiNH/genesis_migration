import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

export type TabNavLink = {
  title: string;
  href: string;
};
const TabNav: React.FC<{
  links: TabNavLink[];
}> = ({ links }) => {
  const pathname = usePathname();
  return (
    <div className={"flex gap-2"}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          className={classNames("px-4 py-2 cursor-pointer", {
            "border-b-2 border-[#132e53]": pathname === link.href,
          })}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

export default TabNav;
