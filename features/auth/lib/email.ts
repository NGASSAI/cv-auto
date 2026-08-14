import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoie l'email de réinitialisation de mot de passe
 * contenant le lien avec le token généré.
 * En développement, retourne le token directement pour faciliter les tests.
 */
export async function envoyerEmailReinitialisation(
  email: string,
  token: string
): Promise<{ success: boolean; token?: string; message?: string }> {
  const lienReinitialisation = `${process.env.NEXT_PUBLIC_URL_APP}/reinitialiser/${token}`;

  // En développement, on essaie d'envoyer l'email mais on retourne aussi le token
  // pour permettre aux utilisateurs de réinitialiser leur mot de passe sans email
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Token de réinitialisation:', token);
    console.log('🔗 Lien de réinitialisation:', lienReinitialisation);
    
    try {
      const { error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
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
        console.warn('⚠️ Email non envoyé (développement):', error.message);
        // En développement, on retourne le token même si l'email échoue
        return { 
          success: false, 
          token, 
          message: `Email non envoyé (développement). Token: ${token}` 
        };
      }

      return { success: true };
    } catch (erreur) {
      console.warn('⚠️ Erreur envoi email (développement):', erreur);
      return { 
        success: false, 
        token, 
        message: `Erreur envoi email (développement). Token: ${token}` 
      };
    }
  }

  // En production, on utilise Resend normalement
  try {
    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
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

    return { success: true };
  } catch (erreur) {
    console.error("Erreur lors de l'envoi de l'email:", erreur);
    throw erreur;
  }
}
