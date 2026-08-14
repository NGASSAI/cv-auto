import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";
import { authOptions } from "@/shared/lib/auth";
import { obtenirParametresSite } from "@/features/admin/api/parametres.service";
import { recupererCVComplet, ErreurCV } from "@/features/cv/api/cv.service";

// OBLIGATOIRE: Puppeteer ne fonctionne que dans l'environnement Node.js
export const runtime = "nodejs";
export const maxDuration = 60;
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cvId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ erreur: "Non authentifié" }, { status: 401 });
  }

  const { cvId } = await params;

  try {
    const parametres = await obtenirParametresSite();
    if (!parametres.exportPdfActif) {
      return NextResponse.json(
        { erreur: "L'export PDF est temporairement désactivé" },
        { status: 403 }
      );
    }

    const cv = await recupererCVComplet(cvId, session.user.id);

    console.log("CV récupéré:", cv.templateId, cv.titre);
    console.log("Paramètres CV:", {
      police: cv.police,
      tailleTexte: cv.tailleTexte,
      alignementTexte: cv.alignementTexte,
      couleurAccent: cv.couleurAccent,
    });

    const sectionsFormatees = cv.sections.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        dateDebut: item.dateDebut ? item.dateDebut.toISOString().split('T')[0] : null,
        dateFin: item.dateFin ? item.dateFin.toISOString().split('T')[0] : null,
      })),
    }));
    
    console.log("Sections formatées:", sectionsFormatees.length);
    
    // Générer le HTML selon le template avec paramètres dynamiques
    const html = genererHtmlPdf(cv, sectionsFormatees);
    
    console.log("HTML généré, longueur:", html.length);

    // Lancer Puppeteer avec arguments adaptés à Windows
    // En production (Vercel), on utilise Chromium allégé compatible serverless.
    // En développement local, on utilise le Chromium complet fourni par le
    // package "puppeteer" classique (installé en devDependency).
    const enProduction = !!process.env.VERCEL_ENV;

    const browser = enProduction
      ? await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        })
      : await (await import("puppeteer")).default.launch({ headless: true });

    console.log("Browser lancé, environnement:", enProduction ? "production" : "développement");
    try {
      const page = await browser.newPage();
      
      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      console.log("Contenu HTML défini");

      // Attendre que les images soient chargées
      await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }));
      });

      // Attendre les polices Google Fonts
      await page.evaluate(() => {
        return new Promise((resolve) => {
          if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(resolve);
          } else {
            setTimeout(resolve, 1500);
          }
        });
      });

      console.log("Images et polices chargées");

      // Générer le PDF en format A4
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      });

      console.log("PDF généré, taille:", pdfBuffer.length);

      await page.close();
      
      const nomFichier = `${cv.titre.replace(/[^a-z0-9]/gi, "_")}.pdf`;

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(nomFichier)}; filename="${nomFichier}"`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (erreur) {
    if (erreur instanceof ErreurCV) {
      return NextResponse.json({ erreur: erreur.message }, { status: 403 });
    }

    console.error("Erreur lors de la génération du PDF :", erreur);
    console.error("Détails de l'erreur:", erreur instanceof Error ? erreur.message : String(erreur));
    console.error("Stack trace:", erreur instanceof Error ? erreur.stack : "No stack trace");
    
    return NextResponse.json(
      { erreur: "Une erreur interne est survenue", details: erreur instanceof Error ? erreur.message : String(erreur) },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires pour tous les templates
function couleurAvecAlpha(couleur: string, alpha: number) {
  if (couleur.startsWith("#") && couleur.length === 7) {
    const hex = couleur.slice(1);
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return couleur;
}

function formaterPeriode(dateDebut: string | null, dateFin: string | null) {
  if (!dateDebut) return "";
  const debut = new Date(dateDebut).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  if (!dateFin) return `${debut} — Présent`;
  const fin = new Date(dateFin).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  return `${debut} — ${fin}`;
}

function classeAlignement(alignement: string) {
  switch (alignement) {
    case "gauche": return "text-left";
    case "centre": return "text-center";
    case "droite": return "text-right";
    case "justifie": return "text-justify";
    default: return "text-left";
  }
}
function tailleResume(taille: string) {
  switch (taille) {
    case "petite": return "text-xs";
    case "grande": return "text-base";
    default: return "text-sm";
  }
}

function getPoliceMapping(police: string) {
  const mapping: Record<string, { web: string; fallback: string }> = {
    "geist": { web: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap", fallback: "'Inter', 'Segoe UI', sans-serif" },
    "fraunces": { web: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&display=swap", fallback: "'Fraunces', 'Georgia', serif" },
    "merriweather": { web: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;500;600;700&display=swap", fallback: "'Merriweather', 'Georgia', serif" },
    "playfair": { web: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap", fallback: "'Playfair Display', 'Georgia', serif" },
    "manrope": { web: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap", fallback: "'Manrope', 'Segoe UI', sans-serif" },
    "lora": { web: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap", fallback: "'Lora', 'Georgia', serif" },
  };
  return mapping[police] || mapping["geist"];
}

function getTailleFacteur(taille: string) {
  switch (taille) {
    case "petite": return 0.85;
    case "grande": return 1.15;
    default: return 1;
  }
}

function getIcones(couleur: string) {
  return {
    mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13a11 11 0 0 1-3.74-2.74L3 21"/><path d="M3 21l1.9-5.7a8.5 8.5 0 0 1 7.55-4.83A8.5 8.5 0 0 1 21 10z"/></svg>`,
  };
}

