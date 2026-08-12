import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source to use the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();

/**
 * Extract all text from a PDF file given its base64 data URL
 * @param {string} base64DataUrl - The base64 data URL of the PDF (e.g., "data:application/pdf;base64,...")
 * @returns {Promise<string>} - Extracted text from all pages
 */
export async function extractTextFromPDF(base64DataUrl) {
    try {
        // Convert base64 data URL to ArrayBuffer
        const base64 = base64DataUrl.includes(',') ? base64DataUrl.split(',')[1] : base64DataUrl;
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Load the PDF document
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const totalPages = pdf.numPages;
        let fullText = '';

        // Extract text from each page
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
        }

        return fullText.trim();
    } catch (error) {
        console.error('PDF extraction error:', error);
        throw new Error('Failed to extract text from PDF. Please try pasting the text manually.');
    }
}
