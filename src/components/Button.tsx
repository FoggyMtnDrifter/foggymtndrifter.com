import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-zinc-800 text-white hover:bg-zinc-700 focus-visible:outline-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-zinc-100":
            variant === "primary",
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus-visible:outline-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:outline-zinc-100":
            variant === "secondary",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
