package com.toyota.finance.service;

import com.toyota.finance.entity.News;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Haber yönetimi iş mantığı.
 *
 * <p>Tüm CRUD işlemleri bu servis üzerinden gerçekleştirilir.
 * Sık okunan listeler Caffeine cache ile 5 dakika süreyle önbelleklenir.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class NewsService {

    private static final Logger log = LogManager.getLogger(NewsService.class);

    private final NewsRepository newsRepository;

    /**
     * Tüm aktif haberleri yayınlanma tarihine göre azalan sırada döner.
     *
     * @return aktif haber listesi
     */
    @Cacheable("allNews")
    public List<News> getAllActiveNews() {
        log.debug("Tüm aktif haberler getiriliyor");
        return newsRepository.findByIsActiveTrueOrderByPublishedDateDesc();
    }

    /**
     * Dashboard için en son 5 haberi döner.
     *
     * @return son 5 haber
     */
    @Cacheable("latestNews")
    public List<News> getLatestNews() {
        return newsRepository.findTop5ByIsActiveTrueOrderByPublishedDateDesc();
    }

    /**
     * Belirtilen ID'ye sahip aktif haberi döner.
     *
     * @param id haber ID'si
     * @return bulunan haber
     * @throws ResourceNotFoundException haber bulunamazsa
     */
    public News getNewsById(Long id) {
        News news = newsRepository.findByIdAndIsActiveTrue(id);
        if (news == null) {
            throw new ResourceNotFoundException("Haber bulunamadı: " + id);
        }
        return news;
    }

    /**
     * Kategoriye göre aktif haberleri döner.
     *
     * @param category haber kategorisi
     * @return kategori haberleri
     */
    @Cacheable(value = "newsByCategory", key = "#category")
    public List<News> getNewsByCategory(String category) {
        return newsRepository.findByCategoryAndIsActiveTrueOrderByPublishedDateDesc(category);
    }

    /**
     * Belirtilen kullanıcıya ait haberleri döner.
     *
     * @param userId Keycloak kullanıcı ID'si
     * @return kullanıcı haberleri
     */
    public List<News> getNewsByUser(String userId) {
        return newsRepository.findByUserIdOrderByPublishedDateDesc(userId);
    }

    /**
     * Yeni haber kaydeder.
     *
     * @param news  haber nesnesi
     * @param userId yazar kullanıcı ID'si
     * @return kaydedilen haber
     */
    @CacheEvict(value = {"allNews", "latestNews"}, allEntries = true)
    public News createNews(News news, String userId) {
        news.setUserId(userId);
        news.setPublishedDate(LocalDateTime.now());
        news.setIsActive(true);
        News saved = newsRepository.save(news);
        log.info("Yeni haber oluşturuldu: id={}, başlık={}", saved.getId(), saved.getTitle());
        return saved;
    }

    /**
     * Var olan haberi günceller. Sadece haberin sahibi güncelleyebilir.
     *
     * @param id     güncellenecek haber ID'si
     * @param update güncel haber verisi
     * @param userId işlemi yapan kullanıcı ID'si
     * @return güncellenen haber
     * @throws ResourceNotFoundException haber bulunamazsa
     * @throws SecurityException haber başka kullanıcıya aitse
     */
    @CacheEvict(value = {"allNews", "latestNews", "newsByCategory"}, allEntries = true)
    public News updateNews(Long id, News update, String userId) {
        News existing = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Haber bulunamadı: " + id));
        if (!userId.equals(existing.getUserId())) {
            throw new SecurityException("Bu haberi güncelleme yetkiniz yok");
        }
        update.setId(id);
        update.setUserId(userId);
        return newsRepository.save(update);
    }

    /**
     * Haberi soft-delete yapar (isActive = false).
     *
     * @param id     silinecek haber ID'si
     * @param userId işlemi yapan kullanıcı ID'si
     * @throws ResourceNotFoundException haber bulunamazsa
     * @throws SecurityException haber başka kullanıcıya aitse
     */
    @CacheEvict(value = {"allNews", "latestNews", "newsByCategory"}, allEntries = true)
    public void deleteNews(Long id, String userId) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Haber bulunamadı: " + id));
        if (!userId.equals(news.getUserId())) {
            throw new SecurityException("Bu haberi silme yetkiniz yok");
        }
        news.setIsActive(false);
        newsRepository.save(news);
        log.info("Haber silindi (soft): id={}", id);
    }
}
