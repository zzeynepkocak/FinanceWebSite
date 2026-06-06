package com.toyota.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "assets")
@Getter
@Setter
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String assetName;   // Örn: Toyota Hisse
    private String assetSymbol; // Örn: TM
    private Double quantity;    // Adet
    private BigDecimal purchasePrice; // Alış Fiyatı
    private String userId;      // Keycloak ID

    protected Asset() {} // JPA için
}