package com.toyota.finance.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;
import java.util.HashMap;

@Service
public class FinnhubService {

    private static final Logger log = LogManager.getLogger(FinnhubService.class);

    private final RestTemplate restTemplate;
    private final String finnhubApiKey;
    private final String finnhubBaseUrl;

    public FinnhubService(RestTemplate restTemplate, 
                         @Value("${finnhub.api.key:}") String finnhubApiKey,
                         @Value("${finnhub.api.base-url:https://finnhub.io/api/v1}") String finnhubBaseUrl) {
        this.restTemplate = restTemplate;
        this.finnhubApiKey = finnhubApiKey;
        this.finnhubBaseUrl = finnhubBaseUrl;
    }

    /**
     * Get real-time quote for a symbol
     */
    @Cacheable(value = "marketQuotes", key = "#symbol")
    @SuppressWarnings("unchecked")
    public Map<String, Object> getQuote(String symbol) {
        try {
            String url = String.format("%s/quote?symbol=%s&token=%s", finnhubBaseUrl, symbol, finnhubApiKey);
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            return result != null ? result : new HashMap<>();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to fetch quote for " + symbol + ": " + e.getMessage());
        }
    }

    /**
     * Get company profile
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCompanyProfile(String symbol) {
        try {
            String url = String.format("%s/stock/profile2?symbol=%s&token=%s", finnhubBaseUrl, symbol, finnhubApiKey);
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            return result != null ? result : new HashMap<>();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to fetch company profile for " + symbol + ": " + e.getMessage());
        }
    }

    /**
     * Get market news
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object>[] getMarketNews(String category, Integer minId) {
        try {
            String url = String.format("%s/news?category=%s&minId=%d&token=%s", 
                    finnhubBaseUrl, category, minId != null ? minId : 0, finnhubApiKey);
            Map<String, Object>[] result = restTemplate.getForObject(url, Map[].class);
            return result != null ? result : new Map[0];
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to fetch market news: " + e.getMessage());
        }
    }

    /**
     * Get candle data for charting
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getCandleData(String symbol, String resolution, Long from, Long to) {
        try {
            String url = String.format("%s/stock/candle?symbol=%s&resolution=%s&from=%d&to=%d&token=%s", 
                    finnhubBaseUrl, symbol, resolution, from, to, finnhubApiKey);
            Map<String, Object> result = restTemplate.getForObject(url, Map.class);
            return result != null ? result : new HashMap<>();
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to fetch candle data for " + symbol + ": " + e.getMessage());
        }
    }

    /**
     * Check if Finnhub API is available
     */
    public boolean isApiAvailable() {
        try {
            // Try to get a simple quote for a common symbol
            Map<String, Object> quote = getQuote("AAPL");
            return quote != null && quote.containsKey("c");
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get multiple quotes in batch (simulated - Finnhub doesn't have true batch endpoint)
     */
    public Map<String, Map<String, Object>> getBatchQuotes(String[] symbols) {
        Map<String, Map<String, Object>> results = new HashMap<>();
        
        for (String symbol : symbols) {
            try {
                Map<String, Object> quote = getQuote(symbol);
                results.put(symbol, quote);
            } catch (Exception e) {
                log.warn("Failed to fetch quote for {}: {}", symbol, e.getMessage());
            }
        }
        
        return results;
    }
}
