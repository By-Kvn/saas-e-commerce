import { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { emailService } from "../lib/email";
import { authMiddleware, AuthenticatedUser } from "../lib/auth";
import { twoFactorService } from "../lib/twoFactor";
import { requireAdmin } from "../lib/roles";

export async function authRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post<{
    Body: { email: string; password: string; name?: string };
  }>("/register", async (request, reply) => {
    const { email, password, name } = request.body;

    // Validation
    if (!email || !password) {
      return reply.code(400).send({ error: "Email et mot de passe requis" });
    }

    if (password.length < 8) {
      return reply
        .code(400)
        .send({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply
          .code(400)
          .send({ error: "Un utilisateur avec cet email existe déjà" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate email verification token
      const emailVerifyToken = emailService.generateToken();
      const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          emailVerifyToken,
          emailVerifyExpires,
        },
      });

      // Send verification email
      try {
        await emailService.sendEmailVerification(email, emailVerifyToken, name);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
        // Don't fail the registration if email fails
      }

      // Generate JWT token (user can use some features before email verification)
      const token = fastify.jwt.sign({ userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        token,
        message: "Inscription réussie. Veuillez vérifier votre email.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Login endpoint
  // Login endpoint
  fastify.post<{
    Body: { email: string; password: string };
  }>("/login", async (request, reply) => {
    const { email, password } = request.body;

    // Validation
    if (!email || !password) {
      return reply.code(400).send({ error: "Email et mot de passe requis" });
    }

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        return reply
          .code(401)
          .send({ error: "Email ou mot de passe incorrect" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply
          .code(401)
          .send({ error: "Email ou mot de passe incorrect" });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id, email: user.email });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
        token,
        message: "Connexion réussie",
      };
    } catch (error) {
      console.error("Login error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Email verification endpoint
  fastify.post<{
    Body: { token: string };
  }>("/verify-email", async (request, reply) => {
    const { token } = request.body;

    if (!token) {
      return reply.code(400).send({ error: "Token de vérification requis" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          emailVerifyToken: token,
          emailVerifyExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return reply
          .code(400)
          .send({ error: "Token de vérification invalide ou expiré" });
      }

      // Update user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerifyToken: null,
          emailVerifyExpires: null,
        },
      });

      return {
        message: "Email vérifié avec succès",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: true,
        },
      };
    } catch (error) {
      console.error("Email verification error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Resend verification email
  fastify.post<{
    Body: { email: string };
  }>("/resend-verification", async (request, reply) => {
    const { email } = request.body;

    if (!email) {
      return reply.code(400).send({ error: "Email requis" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.code(404).send({ error: "Utilisateur non trouvé" });
      }

      if (user.emailVerified) {
        return reply.code(400).send({ error: "Email déjà vérifié" });
      }

      // Generate new verification token
      const emailVerifyToken = emailService.generateToken();
      const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifyToken,
          emailVerifyExpires,
        },
      });

      // Send verification email
      await emailService.sendEmailVerification(
        email,
        emailVerifyToken,
        user.name || "Utilisateur"
      );

      return {
        message: "Email de vérification renvoyé",
      };
    } catch (error) {
      console.error("Resend verification error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Forgot password endpoint
  fastify.post<{
    Body: { email: string };
  }>("/forgot-password", async (request, reply) => {
    const { email } = request.body;

    if (!email) {
      return reply.code(400).send({ error: "Email requis" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message:
            "Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.",
        };
      }

      // Generate reset token
      const passwordResetToken = emailService.generateToken();
      const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken,
          passwordResetExpires,
        },
      });

      // Send reset email
      try {
        await emailService.sendPasswordReset(
          email,
          passwordResetToken,
          user.name || "Utilisateur"
        );
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        return reply
          .code(500)
          .send({ error: "Erreur lors de l'envoi de l'email" });
      }

      return {
        message:
          "Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.",
      };
    } catch (error) {
      console.error("Forgot password error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Reset password endpoint
  fastify.post<{
    Body: { token: string; password: string };
  }>("/reset-password", async (request, reply) => {
    const { token, password } = request.body;

    if (!token || !password) {
      return reply
        .code(400)
        .send({ error: "Token et nouveau mot de passe requis" });
    }

    if (password.length < 8) {
      return reply
        .code(400)
        .send({ error: "Le mot de passe doit contenir au moins 8 caractères" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return reply
          .code(400)
          .send({ error: "Token de réinitialisation invalide ou expiré" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
        },
      });

      return {
        message: "Mot de passe réinitialisé avec succès",
      };
    } catch (error) {
      console.error("Reset password error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Get current user profile (protected route)
  fastify.get(
    "/me",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const user = (request as any).currentUser as AuthenticatedUser;
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified,
        },
      };
    }
  );

  // Update user profile (protected route)
  fastify.put<{
    Body: { name?: string; email?: string };
  }>(
    "/profile",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { name, email } = request.body;
      const currentUser = (request as any).currentUser as AuthenticatedUser;

      try {
        // If email is being changed, check if it's already taken
        if (email && email !== currentUser.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (existingUser) {
            return reply
              .code(400)
              .send({ error: "Cet email est déjà utilisé" });
          }
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email && email !== currentUser.email) {
          updateData.email = email;
          updateData.emailVerified = false; // Reset email verification if email changes

          // Generate new verification token
          const emailVerifyToken = emailService.generateToken();
          const emailVerifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
          updateData.emailVerifyToken = emailVerifyToken;
          updateData.emailVerifyExpires = emailVerifyExpires;

          // Send verification email to new address
          try {
            await emailService.sendEmailVerification(
              email,
              emailVerifyToken,
              name || currentUser.name
            );
          } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
          }
        }

        const updatedUser = await prisma.user.update({
          where: { id: currentUser.id },
          data: updateData,
          select: {
            id: true,
            email: true,
            name: true,
            emailVerified: true,
          },
        });

        return {
          user: updatedUser,
          message:
            email && email !== currentUser.email
              ? "Profil mis à jour. Veuillez vérifier votre nouvel email."
              : "Profil mis à jour avec succès",
        };
      } catch (error) {
        console.error("Profile update error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Change password (protected route)
  fastify.post<{
    Body: { currentPassword: string; newPassword: string };
  }>(
    "/change-password",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { currentPassword, newPassword } = request.body;
      const currentUser = (request as any).currentUser as AuthenticatedUser;

      if (!currentPassword || !newPassword) {
        return reply.code(400).send({
          error: "Mot de passe actuel et nouveau mot de passe requis",
        });
      }

      if (newPassword.length < 8) {
        return reply.code(400).send({
          error: "Le nouveau mot de passe doit contenir au moins 8 caractères",
        });
      }

      try {
        // Get current user with password
        const user = await prisma.user.findUnique({
          where: { id: currentUser.id },
        });

        if (!user?.password) {
          return reply.code(404).send({ error: "Utilisateur non trouvé" });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isValidPassword) {
          return reply
            .code(400)
            .send({ error: "Mot de passe actuel incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword },
        });

        return {
          message: "Mot de passe changé avec succès",
        };
      } catch (error) {
        console.error("Change password error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Logout endpoint (client-side token invalidation)
  fastify.post("/logout", async (request, reply) => {
    return {
      message: "Déconnexion réussie",
    };
  });

  // OAuth Routes
  // Google OAuth
  fastify.get("/google", async (request, reply) => {
    const redirectUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || "")}&` +
      `scope=profile email&` +
      `response_type=code&` +
      `access_type=offline`;

    return reply.redirect(redirectUrl);
  });

  fastify.get("/google/callback", async (request, reply) => {
    try {
      const { code } = request.query as { code?: string };

      if (!code) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Exchange code for tokens
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || "",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
          code,
          grant_type: "authorization_code",
          redirect_uri: process.env.GOOGLE_CALLBACK_URL || "",
        }),
      });

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Get user info from Google
      const userResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      );

      const googleUser = await userResponse.json();

      if (!googleUser.email) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Check if user exists or create new user
      let user = await prisma.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name || googleUser.email.split("@")[0],
            emailVerified: true, // Google emails are verified
          },
        });

        // Create OAuth account
        await prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: "GOOGLE",
            providerAccountId: googleUser.id,
          },
        });
      } else {
        // Check if OAuth account exists
        const existingOAuth = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "GOOGLE",
              providerAccountId: googleUser.id,
            },
          },
        });

        if (!existingOAuth) {
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: "GOOGLE",
              providerAccountId: googleUser.id,
            },
          });
        }
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id, email: user.email });

      // Redirect to frontend with token
      return reply.redirect(
        `${process.env.FRONTEND_URL}/oauth-callback?token=${token}&provider=google`
      );
    } catch (error) {
      console.error("Google OAuth error:", error);
      return reply.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`
      );
    }
  });

  // GitHub OAuth
  fastify.get("/github", async (request, reply) => {
    const redirectUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${process.env.GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL || "")}&` +
      `scope=user:email`;

    return reply.redirect(redirectUrl);
  });

  fastify.get("/github/callback", async (request, reply) => {
    try {
      const { code } = request.query as { code?: string };

      if (!code) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Exchange code for access token
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          }),
        }
      );

      const tokens = await tokenResponse.json();

      if (!tokens.access_token) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Get user info from GitHub
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "User-Agent": "SaaS-App",
        },
      });

      const githubUser = await userResponse.json();

      // Get user emails from GitHub (emails might be private)
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          "User-Agent": "SaaS-App",
        },
      });

      const emails = await emailResponse.json();
      const primaryEmail =
        emails.find((email: any) => email.primary)?.email || githubUser.email;

      if (!primaryEmail) {
        return reply.redirect(
          `${process.env.FRONTEND_URL}/login?error=oauth_failed`
        );
      }

      // Check if user exists or create new user
      let user = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: primaryEmail,
            name:
              githubUser.name || githubUser.login || primaryEmail.split("@")[0],
            emailVerified: true, // GitHub emails are verified
          },
        });

        // Create OAuth account
        await prisma.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: "GITHUB",
            providerAccountId: githubUser.id.toString(),
          },
        });
      } else {
        // Check if OAuth account exists
        const existingOAuth = await prisma.oAuthAccount.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "GITHUB",
              providerAccountId: githubUser.id.toString(),
            },
          },
        });

        if (!existingOAuth) {
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: "GITHUB",
              providerAccountId: githubUser.id.toString(),
            },
          });
        }
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id, email: user.email });

      // Redirect to frontend with token
      return reply.redirect(
        `${process.env.FRONTEND_URL}/oauth-callback?token=${token}&provider=github`
      );
    } catch (error) {
      console.error("GitHub OAuth error:", error);
      return reply.redirect(
        `${process.env.FRONTEND_URL}/login?error=oauth_failed`
      );
    }
  });

  // 2FA Routes
  // Setup 2FA
  fastify.post(
    "/2fa/setup",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const currentUser = (request as any).currentUser as AuthenticatedUser;

      try {
        const user = await prisma.user.findUnique({
          where: { id: currentUser.id },
        });

        if (!user) {
          return reply.code(404).send({ error: "Utilisateur non trouvé" });
        }

        if (user.twoFactorEnabled) {
          return reply.code(400).send({ error: "2FA déjà activé" });
        }

        // Generate secret
        const { secret, otpauthUrl } = twoFactorService.generateSecret(
          user.email,
          "SaaS App"
        );

        // Generate QR code
        const qrCodeDataUrl = otpauthUrl
          ? await twoFactorService.generateQRCode(otpauthUrl)
          : null;

        // Store temporary secret (not yet confirmed)
        await prisma.user.update({
          where: { id: user.id },
          data: { twoFactorSecret: secret },
        });

        return {
          secret,
          qrCode: qrCodeDataUrl,
          message:
            "Scannez le QR code avec votre app d'authentification et entrez le code pour confirmer",
        };
      } catch (error) {
        console.error("2FA setup error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Confirm 2FA setup
  fastify.post<{
    Body: { token: string };
  }>(
    "/2fa/confirm",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { token } = request.body;
      const currentUser = (request as any).currentUser as AuthenticatedUser;

      if (!token) {
        return reply.code(400).send({ error: "Code 2FA requis" });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: currentUser.id },
        });

        if (!user || !user.twoFactorSecret) {
          return reply
            .code(400)
            .send({ error: "Configuration 2FA non trouvée" });
        }

        // Verify token
        const isValid = twoFactorService.verifyToken(
          user.twoFactorSecret,
          token
        );

        if (!isValid) {
          return reply.code(400).send({ error: "Code 2FA invalide" });
        }

        // Generate backup codes
        const backupCodes = twoFactorService.generateBackupCodes();

        // Enable 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorEnabled: true,
            backupCodes: JSON.stringify(backupCodes),
          },
        });

        return {
          backupCodes,
          message:
            "2FA activé avec succès. Sauvegardez ces codes de secours en lieu sûr.",
        };
      } catch (error) {
        console.error("2FA confirm error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Disable 2FA
  fastify.post<{
    Body: { password?: string; token?: string; backupCode?: string };
  }>(
    "/2fa/disable",
    {
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { password, token, backupCode } = request.body;
      const currentUser = (request as any).currentUser as AuthenticatedUser;

      try {
        const user = await prisma.user.findUnique({
          where: { id: currentUser.id },
        });

        if (!user) {
          return reply.code(404).send({ error: "Utilisateur non trouvé" });
        }

        if (!user.twoFactorEnabled) {
          return reply.code(400).send({ error: "2FA non activé" });
        }

        // Verify identity with password or 2FA
        let isAuthorized = false;

        if (password && user.password) {
          isAuthorized = await bcrypt.compare(password, user.password);
        } else if (token && user.twoFactorSecret) {
          isAuthorized = twoFactorService.verifyToken(
            user.twoFactorSecret,
            token
          );
        } else if (backupCode) {
          isAuthorized = twoFactorService.verifyBackupCode(
            user.backupCodes,
            backupCode
          );
        }

        if (!isAuthorized) {
          return reply.code(400).send({ error: "Authentification invalide" });
        }

        // Disable 2FA
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorEnabled: false,
            twoFactorSecret: null,
            backupCodes: JSON.stringify([]),
          },
        });

        return {
          message: "2FA désactivé avec succès",
        };
      } catch (error) {
        console.error("2FA disable error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Verify 2FA token (for login)
  fastify.post<{
    Body: {
      email: string;
      password: string;
      token?: string;
      backupCode?: string;
    };
  }>("/login-2fa", async (request, reply) => {
    const { email, password, token, backupCode } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ error: "Email et mot de passe requis" });
    }

    if (!token && !backupCode) {
      return reply
        .code(400)
        .send({ error: "Code 2FA ou code de secours requis" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        return reply.code(401).send({ error: "Identifiants incorrects" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.code(401).send({ error: "Identifiants incorrects" });
      }

      if (!user.twoFactorEnabled) {
        return reply
          .code(400)
          .send({ error: "2FA non activé pour cet utilisateur" });
      }

      // Verify 2FA
      let is2FAValid = false;
      let updatedBackupCodes = user.backupCodes;

      if (token && user.twoFactorSecret) {
        is2FAValid = twoFactorService.verifyToken(user.twoFactorSecret, token);
      } else if (backupCode) {
        const codes = JSON.parse(user.backupCodes || "[]");
        is2FAValid = twoFactorService.verifyBackupCode(codes, backupCode);
        if (is2FAValid) {
          // Remove used backup code
          const updatedBackupCodesArray = twoFactorService.removeBackupCode(
            codes,
            backupCode
          );
          await prisma.user.update({
            where: { id: user.id },
            data: { backupCodes: JSON.stringify(updatedBackupCodesArray) },
          });
        }
      }

      if (!is2FAValid) {
        return reply.code(400).send({ error: "Code 2FA invalide" });
      }

      // Generate JWT token
      const jwtToken = fastify.jwt.sign({ userId: user.id, email: user.email });

      // Check if backup codes need regeneration
      const shouldRegenerate = twoFactorService.shouldRegenerateBackupCodes(
        JSON.parse(updatedBackupCodes || "[]")
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        token: jwtToken,
        message: "Connexion réussie",
        backupCodesLow: shouldRegenerate,
      };
    } catch (error) {
      console.error("2FA login error:", error);
      return reply.code(500).send({ error: "Erreur interne du serveur" });
    }
  });

  // Admin Routes
  // Get all users (admin only)
  fastify.get(
    "/admin/users",
    {
      preHandler: [authMiddleware, requireAdmin()],
    },
    async (request, reply) => {
      try {
        const users = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            twoFactorEnabled: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                subscriptions: true,
                oauthAccounts: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });

        return { users };
      } catch (error) {
        console.error("Admin users error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );

  // Update user role (admin only)
  fastify.put<{
    Body: { userId: string; role: string };
  }>(
    "/admin/users/role",
    {
      preHandler: [authMiddleware, requireAdmin()],
    },
    async (request, reply) => {
      const { userId, role } = request.body;

      if (!userId || !role) {
        return reply.code(400).send({ error: "ID utilisateur et rôle requis" });
      }

      if (!["USER", "PREMIUM", "ADMIN"].includes(role)) {
        return reply.code(400).send({ error: "Rôle invalide" });
      }

      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: role as any },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });

        return {
          user: updatedUser,
          message: "Rôle mis à jour avec succès",
        };
      } catch (error) {
        console.error("Update role error:", error);
        return reply.code(500).send({ error: "Erreur interne du serveur" });
      }
    }
  );
}
