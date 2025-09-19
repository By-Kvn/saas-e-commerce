import { emailService } from './lib/email';

async function testEmail() {
  console.log('🔧 Test du service email avec Gmail...');
  
  // Vérification de la configuration
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('⚠️  Variables SMTP_USER et SMTP_PASS non configurées dans .env');
    console.log('📋 Instructions :');
    console.log('1. Allez sur https://myaccount.google.com/security');
    console.log('2. Activez la 2FA');
    console.log('3. Générez un "Mot de passe d\'application"');
    console.log('4. Ajoutez SMTP_USER=votre-email@gmail.com dans .env');
    console.log('5. Ajoutez SMTP_PASS=votre-mot-de-passe-app dans .env');
    return;
  }
  
  // Envoi d'un email de test
  const testEmail = process.env.SMTP_USER; // Envoyer à vous-même pour test
  const testToken = 'test-token-123';
  
  console.log(`📧 Envoi d'un email de test à: ${testEmail}`);
  const result = await emailService.sendEmailVerification(testEmail, testToken);
  
  if (result.success) {
    console.log('✅ Email envoyé avec succès !');
    console.log(`� Vérifiez votre boîte mail: ${testEmail}`);
  } else {
    console.log('❌ Erreur:', result.error);
  }
}

testEmail().catch(console.error);