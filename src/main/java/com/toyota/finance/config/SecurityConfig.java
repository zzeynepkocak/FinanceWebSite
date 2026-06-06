package com.toyota.finance.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security yapılandırması.
 *
 * <p>İki profil desteklenir:
 * <ul>
 *   <li><b>local</b> — Geliştirme ortamı; tüm istekler serbesttir.</li>
 *   <li><b>docker</b> — Production benzeri ortam; Keycloak JWT doğrulaması zorunludur.</li>
 * </ul>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // ── LOCAL PROFILE: Tüm istekler serbest ───────────────────────

    /**
     * Yerel geliştirme ortamı için güvenlik zinciri.
     * CSRF devre dışı, tüm endpoint'ler açık.
     *
     * @param http HttpSecurity nesnesi
     * @return güvenlik filtre zinciri
     * @throws Exception yapılandırma hatası
     */
    @Bean
    @Profile("local")
    public SecurityFilterChain localFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // ── DOCKER PROFILE: Keycloak JWT doğrulaması ──────────────────

    /**
     * Docker/production ortamı için güvenlik zinciri.
     * Kamuya açık endpoint'ler dışında JWT doğrulaması zorunludur.
     *
     * @param http HttpSecurity nesnesi
     * @return güvenlik filtre zinciri
     * @throws Exception yapılandırma hatası
     */
    @Bean
    @Profile("docker")
    public SecurityFilterChain dockerFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/actuator/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api/public/**",
                    "/h2-console/**",
                    // v1 haber endpoint'leri (public)
                    "/api/v1/news",
                    "/api/v1/news/**",
                    // Piyasa verileri — Finnhub proxy (public)
                    "/api/v1/market/**",
                    // 2FA setup (pre-auth)
                    "/api/v1/auth/**"
                ).permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    /**
     * CORS yapılandırması.
     *
     * <p>Geliştirme ortamı için localhost portlarına izin verir.</p>
     *
     * @return CORS kaynak yapılandırması
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://127.0.0.1:*"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * Keycloak {@code realm_access.roles} alanını Spring Security rollerine dönüştürür.
     *
     * @return JWT kimlik doğrulama dönüştürücüsü
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }
}
