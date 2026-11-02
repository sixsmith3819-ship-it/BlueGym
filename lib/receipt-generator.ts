import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Generate a PDF receipt from an HTML element
 * @param elementId - ID of the HTML element to convert to PDF
 * @param fileName - Name for the downloaded PDF file
 */
export async function generatePDFReceipt(
  elementId: string,
  fileName: string = 'receipt.pdf'
): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    // Convert HTML to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    // Get canvas dimensions
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let position = 10
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)

    // Handle multiple pages if content is longer
    if (imgHeight > pageHeight - 20) {
      let heightLeft = imgHeight - (pageHeight - 20)
      position = heightLeft - pageHeight
      while (heightLeft > 0) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        position -= pageHeight
      }
    }

    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF receipt')
  }
}

/**
 * Download a data URL as a file
 * @param dataUrl - The data URL to download
 * @param fileName - Name for the downloaded file
 */
export function downloadFile(dataUrl: string, fileName: string): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate receipt filename with date
 */
export function generateReceiptFileName(receiptNumber: string): string {
  const date = new Date().toISOString().split('T')[0]
  return `receipt-${receiptNumber}-${date}.pdf`
}

/**
 * Print receipt using browser print dialog
 */
export async function printReceipt(elementId: string): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`)
    }

    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) {
      throw new Error('Could not open print window')
    }

    printWindow.document.write('<html><head><title>Receipt</title></head><body>')
    printWindow.document.write(element.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()

    printWindow.onload = () => {
      printWindow.print()
    }
  } catch (error) {
    console.error('Error printing receipt:', error)
    throw new Error('Failed to print receipt')
  }
}

export default {
  generatePDFReceipt,
  downloadFile,
  generateReceiptFileName,
  printReceipt,
}
