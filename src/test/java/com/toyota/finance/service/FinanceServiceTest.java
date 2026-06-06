package com.toyota.finance.service;

import com.toyota.finance.entity.Account;
import com.toyota.finance.entity.Asset;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.AccountRepository;
import com.toyota.finance.repository.AssetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * {@link FinanceService} birim testleri.
 *
 * <p>Veritabanı bağlantısı olmaksızın Mockito ile repository'ler mock'lanarak
 * iş mantığı izole biçimde test edilir. Entity'ler de Mockito.mock() ile
 * oluşturulur (protected constructors nedeniyle).</p>
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("FinanceService Unit Tests")
class FinanceServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AssetRepository assetRepository;

    @InjectMocks
    private FinanceService financeService;

    private Account testAccount;
    private Asset testAsset;

    @BeforeEach
    void setUp() {
        // Entity constructor protected → Mockito mock kullanılır
        testAccount = mock(Account.class);
        when(testAccount.getId()).thenReturn(1L);
        when(testAccount.getAccountName()).thenReturn("Test Hesabı");
        when(testAccount.getBalance()).thenReturn(BigDecimal.valueOf(10000));
        when(testAccount.getCurrencyType()).thenReturn("TRY");
        when(testAccount.getUserId()).thenReturn("user-123");

        testAsset = mock(Asset.class);
        when(testAsset.getAssetSymbol()).thenReturn("GARAN");
        when(testAsset.getUserId()).thenReturn("user-123");
    }

    // ── getUserAccounts ──────────────────────────────────────────

    @Test
    @DisplayName("getUserAccounts — mevcut userId için hesap listesi döner")
    void getUserAccounts_shouldReturnAccounts() {
        when(accountRepository.findByUserId("user-123")).thenReturn(List.of(testAccount));

        List<Account> result = financeService.getUserAccounts("user-123");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAccountName()).isEqualTo("Test Hesabı");
        verify(accountRepository).findByUserId("user-123");
    }

    @Test
    @DisplayName("getUserAccounts — hesabı olmayan kullanıcı için boş liste döner")
    void getUserAccounts_shouldReturnEmptyList_whenNoAccounts() {
        when(accountRepository.findByUserId("unknown-user")).thenReturn(List.of());

        List<Account> result = financeService.getUserAccounts("unknown-user");

        assertThat(result).isEmpty();
    }

    // ── getAccountById ───────────────────────────────────────────

    @Test
    @DisplayName("getAccountById — geçerli id ve userId ile hesap döner")
    void getAccountById_shouldReturnAccount() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));

        Account result = financeService.getAccountById(1L, "user-123");

        assertThat(result.getAccountName()).isEqualTo("Test Hesabı");
    }

    @Test
    @DisplayName("getAccountById — başka kullanıcının hesabı için exception fırlatır")
    void getAccountById_shouldThrow_whenDifferentUser() {
        when(accountRepository.findById(1L)).thenReturn(Optional.of(testAccount));

        assertThatThrownBy(() -> financeService.getAccountById(1L, "other-user"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Hesap bulunamadı");
    }

    @Test
    @DisplayName("getAccountById — olmayan id için exception fırlatır")
    void getAccountById_shouldThrow_whenNotFound() {
        when(accountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> financeService.getAccountById(99L, "user-123"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── createAccount ────────────────────────────────────────────

    @Test
    @DisplayName("createAccount — hesabı kaydeder ve döner")
    void createAccount_shouldSaveAndReturn() {
        when(accountRepository.save(testAccount)).thenReturn(testAccount);

        Account result = financeService.createAccount(testAccount);

        assertThat(result.getAccountName()).isEqualTo("Test Hesabı");
        verify(accountRepository).save(testAccount);
    }

    // ── getUserAssets ────────────────────────────────────────────

    @Test
    @DisplayName("getUserAssets — varlık listesini döner")
    void getUserAssets_shouldReturnAssets() {
        when(assetRepository.findByUserId("user-123")).thenReturn(List.of(testAsset));

        List<Asset> result = financeService.getUserAssets("user-123");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAssetSymbol()).isEqualTo("GARAN");
    }

    // ── createAsset ──────────────────────────────────────────────

    @Test
    @DisplayName("createAsset — varlığı kaydeder ve döner")
    void createAsset_shouldSaveAndReturn() {
        when(assetRepository.save(testAsset)).thenReturn(testAsset);

        Asset result = financeService.createAsset(testAsset);

        assertThat(result.getAssetSymbol()).isEqualTo("GARAN");
        verify(assetRepository).save(testAsset);
    }
}
