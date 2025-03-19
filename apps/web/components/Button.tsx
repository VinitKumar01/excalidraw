"use client";

interface ButtonProps {
  className?: string;
  value: string;
  formAction?: (formData: FormData) => void;
}

export const Button = ({ className, value, formAction }: ButtonProps) => {
  return (
    <button
      formAction={formAction}
      className={
        className ||
        "rounded p-2 m-2 w-full cursor-pointer max-w-[350px] bg-purple-500 font-bold text-white"
      }
    >
      {value}
    </button>
  );
};
