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
   * Verify a backup code - handles both JSON string from DB and array input
   */
  verifyBackupCode(backupCodes: string[] | string | null, code: string): boolean {
    const normalizedCode = code.replace(/\s+/g, '').toUpperCase()
    const codesArray = this.parseBackupCodes(backupCodes)
    return codesArray.includes(normalizedCode)
  }

  /**
   * Remove a used backup code - handles both JSON string from DB and array input
   */
  removeBackupCode(backupCodes: string[] | string | null, usedCode: string): string[] {
    const normalizedCode = usedCode.replace(/\s+/g, '').toUpperCase()
    const codesArray = this.parseBackupCodes(backupCodes)
    return codesArray.filter(code => code !== normalizedCode)
  }

  /**
   * Check if user has enough backup codes left - handles both JSON string from DB and array input
   */
  shouldRegenerateBackupCodes(backupCodes: string[] | string | null, threshold: number = 3): boolean {
    const codesArray = this.parseBackupCodes(backupCodes)
    return codesArray.length <= threshold
  }

  /**
   * Parse backup codes from database (JSON string) or direct array
   */
  private parseBackupCodes(backupCodes: string[] | string | null): string[] {
    if (!backupCodes) return []
    if (Array.isArray(backupCodes)) return backupCodes
    try {
      return JSON.parse(backupCodes) as string[]
    } catch {
      return []
    }
  }

  /**
   * Serialize backup codes for database storage
   */
  serializeBackupCodes(backupCodes: string[]): string {
    return JSON.stringify(backupCodes)
  }
}

export const twoFactorService = new TwoFactorService()
