package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.PriceAlert;
import com.toyota.finance.repository.PriceAlertRepository;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Fiyat Alarmı REST API'si.
 *
 * <p>Temel path: {@code /api/v1/alerts}</p>
 */
@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@Tag(name = "Price Alerts", description = "Fiyat alarmı yönetimi")
public class PriceAlertController {

    private final PriceAlertRepository alertRepo;

    @GetMapping
    @Operation(summary = "Alarmları listele")
    public ResponseEntity<ApiResponse<List<PriceAlert>>> getMyAlerts() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) return unauthorized();
        return ResponseEntity.ok(ApiResponse.success(alertRepo.findByUserIdOrderByCreatedAtDesc(userId)));
    }

    @PostMapping
    @Operation(summary = "Yeni alarm oluştur")
    public ResponseEntity<ApiResponse<PriceAlert>> create(@Valid @RequestBody PriceAlert alert) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) return unauthorized();
        alert.setUserId(userId);
        PriceAlert saved = alertRepo.save(alert);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Alarm oluşturuldu", saved));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Alarmı devre dışı bırak")
    public ResponseEntity<ApiResponse<PriceAlert>> deactivate(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) return unauthorized();
        return alertRepo.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .map(a -> {
                    a.setIsActive(false);
                    alertRepo.save(a);
                    return ResponseEntity.ok(ApiResponse.success("Alarm devre dışı bırakıldı", a));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Alarm bulunamadı")));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Alarmı sil")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        return alertRepo.findById(id)
                .filter(a -> a.getUserId().equals(userId))
                .map(a -> {
                    alertRepo.delete(a);
                    return ResponseEntity.ok(ApiResponse.<Void>success("Alarm silindi", null));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Alarm bulunamadı")));
    }

    private <T> ResponseEntity<ApiResponse<T>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error("Kimlik doğrulama gerekli"));
    }
}
