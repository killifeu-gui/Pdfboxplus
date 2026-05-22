package com.pdfcorba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.pdfcorba"})
public class PdfCorbaApplication {

    public static void main(String[] args) {
        SpringApplication.run(PdfCorbaApplication.class, args);
    }
}
