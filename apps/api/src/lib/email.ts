import * as nodemailer from 'nodemailer';
import crypto from 'crypto';
import { render } from '@react-email/render';
import EmailVerification from '../emails/EmailVerification';
import PasswordReset from '../emails/PasswordReset';
import WelcomeEmail from '../emails/WelcomeEmail';

export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = null;
  }

  async init() {
    try {
      console.log('🔧 Initialisation du service email...');
      console.log(`📍 Variables d'environnement détectées:`);
      console.log(`   - SMTP_USER: ${process.env.SMTP_USER ? '✅ Configuré' : '❌ Manquant'}`);
      console.log(`   - SMTP_PASSWORD: ${process.env.SMTP_PASSWORD ? '✅ Configuré' : '❌ Manquant'}`);
      console.log(`   - SMTP_HOST: ${process.env.SMTP_HOST || 'smtp.gmail.com (par défaut)'}`);
      console.log(`   - SMTP_PORT: ${process.env.SMTP_PORT || '587 (par défaut)'}`);
      
      if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        console.log('🎯 Configuration SMTP détectée, tentative de connexion...');
        
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
          }
        });

        try {
          console.log('🔌 Test de connexion au serveur SMTP...');
          await this.transporter.verify();
          
          console.log('✅ Service email initialisé avec SMTP personnalisé');
          console.log(`📧 Serveur: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
          console.log(`👤 Utilisateur: ${process.env.SMTP_USER}`);
          console.log('🚀 Prêt à envoyer des emails réels !');
          
          return true;
        } catch (smtpError) {
          console.error('❌ Erreur de connexion SMTP:', smtpError);
          console.log('🔧 Vérifiez vos identifiants Gmail et mot de passe d\'application');
          console.log('🔄 Basculement vers mode test (Ethereal)...');
        }
      } else {
        console.log('⚠️  Aucune configuration SMTP trouvée.');
        console.log('📝 Pour envoyer des vrais emails, configurez dans .env :');
        console.log('   SMTP_USER=votre.email@gmail.com');
        console.log('   SMTP_PASSWORD=votre-mot-de-passe-app');
      }
      
      console.log('🧪 Configuration du mode test avec Ethereal Email...');
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log('🧪 Service email initialisé en mode TEST (Ethereal Email)');
      console.log(`📧 Compte test: ${testAccount.user}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur initialisation email:', error);
      return false;
    }
  }

  async sendEmailVerification(email: string, token: string, name?: string) {
    if (!this.transporter) {
      await this.init();
    }

    console.log(`📧 Tentative d'envoi email de vérification à: ${email}`);

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    const userName = name || 'Utilisateur';
    
    // Génération du HTML avec React Email
    const emailHtml = await render(EmailVerification({ 
      userFirstname: userName, 
      verificationLink 
    }));
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'SaaS E-Commerce'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@saas-ecommerce.com'}>`,
      to: email,
      subject: 'Vérifiez votre adresse email - SaaS E-Commerce',
      html: emailHtml,
    };

    try {
      console.log('📤 Envoi de l\'email en cours...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de vérification envoyé à:', email);
      console.log('📬 Message ID:', info.messageId);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Voir l\'email (test) ici:', previewUrl);
        console.log('⚠️  ATTENTION: Ceci est un email de TEST, pas un vrai envoi !');
      } else if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
        console.log('📧 Email réel envoyé avec succès !');
        console.log(`📬 L'utilisateur ${email} devrait recevoir l'email dans quelques minutes`);
        console.log('🔍 Vérifiez votre boîte email (et le dossier spam)');
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl,
        isRealEmail: !previewUrl,
        info: 'Email envoyé avec succès'
      };
    } catch (error: any) {
      console.error('❌ Erreur envoi email de vérification:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(email: string, token: string, name?: string) {
    if (!this.transporter) {
      await this.init();
    }

    console.log(`📧 Tentative d'envoi email de reset password à: ${email}`);

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const userName = name || 'Utilisateur';
    
    // Génération du HTML avec React Email
    const emailHtml = await render(PasswordReset({ 
      userFirstname: userName, 
      resetLink 
    }));
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'SaaS E-Commerce'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@saas-ecommerce.com'}>`,
      to: email,
      subject: 'Réinitialisation de mot de passe - SaaS E-Commerce',
      html: emailHtml,
    };

    try {
      console.log('📤 Envoi de l\'email de reset en cours...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de reset envoyé à:', email);
      console.log('📬 Message ID:', info.messageId);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Voir l\'email (test) ici:', previewUrl);
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl,
        info: 'Email de reset envoyé avec succès'
      };
    } catch (error: any) {
      console.error('❌ Erreur envoi email de reset:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(email: string, name?: string) {
    if (!this.transporter) {
      await this.init();
    }

    console.log(`📧 Tentative d'envoi email de bienvenue à: ${email}`);

    const dashboardLink = `http://localhost:3000/dashboard`;
    const userName = name || 'Utilisateur';
    
    // Génération du HTML avec React Email
    const emailHtml = await render(WelcomeEmail({ 
      userFirstname: userName, 
      dashboardLink 
    }));
    
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'SaaS E-Commerce'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER || 'noreply@saas-ecommerce.com'}>`,
      to: email,
      subject: '🎉 Bienvenue sur SaaS E-Commerce ! Votre compte est actif',
      html: emailHtml,
    };

    try {
      console.log('📤 Envoi de l\'email de bienvenue en cours...');
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de bienvenue envoyé à:', email);
      console.log('📬 Message ID:', info.messageId);
      
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('🔗 Voir l\'email (test) ici:', previewUrl);
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl,
        info: 'Email de bienvenue envoyé avec succès'
      };
    } catch (error: any) {
      console.error('❌ Erreur envoi email de bienvenue:', error);
      return { success: false, error: error.message };
    }
  }

  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const emailService = new EmailService();
