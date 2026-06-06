package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.service.TwoFactorAuthService;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * İki faktörlü doğrulama (2FA) REST API'si.
 *
 * <p>TOTP tabanlı 2FA kurulumu ve doğrulaması için endpoint'ler sağlar.
 * Kurulum endpoint'i ({@code /setup}) public erişime açıktır;
 * doğrulama ({@code /verify}) kimlik doğrulama gerektirir.</p>
 *
 * <p>Temel path: {@code /api/v1/auth/2fa}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/auth/2fa")
@RequiredArgsConstructor
@Tag(name = "2FA", description = "İki faktörlü doğrulama (TOTP)")
public class TwoFactorAuthController {

    private final TwoFactorAuthService twoFactorAuthService;

    /**
     * Kullanıcı için yeni TOTP secret ve QR kod üretir.
     *
     * <p>Bu endpoint kimlik doğrulama gerektirmez; secret frontend'de
     * şifrelenerek saklanmalıdır (production'da backend saklarmalı).</p>
     *
     * @return secret ve QR kod Data URI içeren yanıt
     */
    @PostMapping("/setup")
    @Operation(summary = "2FA kurulumu", description = "Yeni TOTP secret ve QR kod üretir")
    public ResponseEntity<ApiResponse<Map<String, String>>> setup() {
        String userId = JwtUtil.getCurrentUserId();
        String username = userId != null ? userId : "kullanici";

        try {
            String secret = twoFactorAuthService.generateSecret();
            String qrUri = twoFactorAuthService.generateQrCodeDataUri(secret, username);

            Map<String, String> data = Map.of(
                    "secret", secret,
                    "qrCodeDataUri", qrUri,
                    "message", "Bu secret'ı güvenli şekilde saklayın. QR kodu Authenticator uygulamasıyla tarayın."
            );
            return ResponseEntity.ok(ApiResponse.success("2FA kurulum başarılı", data));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("QR kod üretilemedi: " + e.getMessage()));
        }
    }

    /**
     * Kullanıcının girdiği TOTP kodunu doğrular.
     *
     * @param request {@code secret} ve {@code code} içeren JSON gövdesi
     * @return doğrulama sonucu
     */
    @PostMapping("/verify")
    @Operation(summary = "2FA doğrulama", description = "TOTP kodunu doğrular")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> verify(
            @RequestBody Map<String, String> request) {
        String secret = request.get("secret");
        String code = request.get("code");

        if (secret == null || code == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("'secret' ve 'code' alanları zorunludur"));
        }

        boolean valid = twoFactorAuthService.verifyCode(secret, code);
        Map<String, Boolean> result = Map.of("valid", valid);

        if (valid) {
            return ResponseEntity.ok(ApiResponse.success("Doğrulama başarılı", result));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Geçersiz veya süresi dolmuş kod"));
        }
    }
}
