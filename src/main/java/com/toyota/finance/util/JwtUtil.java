package com.toyota.finance.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * JWT token'dan mevcut kullanıcı bilgilerini almak için yardımcı sınıf.
 *
 * <p>Spring Security context'inden JWT principal'ı okur.
 * Yalnızca statik yardımcı metotlar içerir; instantiate edilmez.</p>
 *
 * <p>Local profilde security tamamen kapalı olduğundan bu sınıf {@code null}
 * döndürebilir. Controller'lar bu durumu 401 dönerek ele almalıdır.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
public final class JwtUtil {

    private JwtUtil() {
        // Utility sınıfı — instantiate edilemez
    }

    /**
     * JWT token'dan mevcut kullanıcının Keycloak ID'sini ({@code sub} claim) döner.
     *
     * @return Keycloak kullanıcı ID'si (UUID formatında), ya da kimlik doğrulama
     *         yoksa / token JWT değilse {@code null}
     */
    public static String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        return null;
    }
}
