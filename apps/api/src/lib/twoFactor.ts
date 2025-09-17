import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import crypto from 'crypto'

export class TwoFactorService {
  /**
   * Generate a new 2FA secret for a user
   */
  generateSecret(email: string, serviceName: string = 'SaaS App') {
    const secret = speakeasy.generateSecret({
      name: email,
      issuer: serviceName,
      length: 32,
    })

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    }
  }

  /**
   * Generate QR code data URL for the secret
   */
  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      return await qrcode.toDataURL(otpauthUrl)
    } catch (error) {
      throw new Error('Failed to generate QR code')
    }
  }

  /**
   * Verify a TOTP token
   */
  verifyToken(secret: string, token: string, window: number = 2): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window, // Allow some time drift
    })
  }

  /**
   * Generate backup codes for emergency access
   */
  generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      codes.push(code)
    }
    return codes
  }

  /**
   * Verify a backup code
   */
  verifyBackupCode(backupCodes: string[], code: string): boolean {
    const normalizedCode = code.replace(/\s+/g, '').toUpperCase()
    return backupCodes.includes(normalizedCode)
  }

  /**
   * Remove a used backup code
   */
  removeBackupCode(backupCodes: string[], usedCode: string): string[] {
    const normalizedCode = usedCode.replace(/\s+/g, '').toUpperCase()
    return backupCodes.filter(code => code !== normalizedCode)
  }

  /**
   * Check if user has enough backup codes left
   */
  shouldRegenerateBackupCodes(backupCodes: string[], threshold: number = 3): boolean {
    return backupCodes.length <= threshold
  }
}

export const twoFactorService = new TwoFactorService()
