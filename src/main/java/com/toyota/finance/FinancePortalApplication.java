package com.toyota.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * FinansPortalı — Toyota &amp; 32Bit 2026 Ana Uygulama Sınıfı.
 *
 * <p>Spring Boot uygulamasını başlatır.
 * JPA, Cache ve component tarama konfigürasyonlarını tanımlar.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@SpringBootApplication
@EnableCaching
@EntityScan(basePackages = "com.toyota.finance.entity")
@EnableJpaRepositories(basePackages = "com.toyota.finance.repository")
@ComponentScan(basePackages = {
    "com.toyota.finance.controller",
    "com.toyota.finance.service",
    "com.toyota.finance.config",
    "com.toyota.finance.repository",
    "com.toyota.finance.util",
    "com.toyota.finance.kafka",
    "com.toyota.finance.exception"
})
public class FinancePortalApplication {

    /**
     * Uygulama giriş noktası.
     *
     * @param args komut satırı argümanları
     */
    public static void main(String[] args) {
        SpringApplication.run(FinancePortalApplication.class, args);
    }
}
