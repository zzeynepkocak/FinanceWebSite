package com.toyota.finance.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "news")
@Getter
@Setter
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;        // Haber başlığı

    @Column(columnDefinition = "TEXT")
    private String summary;      // Haber özeti

    @Column(columnDefinition = "TEXT")
    private String content;      // Haber içeriği

    @Column(name = "image_url")
    private String imageUrl;     // Haber görseli

    @Column(name = "author_name")
    private String authorName;    // Yazar adı

    @Column(name = "published_date")
    private LocalDateTime publishedDate; // Yayın tarihi

    @Column(name = "category")
    private String category;     // Kategori (Finans, Ekonomi, vb.)

    @Column(name = "is_active")
    private Boolean isActive = true; // Aktif mi?

    @Column(name = "user_id")
    private String userId;       // Oluşturan kullanıcı (Keycloak ID)

    /** JPA için gerekli (proxy / reflection). */
    protected News() {
    }
}
