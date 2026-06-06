package com.toyota.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * BT Servis Talebi varlık sınıfı.
 *
 * <p>jBPM iş akışı modelinden esinlenerek tanımlanmış BT destek talebi.
 * Ticket, aşağıdaki durumlar arasında geçiş yapar:</p>
 *
 * <pre>
 *   OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
 *                                 ↓
 *                              REJECTED
 * </pre>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Entity
@Table(name = "service_tickets")
@Getter
@Setter
public class ServiceTicket {

    /** Olası ticket durumları. */
    public enum Status {
        /** Açık — atama bekleniyor. */
        OPEN,
        /** Atandı — IT uzmanına atandı. */
        ASSIGNED,
        /** İşlemde — çözüm süreci devam ediyor. */
        IN_PROGRESS,
        /** Çözüldü — kullanıcı onayı bekleniyor. */
        RESOLVED,
        /** Kapatıldı — süreç tamamlandı. */
        CLOSED,
        /** Reddedildi — ticket geçersiz veya kapsam dışı. */
        REJECTED
    }

    /** Öncelik seviyeleri. */
    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Ticket başlığı. */
    @Column(nullable = false, length = 255)
    private String title;

    /** Sorunun açıklaması. */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Ticket sahibinin Keycloak ID'si. */
    @Column(nullable = false, length = 255)
    private String userId;

    /** Atanan IT uzmanının kullanıcı adı. */
    @Column(length = 255)
    private String assignedTo;

    /** Mevcut iş akışı durumu. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.OPEN;

    /** Öncelik seviyesi. */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Priority priority = Priority.MEDIUM;

    /** Kategori (örn: Erişim, Donanım, Yazılım). */
    @Column(length = 100)
    private String category;

    /** Çözüm notu. */
    @Column(columnDefinition = "TEXT")
    private String resolutionNote;

    /** Oluşturulma zamanı. */
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    /** Son güncelleme zamanı. */
    @Column
    private LocalDateTime updatedAt;

    /** JPA için zorunlu no-arg constructor. */
    protected ServiceTicket() {}
}
