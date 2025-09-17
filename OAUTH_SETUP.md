# Configuration OAuth

Pour utiliser l'authentification OAuth avec Google et GitHub, vous devez configurer vos clés d'application.

## Google OAuth Configuration

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google+ 
4. Créez des identifiants OAuth 2.0 :
   - Type d'application : Application Web
   - URI de redirection autorisées : `http://localhost:3001/api/auth/google/callback`
5. Copiez le Client ID et Client Secret dans votre fichier `.env` :

```env
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"
```

## GitHub OAuth Configuration

1. Allez sur [GitHub Developer Settings](https://github.com/settings/developers)
2. Cliquez sur "New OAuth App"
3. Remplissez les informations :
   - Application name : SaaS App
   - Homepage URL : `http://localhost:3000`
   - Authorization callback URL : `http://localhost:3001/api/auth/github/callback`
4. Copiez le Client ID et générez un Client Secret
5. Ajoutez-les dans votre fichier `.env` :

```env
GITHUB_CLIENT_ID="votre-github-client-id"
GITHUB_CLIENT_SECRET="votre-github-client-secret"
```

## Pour la production

Assurez-vous de :
1. Changer les URLs de callback pour votre domaine de production
2. Utiliser HTTPS pour toutes les URLs
3. Garder vos clés secrètes en sécurité (variables d'environnement)

## Test en développement

Si vous ne configurez pas OAuth, les boutons OAuth afficheront un message d'erreur explicatif au lieu de rediriger vers Google/GitHub.
