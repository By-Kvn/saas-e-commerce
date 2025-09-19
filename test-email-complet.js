// 🧪 Script de test pour vérifier l'envoi d'emails
const testEmailSending = async () => {
  console.log('🚀 Test d\'envoi d\'email en cours...\n');
  
  try {
    const testData = {
      name: 'Test User',
      email: 'ramanantsoa.mika@gmail.com', // ✅ Votre adresse Gmail pour test
      password: 'motdepasse123'
    };

    console.log('📧 Tentative d\'inscription avec:', testData.email);
    console.log('⏳ Envoi en cours...\n');

    const response = await fetch('http://localhost:3003/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const responseData = await response.json();

    console.log('📡 Status HTTP:', response.status);
    console.log('📋 Réponse complète:', JSON.stringify(responseData, null, 2));

    if (response.ok) {
      console.log('\n✅ INSCRIPTION RÉUSSIE !');
      console.log('📬 Un email devrait être envoyé à:', testData.email);
      console.log('\n🔍 VÉRIFICATIONS :');
      console.log('1. Regardez les logs de l\'API dans votre terminal');
      console.log('2. Vérifiez votre boîte email (et dossier spam)');
      console.log('3. Si mode test: cherchez une URL de prévisualisation');
    } else {
      console.log('\n❌ ERREUR D\'INSCRIPTION');
      console.log('Détails:', responseData);
    }

  } catch (error) {
    console.error('\n❌ ERREUR DE CONNEXION:', error.message);
    console.log('\n🔧 Vérifiez que l\'API fonctionne sur http://localhost:3003');
  }
};

// Ajouter un délai pour que l'API soit prête
setTimeout(testEmailSending, 2000);