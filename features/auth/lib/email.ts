import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie l'email de réinitialisation de mot de passe
 * contenant le lien avec le token généré.
 */
export async function envoyerEmailReinitialisation(
  email: string,
  token: string
): Promise<void> {
  const lienReinitialisation = `${process.env.NEXT_PUBLIC_URL_APP}/reinitialiser/${token}`;

  const { error } = await resend.emails.send({
    from: "CV Builder <onboarding@resend.dev>",
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur CV Builder.</p>
        <p>Ce lien est valable pendant 1 heure :</p>
        <a href="${lienReinitialisation}" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                  color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #666; font-size: 14px;">
          Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Échec de l'envoi de l'email : ${error.message}`);
  }
}