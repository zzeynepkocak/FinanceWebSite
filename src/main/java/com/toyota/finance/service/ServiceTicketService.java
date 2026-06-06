package com.toyota.finance.service;

import com.toyota.finance.entity.ServiceTicket;
import com.toyota.finance.entity.ServiceTicket.Status;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.ServiceTicketRepository;
import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * BT Servis Talebi iş mantığı — jBPM ilhamlı iş akışı.
 *
 * <p>Ticket durumları arasındaki geçişler bu servis tarafından kontrol edilir.
 * Geçerli geçişler:
 * <ul>
 *   <li>OPEN → ASSIGNED (atama yapıldığında)</li>
 *   <li>ASSIGNED → IN_PROGRESS (çalışma başladığında)</li>
 *   <li>IN_PROGRESS → RESOLVED (çözüm uygulandığında)</li>
 *   <li>RESOLVED → CLOSED (kullanıcı onayladığında)</li>
 *   <li>OPEN / ASSIGNED / IN_PROGRESS → REJECTED (geçersiz talep)</li>
 * </ul>
 * </p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@Service
@RequiredArgsConstructor
public class ServiceTicketService {

    private static final Logger log = LogManager.getLogger(ServiceTicketService.class);

    /** Geçerli durum geçişleri. Kaynak → izin verilen hedefler. */
    private static final Map<Status, List<Status>> TRANSITIONS = Map.of(
            Status.OPEN,        List.of(Status.ASSIGNED, Status.REJECTED),
            Status.ASSIGNED,    List.of(Status.IN_PROGRESS, Status.REJECTED),
            Status.IN_PROGRESS, List.of(Status.RESOLVED, Status.REJECTED),
            Status.RESOLVED,    List.of(Status.CLOSED),
            Status.CLOSED,      List.of(),
            Status.REJECTED,    List.of()
    );

    private final ServiceTicketRepository ticketRepository;

    /**
     * Kullanıcının tüm ticket'larını döner.
     *
     * @param userId Keycloak kullanıcı ID'si
     * @return ticket listesi
     */
    public List<ServiceTicket> getUserTickets(String userId) {
        return ticketRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Belirtilen ID'ye sahip ticket'ı döner.
     *
     * @param id     ticket ID'si
     * @param userId işlemi yapan kullanıcı ID'si
     * @return ticket
     * @throws ResourceNotFoundException ticket bulunamazsa
     */
    public ServiceTicket getTicketById(Long id, String userId) {
        return ticketRepository.findById(id)
                .filter(t -> userId.equals(t.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("Ticket bulunamadı: " + id));
    }

    /**
     * Yeni servis talebi oluşturur (OPEN durumunda).
     *
     * @param ticket talep nesnesi
     * @param userId Keycloak kullanıcı ID'si
     * @return oluşturulan ticket
     */
    public ServiceTicket createTicket(ServiceTicket ticket, String userId) {
        ticket.setUserId(userId);
        ticket.setStatus(Status.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ServiceTicket saved = ticketRepository.save(ticket);
        log.info("Servis talebi oluşturuldu: id={}, başlık={}", saved.getId(), saved.getTitle());
        return saved;
    }

    /**
     * Ticket durumunu iş akışı kurallarına göre günceller.
     *
     * @param id         güncellenecek ticket ID'si
     * @param newStatus  hedef durum
     * @param note       çözüm notu (isteğe bağlı)
     * @param assignedTo atanan kişi (ASSIGNED geçişi için)
     * @param userId     işlemi yapan kullanıcı ID'si
     * @return güncellenen ticket
     * @throws IllegalStateException geçersiz durum geçişi
     */
    public ServiceTicket transitionTicket(Long id, Status newStatus,
                                          String note, String assignedTo, String userId) {
        ServiceTicket ticket = getTicketById(id, userId);
        Status current = ticket.getStatus();

        List<Status> allowed = TRANSITIONS.getOrDefault(current, List.of());
        if (!allowed.contains(newStatus)) {
            throw new IllegalStateException(
                    String.format("'%s' → '%s' geçişi geçersiz. İzin verilenler: %s",
                            current, newStatus, allowed));
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        if (note != null) ticket.setResolutionNote(note);
        if (assignedTo != null) ticket.setAssignedTo(assignedTo);

        ServiceTicket updated = ticketRepository.save(ticket);
        log.info("Ticket güncellendi: id={}, {} → {}", id, current, newStatus);
        return updated;
    }
}
