package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.News;
import com.toyota.finance.service.NewsService;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Finans haberleri yönetimi REST API'si.
 *
 * <p>Genel haber okuma endpoint'leri herkes tarafından erişilebilir (public).
 * Haber oluşturma, güncelleme ve silme işlemleri kimlik doğrulama gerektirir.</p>
 *
 * <p>Temel path: {@code /api/v1/news}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/news")
@RequiredArgsConstructor
@Tag(name = "News", description = "Finans haberleri yönetimi")
public class NewsController {

    private final NewsService newsService;

    /**
     * Tüm aktif haberleri listeler.
     *
     * @return aktif haber listesi (public endpoint)
     */
    @GetMapping
    @Operation(summary = "Haberleri listele", description = "Tüm aktif finans haberlerini döner")
    public ResponseEntity<ApiResponse<List<News>>> getAllActiveNews() {
        return ResponseEntity.ok(ApiResponse.success(newsService.getAllActiveNews()));
    }

    /**
     * Dashboard için son 5 haberi döner.
     *
     * @return son 5 haber (public endpoint)
     */
    @GetMapping("/latest")
    @Operation(summary = "Son haberler", description = "Dashboard için son 5 haberi döner")
    public ResponseEntity<ApiResponse<List<News>>> getLatestNews() {
        return ResponseEntity.ok(ApiResponse.success(newsService.getLatestNews()));
    }

    /**
     * Belirtilen ID'ye sahip haberi döner.
     *
     * @param id haber ID'si
     * @return haber verisi
     */
    @GetMapping("/{id}")
    @Operation(summary = "Haber getir", description = "ID'ye göre haber detayını döner")
    public ResponseEntity<ApiResponse<News>> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(newsService.getNewsById(id)));
    }

    /**
     * Kategoriye göre haberleri filtreler.
     *
     * @param category haber kategorisi (örn: Borsa, Döviz, Makro)
     * @return kategori haberleri
     */
    @GetMapping("/category/{category}")
    @Operation(summary = "Kategoriye göre haberler", description = "Belirtilen kategorideki haberleri döner")
    public ResponseEntity<ApiResponse<List<News>>> getNewsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(newsService.getNewsByCategory(category)));
    }

    /**
     * Giriş yapmış kullanıcının haberlerini listeler.
     *
     * @return kullanıcıya ait haberler
     */
    @GetMapping("/my")
    @Operation(summary = "Kendi haberlerim", description = "Giriş yapmış kullanıcının haberlerini döner")
    public ResponseEntity<ApiResponse<List<News>>> getMyNews() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        return ResponseEntity.ok(ApiResponse.success(newsService.getNewsByUser(userId)));
    }

    /**
     * Yeni haber yayınlar.
     *
     * @param news yayınlanacak haber (JSON body)
     * @return oluşturulan haber
     */
    @PostMapping
    @Operation(summary = "Haber oluştur", description = "Yeni finans haberi oluşturur (kimlik doğrulama gerekli)")
    public ResponseEntity<ApiResponse<News>> createNews(@RequestBody News news) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        News saved = newsService.createNews(news, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Haber oluşturuldu", saved));
    }

    /**
     * Var olan haberi günceller.
     *
     * @param id   güncellenecek haber ID'si
     * @param news güncel haber verisi
     * @return güncellenen haber
     */
    @PutMapping("/{id}")
    @Operation(summary = "Haber güncelle", description = "Var olan haberi günceller (sadece sahip güncelleyebilir)")
    public ResponseEntity<ApiResponse<News>> updateNews(@PathVariable Long id, @RequestBody News news) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        News updated = newsService.updateNews(id, news, userId);
        return ResponseEntity.ok(ApiResponse.success("Haber güncellendi", updated));
    }

    /**
     * Haberi soft-delete yapar (isActive = false).
     *
     * @param id silinecek haber ID'si
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Haber sil", description = "Haberi pasif yapar (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        newsService.deleteNews(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Haber silindi", null));
    }
}
