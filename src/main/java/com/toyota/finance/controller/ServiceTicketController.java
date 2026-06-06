package com.toyota.finance.controller;

import com.toyota.finance.dto.ApiResponse;
import com.toyota.finance.entity.ServiceTicket;
import com.toyota.finance.entity.ServiceTicket.Status;
import com.toyota.finance.service.ServiceTicketService;
import com.toyota.finance.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * BT Servis Talebi REST API'si.
 *
 * <p>jBPM iş akışı modelinden ilham alınan ticket yönetim sistemi.
 * Ticket'lar tanımlı durumlar (OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED)
 * arasında geçiş yapar; geçersiz geçişler reddedilir.</p>
 *
 * <p>Temel path: {@code /api/v1/tickets}</p>
 *
 * @author FinansPortalı
 * @version 1.0
 */
@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Tag(name = "Service Tickets", description = "BT Servis Talebi yönetimi (jBPM iş akışı)")
public class ServiceTicketController {

    private final ServiceTicketService ticketService;

    /**
     * Kullanıcının tüm ticket'larını listeler.
     *
     * @return ticket listesi
     */
    @GetMapping
    @Operation(summary = "Ticket'ları listele", description = "Kullanıcının servis taleplerini döner")
    public ResponseEntity<ApiResponse<List<ServiceTicket>>> getMyTickets() {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        return ResponseEntity.ok(ApiResponse.success(ticketService.getUserTickets(userId)));
    }

    /**
     * Belirtilen ID'ye sahip ticket'ı döner.
     *
     * @param id ticket ID'si
     * @return ticket verisi
     */
    @GetMapping("/{id}")
    @Operation(summary = "Ticket getir", description = "ID'ye göre servis talebini döner")
    public ResponseEntity<ApiResponse<ServiceTicket>> getTicketById(@PathVariable Long id) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        ServiceTicket ticket = ticketService.getTicketById(id, userId);
        return ResponseEntity.ok(ApiResponse.success(ticket));
    }

    /**
     * Yeni servis talebi açar.
     *
     * @param ticket talep nesnesi (JSON body)
     * @return oluşturulan ticket (OPEN durumunda)
     */
    @PostMapping
    @Operation(summary = "Ticket aç", description = "Yeni BT servis talebi oluşturur")
    public ResponseEntity<ApiResponse<ServiceTicket>> createTicket(@RequestBody ServiceTicket ticket) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }
        ServiceTicket saved = ticketService.createTicket(ticket, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Servis talebi oluşturuldu", saved));
    }

    /**
     * Ticket durumunu iş akışı kurallarına göre ilerletir.
     *
     * <p>Örnek istek gövdesi:
     * <pre>{@code
     * {
     *   "status": "ASSIGNED",
     *   "assignedTo": "it-uzman@toyota.com",
     *   "note": "Sorun inceleniyor"
     * }
     * }</pre>
     * </p>
     *
     * @param id      ilerlemeye tabi ticket ID'si
     * @param payload durum geçiş verisi
     * @return güncellenmiş ticket
     */
    @PatchMapping("/{id}/transition")
    @Operation(summary = "Durum geçişi", description = "Ticket durumunu iş akışı kurallarına göre ilerletir")
    public ResponseEntity<ApiResponse<ServiceTicket>> transition(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String userId = JwtUtil.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Kimlik doğrulama gerekli"));
        }

        try {
            Status newStatus = Status.valueOf(payload.get("status").toUpperCase());
            String note = payload.get("note");
            String assignedTo = payload.get("assignedTo");

            ServiceTicket updated = ticketService.transitionTicket(id, newStatus, note, assignedTo, userId);
            return ResponseEntity.ok(ApiResponse.success("Durum güncellendi", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Geçersiz durum değeri: " + payload.get("status")));
        }
    }
}
