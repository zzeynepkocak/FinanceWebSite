package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.LoanRequest;
import com.toyota.finance.service.LoanService;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Kredi talebi yönetimi REST API'si.
 *
 * <p>Kullanıcıların kredi taleplerini oluşturması, görüntülemesi,
 * güncellemesi ve silmesi için endpoint'ler sağlar.</p>
 *
 * <p>Temel path: {@code /api/v1/loans}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
@Tag(name = "Loans", description = "Kredi talebi yönetimi")
public class LoanController {

    private final LoanService loanService;

    /**
     * Giriş yapmış kullanıcının kredi taleplerini listeler.
     *
     * @return kredi talebi listesi
     */
    @GetMapping
    @Operation(summary = "Kredileri listele", description = "Kullanıcının kredi taleplerini döner")
    public ResponseEntity<ApiResponse<List<LoanRequest>>> getMyLoans() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        return ResponseEntity.ok(ApiResponse.success(loanService.getUserLoans(userId)));
    }

    /**
     * Belirtilen ID'ye sahip kredi talebini döner.
     *
     * @param id kredi talebi ID'si
     * @return kredi talebi verisi
     */
    @GetMapping("/{id}")
    @Operation(summary = "Kredi talebi getir", description = "ID'ye göre kredi talebi döner")
    public ResponseEntity<ApiResponse<LoanRequest>> getLoanById(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        LoanRequest loan = loanService.getLoanById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(loan));
    }

    /**
     * Yeni kredi talebi oluşturur.
     *
     * @param loanRequest talep verisi (JSON body)
     * @return oluşturulan talep
     */
    @PostMapping
    @Operation(summary = "Kredi talebi oluştur", description = "Yeni kredi talebi açar")
    public ResponseEntity<ApiResponse<LoanRequest>> createLoan(@RequestBody LoanRequest loanRequest) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        LoanRequest saved = loanService.createLoan(loanRequest, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Kredi talebi oluşturuldu", saved));
    }

    /**
     * Var olan kredi talebini günceller.
     *
     * @param id          güncellenecek talep ID'si
     * @param loanRequest güncel veri
     * @return güncellenen talep
     */
    @PutMapping("/{id}")
    @Operation(summary = "Kredi talebi güncelle", description = "Mevcut kredi talebini günceller")
    public ResponseEntity<ApiResponse<LoanRequest>> updateLoan(
            @PathVariable Long id, @RequestBody LoanRequest loanRequest) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        LoanRequest updated = loanService.updateLoan(id, loanRequest, userId);
        return ResponseEntity.ok(ApiResponse.success("Kredi talebi güncellendi", updated));
    }

    /**
     * Kredi talebini kalıcı olarak siler.
     *
     * @param id silinecek talep ID'si
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Kredi talebi sil", description = "Kredi talebini kalıcı olarak siler")
    public ResponseEntity<ApiResponse<Void>> deleteLoan(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        loanService.deleteLoan(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Kredi talebi silindi", null));
    }
}
