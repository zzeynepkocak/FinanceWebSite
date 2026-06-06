package com.toyota.finance.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 3 / Swagger UI yapılandırması.
 *
 * <p>Swagger UI adresine şuradan erişilebilir:
 * <a href="http://localhost:8081/swagger-ui.html">http://localhost:8081/swagger-ui.html</a></p>
 *
 * <p>Bearer (Keycloak) JWT token doğrulaması için güvenlik şeması eklenmiştir.
 * "Authorize" butonuna tıklayarak token girişi yapılabilir.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    /**
     * OpenAPI 3 meta verilerini ve JWT güvenlik şemasını yapılandırır.
     *
     * @return OpenAPI tanım nesnesi
     */
    @Bean
    public OpenAPI financePortalOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FinansPortalı API")
                        .description("""
                                Toyota & 32Bit 2026 — Kurumsal Finans Portalı REST API.

                                **Kimlik Doğrulama:** Keycloak JWT Bearer Token
                                **API Versiyonu:** v1 (`/api/v1/...`)

                                Swagger UI üzerinden test etmek için önce Keycloak'tan token alın,
                                ardından sağ üstteki "Authorize" butonunu kullanın.
                                """)
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("FinansPortalı Ekibi")
                                .email("finans@toyota.com.tr"))
                        .license(new License()
                                .name("Toyota Internal Use Only")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Keycloak'tan alınan JWT access token")));
    }
}
