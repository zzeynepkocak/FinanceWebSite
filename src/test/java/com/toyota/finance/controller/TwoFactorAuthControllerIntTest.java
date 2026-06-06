package com.toyota.finance.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
 * TwoFactorAuthController entegrasyon testleri.
 *
 * <p>/setup endpoint'i kimlik gerektirmez (setup QR için);
 * /verify endpoint'i request body doğrular.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
@DisplayName("TwoFactorAuthController Integration Tests")
class TwoFactorAuthControllerIntTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("POST /api/v1/auth/2fa/setup — QR kod ve secret döner")
    void setup_returns200WithQrAndSecret() throws Exception {
        mockMvc.perform(post("/api/v1/auth/2fa/setup"))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.success").value(true))
               .andExpect(jsonPath("$.data.secret").isNotEmpty())
               .andExpect(jsonPath("$.data.qrCodeDataUri").value(startsWith("data:image/")));
    }

    @Test
    @DisplayName("POST /api/v1/auth/2fa/verify — body eksikse 400 döner")
    void verify_missingBody_returns400() throws Exception {
        mockMvc.perform(post("/api/v1/auth/2fa/verify")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content("{}"))
               .andExpect(status().isBadRequest())
               .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/v1/auth/2fa/verify — geçersiz kod 401 döner")
    void verify_invalidCode_returns401() throws Exception {
        /* önce bir secret al */
        String setupResponse = mockMvc.perform(post("/api/v1/auth/2fa/setup"))
               .andReturn().getResponse().getContentAsString();

        String secret = objectMapper.readTree(setupResponse).at("/data/secret").asText();

        Map<String, String> body = Map.of("secret", secret, "code", "000000");

        mockMvc.perform(post("/api/v1/auth/2fa/verify")
                       .contentType(MediaType.APPLICATION_JSON)
                       .content(objectMapper.writeValueAsString(body)))
               .andExpect(status().isUnauthorized())
               .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("POST /api/v1/auth/2fa/setup — ApiResponse yapısı doğru")
    void setup_responseStructureIsCorrect() throws Exception {
        mockMvc.perform(post("/api/v1/auth/2fa/setup"))
               .andExpect(jsonPath("$.success").value(true))
               .andExpect(jsonPath("$.data.message").exists())
               .andExpect(jsonPath("$.data.secret").isString());
    }
}
