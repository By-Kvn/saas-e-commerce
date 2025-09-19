# Alternative Email Configurations

## Gmail Configuration
Pour utiliser Gmail, vous devez :
1. Activer la vérification en 2 étapes sur votre compte Google
2. Générer un "Mot de passe d'application" dans Google Account Settings
3. Utiliser ce mot de passe dans SMTP_PASSWORD

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-application"
FROM_EMAIL="votre-email@gmail.com"
```

## Mailtrap Configuration (Recommandé pour test)
Service gratuit jusqu'à 100 emails/mois
1. Créer un compte sur https://mailtrap.io/
2. Créer une inbox
3. Copier les paramètres SMTP

```env
SMTP_HOST="sandbox.smtp.mailtrap.io"
SMTP_PORT="2525"
SMTP_SECURE="false"
SMTP_USER="votre-username-mailtrap"
SMTP_PASSWORD="votre-password-mailtrap"
FROM_EMAIL="noreply@votreapp.com"
```

## SendGrid Configuration (Production)
Service professionnel avec API
1. Créer un compte sur https://sendgrid.com/
2. Générer une API key
3. Configurer

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="apikey"
SMTP_PASSWORD="votre-sendgrid-api-key"
FROM_EMAIL="noreply@votredomaine.com"
```

## Outlook/Hotmail Configuration
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="votre-email@outlook.com"
SMTP_PASSWORD="votre-mot-de-passe"
FROM_EMAIL="votre-email@outlook.com"
```