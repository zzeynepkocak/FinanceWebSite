package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.dto.RegisterRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

/**
 * Kullanıcı kayıt (register) REST API'si.
 *
 * <p>Keycloak Admin REST API aracılığıyla yeni kullanıcı oluşturur.</p>
 *
 * <p>Temel path: {@code /api/v1/auth}</p>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Kullanıcı kimlik doğrulama ve kayıt")
public class AuthController {

    private final RestTemplate restTemplate;

    @Value("${keycloak.admin.url}")
    private String keycloakUrl;

    @Value("${keycloak.admin.realm}")
    private String realm;

    @Value("${keycloak.admin.username}")
    private String adminUsername;

    @Value("${keycloak.admin.password}")
    private String adminPassword;

    /**
     * Yeni kullanıcı kaydı — Keycloak'ta kullanıcı oluşturur.
     *
     * @param request kayıt bilgileri
     * @return kayıt sonucu
     */
    @PostMapping("/register")
    @Operation(summary = "Kullanıcı kaydı", description = "Keycloak'ta yeni kullanıcı oluşturur")
    public ResponseEntity<ApiResponse<Map<String, String>>> register(
            @RequestBody RegisterRequest request) {

        if (request.username() == null || request.username().isBlank()
                || request.password() == null || request.password().isBlank()
                || request.email() == null || request.email().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Kullanıcı adı, şifre ve e-posta zorunludur"));
        }

        try {
            String adminToken = getAdminToken();
            createKeycloakUser(adminToken, request);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Kullanıcı başarıyla oluşturuldu",
                            Map.of("username", request.username())));

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.CONFLICT) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(ApiResponse.error("Bu kullanıcı adı veya e-posta zaten kayıtlı"));
            }
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(ApiResponse.error("Kayıt servisi hatası: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Kayıt işlemi başarısız: " + e.getMessage()));
        }
    }

    // ── Keycloak admin token al ──────────────────────────────────

    private String getAdminToken() {
        String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "admin-cli");
        body.add("username", adminUsername);
        body.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restTemplate.postForObject(tokenUrl, entity, Map.class);

        if (response == null || !response.containsKey("access_token")) {
            throw new RuntimeException("Admin token alınamadı");
        }
        return (String) response.get("access_token");
    }

    // ── Keycloak'ta kullanıcı oluştur ───────────────────────────

    private void createKeycloakUser(String adminToken, RegisterRequest request) {
        String usersUrl = keycloakUrl + "/admin/realms/" + realm + "/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        Map<String, Object> credential = Map.of(
                "type", "password",
                "value", request.password(),
                "temporary", false
        );

        Map<String, Object> user = Map.of(
                "username", request.username(),
                "email", request.email(),
                "firstName", request.firstName() != null ? request.firstName() : "",
                "lastName", request.lastName() != null ? request.lastName() : "",
                "enabled", true,
                "emailVerified", false,
                "credentials", List.of(credential),
                "attributes", Map.of(
                        "phone", request.phone() != null ? List.of(request.phone()) : List.of(),
                        "accountType", request.accountType() != null ? List.of(request.accountType()) : List.of("bireysel")
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(user, headers);
        restTemplate.postForEntity(usersUrl, entity, Void.class);
    }
}
