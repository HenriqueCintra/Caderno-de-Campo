import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-12 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 text-base focus:border-green-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
