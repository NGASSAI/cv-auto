import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";

export default async function PageApresConnexion() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/connexion");
  }

  const role = session.user.role;

  if (role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/dashboard");
}
