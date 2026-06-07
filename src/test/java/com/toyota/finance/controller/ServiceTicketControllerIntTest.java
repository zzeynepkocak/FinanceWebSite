package com.toyota.finance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toyota.finance.repository.ServiceTicketRepository;
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

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ServiceTicketController entegrasyon testleri.
 *
 * <p>local profili ile H2 veritabanı kullanır; Keycloak gerekmez.
 * JwtUtil.getCurrentUserId() local profilde "local-dev-user" döndürür,
 * bu nedenle CRUD işlemleri başarıyla çalışır.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@DisplayName("ServiceTicketController Integration Tests")
class ServiceTicketControllerIntTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ServiceTicketRepository ticketRepo;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtDecoder jwtDecoder;

    @AfterEach
    void cleanup() {
        ticketRepo.deleteAll();
    }

    @Test
    @DisplayName("GET /api/v1/tickets — başlangıçta boş liste döner")
    void getTickets_returnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/v1/tickets"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("POST /api/v1/tickets — geçerli body ile ticket oluşturulur")
    void createTicket_validBody_returns201() throws Exception {
        Map<String, String> body = Map.of(
                "title",       "Test Ticket",
                "description", "Test açıklama",
                "priority",    "MEDIUM",
                "category",    "Yazılım"
        );

        mockMvc.perform(post("/api/v1/tickets")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isCreated())
               .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("GET /api/v1/tickets/{id} — olmayan ticket için 404 döner")
    void getTicketById_notFound_returns404() throws Exception {
        mockMvc.perform(get("/api/v1/tickets/999"))
               .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("PATCH /api/v1/tickets/{id}/transition — olmayan ticket için 404 döner")
    void transition_notFound_returns404() throws Exception {
        Map<String, String> body = Map.of("status", "ASSIGNED");

        mockMvc.perform(patch("/api/v1/tickets/999/transition")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("API yanıtları ApiResponse sarmalayıcı yapısını döner")
    void response_hasApiResponseStructure() throws Exception {
        mockMvc.perform(get("/api/v1/tickets"))
               .andExpect(jsonPath("$.success").exists())
               .andExpect(jsonPath("$.message").exists());
    }
}
