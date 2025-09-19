import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userFirstname?: string;
  dashboardLink?: string;
}

export const WelcomeEmail = ({
  userFirstname = 'Utilisateur',
  dashboardLink = 'http://localhost:3000/dashboard',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue sur SaaS E-Commerce ! Votre compte est maintenant actif.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>🚀 SaaS E-Commerce</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h1}>🎉 Bienvenue {userFirstname} !</Heading>
          <Text style={text}>
            Félicitations ! Votre compte SaaS E-Commerce est maintenant actif et vérifié.
          </Text>
          <Text style={text}>
            Vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme
            et commencer à développer votre activité en ligne.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={dashboardLink}>
            🏠 Accéder à mon tableau de bord
          </Button>
        </Section>

        <Section style={featuresSection}>
          <Heading style={featuresTitle}>Ce que vous pouvez faire maintenant :</Heading>
          
          <div style={featureItem}>
            <Text style={featureText}>
              <strong>💳 Gérer vos abonnements</strong><br />
              Consultez et modifiez vos plans d'abonnement
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureText}>
              <strong>📊 Analyser vos données</strong><br />
              Accédez aux statistiques détaillées de votre activité
            </Text>
          </div>
          
          <div style={featureItem}>
            <Text style={featureText}>
              <strong>🛠️ Personnaliser votre profil</strong><br />
              Configurez vos préférences et paramètres
            </Text>
          </div>
        </Section>

        <Section style={supportSection}>
          <Text style={supportText}>
            <strong>Besoin d'aide ?</strong><br />
            Notre équipe support est là pour vous accompagner dans vos premiers pas.
          </Text>
          <Link href="mailto:support@saas-ecommerce.com" style={supportLink}>
            📧 Contacter le support
          </Link>
        </Section>

        <Hr style={hr} />
        
        <Section style={footerSection}>
          <Text style={footer}>
            Merci de faire confiance à SaaS E-Commerce pour votre activité !
          </Text>
          <Text style={footer}>
            © 2024 SaaS E-Commerce. Tous droits réservés.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#667eea',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

const logo = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const heroSection = {
  padding: '40px 20px 0',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  letterSpacing: '-0.5px',
  margin: '0 0 30px',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const buttonSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#667eea',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '25px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: 'auto',
  padding: '12px 20px',
};

const featuresSection = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  margin: '20px',
};

const featuresTitle = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const featureItem = {
  margin: '0 0 20px',
  padding: '15px',
  backgroundColor: '#ffffff',
  borderRadius: '6px',
  border: '1px solid #e9ecef',
};

const featureText = {
  color: '#484848',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const supportSection = {
  padding: '20px',
  textAlign: 'center' as const,
  backgroundColor: '#e8f4fd',
  borderRadius: '8px',
  border: '1px solid #bee5eb',
  margin: '20px',
};

const supportText = {
  color: '#0c5460',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 15px',
};

const supportLink = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
};

const hr = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '40px 20px',
};

const footerSection = {
  padding: '0 20px',
};

const footer = {
  color: '#9ca299',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
};