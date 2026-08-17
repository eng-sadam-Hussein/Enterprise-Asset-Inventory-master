package com.eams.controller;

import com.eams.dto.AssetRequest;
import com.eams.dto.AssetResponse;
import com.eams.dto.MessageResponse;
import com.eams.dto.PageResponse;
import com.eams.model.AssetCategory;
import com.eams.model.AssetStatus;
import com.eams.service.AssetService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<PageResponse<AssetResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AssetStatus status,
            @RequestParam(required = false) AssetCategory category) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(assetService.search(search, status, category, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssetResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assetService.getById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<AssetResponse> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(assetService.getByCode(code));
    }

    @PostMapping
    public ResponseEntity<AssetResponse> create(@Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(assetService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetResponse> update(@PathVariable Long id, @Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(assetService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> delete(@PathVariable Long id) {
        assetService.delete(id);
        return ResponseEntity.ok(new MessageResponse("Asset deleted successfully"));
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<AssetResponse> uploadImage(@PathVariable Long id, @RequestParam("file") MultipartFile file)
            throws Exception {
        return ResponseEntity.ok(assetService.uploadImage(id, file));
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> getQr(@PathVariable Long id) {
        byte[] png = assetService.getQrImage(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=qr-" + id + ".png")
                .contentType(MediaType.IMAGE_PNG)
                .body(png);
    }

    @GetMapping("/{id}/barcode")
    public ResponseEntity<byte[]> getBarcode(@PathVariable Long id) {
        byte[] png = assetService.getBarcodeImage(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=barcode-" + id + ".png")
                .contentType(MediaType.IMAGE_PNG)
                .body(png);
    }
}
