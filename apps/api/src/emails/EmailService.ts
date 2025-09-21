import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import EmailVerificationTemplate from './templates/EmailVerification';
import WelcomeEmailTemplate from './templates/WelcomeEmail';
import PasswordResetTemplate from './templates/PasswordReset';

// Configuration du transporteur email
const createTransporter = () => {
  // Configuration pour développement (MailHog)
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: undefined,
    });
  }

  // Configuration pour production (Amazon SES ou autre)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private readonly transporter = createTransporter();

  private async sendEmail({ to, subject, html, text }: SendEmailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'ERZA <noreply@erza-fashion.com>',
        to,
        subject,
        html,
        text,
      });

      console.log('Email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationEmail(userEmail: string, userName: string | undefined, verificationToken: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const html = await render(
      EmailVerificationTemplate({
        userEmail,
        userName,
        verificationUrl,
      })
    );

    const text = `
Vérifiez votre adresse email

Bonjour ${userName || 'cher utilisateur'},

Merci de vous être inscrit sur ERZA ! Pour commencer à utiliser votre compte, nous devons vérifier votre adresse email.

Cliquez sur ce lien pour vérifier : ${verificationUrl}

Ce lien expirera dans 24 heures.
Si vous n'avez pas créé de compte ERZA, vous pouvez ignorer cet email.

© 2025 ERZA - Tous droits réservés
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Vérifiez votre adresse email - ERZA',
      html,
      text,
    });
  }

  async sendWelcomeEmail(userEmail: string, userName: string | undefined) {
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
    
    const html = await render(
      WelcomeEmailTemplate({
        userEmail,
        userName,
        dashboardUrl,
      })
    );

    const text = `
Bienvenue chez ERZA !

Salut ${userName || 'cher membre'} !

Ton email a été vérifié avec succès ! Bienvenue dans la communauté ERZA.

Accède à ton espace : ${dashboardUrl}

Offre de bienvenue : Utilise le code WELCOME10 pour 10% de réduction sur ta première commande !

© 2025 ERZA - Tous droits réservés
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Bienvenue chez ERZA ! 🎉',
      html,
      text,
    });
  }

  async sendPasswordResetEmail(userEmail: string, userName: string | undefined, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const html = await render(
      PasswordResetTemplate({
        userEmail,
        userName,
        resetUrl,
      })
    );

    const text = `
Réinitialisez votre mot de passe ERZA

Salut ${userName || 'cher utilisateur'} !

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte (${userEmail}).

Si vous avez fait cette demande, cliquez sur ce lien pour créer un nouveau mot de passe : ${resetUrl}

Ce lien expirera dans 1 heure pour votre sécurité.

Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.

© 2025 ERZA - Tous droits réservés
    `;

    return this.sendEmail({
      to: userEmail,
      subject: 'Réinitialisez votre mot de passe - ERZA',
      html,
      text,
    });
  }
}

export const emailService = new EmailService();