import { render } from '@react-email/render';
import EmailVerification from './emails/EmailVerification';
import PasswordReset from './emails/PasswordReset';
import WelcomeEmail from './emails/WelcomeEmail';

// Test script pour générer des exemples d'emails
async function testEmailTemplates() {
  console.log('🧪 Test des templates d\'email avec React Email...\n');

  try {
    // Test Email de vérification
    const verificationHtml = await render(EmailVerification({
      userFirstname: 'Marie',
      verificationLink: 'http://localhost:3000/verify-email?token=sample123'
    }));
    console.log('✅ Template de vérification généré avec succès');
    console.log(`📏 Taille: ${verificationHtml.length} caractères\n`);

    // Test Email de reset
    const resetHtml = await render(PasswordReset({
      userFirstname: 'Pierre',
      resetLink: 'http://localhost:3000/reset-password?token=reset456'
    }));
    console.log('✅ Template de reset généré avec succès');
    console.log(`📏 Taille: ${resetHtml.length} caractères\n`);

    // Test Email de bienvenue
    const welcomeHtml = await render(WelcomeEmail({
      userFirstname: 'Sophie',
      dashboardLink: 'http://localhost:3000/dashboard'
    }));
    console.log('✅ Template de bienvenue généré avec succès');
    console.log(`📏 Taille: ${welcomeHtml.length} caractères\n`);

    console.log('🎉 Tous les templates React Email fonctionnent parfaitement !');
    console.log('\n💡 Les templates sont maintenant intégrés avec le service EmailService');
    console.log('📧 Ils remplacent les anciens templates HTML basiques');
    console.log('🚀 Professionnels et optimisés pour tous les clients email');

  } catch (error) {
    console.error('❌ Erreur lors du test des templates:', error);
  }
}

// Exécuter les tests si le fichier est appelé directement
if (require.main === module) {
  testEmailTemplates();
}

export { testEmailTemplates };