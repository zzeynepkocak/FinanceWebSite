package com.toyota.finance.service;

import com.toyota.finance.entity.LoanRequest;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.LoanRequestRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Kredi talebi yönetimi iş mantığı.
 *
 * <p>Kullanıcıya özel kredi talepleri bu servis üzerinden CRUD işlemleriyle yönetilir.
 * Güvenlik doğrulaması (userId eşleşmesi) servis katmanında gerçekleştirilir.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class LoanService {

    private static final Logger log = LogManager.getLogger(LoanService.class);

    private final LoanRequestRepository loanRequestRepository;

    /**
     * Kullanıcıya ait tüm kredi taleplerini döner.
     *
     * @param userId Keycloak kullanıcı ID'si
     * @return kredi talebi listesi
     */
    public List<LoanRequest> getUserLoans(String userId) {
        return loanRequestRepository.findByUserId(userId);
    }

    /**
     * Belirtilen ID'ye sahip ve kullanıcıya ait kredi talebini döner.
     *
     * @param id     kredi talebi ID'si
     * @param userId Keycloak kullanıcı ID'si
     * @return kredi talebi
     * @throws ResourceNotFoundException kredi talebi bulunamazsa
     */
    public LoanRequest getLoanById(Long id, String userId) {
        return loanRequestRepository.findById(id)
                .filter(loan -> userId.equals(loan.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Kredi talebi bulunamadı: " + id));
    }

    /**
     * Yeni kredi talebi oluşturur.
     *
     * @param loanRequest kredi talebi nesnesi
     * @param userId      Keycloak kullanıcı ID'si
     * @return kaydedilen kredi talebi
     */
    public LoanRequest createLoan(LoanRequest loanRequest, String userId) {
        loanRequest.setUserId(userId);
        LoanRequest saved = loanRequestRepository.save(loanRequest);
        log.info("Kredi talebi oluşturuldu: id={}, kullanıcı={}", saved.getId(), userId);
        return saved;
    }

    /**
     * Var olan kredi talebini günceller.
     *
     * @param id          güncellenecek kredi talebi ID'si
     * @param loanRequest güncel talep verisi
     * @param userId      işlemi yapan kullanıcı ID'si
     * @return güncellenen kredi talebi
     * @throws ResourceNotFoundException kredi talebi bulunamazsa
     */
    public LoanRequest updateLoan(Long id, LoanRequest loanRequest, String userId) {
        loanRequestRepository.findById(id)
                .filter(l -> userId.equals(l.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Kredi talebi bulunamadı: " + id));
        loanRequest.setId(id);
        loanRequest.setUserId(userId);
        return loanRequestRepository.save(loanRequest);
    }

    /**
     * Kredi talebini kalıcı olarak siler.
     *
     * @param id     silinecek kredi talebi ID'si
     * @param userId işlemi yapan kullanıcı ID'si
     * @throws ResourceNotFoundException kredi talebi bulunamazsa
     */
    public void deleteLoan(Long id, String userId) {
        loanRequestRepository.findById(id)
                .filter(loan -> userId.equals(loan.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Kredi talebi bulunamadı: " + id));
        loanRequestRepository.deleteById(id);
        log.info("Kredi talebi silindi: id={}", id);
    }
}