// Générateur principal qui délègue aux générateurs spécifiques
function genererHtmlPdf(cv: any, sections: any[]): string {
  switch (cv.templateId) {
    case 'moderne':
      return genererTemplateModerne(cv, sections);
    case 'classique':
      return genererTemplateClassique(cv, sections);
    case 'minimaliste':
      return genererTemplateMinimaliste(cv, sections);
    case 'elegant':
      return genererTemplateElegant(cv, sections);
    case 'executif':
      return genererTemplateExecutif(cv, sections);
    case 'dossier-structure':
      return genererTemplateDossierStructure(cv, sections);
    case 'portfolio':
      return genererTemplatePortfolio(cv, sections);
    default:
      return genererTemplateModerne(cv, sections); // Fallback
  }
}

// Template Moderne - avec paramètres dynamiques
function genererTemplateModerne(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionsLaterales = sectionsVisibles.filter((s) => ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"].includes(s.type));
  const sectionsPrincipales = sectionsVisibles.filter((s) => !["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"].includes(s.type));
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: white; overflow: hidden; display: flex; flex-direction: column; }
    .header { padding: 18mm 18mm 15mm 18mm; background: linear-gradient(135deg, ${couleurAccent} 0%, ${couleurAvecAlpha(couleurAccent, 0.8)} 100%); color: white; }
    .header-content { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .profile-section { flex: 1; min-width: 0; }
    .profile-label { font-size: ${10 * tailleFacteur}px; text-transform: uppercase; letter-spacing: 0.28em; color: rgba(255,255,255,0.75); margin-bottom: 8px; }
    .name { font-size: ${28 * tailleFacteur}px; font-weight: 600; line-height: 1.2; margin: 0 0 8px 0; font-family: Georgia, serif; }
    .title { font-size: ${14 * tailleFacteur}px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.85); margin: 8px 0 0 0; }
    .photo { width: 120px; height: 120px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.7); background: rgba(255,255,255,0.1); overflow: hidden; flex-shrink: 0; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .contact-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
    .contact-badge { display: inline-flex; align-items: center; gap: 8px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); padding: 6px 12px; font-size: ${11 * tailleFacteur}px; color: rgba(255,255,255,0.9); }
    .contact-badge svg { flex-shrink: 0; }
    .main-content { display: flex; flex: 1; min-height: 0; }
    .sidebar { width: 34%; background: #f1f5f9; border-right: 1px solid #e2e8f0; padding: 24px; }
    .content-area { flex: 1; background: white; padding: 24px; }
    .sidebar-section { margin-bottom: 24px; }
    .sidebar-title { font-size: ${10 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.22em; color: #64748b; margin-bottom: 12px; }
    .badge-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { border-radius: 50px; border: 1px solid #e2e8f0; background: white; padding: 4px 10px; font-size: ${11 * tailleFacteur}px; font-weight: 500; color: #334155; }
    .resume-box { margin-bottom: 24px; border-radius: 16px; border: 1px solid #e2e8f0; background: #f8fafc; padding: 16px; }
    .resume-text { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; ${classeAlignement(alignementTexte)} }
    .main-section { margin-bottom: 20px; border-radius: 16px; border: 1px solid #e2e8f0; background: white; padding: 16px; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .section-dot { width: 10px; height: 10px; border-radius: 50%; background: ${couleurAccent}; }
    .section-title { font-size: ${11 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #334155; }
    .item { margin-bottom: 16px; border-left: 1px solid #e2e8f0; padding-left: 14px; }
    .item-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .item-title { font-size: ${16 * tailleFacteur}px; font-weight: 600; color: #0f172a; margin: 0; }
    .item-subtitle { font-size: ${12 * tailleFacteur}px; color: #475569; margin: 4px 0 0 0; }
    .item-date { font-size: ${11 * tailleFacteur}px; color: #64748b; flex-shrink: 0; }
    .item-description { font-size: ${12 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 8px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <div class="header-content">
        <div class="profile-section">
          <div class="profile-label">Profil professionnel</div>
          <h1 class="name">${nomComplet || "Votre nom"}</h1>
          ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
        </div>
        ${cv.informations?.photoUrl ? `<div class="photo"><img src="${cv.informations.photoUrl}" alt="${nomComplet}" /></div>` : ''}
      </div>
      <div class="contact-badges">
        ${cv.informations?.email ? `<span class="contact-badge">${icones.mail} ${cv.informations.email}</span>` : ''}
        ${cv.informations?.telephone ? `<span class="contact-badge">${icones.phone} ${cv.informations.telephone}</span>` : ''}
        ${cv.informations?.adresse ? `<span class="contact-badge">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
      </div>
    </div>
    <div class="main-content">
      <div class="sidebar">
        ${sectionsLaterales.map((section: any) => `
          <div class="sidebar-section">
            <h3 class="sidebar-title">${section.titre}</h3>
            <div class="badge-list">
              ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="content-area">
        ${cv.informations?.resume ? `<div class="resume-box"><p class="resume-text">${cv.informations.resume}</p></div>` : ''}
        ${sectionsPrincipales.map((section: any) => `
          <div class="main-section">
            <div class="section-header"><span class="section-dot"></span><h2 class="section-title">${section.titre}</h2></div>
            <div>
              ${section.items.map((item: any) => `
                <div class="item">
                  <div class="item-header">
                    <div style="flex: 1; min-width: 0;">
                      <p class="item-title">${item.titre || ''}</p>
                      ${item.sousTitre || item.lieu ? `<p class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' • ')}</p>` : ''}
                    </div>
                    ${item.dateDebut ? `<span class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</span>` : ''}
                  </div>
                  ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Template Classique
function genererTemplateClassique(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const typesEnBadges = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: white; overflow: hidden; padding: 32px 32px 32px 32px; }
    .header { text-align: center; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 2px solid ${couleurAccent}; }
    .name { font-size: ${36 * tailleFacteur}px; font-weight: 500; margin: 0 0 4px 0; font-family: Georgia, serif; }
    .title { font-size: ${16 * tailleFacteur}px; text-transform: uppercase; letter-spacing: 0.2em; color: #3D4B5C; margin: 4px 0 0 0; }
    .contact-info { display: flex; justify-content: center; gap: 16px; margin-top: 12px; flex-wrap: wrap; font-size: ${14 * tailleFacteur}px; color: #3D4B5C; }
    .contact-item { display: flex; align-items: center; gap: 4px; }
    .contact-item svg { flex-shrink: 0; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; font-style: italic; margin-bottom: 28px; color: #3D4B5C; padding: 0 16px; ${classeAlignement(alignementTexte)} }
    .section { margin-bottom: 16px; }
    .section-title { font-size: ${14 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; padding-bottom: 6px; margin-bottom: 12px; color: ${couleurAccent}; border-bottom: 1px solid ${couleurAvecAlpha(couleurAccent, 0.2)}; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { font-size: ${14 * tailleFacteur}px; padding: 4px 12px; border-radius: 50px; font-weight: 500; background: ${couleurAvecAlpha(couleurAccent, 0.1)}; color: ${couleurAccent}; }
    .item { margin-bottom: 14px; }
    .item-title { font-weight: 600; font-size: ${15 * tailleFacteur}px; margin-bottom: 2px; }
    .item-subtitle { color: #3D4B5C; font-size: ${13 * tailleFacteur}px; margin-bottom: 2px; }
    .item-date { color: #64748b; font-size: ${12 * tailleFacteur}px; margin-bottom: 4px; }
    .item-description { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 4px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1 class="name">${nomComplet || "Votre nom"}</h1>
      ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
      <div class="contact-info">
        ${cv.informations?.email ? `<span class="contact-item">${icones.mail} ${cv.informations.email}</span>` : ''}
        ${cv.informations?.telephone ? `<span class="contact-item">${icones.phone} ${cv.informations.telephone}</span>` : ''}
        ${cv.informations?.adresse ? `<span class="contact-item">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
      </div>
    </div>
    ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
    ${sectionsVisibles.map((section: any) => `
      <div class="section">
        <h2 class="section-title">${section.titre}</h2>
        ${typesEnBadges.includes(section.type) ? `
          <div class="badge-container">
            ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
          </div>
        ` : `
          <div>
            ${section.items.map((item: any) => `
              <div class="item">
                <div class="item-title">${item.titre || ''}</div>
                ${item.sousTitre || item.lieu ? `<div class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</div>` : ''}
                ${item.dateDebut ? `<div class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</div>` : ''}
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}

// Template Minimaliste
function genererTemplateMinimaliste(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const typesEnBadges = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: white; overflow: hidden; padding: 40px 40px 40px 40px; }
    .header { margin-bottom: 28px; }
    .name { font-size: ${36 * tailleFacteur}px; font-weight: 300; letter-spacing: -0.02em; margin: 0 0 8px 0; font-family: Georgia, serif; }
    .title { font-size: ${16 * tailleFacteur}px; color: #3D4B5C; font-weight: 300; margin: 8px 0 0 0; }
    .contact-info { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; font-size: ${14 * tailleFacteur}px; color: #3D4B5C; }
    .contact-item { display: flex; align-items: center; gap: 6px; }
    .contact-item svg { flex-shrink: 0; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; font-style: italic; margin-bottom: 28px; color: #3D4B5C; padding: 0 16px; ${classeAlignement(alignementTexte)} }
    .section { margin-bottom: 24px; }
    .section-title { font-size: ${16 * tailleFacteur}px; font-weight: 500; padding-bottom: 8px; margin-bottom: 16px; color: #161B22; border-bottom: 1px solid #e2e8f0; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { font-size: ${14 * tailleFacteur}px; padding: 4px 12px; border-radius: 4px; font-weight: 400; background: #f8fafc; color: #161B22; border: 1px solid #e2e8f0; }
    .item { margin-bottom: 16px; }
    .item-title { font-weight: 500; font-size: ${15 * tailleFacteur}px; margin-bottom: 2px; }
    .item-subtitle { color: #3D4B5C; font-size: ${13 * tailleFacteur}px; margin-bottom: 2px; }
    .item-date { color: #64748b; font-size: ${12 * tailleFacteur}px; margin-bottom: 4px; }
    .item-description { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 4px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1 class="name">${nomComplet || "Votre nom"}</h1>
      ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
      <div class="contact-info">
        ${cv.informations?.email ? `<span class="contact-item">${icones.mail} ${cv.informations.email}</span>` : ''}
        ${cv.informations?.telephone ? `<span class="contact-item">${icones.phone} ${cv.informations.telephone}</span>` : ''}
        ${cv.informations?.adresse ? `<span class="contact-item">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
      </div>
    </div>
    ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
    ${sectionsVisibles.map((section: any) => `
      <div class="section">
        <h2 class="section-title">${section.titre}</h2>
        ${typesEnBadges.includes(section.type) ? `
          <div class="badge-container">
            ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
          </div>
        ` : `
          <div>
            ${section.items.map((item: any) => `
              <div class="item">
                <div class="item-title">${item.titre || ''}</div>
                ${item.sousTitre || item.lieu ? `<div class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</div>` : ''}
                ${item.dateDebut ? `<div class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</div>` : ''}
                ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();
}

// Template Elegant
function genererTemplateElegant(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const typesEnBadges = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  const hasPhoto = !!cv.informations?.photoUrl;
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: white; overflow: hidden; }
    .header { position: relative; padding: 32px 40px 40px 40px; background: ${couleurAccent}; color: white; }
    .name { font-size: ${36 * tailleFacteur}px; font-weight: 500; line-height: 1.2; margin: 0 0 6px 0; font-family: Georgia, serif; }
    .title { font-size: ${16 * tailleFacteur}px; color: rgba(255,255,255,0.85); letter-spacing: 0.05em; margin: 6px 0 0 0; }
    .contact-info { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; font-size: ${14 * tailleFacteur}px; color: rgba(255,255,255,0.8); }
    .contact-item { display: flex; align-items: center; gap: 6px; }
    .contact-item svg { flex-shrink: 0; }
    .photo-container { position: relative; margin-top: -48px; margin-left: 40px; margin-bottom: 8px; z-index: 10; }
    .photo { width: 96px; height: 96px; border-radius: 50%; border: 4px solid white; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .content { padding: ${hasPhoto ? '16px 40px 40px 40px' : '40px 40px 40px 40px'}; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; font-style: italic; margin-bottom: 28px; color: #3D4B5C; padding: 0 16px; ${classeAlignement(alignementTexte)} }
    .section { margin-bottom: 20px; }
    .section-title { font-size: ${16 * tailleFacteur}px; font-weight: 500; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; font-family: Georgia, serif; font-style: italic; }
    .section-line { width: 24px; height: 1px; background: ${couleurAccent}; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; padding-left: 32px; }
    .badge { font-size: ${14 * tailleFacteur}px; padding: 4px 12px; border-radius: 50px; font-weight: 500; background: ${couleurAvecAlpha(couleurAccent, 0.1)}; color: ${couleurAccent}; }
    .items-container { padding-left: 32px; }
    .item { margin-bottom: 16px; }
    .item-header { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .item-title { font-size: ${16 * tailleFacteur}px; font-weight: 500; }
    .item-date { font-size: ${12 * tailleFacteur}px; color: #3D4B5C; flex-shrink: 0; white-space: nowrap; }
    .item-subtitle { font-size: ${14 * tailleFacteur}px; color: #3D4B5C; margin-top: 2px; }
    .item-description { font-size: ${14 * tailleFacteur}px; line-height: 1.6; margin-top: 6px; color: rgba(22, 27, 34, 0.85); white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      <h1 class="name">${nomComplet || "Votre nom"}</h1>
      ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
      <div class="contact-info">
        ${cv.informations?.email ? `<span class="contact-item">${icones.mail} ${cv.informations.email}</span>` : ''}
        ${cv.informations?.telephone ? `<span class="contact-item">${icones.phone} ${cv.informations.telephone}</span>` : ''}
        ${cv.informations?.adresse ? `<span class="contact-item">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
      </div>
    </div>
    ${cv.informations?.photoUrl ? `<div class="photo-container"><div class="photo"><img src="${cv.informations.photoUrl}" alt="${nomComplet}" /></div></div>` : ''}
    <div class="content">
      ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
      ${sectionsVisibles.map((section: any) => `
        <div class="section">
          <h2 class="section-title"><span class="section-line"></span>${section.titre}</h2>
          ${typesEnBadges.includes(section.type) ? `
            <div class="badge-container">
              ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
            </div>
          ` : `
            <div class="items-container">
              ${section.items.map((item: any) => `
                <div class="item">
                  <div class="item-header">
                    <span class="item-title">${item.titre || ''}</span>
                    ${item.dateDebut ? `<span class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</span>` : ''}
                  </div>
                  ${item.sousTitre || item.lieu ? `<p class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</p>` : ''}
                  ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Template Executif
function genererTemplateExecutif(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const typesEnBadges = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: #FAF8F3; overflow: hidden; color: #161B22; position: relative; }
    .photo-container { position: absolute; right: 48px; top: 48px; width: 64px; height: 64px; border-radius: 50%; border: 1px solid rgba(61, 75, 92, 0.2); overflow: hidden; z-index: 10; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .content { display: flex; flex-direction: column; gap: 32px; padding: 56px 64px 64px 64px; }
    .header { padding-right: 80px; }
    .name { font-size: ${36 * tailleFacteur}px; font-weight: 500; line-height: 1.2; margin: 0 0 8px 0; font-family: Georgia, serif; }
    .title { font-size: ${16 * tailleFacteur}px; letter-spacing: 0.1em; color: #3D4B5C; margin: 8px 0 0 0; }
    .contact-info { display: flex; flex-wrap: wrap; gap: 24px 24px; margin-top: 20px; font-size: ${14 * tailleFacteur}px; color: #3D4B5C; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; color: #3D4B5C; ${classeAlignement(alignementTexte)} }
    .section { margin-bottom: 28px; }
    .section-title { font-size: ${14 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; color: #161B22; border-bottom: 2px solid #E4E0D6; padding-bottom: 8px; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { font-size: ${13 * tailleFacteur}px; padding: 6px 16px; border-radius: 2px; font-weight: 500; background: white; color: #161B22; border: 1px solid #E4E0D6; }
    .item { margin-bottom: 16px; }
    .item-title { font-weight: 600; font-size: ${15 * tailleFacteur}px; margin-bottom: 4px; }
    .item-subtitle { color: #3D4B5C; font-size: ${13 * tailleFacteur}px; margin-bottom: 4px; }
    .item-date { color: #64748b; font-size: ${12 * tailleFacteur}px; margin-bottom: 6px; }
    .item-description { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 6px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    ${cv.informations?.photoUrl ? `<div class="photo-container"><img src="${cv.informations.photoUrl}" alt="${nomComplet}" /></div>` : ''}
    <div class="content">
      <div class="header">
        <h1 class="name">${nomComplet || "Votre nom"}</h1>
        ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
        <div class="contact-info">
          ${cv.informations?.email ? `<span>${cv.informations.email}</span>` : ''}
          ${cv.informations?.telephone ? `<span>${cv.informations.telephone}</span>` : ''}
          ${cv.informations?.adresse ? `<span>${cv.informations.adresse}</span>` : ''}
        </div>
      </div>
      ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
      ${sectionsVisibles.map((section: any) => `
        <div class="section">
          <h2 class="section-title">${section.titre}</h2>
          ${typesEnBadges.includes(section.type) ? `
            <div class="badge-container">
              ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
            </div>
          ` : `
            <div>
              ${section.items.map((item: any) => `
                <div class="item">
                  <div class="item-title">${item.titre || ''}</div>
                  ${item.sousTitre || item.lieu ? `<div class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</div>` : ''}
                  ${item.dateDebut ? `<div class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</div>` : ''}
                  ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Template Dossier Structure
function genererTemplateDossierStructure(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const typesEnBadges = ["COMPETENCES", "LANGUES", "CENTRES_INTERET", "CERTIFICATIONS"];
  
  function numeroSection(index: number): string {
    return String(index + 1).padStart(2, "0");
  }
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: #FAF8F3; overflow: hidden; color: #161B22; padding: 48px 48px 48px 48px; }
    .header-frame { position: relative; padding: 2px; background: ${couleurAccent}; border-radius: 0 8px 0 0; }
    .header-inner { position: relative; padding: 24px; background: ${couleurAvecAlpha(couleurAccent, 0.07)}; border-radius: 0 7px 0 0; }
    .header-content { display: flex; align-items: center; gap: 20px; }
    .photo { width: 80px; height: 80px; border-radius: 4px; border: 2px solid ${couleurAccent}; overflow: hidden; flex-shrink: 0; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .name { font-size: ${30 * tailleFacteur}px; font-weight: 500; line-height: 1.2; margin: 0 0 4px 0; font-family: Georgia, serif; color: color-mix(in srgb, ${couleurAccent} 55%, #161B22); }
    .title { font-size: ${16 * tailleFacteur}px; font-weight: 500; color: ${couleurAccent}; margin: 4px 0 0 0; }
    .contact-info { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 8px; font-size: ${14 * tailleFacteur}px; color: #3D4B5C; }
    .contact-item { display: flex; align-items: center; gap: 4px; }
    .contact-item svg { flex-shrink: 0; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; margin-bottom: 32px; color: #3D4B5C; ${classeAlignement(alignementTexte)} }
    .section { display: flex; gap: 16px; margin-bottom: 28px; }
    .section-number { flex-shrink: 0; font-size: ${24 * tailleFacteur}px; font-weight: 500; line-height: 1; font-family: Georgia, serif; color: ${couleurAccent}; }
    .section-content { flex: 1; border-left: 1px solid rgba(61, 75, 92, 0.2); padding-left: 16px; }
    .section-title { font-size: ${16 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { font-size: ${13 * tailleFacteur}px; padding: 4px 12px; background: white; color: #161B22; border: 1px solid #E4E0D6; }
    .item { margin-bottom: 14px; }
    .item-title { font-weight: 600; font-size: ${15 * tailleFacteur}px; margin-bottom: 2px; }
    .item-subtitle { color: #3D4B5C; font-size: ${13 * tailleFacteur}px; margin-bottom: 2px; }
    .item-date { color: #64748b; font-size: ${12 * tailleFacteur}px; margin-bottom: 4px; }
    .item-description { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 4px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header-frame">
      <div class="header-inner">
        <div class="header-content">
          ${cv.informations?.photoUrl ? `<div class="photo"><img src="${cv.informations.photoUrl}" alt="${nomComplet}" /></div>` : ''}
          <div>
            <h1 class="name">${nomComplet || "Votre nom"}</h1>
            ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
            <div class="contact-info">
              ${cv.informations?.email ? `<span class="contact-item">${icones.mail} ${cv.informations.email}</span>` : ''}
              ${cv.informations?.telephone ? `<span class="contact-item">${icones.phone} ${cv.informations.telephone}</span>` : ''}
              ${cv.informations?.adresse ? `<span class="contact-item">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 32px;">
      ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
      ${sectionsVisibles.map((section: any, index: number) => `
        <div class="section">
          <span class="section-number">${numeroSection(index)}</span>
          <div class="section-content">
            <h2 class="section-title">${section.titre}</h2>
            ${typesEnBadges.includes(section.type) ? `
              <div class="badge-container">
                ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
              </div>
            ` : `
              <div>
                ${section.items.map((item: any) => `
                  <div class="item">
                    <div class="item-title">${item.titre || ''}</div>
                    ${item.sousTitre || item.lieu ? `<div class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</div>` : ''}
                    ${item.dateDebut ? `<div class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</div>` : ''}
                    ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Template Portfolio
function genererTemplatePortfolio(cv: any, sections: any[]): string {
  const nomComplet = [cv.informations?.prenom, cv.informations?.nom].filter(Boolean).join(" ");
  const sectionsVisibles = sections.filter((s) => s.estVisible);
  const sectionCompetences = sectionsVisibles.find((s) => s.type === "COMPETENCES");
  const sectionsBadges = sectionsVisibles.filter((s) => ["LANGUES", "CENTRES_INTERET"].includes(s.type));
  const sectionsChronologiques = sectionsVisibles.filter(
    (s) => s.type !== "COMPETENCES" && !["LANGUES", "CENTRES_INTERET"].includes(s.type)
  );
  
  const couleurAccent = cv.couleurAccent || "#2563eb";
  const police = cv.police || "geist";
  const alignementTexte = cv.alignementTexte || "gauche";
  const tailleTexte = cv.tailleTexte || "moyenne";
  
  const policeConfig = getPoliceMapping(police);
  const tailleFacteur = getTailleFacteur(tailleTexte);
  const icones = getIcones(couleurAccent);
  
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CV - ${cv.titre}</title>
  <link href="${policeConfig.web}" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 0; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: ${policeConfig.fallback}; }
    .cv-container { width: 210mm; height: 297mm; background: #FAF8F3; overflow: hidden; color: #161B22; }
    .header { display: flex; align-items: center; gap: 24px; padding: 40px 40px 24px 40px; }
    .photo { width: 80px; height: 80px; border-radius: 50%; border: 2px solid ${couleurAccent}; overflow: hidden; flex-shrink: 0; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .header-info { flex: 1; }
    .name { font-size: ${32 * tailleFacteur}px; font-weight: 600; line-height: 1.2; margin: 0 0 4px 0; font-family: Georgia, serif; }
    .title { font-size: ${16 * tailleFacteur}px; color: #3D4B5C; margin: 4px 0 0 0; }
    .contact-info { display: flex; gap: 16px; margin-top: 8px; font-size: ${13 * tailleFacteur}px; color: #3D4B5C; }
    .contact-item { display: flex; align-items: center; gap: 4px; }
    .contact-item svg { flex-shrink: 0; }
    .main-content { display: flex; gap: 32px; padding: 0 40px 40px 40px; }
    .left-column { flex: 1; }
    .right-column { width: 35%; }
    .resume { font-size: ${14 * tailleFacteur}px; line-height: 1.6; margin-bottom: 24px; color: #3D4B5C; ${classeAlignement(alignementTexte)} }
    .section { margin-bottom: 20px; }
    .section-title { font-size: ${14 * tailleFacteur}px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px; color: #161B22; border-bottom: 2px solid ${couleurAccent}; padding-bottom: 6px; }
    .skill-item { margin-bottom: 12px; }
    .skill-name { font-size: ${13 * tailleFacteur}px; font-weight: 500; margin-bottom: 4px; }
    .skill-bar { height: 6px; background: #E4E0D6; border-radius: 3px; overflow: hidden; }
    .skill-fill { height: 100%; background: ${couleurAccent}; border-radius: 3px; }
    .badge-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { font-size: ${13 * tailleFacteur}px; padding: 4px 12px; background: white; color: #161B22; border: 1px solid #E4E0D6; border-radius: 4px; }
    .item { margin-bottom: 14px; }
    .item-title { font-weight: 600; font-size: ${15 * tailleFacteur}px; margin-bottom: 2px; }
    .item-subtitle { color: #3D4B5C; font-size: ${13 * tailleFacteur}px; margin-bottom: 2px; }
    .item-date { color: #64748b; font-size: ${12 * tailleFacteur}px; margin-bottom: 4px; }
    .item-description { font-size: ${13 * tailleFacteur}px; line-height: 1.6; color: #334155; margin-top: 4px; white-space: pre-line; }
  </style>
</head>
<body>
  <div class="cv-container">
    <div class="header">
      ${cv.informations?.photoUrl ? `<div class="photo"><img src="${cv.informations.photoUrl}" alt="${nomComplet}" /></div>` : ''}
      <div class="header-info">
        <h1 class="name">${nomComplet || "Votre nom"}</h1>
        ${cv.informations?.titrePoste ? `<p class="title">${cv.informations.titrePoste}</p>` : ''}
        <div class="contact-info">
          ${cv.informations?.email ? `<span class="contact-item">${icones.mail} ${cv.informations.email}</span>` : ''}
          ${cv.informations?.telephone ? `<span class="contact-item">${icones.phone} ${cv.informations.telephone}</span>` : ''}
          ${cv.informations?.adresse ? `<span class="contact-item">${icones.mapPin} ${cv.informations.adresse}</span>` : ''}
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="left-column">
        ${cv.informations?.resume ? `<p class="resume">${cv.informations.resume}</p>` : ''}
        ${sectionsChronologiques.map((section: any) => `
          <div class="section">
            <h2 class="section-title">${section.titre}</h2>
            <div>
              ${section.items.map((item: any) => `
                <div class="item">
                  <div class="item-title">${item.titre || ''}</div>
                  ${item.sousTitre || item.lieu ? `<div class="item-subtitle">${[item.sousTitre, item.lieu].filter(Boolean).join(' — ')}</div>` : ''}
                  ${item.dateDebut ? `<div class="item-date">${formaterPeriode(item.dateDebut, item.dateFin)}</div>` : ''}
                  ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div class="right-column">
        ${sectionCompetences ? `
          <div class="section">
            <h2 class="section-title">${sectionCompetences.titre}</h2>
            ${sectionCompetences.items.map((item: any) => {
              const niveau = typeof item.donneesJson === 'object' && item.donneesJson?.niveau ? item.donneesJson.niveau : 75;
              return `
                <div class="skill-item">
                  <div class="skill-name">${item.titre}</div>
                  <div class="skill-bar"><div class="skill-fill" style="width: ${niveau}%"></div></div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
        ${sectionsBadges.map((section: any) => `
          <div class="section">
            <h2 class="section-title">${section.titre}</h2>
            <div class="badge-container">
              ${section.items.map((item: any) => `<span class="badge">${item.titre}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
