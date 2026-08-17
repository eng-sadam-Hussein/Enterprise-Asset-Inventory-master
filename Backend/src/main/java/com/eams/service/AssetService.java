package com.eams.service;

import com.eams.dto.AssetRequest;
import com.eams.dto.AssetResponse;
import com.eams.dto.PageResponse;
import com.eams.exception.ResourceNotFoundException;
import com.eams.model.Asset;
import com.eams.model.AssetCategory;
import com.eams.model.AssetStatus;
import com.eams.repo.AssetRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.stream.Collectors;

@Service
public class AssetService {

    private final AssetRepository assetRepository;
    private final ActivityService activityService;
    private final FileStorageService fileStorageService;
    private final QrBarcodeService qrBarcodeService;

    public AssetService(AssetRepository assetRepository,
                        ActivityService activityService,
                        FileStorageService fileStorageService,
                        QrBarcodeService qrBarcodeService) {
        this.assetRepository = assetRepository;
        this.activityService = activityService;
        this.fileStorageService = fileStorageService;
        this.qrBarcodeService = qrBarcodeService;
    }

    public PageResponse<AssetResponse> search(String search, AssetStatus status, AssetCategory category, Pageable pageable) {
        Page<Asset> page = assetRepository.search(search, status, category, pageable);
        return toPageResponse(page);
    }

    public AssetResponse getById(Long id) {
        return AssetResponse.from(findAsset(id));
    }

    public AssetResponse getByCode(String code) {
        Asset asset = assetRepository.findByAssetCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with code: " + code));
        return AssetResponse.from(asset);
    }

    @Transactional
    public AssetResponse create(AssetRequest request) {
        Asset asset = new Asset();
        applyRequest(asset, request);
        if (asset.getStatus() == null) {
            asset.setStatus(AssetStatus.AVAILABLE);
        }
        asset.setAssetCode("TEMP");
        asset.setQrCodeData("TEMP");
        asset.setBarcodeData("TEMP");
        asset = assetRepository.save(asset);

        String code = String.format("G2-%06d", 100000 + asset.getId());
        asset.setAssetCode(code);
        asset.setQrCodeData("/api/public/assets/by-code/" + code);
        asset.setBarcodeData(code);
        asset = assetRepository.save(asset);

        activityService.log("CREATE", "Asset", asset.getId(), "Created asset " + code, currentUsername());
        return AssetResponse.from(asset);
    }

    @Transactional
    public AssetResponse update(Long id, AssetRequest request) {
        Asset asset = findAsset(id);
        applyRequest(asset, request);
        asset = assetRepository.save(asset);
        activityService.log("UPDATE", "Asset", asset.getId(), "Updated asset " + asset.getAssetCode(), currentUsername());
        return AssetResponse.from(asset);
    }

    @Transactional
    public void delete(Long id) {
        Asset asset = findAsset(id);
        String code = asset.getAssetCode();
        assetRepository.delete(asset);
        activityService.log("DELETE", "Asset", id, "Deleted asset " + code, currentUsername());
    }

    @Transactional
    public AssetResponse uploadImage(Long id, MultipartFile file) throws Exception {
        Asset asset = findAsset(id);
        String url = fileStorageService.store(file);
        asset.setImageUrl(url);
        asset = assetRepository.save(asset);
        activityService.log("UPDATE", "Asset", asset.getId(), "Uploaded image for " + asset.getAssetCode(), currentUsername());
        return AssetResponse.from(asset);
    }

    public byte[] getQrImage(Long id) {
        Asset asset = findAsset(id);
        return qrBarcodeService.generateQrPng(asset.getQrCodeData());
    }

    public byte[] getBarcodeImage(Long id) {
        Asset asset = findAsset(id);
        return qrBarcodeService.generateBarcodePng(asset.getBarcodeData());
    }

    public Asset findAsset(Long id) {
        return assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
    }

    private void applyRequest(Asset asset, AssetRequest request) {
        asset.setName(request.getName());
        asset.setSerialNumber(request.getSerialNumber());
        asset.setCategory(request.getCategory());
        asset.setPurchaseDate(request.getPurchaseDate());
        asset.setPurchaseCost(request.getPurchaseCost());
        asset.setWarrantyExpiry(request.getWarrantyExpiry());
        asset.setLocation(request.getLocation());
        if (request.getStatus() != null) {
            asset.setStatus(request.getStatus());
        }
        asset.setNotes(request.getNotes());
    }

    private PageResponse<AssetResponse> toPageResponse(Page<Asset> page) {
        return new PageResponse<>(
                page.getContent().stream().map(AssetResponse::from).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast(),
                page.isFirst()
        );
    }

    private String currentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return "system";
        }
        return auth.getName();
    }
}
