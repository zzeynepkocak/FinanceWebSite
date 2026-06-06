package com.toyota.finance.service;

import com.toyota.finance.entity.Account;
import com.toyota.finance.entity.Asset;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.AccountRepository;
import com.toyota.finance.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Hesap ve varlık (asset) yönetimi iş mantığı.
 *
 * <p>Kullanıcıya özel banka hesapları ile portföy varlıklarının CRUD işlemleri
 * bu servis üzerinden gerçekleştirilir. Sık okunan veriler Caffeine önbelleğinde
 * tutularak veritabanı yükü azaltılır.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class FinanceService {

    private static final Logger log = LogManager.getLogger(FinanceService.class);

    private final AccountRepository accountRepository;
    private final AssetRepository assetRepository;

    // ──────────────────────────────────────────────────────────────
    //  Hesaplar
    // ──────────────────────────────────────────────────────────────

    /**
     * Belirtilen kullanıcıya ait tüm hesapları döner.
     *
     * @param userId Keycloak kullanıcı ID'si (JWT sub)
     * @return kullanıcı hesapları listesi
     */
    @Cacheable(value = "userAccounts", key = "#userId")
    public List<Account> getUserAccounts(String userId) {
        log.debug("Hesaplar getiriliyor: userId={}", userId);
        return accountRepository.findByUserId(userId);
    }

    /**
     * Belirtilen ID ve kullanıcıya ait hesabı döner.
     *
     * @param id     hesap ID'si
     * @param userId Keycloak kullanıcı ID'si
     * @return hesap
     * @throws ResourceNotFoundException hesap bulunamazsa
     */
    public Account getAccountById(Long id, String userId) {
        return accountRepository.findById(id)
                .filter(a -> userId.equals(a.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Hesap bulunamadı: " + id));
    }

    /**
     * Yeni hesap oluşturur.
     *
     * @param account hesap nesnesi
     * @return kaydedilen hesap
     */
    @CacheEvict(value = "userAccounts", key = "#account.userId")
    public Account createAccount(Account account) {
        Account saved = accountRepository.save(account);
        log.info("Hesap oluşturuldu: id={}, userId={}", saved.getId(), saved.getUserId());
        return saved;
    }

    // ──────────────────────────────────────────────────────────────
    //  Varlıklar (Assets)
    // ──────────────────────────────────────────────────────────────

    /**
     * Belirtilen kullanıcıya ait tüm varlıkları döner.
     *
     * @param userId Keycloak kullanıcı ID'si
     * @return varlık listesi
     */
    @Cacheable(value = "userAssets", key = "#userId")
    public List<Asset> getUserAssets(String userId) {
        log.debug("Varlıklar getiriliyor: userId={}", userId);
        return assetRepository.findByUserId(userId);
    }

    /**
     * Belirtilen ID ve kullanıcıya ait varlığı döner.
     *
     * @param id     varlık ID'si
     * @param userId Keycloak kullanıcı ID'si
     * @return varlık
     * @throws ResourceNotFoundException varlık bulunamazsa
     */
    public Asset getAssetById(Long id, String userId) {
        return assetRepository.findById(id)
                .filter(a -> userId.equals(a.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Varlık bulunamadı: " + id));
    }

    /**
     * Yeni varlık kaydeder.
     *
     * @param asset varlık nesnesi
     * @return kaydedilen varlık
     */
    @CacheEvict(value = "userAssets", key = "#asset.userId")
    public Asset createAsset(Asset asset) {
        Asset saved = assetRepository.save(asset);
        log.info("Varlık oluşturuldu: id={}, sembol={}", saved.getId(), saved.getAssetSymbol());
        return saved;
    }
}
