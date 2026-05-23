package com.pdfcorba.service;

import org.springframework.stereotype.Service;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.rendering.PDFRenderer;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PdfService {
    
    private static final Logger logger = LoggerFactory.getLogger(PdfService.class);
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

    /**
     * Crée un PDF simple avec du texte
     */
    public File createPdf(String text, String outputPath) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText(text);
                contentStream.endText();
            }

            File output = new File(outputPath);
            output.getParentFile().mkdirs();
            document.save(output);
            logger.info("PDF créé: " + outputPath);
            return output;
        }
    }

    /**
     * Fusionne plusieurs PDF
     */
    public File mergePdfs(List<String> inputPaths, String outputPath) throws IOException {
        PDDocument mergedDoc = new PDDocument();

        try {
            for (String inputPath : inputPaths) {
                File file = new File(inputPath);
                if (!file.exists()) {
                    throw new IOException("Fichier introuvable: " + inputPath);
                }
                PDDocument doc = PDDocument.load(file);
                for (PDPage page : doc.getPages()) {
                    mergedDoc.addPage(page);
                }
                doc.close();
            }

            File output = new File(outputPath);
            output.getParentFile().mkdirs();
            mergedDoc.save(output);
            logger.info("PDFs fusionnés: " + outputPath);
            return output;
        } finally {
            mergedDoc.close();
        }
    }

    /**
     * Divise un PDF en pages individuelles
     */
    public List<File> splitPdf(String inputPath, String outputDir) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument doc = PDDocument.load(input);
        List<File> outputFiles = new ArrayList<>();

        try {
            int pageCount = doc.getNumberOfPages();
            for (int i = 0; i < pageCount; i++) {
                PDDocument singlePageDoc = new PDDocument();
                singlePageDoc.addPage(doc.getPage(i));

                File outputFile = new File(outputDir + File.separator + "page_" + (i + 1) + ".pdf");
                outputFile.getParentFile().mkdirs();
                singlePageDoc.save(outputFile);
                singlePageDoc.close();
                outputFiles.add(outputFile);
            }
            logger.info("PDF divisé en " + pageCount + " fichiers");
            return outputFiles;
        } finally {
            doc.close();
        }
    }

    /**
     * Extrait des pages spécifiques
     */
    public File extractPages(String inputPath, int startPage, int endPage, String outputPath) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument sourceDoc = PDDocument.load(input);
        PDDocument newDoc = new PDDocument();

        try {
            int totalPages = sourceDoc.getNumberOfPages();
            startPage = Math.max(0, startPage - 1);
            endPage = Math.min(totalPages, endPage);

            for (int i = startPage; i < endPage; i++) {
                newDoc.addPage(sourceDoc.getPage(i));
            }

            File output = new File(outputPath);
            output.getParentFile().mkdirs();
            newDoc.save(output);
            logger.info("Pages " + (startPage + 1) + "-" + endPage + " extraites");
            return output;
        } finally {
            sourceDoc.close();
            newDoc.close();
        }
    }

    /**
     * Supprime des pages spécifiques
     */
    public File deletePages(String inputPath, List<Integer> pageNumbers, String outputPath) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument doc = PDDocument.load(input);

        try {
            // Trier en ordre décroissant pour éviter les problèmes d'index
            pageNumbers.stream().sorted((a, b) -> Integer.compare(b, a)).forEach(pageNum -> {
                int index = pageNum - 1;
                if (index >= 0 && index < doc.getNumberOfPages()) {
                    doc.removePage(index);
                }
            });

            File output = new File(outputPath);
            output.getParentFile().mkdirs();
            doc.save(output);
            logger.info("Pages supprimées: " + pageNumbers);
            return output;
        } finally {
            doc.close();
        }
    }

    /**
     * Ajoute un mot de passe
     */
    public File addPassword(String inputPath, String password, String outputPath) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument doc = PDDocument.load(input);

        try {
            doc.protect(new org.apache.pdfbox.pdmodel.encryption.StandardProtectionPolicy(
                    password, password, doc.getCurrentAccessPermission()));

            File output = new File(outputPath);
            output.getParentFile().mkdirs();
            doc.save(output);
            logger.info("Mot de passe ajouté au PDF");
            return output;
        } finally {
            doc.close();
        }
    }

    /**
     * Convertit un PDF en images
     */
    public List<File> convertPdfToImages(String inputPath, String outputDir) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument doc = PDDocument.load(input);
        PDFRenderer renderer = new PDFRenderer(doc);
        List<File> imageFiles = new ArrayList<>();

        try {
            int pageCount = doc.getNumberOfPages();
            for (int i = 0; i < pageCount; i++) {
                BufferedImage image = renderer.renderImageWithDPI(i, 150);
                File outputFile = new File(outputDir + File.separator + "page_" + (i + 1) + ".png");
                outputFile.getParentFile().mkdirs();
                ImageIO.write(image, "png", outputFile);
                imageFiles.add(outputFile);
            }
            logger.info("PDF converti en " + pageCount + " images");
            return imageFiles;
        } finally {
            doc.close();
        }
    }

    /**
     * Extrait le texte d'un PDF
     */
    public String extractText(String inputPath) throws IOException {
        File input = new File(inputPath);
        if (!input.exists()) {
            throw new IOException("Fichier introuvable: " + inputPath);
        }

        PDDocument doc = PDDocument.load(input);

        try {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);
            logger.info("Texte extrait du PDF");
            return text;
        } finally {
            doc.close();
        }
    }

    /**
     * Valide la taille du fichier
     */
    public boolean validateFileSize(File file) {
        return file.length() <= MAX_FILE_SIZE;
    }

    /**
     * Valide l'extension du fichier
     */
    public boolean validateFileExtension(String filename) {
        return filename.toLowerCase().endsWith(".pdf");
    }
}
