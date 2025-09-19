import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailVerificationProps {
  userFirstname?: string;
  verificationLink?: string;
}

const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

export const EmailVerification = ({
  userFirstname = 'Utilisateur',
  verificationLink = '',
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Vérifiez votre adresse email pour SaaS E-Commerce</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>🚀 SaaS E-Commerce</Heading>
        </Section>
        
        <Section style={heroSection}>
          <Heading style={h1}>Bienvenue, {userFirstname} !</Heading>
          <Text style={text}>
            Merci de vous être inscrit sur notre plateforme ! Pour finaliser votre inscription, 
            veuillez cliquer sur le bouton ci-dessous pour vérifier votre adresse email.
          </Text>
        </Section>

        <Section style={buttonSection}>
          <Button style={button} href={verificationLink}>
            ✅ Vérifier mon email
          </Button>
        </Section>

        <Section style={infoSection}>
          <Text style={infoText}>
            <strong>Lien direct :</strong><br />
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :
          </Text>
          <Link href={verificationLink} style={link}>
            {verificationLink}
          </Link>
        </Section>

        <Hr style={hr} />
        
        <Section style={footerSection}>
          <Text style={footer}>
            Ce lien expire dans 24 heures pour des raisons de sécurité.<br />
            Si vous n'avez pas créé de compte, ignorez cet email.
          </Text>
          <Text style={footer}>
            © 2024 SaaS E-Commerce. Tous droits réservés.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default EmailVerification;

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
  fontSize: '36px',
  fontWeight: '700',
  lineHeight: '42px',
  letterSpacing: '-0.5px',
  margin: '0 0 30px',
  textAlign: 'center' as const,
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
};

const buttonSection = {
  padding: '40px 20px',
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

const infoSection = {
  padding: '0 20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  margin: '0 20px',
};

const infoText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '20px 0 10px',
  margin: '0',
};

const link = {
  color: '#667eea',
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