"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BoutonDeconnexion() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/connexion" })}
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Déconnexion</span>
    </Button>
  );
}