import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageCompteSuspendu() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-6 h-6 text-destructive" />
        </div>
        <h1 className="font-display text-2xl font-medium">Compte suspendu</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Votre compte a été temporairement suspendu par l&apos;administrateur.
          Contactez-le pour plus d&apos;informations.
        </p>
        <Link href="/connexion" className="mt-6 inline-flex">
          <Button>Retour à la connexion</Button>
        </Link>
      </div>
    </div>
  );
}