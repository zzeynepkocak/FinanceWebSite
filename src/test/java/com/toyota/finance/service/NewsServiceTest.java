package com.toyota.finance.service;

import com.toyota.finance.entity.News;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * {@link NewsService} birim testleri.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("NewsService Unit Tests")
class NewsServiceTest {

    @Mock
    private NewsRepository newsRepository;

    @InjectMocks
    private NewsService newsService;

    private News activeNews;

    @BeforeEach
    void setUp() {
        // News constructor protected → Mockito mock
        activeNews = mock(News.class);
        when(activeNews.getTitle()).thenReturn("BIST 100 rekor kırdı");
        when(activeNews.getSummary()).thenReturn("Ana endeks 14.000 puanı aştı");
        when(activeNews.getIsActive()).thenReturn(true);
        when(activeNews.getUserId()).thenReturn("editor-user");
        when(activeNews.getCategory()).thenReturn("Borsa");
        when(activeNews.getPublishedDate()).thenReturn(LocalDateTime.now());
    }

    // ── getAllActiveNews ─────────────────────────────────────────

    @Test
    @DisplayName("getAllActiveNews — aktif haberleri döner")
    void getAllActiveNews_shouldReturnActiveNews() {
        when(newsRepository.findByIsActiveTrueOrderByPublishedDateDesc())
                .thenReturn(List.of(activeNews));

        List<News> result = newsService.getAllActiveNews();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("BIST 100 rekor kırdı");
    }

    // ── getNewsById ──────────────────────────────────────────────

    @Test
    @DisplayName("getNewsById — aktif haber bulunursa döner")
    void getNewsById_shouldReturnNews_whenActive() {
        when(newsRepository.findByIdAndIsActiveTrue(1L)).thenReturn(activeNews);

        News result = newsService.getNewsById(1L);

        assertThat(result.getCategory()).isEqualTo("Borsa");
    }

    @Test
    @DisplayName("getNewsById — silinmiş haber için exception fırlatır")
    void getNewsById_shouldThrow_whenInactive() {
        when(newsRepository.findByIdAndIsActiveTrue(99L)).thenReturn(null);

        assertThatThrownBy(() -> newsService.getNewsById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Haber bulunamadı: 99");
    }

    // ── createNews ───────────────────────────────────────────────

    @Test
    @DisplayName("createNews — yeni haber kaydeder, save çağrılır")
    void createNews_shouldCallSave() {
        News draft = mock(News.class);
        when(draft.getTitle()).thenReturn("Yeni Haber");
        when(newsRepository.save(draft)).thenReturn(draft);
        when(draft.getId()).thenReturn(1L);

        News result = newsService.createNews(draft, "editor-123");

        assertThat(result).isNotNull();
        verify(newsRepository).save(draft);
        verify(draft).setUserId("editor-123");
        verify(draft).setIsActive(true);
    }

    // ── updateNews ───────────────────────────────────────────────

    @Test
    @DisplayName("updateNews — sahip kullanıcı güncelleyebilir")
    void updateNews_shouldUpdate_whenOwner() {
        when(newsRepository.findById(1L)).thenReturn(Optional.of(activeNews));
        News update = mock(News.class);
        when(newsRepository.save(update)).thenReturn(update);

        News result = newsService.updateNews(1L, update, "editor-user");

        verify(newsRepository).save(update);
        verify(update).setId(1L);
        verify(update).setUserId("editor-user");
    }

    @Test
    @DisplayName("updateNews — başka kullanıcı güncellemeye çalışırsa SecurityException fırlatır")
    void updateNews_shouldThrow_whenNotOwner() {
        when(newsRepository.findById(1L)).thenReturn(Optional.of(activeNews));

        assertThatThrownBy(() -> newsService.updateNews(1L, mock(News.class), "other-user"))
                .isInstanceOf(SecurityException.class);
    }

    // ── deleteNews ───────────────────────────────────────────────

    @Test
    @DisplayName("deleteNews — soft delete: isActive=false yapılır")
    void deleteNews_shouldSoftDelete() {
        when(newsRepository.findById(1L)).thenReturn(Optional.of(activeNews));

        newsService.deleteNews(1L, "editor-user");

        verify(activeNews).setIsActive(false);
        verify(newsRepository).save(activeNews);
    }
}
