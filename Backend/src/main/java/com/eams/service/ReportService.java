package com.eams.service;

import com.eams.exception.BadRequestException;
import com.eams.model.*;
import com.eams.repo.AssetRepository;
import com.eams.repo.AssignmentRepository;
import com.eams.repo.MaintenanceRepository;
import com.eams.repo.StockItemRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Image;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReportService {

    private static final String COMPANY_NAME = "Nexora Technologies";
    private static final String LOGO_PATH = "brand/logo-full-color.png";
    private static final Color BRAND_BLUE = new Color(30, 77, 255);

    private final AssetRepository assetRepository;
    private final StockItemRepository stockItemRepository;
    private final AssignmentRepository assignmentRepository;
    private final MaintenanceRepository maintenanceRepository;

    public ReportService(AssetRepository assetRepository,
                         StockItemRepository stockItemRepository,
                         AssignmentRepository assignmentRepository,
                         MaintenanceRepository maintenanceRepository) {
        this.assetRepository = assetRepository;
        this.stockItemRepository = stockItemRepository;
        this.assignmentRepository = assignmentRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    public byte[] generateExcel(String type) {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(capitalize(type));
            int startRow = writeExcelBranding(workbook, sheet, type);
            switch (type) {
                case "assets" -> writeAssetsExcel(sheet, startRow, workbook);
                case "stock" -> writeStockExcel(sheet, startRow, workbook);
                case "assignments" -> writeAssignmentsExcel(sheet, startRow, workbook);
                case "maintenance" -> writeMaintenanceExcel(sheet, startRow, workbook);
                default -> throw new BadRequestException("Unknown report type: " + type);
            }
            for (int i = 0; i < 8; i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            return out.toByteArray();
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel report", e);
        }
    }

    public byte[] generatePdf(String type) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            addPdfHeader(document, type);
            switch (type) {
                case "assets" -> writeAssetsPdf(document);
                case "stock" -> writeStockPdf(document);
                case "assignments" -> writeAssignmentsPdf(document);
                case "maintenance" -> writeMaintenancePdf(document);
                default -> throw new BadRequestException("Unknown report type: " + type);
            }
            document.close();
            return out.toByteArray();
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        }
    }

    private int writeExcelBranding(XSSFWorkbook workbook, Sheet sheet, String type) throws Exception {
        byte[] logoBytes = loadLogoBytes();
        if (logoBytes != null && logoBytes.length > 0) {
            int pictureIdx = workbook.addPicture(logoBytes, Workbook.PICTURE_TYPE_PNG);
            CreationHelper helper = workbook.getCreationHelper();
            Drawing<?> drawing = sheet.createDrawingPatriarch();
            ClientAnchor anchor = helper.createClientAnchor();
            anchor.setCol1(0);
            anchor.setRow1(0);
            anchor.setCol2(2);
            anchor.setRow2(4);
            Picture picture = drawing.createPicture(anchor, pictureIdx);
            picture.resize(1.0);
            sheet.getRow(0);
            for (int i = 0; i < 4; i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    row = sheet.createRow(i);
                }
                row.setHeightInPoints(18);
            }
        }

        XSSFCellStyle titleStyle = workbook.createCellStyle();
        XSSFFont titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);
        titleStyle.setFont(titleFont);

        XSSFCellStyle subtitleStyle = workbook.createCellStyle();
        XSSFFont subtitleFont = workbook.createFont();
        subtitleFont.setFontHeightInPoints((short) 11);
        subtitleStyle.setFont(subtitleFont);

        Row companyRow = sheet.getRow(0) != null ? sheet.getRow(0) : sheet.createRow(0);
        if (companyRow.getCell(3) == null) {
            companyRow.createCell(3);
        }
        companyRow.getCell(3).setCellValue(COMPANY_NAME);
        companyRow.getCell(3).setCellStyle(titleStyle);

        Row reportRow = sheet.getRow(1) != null ? sheet.getRow(1) : sheet.createRow(1);
        if (reportRow.getCell(3) == null) {
            reportRow.createCell(3);
        }
        reportRow.getCell(3).setCellValue(capitalize(type) + " Report");
        reportRow.getCell(3).setCellStyle(subtitleStyle);

        Row dateRow = sheet.getRow(2) != null ? sheet.getRow(2) : sheet.createRow(2);
        if (dateRow.getCell(3) == null) {
            dateRow.createCell(3);
        }
        dateRow.getCell(3).setCellValue("Generated: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        dateRow.getCell(3).setCellStyle(subtitleStyle);

        return 5;
    }

    private void addPdfHeader(Document document, String type) throws Exception {
        byte[] logoBytes = loadLogoBytes();
        if (logoBytes != null && logoBytes.length > 0) {
            Image logo = Image.getInstance(logoBytes);
            logo.scaleToFit(140, 70);
            logo.setAlignment(Element.ALIGN_LEFT);
            document.add(logo);
        }

        Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BRAND_BLUE);
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY);
        Font metaFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);

        Paragraph company = new Paragraph(COMPANY_NAME, companyFont);
        company.setSpacingBefore(6);
        document.add(company);

        Paragraph title = new Paragraph(capitalize(type) + " Report", titleFont);
        title.setSpacingBefore(4);
        document.add(title);

        Paragraph meta = new Paragraph(
                "Asset & Inventory Management  |  Generated: "
                        + LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                metaFont
        );
        meta.setSpacingAfter(12);
        document.add(meta);

        PdfPTable line = new PdfPTable(1);
        line.setWidthPercentage(100);
        PdfPCell lineCell = new PdfPCell(new Phrase(" "));
        lineCell.setBorderWidthTop(0);
        lineCell.setBorderWidthLeft(0);
        lineCell.setBorderWidthRight(0);
        lineCell.setBorderWidthBottom(2f);
        lineCell.setBorderColorBottom(BRAND_BLUE);
        lineCell.setFixedHeight(8);
        line.addCell(lineCell);
        document.add(line);
        document.add(new Paragraph(" "));
    }

    private byte[] loadLogoBytes() {
        try {
            ClassPathResource resource = new ClassPathResource(LOGO_PATH);
            if (!resource.exists()) {
                return null;
            }
            try (InputStream in = resource.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
                in.transferTo(buffer);
                return buffer.toByteArray();
            }
        } catch (Exception e) {
            return null;
        }
    }

    private XSSFCellStyle headerStyle(XSSFWorkbook workbook) {
        XSSFCellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setColor(org.apache.poi.ss.usermodel.IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(org.apache.poi.ss.usermodel.IndexedColors.DARK_BLUE.getIndex());
        style.setFillPattern(org.apache.poi.ss.usermodel.FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private void writeHeaderRow(Sheet sheet, int rowNum, String[] cols, XSSFCellStyle style) {
        Row header = sheet.createRow(rowNum);
        for (int i = 0; i < cols.length; i++) {
            header.createCell(i).setCellValue(cols[i]);
            header.getCell(i).setCellStyle(style);
        }
    }

    private void writeAssetsExcel(Sheet sheet, int startRow, XSSFWorkbook workbook) {
        String[] cols = {"ID", "Code", "Name", "Category", "Status", "Location", "Purchase Cost"};
        writeHeaderRow(sheet, startRow, cols, headerStyle(workbook));
        List<Asset> assets = assetRepository.findAll();
        int rowNum = startRow + 1;
        for (Asset a : assets) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(a.getId());
            row.createCell(1).setCellValue(a.getAssetCode());
            row.createCell(2).setCellValue(a.getName());
            row.createCell(3).setCellValue(a.getCategory().name());
            row.createCell(4).setCellValue(a.getStatus().name());
            row.createCell(5).setCellValue(a.getLocation() != null ? a.getLocation() : "");
            row.createCell(6).setCellValue(a.getPurchaseCost() != null ? a.getPurchaseCost().doubleValue() : 0);
        }
    }

    private void writeStockExcel(Sheet sheet, int startRow, XSSFWorkbook workbook) {
        String[] cols = {"ID", "Item Name", "SKU", "Quantity", "Minimum", "Location"};
        writeHeaderRow(sheet, startRow, cols, headerStyle(workbook));
        List<StockItem> items = stockItemRepository.findAll();
        int rowNum = startRow + 1;
        for (StockItem s : items) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(s.getId());
            row.createCell(1).setCellValue(s.getItemName());
            row.createCell(2).setCellValue(s.getSku());
            row.createCell(3).setCellValue(s.getQuantity());
            row.createCell(4).setCellValue(s.getMinimumStock());
            row.createCell(5).setCellValue(s.getLocation() != null ? s.getLocation() : "");
        }
    }

    private void writeAssignmentsExcel(Sheet sheet, int startRow, XSSFWorkbook workbook) {
        String[] cols = {"ID", "Asset Code", "Asset Name", "Employee", "Department", "Status", "Assignment Date"};
        writeHeaderRow(sheet, startRow, cols, headerStyle(workbook));
        List<Assignment> list = assignmentRepository.findAll();
        int rowNum = startRow + 1;
        for (Assignment a : list) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(a.getId());
            row.createCell(1).setCellValue(a.getAsset().getAssetCode());
            row.createCell(2).setCellValue(a.getAsset().getName());
            row.createCell(3).setCellValue(a.getEmployeeName());
            row.createCell(4).setCellValue(a.getDepartment() != null ? a.getDepartment() : "");
            row.createCell(5).setCellValue(a.getStatus().name());
            row.createCell(6).setCellValue(a.getAssignmentDate().toString());
        }
    }

    private void writeMaintenanceExcel(Sheet sheet, int startRow, XSSFWorkbook workbook) {
        String[] cols = {"ID", "Asset Code", "Title", "Technician", "Status", "Cost", "Schedule Date"};
        writeHeaderRow(sheet, startRow, cols, headerStyle(workbook));
        List<Maintenance> list = maintenanceRepository.findAll();
        int rowNum = startRow + 1;
        for (Maintenance m : list) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(m.getId());
            row.createCell(1).setCellValue(m.getAsset().getAssetCode());
            row.createCell(2).setCellValue(m.getTitle());
            row.createCell(3).setCellValue(m.getTechnician() != null ? m.getTechnician() : "");
            row.createCell(4).setCellValue(m.getStatus().name());
            row.createCell(5).setCellValue(m.getCost() != null ? m.getCost().doubleValue() : 0);
            row.createCell(6).setCellValue(m.getScheduleDate() != null ? m.getScheduleDate().toString() : "");
        }
    }

    private void writeAssetsPdf(Document document) throws Exception {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        addHeader(table, new String[]{"Code", "Name", "Category", "Status", "Location"});
        for (Asset a : assetRepository.findAll()) {
            table.addCell(a.getAssetCode());
            table.addCell(a.getName());
            table.addCell(a.getCategory().name());
            table.addCell(a.getStatus().name());
            table.addCell(a.getLocation() != null ? a.getLocation() : "");
        }
        document.add(table);
    }

    private void writeStockPdf(Document document) throws Exception {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        addHeader(table, new String[]{"Item", "SKU", "Qty", "Min", "Location"});
        for (StockItem s : stockItemRepository.findAll()) {
            table.addCell(s.getItemName());
            table.addCell(s.getSku());
            table.addCell(String.valueOf(s.getQuantity()));
            table.addCell(String.valueOf(s.getMinimumStock()));
            table.addCell(s.getLocation() != null ? s.getLocation() : "");
        }
        document.add(table);
    }

    private void writeAssignmentsPdf(Document document) throws Exception {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        addHeader(table, new String[]{"Asset", "Employee", "Dept", "Status", "Date"});
        for (Assignment a : assignmentRepository.findAll()) {
            table.addCell(a.getAsset().getAssetCode());
            table.addCell(a.getEmployeeName());
            table.addCell(a.getDepartment() != null ? a.getDepartment() : "");
            table.addCell(a.getStatus().name());
            table.addCell(a.getAssignmentDate().toString());
        }
        document.add(table);
    }

    private void writeMaintenancePdf(Document document) throws Exception {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        addHeader(table, new String[]{"Asset", "Title", "Technician", "Status", "Cost"});
        for (Maintenance m : maintenanceRepository.findAll()) {
            table.addCell(m.getAsset().getAssetCode());
            table.addCell(m.getTitle());
            table.addCell(m.getTechnician() != null ? m.getTechnician() : "");
            table.addCell(m.getStatus().name());
            table.addCell(m.getCost() != null ? m.getCost().toString() : "");
        }
        document.add(table);
    }

    private void addHeader(PdfPTable table, String[] headers) {
        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, font));
            cell.setBackgroundColor(BRAND_BLUE);
            cell.setPadding(6);
            table.addCell(cell);
        }
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) {
            return s;
        }
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
