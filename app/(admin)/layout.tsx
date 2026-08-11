import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/shared/lib/auth";
import { NavAdmin } from "@/features/admin/components/nav-admin";
import { BoutonCreationCV } from "@/features/dashboard/components/bouton-creation-cv";
import { BoutonDeconnexion } from "@/features/dashboard/components/bouton-deconnexion";
import { ClocheNotifications } from "@/features/notifications/components/cloche-notifications";

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Double sécurité en plus du middleware, comme pour le dashboard utilisateur
  if (!session) {
    redirect("/connexion");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl italic text-secondary">
            CV Builder <span className="text-xs font-mono not-italic text-primary align-top">ADMIN</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <BoutonCreationCV />
            <ClocheNotifications />
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
              Retour à l&apos;app
            </Link>
            <BoutonDeconnexion />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">
        <NavAdmin />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}