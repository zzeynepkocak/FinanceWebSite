package com.toyota.finance;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Spring Boot uygulama context yükleme testi.
 *
 * <p>local profili ile H2 veritabanı kullanılarak context başarıyla
 * yüklendiğini doğrular. JwtDecoder mock'lanır (Keycloak gerektirmez).</p>
 */
@SpringBootTest
@ActiveProfiles("local")
@DisplayName("Application Context Load Test")
class FinancePortalApplicationTests {

    @MockBean
    private JwtDecoder jwtDecoder;

    @Test
    @DisplayName("Spring context başarıyla yüklenir")
    void contextLoads() {
        // Context yüklenirse test geçer
        assertThat(true).isTrue();
    }
}
