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

interface PasswordResetProps {
  userFirstname?: string;
  resetLink?: string;
}

export const PasswordReset = ({
  userFirstname = 'Utilisateur',
  resetLink = '',
}: PasswordResetProps) => (
  <Html>
    <Head />
    <Preview>Réinitialisez votre mot de passe pour SaaS E-Commerce</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>🚀 SaaS E-Commerce</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h1}>Réinitialisation du mot de passe</Heading>
          <Text style={text}>
            Bonjour {userFirstname},
          </Text>
          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe. 
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={resetLink}>
            🔒 Réinitialiser mon mot de passe
          </Button>
        </Section>

        <Section style={warningSection}>
          <Text style={warningText}>
            ⚠️ <strong>Important :</strong> Si vous n'avez pas demandé cette réinitialisation, 
            ignorez cet email. Votre compte reste sécurisé.
          </Text>
        </Section>

        <Section style={infoSection}>
          <Text style={infoText}>
            <strong>Lien direct :</strong><br />
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
          </Text>
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
        </Section>

        <Hr style={hr} />
        
        <Section style={footerSection}>
          <Text style={footer}>
            Ce lien expire dans 1 heure pour des raisons de sécurité.<br />
            Pour votre sécurité, ne partagez jamais ce lien avec personne.
          </Text>
          <Text style={footer}>
            © 2024 SaaS E-Commerce. Tous droits réservés.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordReset;

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
  backgroundColor: '#f093fb',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
  backgroundColor: '#f093fb',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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

const warningSection = {
  padding: '20px',
  backgroundColor: '#fff3cd',
  borderRadius: '8px',
  border: '1px solid #ffeaa7',
  margin: '20px',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0',
};

const infoSection = {
  padding: '0 20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  margin: '20px',
};

const infoText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '20px 0 10px',
  margin: '0',
};

const link = {
  color: '#f093fb',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
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