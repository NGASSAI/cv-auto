const { PrismaClient } = require('./lib/generated/prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function testAuth() {
  const email = process.argv[2];
  const motDePasse = process.argv[3];

  if (!email || !motDePasse) {
    console.log('Usage: node scripts/test-auth.js <email> <motDePasse>');
    process.exit(1);
  }

  try {
    console.log('🔍 Recherche de l\'utilisateur...');
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      console.log('❌ Utilisateur non trouvé');
      process.exit(1);
    }

    console.log('✅ Utilisateur trouvé:', {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      estSuspendu: utilisateur.estSuspendu,
      aMotDePasse: !!utilisateur.motDePasse,
    });

    if (!utilisateur.motDePasse) {
      console.log('❌ L\'utilisateur n\'a pas de mot de passe défini');
      process.exit(1);
    }

    console.log('🔐 Test de vérification du mot de passe...');
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (motDePasseValide) {
      console.log('✅ Mot de passe valide');
    } else {
      console.log('❌ Mot de passe invalide');
      process.exit(1);
    }

    console.log('🎉 Authentification réussie !');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
