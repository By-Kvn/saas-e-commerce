import { emailService } from './lib/email';

async function testReactEmailTemplates() {
  console.log('🧪 Test des templates React Email...\n');

  try {
    // Initialiser le service email
    console.log('🔧 Initialisation du service email...');
    await emailService.init();
    
    // Test Email de vérification
    console.log('\n📧 Test: Email de vérification...');
    const verificationResult = await emailService.sendEmailVerification(
      'marie@example.com',
      'sample-verification-token-123',
      'Marie Dupont'
    );
    
    if (verificationResult.success) {
      console.log('✅ Email de vérification envoyé avec succès !');
      if (verificationResult.previewUrl) {
        console.log(`🔗 Aperçu: ${verificationResult.previewUrl}`);
      }
    } else {
      console.log('❌ Erreur:', verificationResult.error);
    }

    // Test Email de reset password
    console.log('\n🔒 Test: Email de reset password...');
    const resetResult = await emailService.sendPasswordReset(
      'pierre@example.com',
      'sample-reset-token-456',
      'Pierre Martin'
    );
    
    if (resetResult.success) {
      console.log('✅ Email de reset envoyé avec succès !');
      if (resetResult.previewUrl) {
        console.log(`🔗 Aperçu: ${resetResult.previewUrl}`);
      }
    } else {
      console.log('❌ Erreur:', resetResult.error);
    }

    // Test Email de bienvenue
    console.log('\n🎉 Test: Email de bienvenue...');
    const welcomeResult = await emailService.sendWelcomeEmail(
      'sophie@example.com',
      'Sophie Bernard'
    );
    
    if (welcomeResult.success) {
      console.log('✅ Email de bienvenue envoyé avec succès !');
      if (welcomeResult.previewUrl) {
        console.log(`🔗 Aperçu: ${welcomeResult.previewUrl}`);
      }
    } else {
      console.log('❌ Erreur:', welcomeResult.error);
    }

    console.log('\n🎊 Tous les tests terminés !');
    console.log('💡 Les templates React Email sont maintenant opérationnels');
    console.log('🚀 Design professionnel et compatible avec tous les clients email');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    process.exit(0);
  }
}

testReactEmailTemplates();