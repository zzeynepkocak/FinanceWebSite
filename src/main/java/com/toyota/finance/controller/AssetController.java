package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.Asset;
import com.toyota.finance.service.FinanceService;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Portföy varlığı yönetimi REST API'si.
 *
 * <p>Hisse senedi, kripto, döviz gibi finansal varlıkların CRUD işlemleri.
 * Her varlık yalnızca sahibi tarafından görüntülenebilir/değiştirilebilir.</p>
 *
 * <p>Temel path: {@code /api/v1/assets}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/assets")
@RequiredArgsConstructor
@Tag(name = "Assets", description = "Portföy varlığı yönetimi")
public class AssetController {

    private final FinanceService financeService;

    /**
     * Giriş yapmış kullanıcının tüm varlıklarını listeler.
     *
     * @return varlık listesi
     */
    @GetMapping
    @Operation(summary = "Varlıkları listele", description = "Kullanıcının portföy varlıklarını döner")
    public ResponseEntity<ApiResponse<List<Asset>>> getMyAssets() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        return ResponseEntity.ok(ApiResponse.success(financeService.getUserAssets(userId)));
    }

    /**
     * Belirtilen ID'ye sahip varlığı döner.
     *
     * @param id varlık ID'si
     * @return varlık verisi
     */
    @GetMapping("/{id}")
    @Operation(summary = "Varlık getir", description = "ID'ye göre varlık bilgisini döner")
    public ResponseEntity<ApiResponse<Asset>> getAssetById(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        Asset asset = financeService.getAssetById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(asset));
    }

    /**
     * Portföye yeni varlık ekler.
     *
     * @param asset eklenecek varlık (JSON body)
     * @return oluşturulan varlık
     */
    @PostMapping
    @Operation(summary = "Varlık ekle", description = "Portföye yeni finansal varlık ekler")
    public ResponseEntity<ApiResponse<Asset>> createAsset(@RequestBody Asset asset) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        asset.setUserId(userId);
        Asset saved = financeService.createAsset(asset);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Varlık eklendi", saved));
    }
}
