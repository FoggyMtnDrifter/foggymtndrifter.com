import clsx from "clsx";
import { forwardRef } from "react";

interface ProseProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
}

export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={clsx(className, "prose dark:prose-invert")}
      {...props}
    />
  );
});
