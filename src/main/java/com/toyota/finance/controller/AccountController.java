package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.Account;
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
 * Banka hesabı yönetimi REST API'si.
 *
 * <p>Tüm endpoint'ler kimlik doğrulama gerektirir. Kullanıcılar yalnızca
 * kendi hesaplarına erişebilir.</p>
 *
 * <p>Temel path: {@code /api/v1/accounts}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "Banka hesabı yönetimi")
public class AccountController {

    private final FinanceService financeService;

    /**
     * Giriş yapmış kullanıcının tüm hesaplarını listeler.
     *
     * @return hesap listesi
     */
    @GetMapping
    @Operation(summary = "Hesapları listele", description = "Giriş yapmış kullanıcının tüm hesaplarını döner")
    public ResponseEntity<ApiResponse<List<Account>>> getMyAccounts() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        List<Account> accounts = financeService.getUserAccounts(userId);
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }

    /**
     * Belirtilen ID'ye sahip hesabı döner.
     *
     * @param id hesap ID'si
     * @return hesap verisi
     */
    @GetMapping("/{id}")
    @Operation(summary = "Hesap getir", description = "ID'ye göre hesap bilgisini döner")
    public ResponseEntity<ApiResponse<Account>> getAccountById(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        Account account = financeService.getAccountById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(account));
    }

    /**
     * Yeni hesap oluşturur.
     *
     * @param account oluşturulacak hesap verisi (JSON body)
     * @return oluşturulan hesap
     */
    @PostMapping
    @Operation(summary = "Hesap oluştur", description = "Giriş yapmış kullanıcı adına yeni hesap oluşturur")
    public ResponseEntity<ApiResponse<Account>> createAccount(@RequestBody Account account) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        account.setUserId(userId);
        Account saved = financeService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Hesap oluşturuldu", saved));
    }
}
