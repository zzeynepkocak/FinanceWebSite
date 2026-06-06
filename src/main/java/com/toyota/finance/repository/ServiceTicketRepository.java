package com.toyota.finance.repository;

import com.toyota.finance.entity.ServiceTicket;
import com.toyota.finance.entity.ServiceTicket.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BT Servis Talebi JPA deposu.
 *
 * <p>Temel CRUD işlemlerine ek olarak kullanıcıya ve duruma göre
 * sorgulama metotları sağlanmıştır.</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Repository
public interface ServiceTicketRepository extends JpaRepository<ServiceTicket, Long> {

    /**
     * Kullanıcının tüm ticket'larını oluşturma tarihine göre döner.
     *
     * @param userId Keycloak kullanıcı ID'si
     * @return ticket listesi
     */
    List<ServiceTicket> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Belirtilen durumdaki tüm ticket'ları döner.
     *
     * @param status ticket durumu
     * @return ticket listesi
     */
    List<ServiceTicket> findByStatusOrderByCreatedAtDesc(Status status);

    /**
     * Belirtilen kullanıcıya atanmış ticket'ları döner.
     *
     * @param assignedTo IT uzmanının kullanıcı adı
     * @return ticket listesi
     */
    List<ServiceTicket> findByAssignedToOrderByCreatedAtDesc(String assignedTo);
}
