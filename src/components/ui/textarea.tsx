import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-base focus:border-green-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      {...props}
    />
  );
}
