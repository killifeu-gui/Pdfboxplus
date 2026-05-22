package com.pdfcorba.service;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;
import java.io.File;
import java.io.IOException;

public class PdfServiceTest {

    private PdfService pdfService;
    private static final String TEST_DIR = "test-output";

    @Before
    public void setUp() {
        pdfService = new PdfService();
        File dir = new File(TEST_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @Test
    public void testCreatePdf() throws IOException {
        String text = "Test PDF Content";
        String outputPath = TEST_DIR + "/test.pdf";
        
        File result = pdfService.createPdf(text, outputPath);
        
        assertTrue("PDF should be created", result.exists());
        assertTrue("PDF should have content", result.length() > 0);
    }

    @Test
    public void testValidateFileExtension() {
        assertTrue("Should accept .pdf files", pdfService.validateFileExtension("document.pdf"));
        assertFalse("Should reject non-PDF files", pdfService.validateFileExtension("document.txt"));
    }

    @Test
    public void testValidateFileSize() throws IOException {
        File testFile = new File(TEST_DIR + "/test.txt");
        testFile.createNewFile();
        
        assertTrue("Should accept small files", pdfService.validateFileSize(testFile));
    }

    @Test
    public void testExtractText() throws IOException {
        // Create a test PDF first
        String testPdfPath = TEST_DIR + "/extract-test.pdf";
        pdfService.createPdf("Sample text to extract", testPdfPath);
        
        String extractedText = pdfService.extractText(testPdfPath);
        
        assertNotNull("Should extract text", extractedText);
        assertTrue("Should contain the original text", extractedText.contains("Sample text"));
    }

    @Test(expected = IOException.class)
    public void testFileNotFound() throws IOException {
        pdfService.extractText("non-existent-file.pdf");
    }
}
