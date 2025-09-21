// Script de test pour vérifier l'envoi d'email
require('dotenv').config({ path: './.env' });
const nodemailer = require('nodemailer');

console.log('🚀 Test d\'envoi d\'email...');
console.log('📧 SMTP_HOST:', process.env.SMTP_HOST);
console.log('📧 SMTP_USER:', process.env.SMTP_USER);
console.log('📧 FROM_EMAIL:', process.env.FROM_EMAIL);

(async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    console.log('⏳ Envoi en cours...');
    
    const info = await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: process.env.SMTP_USER, // Tu reçois l'email toi-même
      subject: '✅ Test SMTP - ERZA E-Commerce',
      text: 'Félicitations ! L\'envoi d\'email fonctionne parfaitement.',
      html: `
        <h2>✅ Test SMTP Réussi !</h2>
        <p>Félicitations ! L'envoi d'email depuis ton serveur ERZA fonctionne parfaitement.</p>
        <p><strong>Configuration utilisée :</strong></p>
        <ul>
          <li>Host: ${process.env.SMTP_HOST}</li>
          <li>Port: ${process.env.SMTP_PORT}</li>
          <li>User: ${process.env.SMTP_USER}</li>
          <li>From: ${process.env.FROM_EMAIL}</li>
        </ul>
        <p>Tu peux maintenant envoyer des emails de vérification à tes utilisateurs ! 🎉</p>
      `,
    });
    
    console.log('✅ SUCCESS ! Email envoyé avec succès');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Vérifie ta boîte mail:', process.env.SMTP_USER);
    
  } catch (err) {
    console.error('❌ ERREUR lors de l\'envoi :');
    console.error(err.message);
    
    // Messages d'aide selon l'erreur
    if (err.message.includes('Invalid login') || err.message.includes('Authentication failed')) {
      console.log('\n💡 SOLUTION: Vérifie que :');
      console.log('   - Le mot de passe d\'application est correct');
      console.log('   - La validation en 2 étapes est activée sur ton compte Google');
    }
    
    if (err.message.includes('self signed certificate')) {
      console.log('\n💡 SOLUTION: Problème TLS, ajoute tls: { rejectUnauthorized: false } pour debug');
    }
  } finally {
    process.exit(0);
  }
})();