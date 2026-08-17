package com.eams.controller;

import com.eams.dto.AssetResponse;
import com.eams.service.AssetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final AssetService assetService;

    public PublicController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/assets/by-code/{code}")
    public ResponseEntity<AssetResponse> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(assetService.getByCode(code));
    }
}
