import { cn } from "@/lib/utils";

interface PanneauBrandingProps {
  numeroDossier?: string;
  className?: string;
}

export function PanneauBranding({
  numeroDossier = "0042",
  className,
}: PanneauBrandingProps) {
  return (
    <div
      className={cn(
        "hidden md:flex flex-col justify-between",
        "bg-secondary text-secondary-foreground",
        "p-10 lg:p-14 relative overflow-hidden",
        className
      )}
    >
      <div className="relative z-10">
        <span className="font-mono text-xs tracking-widest uppercase opacity-70">
          CV Builder
        </span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center py-8">
        <div className="relative w-full max-w-70">
          <div
            className="bg-card text-card-foreground rounded-lg shadow-2xl p-6 relative"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-7 h-7 bg-muted"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              }}
            />

            <div className="space-y-3">
              <div className="font-display text-lg font-medium">
                Nathan NG
              </div>
              <div className="text-xs text-muted-foreground">
                Chef de Projet
              </div>

              <div className="pt-3 space-y-2">
                <div className="h-2 bg-muted rounded-full w-full" />
                <div className="h-2 bg-muted rounded-full w-4/5" />
                <div className="h-2 bg-muted rounded-full w-3/5" />
              </div>

              <div className="pt-2 flex gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                  Stratégie
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                  Produit
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 font-mono text-[11px] tracking-wider opacity-60 text-center">
            N° DOSSIER {numeroDossier}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <p className="font-display text-2xl lg:text-3xl italic leading-snug">
          Un dossier qui vous ressemble.
        </p>
      </div>
    </div>
  );
}