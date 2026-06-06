package com.toyota.finance.repository;

import com.toyota.finance.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    /**
     * Aktif haberleri yayın tarihine göre azalan sırada getir
     */
    List<News> findByIsActiveTrueOrderByPublishedDateDesc();

    /**
     * Kategoriye göre aktif haberleri getir
     */
    List<News> findByCategoryAndIsActiveTrueOrderByPublishedDateDesc(String category);

    /**
     * Son N adet haberi getir
     */
    List<News> findTop5ByIsActiveTrueOrderByPublishedDateDesc();

    /**
     * Kullanıcının haberlerini getir
     */
    List<News> findByUserIdOrderByPublishedDateDesc(String userId);

    /**
     * ID'ye göre haber getir (sadece aktif olanlar)
     */
    News findByIdAndIsActiveTrue(Long id);
}
