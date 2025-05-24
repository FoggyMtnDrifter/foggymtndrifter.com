"use client";

import type { ComponentPropsWithoutRef } from "react";

type AnalyticsLinkProps = {
  href: string;
  eventName: string;
  eventProps?: Record<string, any>;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<"a">;

export function AnalyticsLink({
  href,
  eventName,
  eventProps = {},
  className,
  children,
  ...props
}: AnalyticsLinkProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).rybbit) {
      (window as any).rybbit.event(eventName, {
        location: window.location.pathname,
        href,
        ...eventProps,
      });
    }
  };

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
