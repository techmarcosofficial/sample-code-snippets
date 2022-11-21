import React from "react";
import Link from "next/link";

export default function Index({ items }: any) {
  return (
    <>
      <nav className="container">
        <ol className="list-reset py-4 rounded flex bg-grey-light text-grey breads">
          <li className="px-2">
            <Link href="/">
              <a className="text-blueGray-500 no-underline text-indigo">Home</a>
            </Link>
          </li>
          <li className="text-blueGray-500">/</li>
          {items.length === 1 && <li className="text-blueGray-500">&nbsp;&nbsp;{items[0].label}</li>}
          {items.length > 1 && items.map(({ path, label }: any, i: number) => {
            return (
              path ? (
                <React.Fragment key={i}>
                  <li className="px-2">
                    <Link href={path}>
                      <a className="text-blueGray-500 no-underline text-indigo">{label}</a>
                    </Link>
                  </li>
                  {items.length - 1 !== i && <li className="text-blueGray-500">/</li>}
                </React.Fragment>
              ) : <React.Fragment key={i}>
              <li className="px-2 text-blueGray-500  no-underline text-indigo">{label}</li>
                {items.length - 1 !== i && <li>/</li>}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
