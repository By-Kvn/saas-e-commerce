import fetch from 'node-fetch';

async function testRegistration() {
  console.log('🔧 Test d\'inscription avec envoi d\'email...');
  
  const testUser = {
    name: 'Utilisateur Test',
    email: 'test@example.com', // Remplacez par votre vrai email pour tester
    password: 'motdepassetest123'
  };

  try {
    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const result = await response.json();
    
    console.log('📊 Statut:', response.status);
    console.log('📄 Réponse:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Inscription réussie !');
      console.log('📧 Un email de vérification devrait être envoyé à:', testUser.email);
    } else {
      console.log('❌ Erreur lors de l\'inscription');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  }
}

testRegistration();