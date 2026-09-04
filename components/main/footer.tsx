import Link from "next/link";

import { FOOTER_DATA } from "@/constants";

export const Footer = () => {
  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg px-4 py-8 sm:p-[15px]">
      <div className="w-full flex flex-col items-center justify-center m-auto">
        <div className="w-full h-full flex flex-row items-start justify-center sm:justify-around flex-wrap gap-8 sm:gap-4">
          {FOOTER_DATA.map((column) => (
            <div
              key={column.title}
              className="min-w-[160px] h-auto flex flex-col items-center justify-start"
            >
              <h3 className="font-bold text-[16px]">{column.title}</h3>
              {column.data.map(({ icon: Icon, name, link }) => (
                <Link
                  key={`${column.title}-${name}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-row items-center my-[15px] cursor-pointer hover:text-[var(--accent-solid)] transition"
                >
                  {Icon && <Icon />}
                  <span className="text-[15px] ml-[6px]">{name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 mb-[20px] text-sm sm:text-[15px] text-center px-4">
          &copy; Haroun Bayoudh {new Date().getFullYear()} Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};
