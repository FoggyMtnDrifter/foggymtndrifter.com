"use client";

import { useModal } from "@/components/ModalContext";
import clsx from "clsx";
import { useEffect, useState } from "react";

function CoffeeIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="currentColor" />
      <path
        d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
        stroke="currentColor"
      />
      <path d="M6 1v3" stroke="currentColor" />
      <path d="M10 1v3" stroke="currentColor" />
      <path d="M14 1v3" stroke="currentColor" />
    </svg>
  );
}

export function TipButton() {
  const [isMounted, setIsMounted] = useState(false);

  // Always call useModal hook - but handle gracefully if not available
  let modal;
  try {
    modal = useModal();
  } catch (error) {
    // Modal context not available during SSR - this is expected
    modal = null;
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Track tip button click
    if (typeof window !== "undefined" && (window as any).rybbit) {
      (window as any).rybbit.event("tip_button_click", {
        location: window.location.pathname,
      });
    }

    // Try to open modal if available, otherwise fallback to hash navigation
    if (isMounted && modal?.openTipModal) {
      modal.openTipModal();
    } else {
      // Fallback - navigate to hash which should open modal
      if (typeof window !== "undefined") {
        window.location.hash = "tipme";
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "group inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:transition-none",
        "bg-violet-600 text-white hover:bg-violet-700 focus-visible:outline-violet-600 active:bg-violet-700 active:text-white/80",
        "dark:bg-violet-400 dark:text-zinc-900 dark:hover:bg-violet-300 dark:focus-visible:outline-violet-400 dark:active:bg-violet-300 dark:active:text-zinc-900/80"
      )}
    >
      Tip Me
      <CoffeeIcon className="h-4 w-4 stroke-white dark:stroke-zinc-900" />
    </button>
  );
}
