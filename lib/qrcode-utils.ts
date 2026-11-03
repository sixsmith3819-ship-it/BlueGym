import QRCode from 'qrcode'

/**
 * Generate a QR code as data URL
 * @param value - The value to encode (typically a verification URL or token)
 * @param options - QRCode options
 * @returns Base64 encoded PNG data URL
 */
export async function generateQRCodeDataURL(
  value: string,
  options?: {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    quality?: number
    margin?: number
    width?: number
    color?: {
      dark?: string
      light?: string
    }
  }
): Promise<string> {
  try {
    const qrOptions = {
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
      quality: options?.quality || 0.92,
      margin: options?.margin || 1,
      width: options?.width || 300,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#ffffff',
      },
    }

    const dataUrl = await QRCode.toDataURL(value, qrOptions)
    return dataUrl
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Generate a QR code and return as canvas element
 * @param value - The value to encode
 * @returns Canvas element with QR code
 */
export async function generateQRCodeCanvas(value: string): Promise<HTMLCanvasElement> {
  try {
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
    return canvas
  } catch (error) {
    console.error('Error generating QR code canvas:', error)
    throw new Error('Failed to generate QR code canvas')
  }
}

/**
 * Create a verification token for QR codes
 * Used to link QR codes to payments without exposing sensitive data
 */
export function createVerificationToken(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}`.toUpperCase()
}

/**
 * Generate a QR code verification URL
 * @param verificationToken - The unique verification token
 * @returns Full verification URL
 */
export function generateVerificationURL(verificationToken: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/verify/${verificationToken}`
}

/**
 * Generate QR for receipt display with Blue Gym branding colors
 */
export async function generateReceiptQRCode(
  verificationToken: string
): Promise<string> {
  const verificationURL = generateVerificationURL(verificationToken)

  return generateQRCodeDataURL(verificationURL, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 300,
    color: {
      dark: '#0066FF', // Blue Gym primary color
      light: '#FFFFFF',
    },
  })
}

export default {
  generateQRCodeDataURL,
  generateQRCodeCanvas,
  createVerificationToken,
  generateVerificationURL,
  generateReceiptQRCode,
}
