package com.eams.controller;

import com.eams.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/{type}/excel")
    public ResponseEntity<byte[]> excel(@PathVariable String type) {
        byte[] data = reportService.generateExcel(type);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type + "-report.xlsx")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @GetMapping("/{type}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable String type) {
        byte[] data = reportService.generatePdf(type);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + type + "-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }
}
