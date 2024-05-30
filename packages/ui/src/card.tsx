import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className='border border-sky-200 p-4'>
      <h1 className='text-xl border-b border-sky-200 pb-2'>{title}</h1>
      <div>{children}</div>
    </div>
  );
}
