package com.pdfcorba.controller;

import com.pdfcorba.service.PdfService;
import com.pdfcorba.dto.ResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PdfController {

    private static final Logger logger = LoggerFactory.getLogger(PdfController.class);
    private static final String UPLOAD_DIR = "uploads";
    
    @Autowired
    private PdfService pdfService;

    @PostMapping("/create")
    public ResponseEntity<?> createPdf(@RequestParam String text) {
        try {
            File uploadsDir = new File(UPLOAD_DIR);
            uploadsDir.mkdirs();
            
            String outputPath = UPLOAD_DIR + File.separator + "created_" + System.currentTimeMillis() + ".pdf";
            File result = pdfService.createPdf(text, outputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "PDF créé avec succès", result.getName()));
        } catch (Exception e) {
            logger.error("Erreur lors de la création du PDF", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/merge")
    public ResponseEntity<?> mergePdfs(@RequestParam List<String> files) {
        try {
            List<String> validatedPaths = files.stream()
                    .map(f -> UPLOAD_DIR + File.separator + f)
                    .collect(Collectors.toList());
            
            String outputPath = UPLOAD_DIR + File.separator + "merged_" + System.currentTimeMillis() + ".pdf";
            File result = pdfService.mergePdfs(validatedPaths, outputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "PDFs fusionnés avec succès", result.getName()));
        } catch (Exception e) {
            logger.error("Erreur lors de la fusion des PDFs", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/split")
    public ResponseEntity<?> splitPdf(@RequestParam String file) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String outputDir = UPLOAD_DIR + File.separator + "split_" + System.currentTimeMillis();
            
            List<File> results = pdfService.splitPdf(inputPath, outputDir);
            List<String> filenames = results.stream()
                    .map(File::getName)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(new ResponseDto(true, "PDF divisé avec succès", filenames));
        } catch (Exception e) {
            logger.error("Erreur lors de la division du PDF", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/extract-pages")
    public ResponseEntity<?> extractPages(@RequestParam String file, 
                                         @RequestParam int startPage,
                                         @RequestParam int endPage) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String outputPath = UPLOAD_DIR + File.separator + "extracted_" + System.currentTimeMillis() + ".pdf";
            
            File result = pdfService.extractPages(inputPath, startPage, endPage, outputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "Pages extraites avec succès", result.getName()));
        } catch (Exception e) {
            logger.error("Erreur lors de l'extraction des pages", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/delete-pages")
    public ResponseEntity<?> deletePages(@RequestParam String file, 
                                        @RequestParam List<Integer> pageNumbers) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String outputPath = UPLOAD_DIR + File.separator + "deleted_" + System.currentTimeMillis() + ".pdf";
            
            File result = pdfService.deletePages(inputPath, pageNumbers, outputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "Pages supprimées avec succès", result.getName()));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression des pages", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/add-password")
    public ResponseEntity<?> addPassword(@RequestParam String file, 
                                        @RequestParam String password) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String outputPath = UPLOAD_DIR + File.separator + "protected_" + System.currentTimeMillis() + ".pdf";
            
            File result = pdfService.addPassword(inputPath, password, outputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "Mot de passe ajouté avec succès", result.getName()));
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout du mot de passe", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/to-images")
    public ResponseEntity<?> convertToImages(@RequestParam String file) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String outputDir = UPLOAD_DIR + File.separator + "images_" + System.currentTimeMillis();
            
            List<File> results = pdfService.convertPdfToImages(inputPath, outputDir);
            List<String> filenames = results.stream()
                    .map(File::getName)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(new ResponseDto(true, "PDF converti en images", filenames));
        } catch (Exception e) {
            logger.error("Erreur lors de la conversion en images", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/extract-text")
    public ResponseEntity<?> extractText(@RequestParam String file) {
        try {
            String inputPath = UPLOAD_DIR + File.separator + file;
            String text = pdfService.extractText(inputPath);
            
            return ResponseEntity.ok(new ResponseDto(true, "Texte extrait avec succès", text));
        } catch (Exception e) {
            logger.error("Erreur lors de l'extraction du texte", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new ResponseDto(false, "Fichier vide", null));
            }

            if (!pdfService.validateFileExtension(file.getOriginalFilename())) {
                return ResponseEntity.badRequest().body(new ResponseDto(false, "Format invalide (PDF requis)", null));
            }

            if (!pdfService.validateFileSize(file.getSize())) {
                return ResponseEntity.badRequest().body(new ResponseDto(false, "Fichier trop volumineux (max 50MB)", null));
            }

            File uploadsDir = new File(UPLOAD_DIR);
            uploadsDir.mkdirs();

            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filepath = Paths.get(UPLOAD_DIR, filename);
            file.transferTo(filepath.toFile());

            logger.info("Fichier uploadé: " + filename);
            return ResponseEntity.ok(new ResponseDto(true, "Fichier uploadé avec succès", filename));
        } catch (Exception e) {
            logger.error("Erreur lors de l'upload", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @GetMapping("/download/{filename}")
    public ResponseEntity<?> downloadFile(@PathVariable String filename) {
        try {
            File file = new File(UPLOAD_DIR + File.separator + filename);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(file);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            logger.error("Erreur lors du téléchargement", e);
            return ResponseEntity.badRequest().body(new ResponseDto(false, "Erreur: " + e.getMessage(), null));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new ResponseDto(true, "Service disponible", null));
    }
}
