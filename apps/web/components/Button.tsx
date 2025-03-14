"use client";

interface ButtonProps {
  className?: string;
  value: string;
}

export const Button = ({ className, value }: ButtonProps) => {
  return (
    <button className={className || "rounded p-2 m-2 w-full cursor-pointer max-w-[350px] bg-purple-500 font-bold text-white"}>{value}</button>
  );
};
