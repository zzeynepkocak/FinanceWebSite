package com.toyota.finance.controller;

import com.toyota.finance.service.FinnhubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/market")
@RequiredArgsConstructor
@io.swagger.v3.oas.annotations.tags.Tag(name = "Market", description = "Finnhub gerçek zamanlı piyasa verileri")
public class MarketController {

    private final FinnhubService finnhubService;

    /**
     * Get real-time quote for a symbol
     * GET /api/market/quote?symbol=AAPL
     */
    @GetMapping("/quote")
    public ResponseEntity<Map<String, Object>> getQuote(@RequestParam String symbol) {
        try {
            Map<String, Object> quote = finnhubService.getQuote(symbol);
            return ResponseEntity.ok(quote);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch quote");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("symbol", symbol);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get company profile
     * GET /api/market/profile?symbol=AAPL
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getCompanyProfile(@RequestParam String symbol) {
        try {
            Map<String, Object> profile = finnhubService.getCompanyProfile(symbol);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch company profile");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("symbol", symbol);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get market news
     * GET /api/market/news?category=general&minId=0
     */
    @GetMapping("/news")
    public ResponseEntity<Map<String, Object>[]> getMarketNews(
            @RequestParam(defaultValue = "general") String category,
            @RequestParam(required = false) Integer minId) {
        try {
            Map<String, Object>[] news = finnhubService.getMarketNews(category, minId);
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch market news");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("category", category);
            
            @SuppressWarnings("unchecked")
            Map<String, Object>[] errorArray = new Map[]{errorResponse};
            return ResponseEntity.status(500).body(errorArray);
        }
    }

    /**
     * Get candle data for charting
     * GET /api/market/candle?symbol=AAPL&resolution=D&from=1609459200&to=1612137600
     */
    @GetMapping("/candle")
    public ResponseEntity<Map<String, Object>> getCandleData(
            @RequestParam String symbol,
            @RequestParam(defaultValue = "D") String resolution,
            @RequestParam Long from,
            @RequestParam Long to) {
        try {
            Map<String, Object> candleData = finnhubService.getCandleData(symbol, resolution, from, to);
            return ResponseEntity.ok(candleData);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch candle data");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("symbol", symbol);
            errorResponse.put("resolution", resolution);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Get multiple quotes in batch
     * POST /api/market/quotes
     * Body: {"symbols": ["AAPL", "GOOGL", "MSFT"]}
     */
    @PostMapping("/quotes")
    public ResponseEntity<Map<String, Map<String, Object>>> getBatchQuotes(@RequestBody Map<String, String[]> request) {
        try {
            String[] symbols = request.get("symbols");
            if (symbols == null || symbols.length == 0) {
                Map<String, Map<String, Object>> errorResponse = new HashMap<>();
                Map<String, Object> errorDetails = new HashMap<>();
                errorDetails.put("error", "Symbols array is required");
                errorResponse.put("error", errorDetails);
                return ResponseEntity.badRequest().body(errorResponse);
            }

            Map<String, Map<String, Object>> quotes = finnhubService.getBatchQuotes(symbols);
            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            Map<String, Map<String, Object>> errorResponse = new HashMap<>();
            Map<String, Object> errorDetails = new HashMap<>();
            errorDetails.put("error", "Failed to fetch batch quotes");
            errorDetails.put("message", e.getMessage());
            errorResponse.put("error", errorDetails);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Check if Finnhub API is available
     * GET /api/market/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        boolean isAvailable = finnhubService.isApiAvailable();
        
        Map<String, Object> response = new HashMap<>();
        response.put("finnhub_api_available", isAvailable);
        response.put("timestamp", System.currentTimeMillis());
        
        if (isAvailable) {
            response.put("status", "healthy");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "unhealthy");
            response.put("message", "Finnhub API is not accessible");
            return ResponseEntity.status(503).body(response);
        }
    }

    /**
     * Get Turkish market symbols mapping
     * GET /api/market/symbols/turkish
     */
    @GetMapping("/symbols/turkish")
    public ResponseEntity<Map<String, String>> getTurkishSymbols() {
        Map<String, String> symbols = new HashMap<>();
        symbols.put("USD/TRY", "FX:USDTRY");
        symbols.put("EUR/TRY", "FX:EURTRY");
        symbols.put("GBP/TRY", "FX:GBPTRY");
        symbols.put("BIST 100", "XU100.IS");
        symbols.put("GARAN", "GARAN.IS");
        symbols.put("AKBNK", "AKBNK.IS");
        symbols.put("THYAO", "THYAO.IS");
        symbols.put("KCHOL", "KCHOL.IS");
        symbols.put("SAHOL", "SAHOL.IS");
        
        return ResponseEntity.ok(symbols);
    }
}
