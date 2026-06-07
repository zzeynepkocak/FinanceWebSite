package com.toyota.finance.dto;

/**
 * Kullanıcı kayıt isteği DTO'su.
 */
public record RegisterRequest(
        String firstName,
        String lastName,
        String email,
        String username,
        String password,
        String phone,
        String accountType
) {}
