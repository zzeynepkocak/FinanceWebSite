package com.toyota.finance.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Fiyat alarmı varlık sınıfı.
 *
 * <p>Kullanıcı belirli bir sembol için hedef fiyat belirler.
 * alert_type: ABOVE (fiyat geçince uyar) veya BELOW (fiyat düşünce uyar).</p>
 */
@Entity
@Table(name = "price_alerts")
@Getter
@Setter
public class PriceAlert {

    public enum AlertType { ABOVE, BELOW }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 255)
    private String userId;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String symbol;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 18, scale = 4)
    private BigDecimal targetPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AlertType alertType = AlertType.ABOVE;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    protected PriceAlert() {}
}
