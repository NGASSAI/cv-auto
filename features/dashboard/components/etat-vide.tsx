import { FileText } from "lucide-react";

export function EtatVide() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="w-6 h-6 text-muted-foreground" />
      </div>
      <h2 className="font-display text-xl font-medium">
        Aucun CV pour l&apos;instant
      </h2>
      <p className="text-muted-foreground text-sm mt-1 max-w-xs">
        Créez votre premier CV et commencez à construire votre dossier professionnel.
      </p>
    </div>
  );
}