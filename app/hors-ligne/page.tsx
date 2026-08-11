export default function PageHorsLigne() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-papier px-6 text-center text-encre">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Vous êtes hors connexion
      </h1>
      <p className="max-w-sm text-sm text-ardoise">
        Certaines fonctionnalités, comme la connexion ou l&apos;inscription, nécessitent une connexion internet.
        Réessayez dès que vous êtes de nouveau en ligne.
      </p>
    </div>
  );
}