package com.toyota.finance.kafka;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Kafka log konusunu dinleyen ve mesajları OpenSearch'e ileten tüketici.
 *
 * <p>Pipeline:
 * <pre>
 *   Log4j2 KafkaAppender → Kafka (finance-logs) → LogConsumer → OpenSearch
 * </pre>
 * </p>
 *
 * <p>OpenSearch'e HTTP REST API üzerinden yazma yapılır.
 * Bağlantı bilgisi {@code OPENSEARCH_URL} ortam değişkeninden okunur.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Component
public class LogConsumer {

    private static final Logger log = LogManager.getLogger(LogConsumer.class);

    @Value("${opensearch.url:http://opensearch:9200}")
    private String openSearchUrl;

    @Value("${opensearch.index:finance-portal-logs}")
    private String indexName;

    private final RestTemplate restTemplate;

    /**
     * @param restTemplate HTTP istemcisi
     */
    public LogConsumer(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * {@code finance-logs} konusundan log mesajlarını tüketir ve OpenSearch'e yazar.
     *
     * @param message Kafka'dan gelen log mesajı
     * @param offset  mesaj offset'i (izleme amaçlı)
     */
    @KafkaListener(
            topics = "finance-logs",
            groupId = "log-consumer-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeLog(
            @Payload String message,
            @Header(KafkaHeaders.OFFSET) Long offset) {
        try {
            indexToOpenSearch(message, offset);
        } catch (Exception e) {
            // OpenSearch'e yazma başarısız olursa sadece yerel log at; sonsuz döngü önlenir
            log.warn("OpenSearch'e log yazılamadı (offset={}): {}", offset, e.getMessage());
        }
    }

    /**
     * Log mesajını OpenSearch'e HTTP POST ile yazar.
     *
     * @param rawMessage ham log satırı
     * @param offset     Kafka offset numarası
     */
    private void indexToOpenSearch(String rawMessage, Long offset) {
        String url = String.format("%s/%s/_doc", openSearchUrl, indexName);

        Map<String, Object> document = new HashMap<>();
        document.put("@timestamp", Instant.now().toString());
        document.put("message", rawMessage);
        document.put("kafka_offset", offset);
        document.put("service", "finance-portal");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(document, headers);
        restTemplate.postForObject(url, request, String.class);
    }
}
