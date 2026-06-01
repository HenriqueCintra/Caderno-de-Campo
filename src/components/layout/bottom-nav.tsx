"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  CloudSun,
  Grid3X3,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início", icon: Grid3X3 },
  { href: "/parcelas", label: "Parcelas", icon: MapPin },
  { href: "/registros", label: "Registros", icon: ClipboardList },
  { href: "/clima", label: "Clima", icon: CloudSun },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-green-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-green-900 dark:bg-zinc-950/95">
      <ul className="mx-auto flex max-w-lg justify-around">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex min-h-[56px] min-w-[56px] flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs",
                  active
                    ? "text-green-700 font-semibold"
                    : "text-zinc-500"
                )}
              >
                <Icon className="h-6 w-6" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
