package com.toyota.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "accounts") // Veritabanındaki tablo adı
@Getter
@Setter
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountName; // Örn: "Maaş Hesabı"

    @Column(nullable = false)
    private BigDecimal balance; // Bakiye

    @Column(name = "currency_type")
    private String currencyType; // TL, USD, BTC vb.

    // Kullanıcı ile ilişki (Keycloak User ID'si ile eşleşecek alan)
    private String userId;

    /** JPA için gerekli (proxy / reflection). */
    protected Account() {
    }
}