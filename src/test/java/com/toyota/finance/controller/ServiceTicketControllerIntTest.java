package com.toyota.finance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.toyota.finance.entity.ServiceTicket;
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
 * JwtUtil.getCurrentUserId() local profilde null döndüğünden controller
 * 401 döndürür — bu beklenen davranış olarak test edilmiştir.</p>
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
    @DisplayName("GET /api/v1/tickets — kimlik yoksa 401 döner")
    void getTickets_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/tickets"))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/v1/tickets — kimlik yoksa 401 döner")
    void createTicket_noAuth_returns401() throws Exception {
        Map<String, String> body = Map.of(
                "title", "Test Ticket",
                "description", "Test açıklama",
                "priority", "MEDIUM",
                "category", "Yazılım"
        );

        mockMvc.perform(post("/api/v1/tickets")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("GET /api/v1/tickets/{id} — kimlik yoksa 401 döner")
    void getTicketById_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/v1/tickets/999"))
               .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PATCH /api/v1/tickets/{id}/transition — kimlik yoksa 401 döner")
    void transition_noAuth_returns401() throws Exception {
        Map<String, String> body = Map.of("status", "ASSIGNED");

        mockMvc.perform(patch("/api/v1/tickets/1/transition")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("API yanıtları ApiResponse sarmalayıcı yapısını döner")
    void response_hasApiResponseStructure() throws Exception {
        mockMvc.perform(get("/api/v1/tickets"))
               .andExpect(jsonPath("$.success").exists())
               .andExpect(jsonPath("$.message").exists());
    }
}
