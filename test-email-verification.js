// Script de test pour voir les emails
const testEmailVerification = async () => {
  try {
    console.log('🧪 Test d\'inscription avec email...');
    
    const response = await fetch('http://localhost:3002/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Utilisateur Test',
        email: 'test@example.com',
        password: 'motdepasse123'
      }),
    });

    console.log('📡 Status de la réponse:', response.status);
    
    const data = await response.json();
    console.log('📧 Réponse:', data);

    if (data.success || response.ok) {
      console.log('✅ Inscription réussie !');
      console.log('📬 Vérifiez la console de l\'API pour l\'URL de prévisualisation de l\'email');
    } else {
      console.log('❌ Erreur:', data);
    }

  } catch (error) {
    console.error('❌ Erreur de test:', error);
  }
};

testEmailVerification();