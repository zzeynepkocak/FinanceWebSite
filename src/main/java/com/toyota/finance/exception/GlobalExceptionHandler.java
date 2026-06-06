package com.toyota.finance.exception;

import com.toyota.finance.dto.ApiResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

/**
 * Global hata yakalama mekanizması.
 *
 * <p>Tüm controller'lardan fırlatılan istisnalar bu sınıf tarafından yakalanır
 * ve standart {@link ApiResponse} formatında istemciye döndürülür.
 * Tüm hatalar Log4j2 ile de kaydedilir.</p>
 *
 * <p>HTTP durum kodu eşleştirmeleri:
 * <ul>
 *   <li>404 — {@link ResourceNotFoundException}</li>
 *   <li>403 — {@link AccessDeniedException}, {@link SecurityException}</li>
 *   <li>400 — {@link IllegalArgumentException}, {@link IllegalStateException},
 *               {@link MethodArgumentNotValidException}, {@link MethodArgumentTypeMismatchException}</li>
 *   <li>500 — Tüm diğer {@link Exception}'lar</li>
 * </ul>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LogManager.getLogger(GlobalExceptionHandler.class);

    /**
     * Kaynak bulunamadığında 404 döner.
     *
     * @param ex istisna
     * @return 404 hata yanıtı
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Kaynak bulunamadı: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Erişim reddedildiğinde 403 döner.
     *
     * @param ex istisna
     * @return 403 hata yanıtı
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        log.warn("Erişim reddedildi: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error("Bu işlem için yetkiniz bulunmuyor"));
    }

    /**
     * Güvenlik ihlali durumunda 403 döner.
     *
     * @param ex istisna
     * @return 403 hata yanıtı
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiResponse<Void>> handleSecurityException(SecurityException ex) {
        log.warn("Güvenlik ihlali: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Geçersiz argüman veya iş akışı durumu için 400 döner.
     *
     * @param ex istisna
     * @return 400 hata yanıtı
     */
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(RuntimeException ex) {
        log.warn("Geçersiz istek: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Bean Validation hatası için 400 döner.
     *
     * @param ex istisna
     * @return 400 hata yanıtı (alan bazlı)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("Geçersiz istek gövdesi");
        log.warn("Doğrulama hatası: {}", msg);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(msg));
    }

    /**
     * Tip uyuşmazlığı (path variable, request param) için 400 döner.
     *
     * @param ex istisna
     * @return 400 hata yanıtı
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        String msg = String.format("'%s' parametresi geçersiz değer: %s", ex.getName(), ex.getValue());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(msg));
    }

    /**
     * Yakalanmamış tüm hatalar için 500 döner.
     *
     * @param ex istisna
     * @return 500 hata yanıtı
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Beklenmeyen hata: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."));
    }
}
