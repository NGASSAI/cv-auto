import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/shared/lib/auth";
import { BoutonDeconnexion } from "@/features/dashboard/components/bouton-deconnexion";

export default async function LayoutDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Double sécurité en plus du middleware : si jamais le middleware
  // était contourné ou mal configuré, cette vérification bloque quand même l'accès.
  if (!session) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="font-display text-xl italic text-secondary">
            CV Builder
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {session.user.name ?? session.user.email}
            </span>
            <BoutonDeconnexion />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}