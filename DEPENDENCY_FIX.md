# Dependency Fix - QR Code Library

## Problem
```
npm error peer react@"^15.5.3 || ^16.0.0 || ^17.0.0" from qrcode.react@1.0.1
```

The `qrcode.react` package only supports React 15-17, but we're using React 19.3.0.

## Solution
Replaced `qrcode.react` with `qrcode` - a modern QR code library that supports React 19+.

### Changes Made to `package.json`

**Removed:**
```json
"qrcode.react": "^1.0.1"
"@types/qrcode.react": "^1.0.5"
```

**Added:**
```json
"qrcode": "^1.5.3"
"@types/qrcode": "^1.5.5"
```

## Usage

### Old Way (No longer works)
```typescript
import QRCode from 'qrcode.react'

<QRCode value="https://example.com" />
```

### New Way
```typescript
import QRCode from 'qrcode'

// Generate as data URL
const dataUrl = await QRCode.toDataURL('https://example.com')

// Generate as canvas
const canvas = await QRCode.toCanvas(element, 'https://example.com')
```

## Utilities Created

Two utility files have been created for convenient QR code and receipt handling:

### 1. `lib/qrcode-utils.ts`
Provides wrapper functions:
- `generateQRCodeDataURL(value, options)` - Get QR as base64 PNG
- `generateQRCodeCanvas(value)` - Get QR as canvas element
- `createVerificationToken()` - Generate unique tokens
- `generateVerificationURL(token)` - Create verification links
- `generateReceiptQRCode(token)` - Generate branded QR codes

### 2. `lib/receipt-generator.ts`
Provides receipt utilities:
- `generatePDFReceipt(elementId, fileName)` - HTML to PDF
- `downloadFile(dataUrl, fileName)` - Download files
- `generateReceiptFileName(receiptNumber)` - Create filenames
- `printReceipt(elementId)` - Print receipts

## Installation

```bash
cd "c:\Users\terre\Desktop\Blue Gym\blue-gym"

# Clean install
Remove-Item -Recurse -Force node_modules package-lock.json
npm install

# Or if conflicts persist
npm install --legacy-peer-deps
```

## Verification

After installation, verify the package is installed:
```bash
npm ls qrcode
```

Should show:
```
blue-gym@0.1.0
└── qrcode@1.5.3
```

---

**Status**: ✅ Fixed - Ready for development
