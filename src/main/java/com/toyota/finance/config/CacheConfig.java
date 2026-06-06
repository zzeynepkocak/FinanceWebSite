package com.toyota.finance.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Caffeine önbellek yapılandırması.
 *
 * <p>Sık okunan ve nadiren değişen veriler (haber listeleri, kullanıcı hesapları)
 * Caffeine in-memory önbelleğinde tutularak veritabanı yükü azaltılır.</p>
 *
 * <p>Önbellek adları ve TTL (Time-to-Live) süreleri:
 * <ul>
 *   <li>{@code allNews}        — 5 dakika</li>
 *   <li>{@code latestNews}     — 2 dakika</li>
 *   <li>{@code newsByCategory} — 5 dakika</li>
 *   <li>{@code userAccounts}   — 10 dakika</li>
 *   <li>{@code userAssets}     — 5 dakika</li>
 * </ul>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 * @see org.springframework.cache.annotation.Cacheable
 * @see org.springframework.cache.annotation.CacheEvict
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Uygulama genelinde kullanılan CacheManager bean'ini oluşturur.
     *
     * <p>Tüm önbellekler için varsayılan davranış:
     * maksimum 500 girdi, 5 dakika TTL.</p>
     *
     * @return Caffeine tabanlı CacheManager
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();

        // Varsayılan spec (application.yml'deki değeri override eder)
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .recordStats());

        // Önbellek adlarını önceden tanımla
        manager.setCacheNames(java.util.List.of(
                "allNews",
                "latestNews",
                "newsByCategory",
                "userAccounts",
                "userAssets"
        ));

        return manager;
    }
}
