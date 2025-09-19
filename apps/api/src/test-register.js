// Test d'inscription utilisateur
const testRegister = async () => {
  try {
    console.log('🧪 Test d\'inscription...');
    
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

    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Réponse JSON:', data);
    } catch (parseError) {
      console.log('❌ Impossible de parser le JSON. Réponse brute:', responseText);
    }

  } catch (error) {
    console.error('❌ Erreur de test:', error);
  }
};

testRegister();