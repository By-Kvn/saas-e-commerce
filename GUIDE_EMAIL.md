# 📧 Configuration Email - Guide pour VRAIS EMAILS

## ✅ Pour envoyer des emails aux utilisateurs qui s'inscrivent

### 🎯 Configuration Gmail (Recommandée - Gratuite)

1. **Activez la validation en 2 étapes** sur votre compte Google
2. **Générez un mot de passe d'application** :
   - https://myaccount.google.com/
   - Sécurité → Mots de passe d'application
   - Choisissez "Autre" → "SaaS E-Commerce"
   - Copiez le mot de passe de 16 caractères

3. **Modifiez `/apps/api/.env`** avec vos vraies informations :
```bash
SMTP_USER="votre.email@gmail.com"
SMTP_PASSWORD="abcd efgh ijkl mnop"  # Mot de passe d'application
FROM_EMAIL="votre.email@gmail.com"
FROM_NAME="Votre Nom"
```

4. **Redémarrez l'API** : `npm run dev`

### 🧪 Test

Inscrivez-vous avec votre vraie adresse email et vous recevrez l'email de vérification !

### ⚡ Autres options

**SendGrid (Professionnel)**
```bash
SMTP_HOST="smtp.sendgrid.net"
SMTP_USER="apikey" 
SMTP_PASSWORD="votre-api-key"
```

**Outlook**
```bash
SMTP_HOST="smtp-mail.outlook.com"
SMTP_USER="votre@outlook.com"
SMTP_PASSWORD="votre-mot-de-passe"
```