"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, Users, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const LIENS = [
  { href: "/admin", label: "Vue d'ensemble", icone: LayoutDashboard },
  { href: "/admin/demandes", label: "Demandes Premium", icone: Clock },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icone: Users },
  { href: "/admin/statistiques", label: "Statistiques", icone: BarChart3 },
];

export function NavAdmin() {
  const pathname = usePathname();

  return (
    <nav className="md:w-56 shrink-0">
      <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {LIENS.map((lien) => {
          const actif = pathname === lien.href;
          const Icone = lien.icone;

          return (
            <li key={lien.href} className="shrink-0">
              <Link
                href={lien.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors",
                  actif
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icone className="w-4 h-4" />
                {lien.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}