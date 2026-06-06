package com.toyota.finance.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * Kafka konu (topic) yapılandırması.
 *
 * <p>Uygulama başlarken aşağıdaki konular otomatik olarak oluşturulur:
 * <ul>
 *   <li>{@code finance-logs}   — Log4j2 KafkaAppender tarafından yazılan uygulama logları</li>
 *   <li>{@code finance-alerts} — Fiyat alarmları ve sistem bildirimleri</li>
 *   <li>{@code finance-events} — İşlem ve portföy olayları (audit trail)</li>
 * </ul>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Configuration
public class KafkaTopicConfig {

    /**
     * Log4j2 KafkaAppender'ın yazdığı uygulama log konusu.
     * Loglar buradan OpenSearch'e iletilir.
     *
     * @return Kafka konu tanımı
     */
    @Bean
    public NewTopic financeLogsTopic() {
        return TopicBuilder.name("finance-logs")
                .partitions(3)
                .replicas(1)
                .build();
    }

    /**
     * Fiyat alarm bildirimleri için konu.
     *
     * @return Kafka konu tanımı
     */
    @Bean
    public NewTopic financeAlertsTopic() {
        return TopicBuilder.name("finance-alerts")
                .partitions(2)
                .replicas(1)
                .build();
    }

    /**
     * İşlem ve portföy olayları için audit konu.
     *
     * @return Kafka konu tanımı
     */
    @Bean
    public NewTopic financeEventsTopic() {
        return TopicBuilder.name("finance-events")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
