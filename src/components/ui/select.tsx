import { cn } from "@/lib/utils";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-zinc-200 bg-white px-4 text-base focus:border-green-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
