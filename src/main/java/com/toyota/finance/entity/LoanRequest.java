package com.toyota.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "loan_requests")
@Getter
@Setter
public class LoanRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;  // Müşteri adı
    private java.math.BigDecimal loanAmount;  // Kredi tutarı
    private String userId;       // Keycloak kullanıcı ID (sahipliği için)
}
