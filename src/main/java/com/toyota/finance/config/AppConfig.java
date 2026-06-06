package com.toyota.finance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.client.RestTemplate;

/**
 * Genel uygulama bean yapılandırması.
 *
 * <p>Dış API çağrıları (Finnhub, OpenSearch) için kullanılan
 * {@link RestTemplate} bean'i bu sınıfta tanımlanır.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Configuration
public class AppConfig {

    /**
     * Dış servis çağrıları için RestTemplate bean'i.
     *
     * <p>FinnhubService ve LogConsumer tarafından kullanılır.</p>
     *
     * @param builder Spring tarafından enjekte edilen builder
     * @return yapılandırılmış RestTemplate
     */
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
