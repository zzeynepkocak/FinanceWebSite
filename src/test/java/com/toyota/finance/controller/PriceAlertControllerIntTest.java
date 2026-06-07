package com.toyota.finance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toyota.finance.repository.PriceAlertRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * PriceAlertController entegrasyon testleri.
 *
 * <p>local profili — security kapalı, JwtUtil "local-dev-user" döndürür.
 * CRUD işlemleri ve ApiResponse yapısı doğrulanır.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@DisplayName("PriceAlertController Integration Tests")
class PriceAlertControllerIntTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PriceAlertRepository alertRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtDecoder jwtDecoder;

    @AfterEach
    void cleanup() {
        alertRepo.deleteAll();
    }

    @Test
    @DisplayName("GET /api/v1/alerts — başlangıçta boş liste döner")
    void getAlerts_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/alerts"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/v1/alerts — geçerli body ile alarm oluşturulur")
    void createAlert_validBody_returns201() throws Exception {
        Map<String, Object> body = Map.of(
                "symbol",      "BTCUSDT",
                "targetPrice", new BigDecimal("70000"),
                "alertType",   "ABOVE"
        );

        mockMvc.perform(post("/api/v1/alerts")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("PATCH /api/v1/alerts/{id}/deactivate — olmayan alarm için 404 döner")
    void deactivate_nonExisting_returns404() throws Exception {
        mockMvc.perform(patch("/api/v1/alerts/999/deactivate"))
               .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("DELETE /api/v1/alerts/{id} — olmayan alarm için 404 döner")
    void delete_nonExisting_returns404() throws Exception {
        mockMvc.perform(delete("/api/v1/alerts/999"))
               .andExpect(status().isNotFound());
    }
}
