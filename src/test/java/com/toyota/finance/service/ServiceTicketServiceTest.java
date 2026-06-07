package com.toyota.finance.service;

import com.toyota.finance.entity.ServiceTicket;
import com.toyota.finance.entity.ServiceTicket.Status;
import com.toyota.finance.exception.ResourceNotFoundException;
import com.toyota.finance.repository.ServiceTicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * {@link ServiceTicketService} birim testleri — jBPM iş akışı geçiş kuralları.
 *
 * <p>ServiceTicket varlığı new ServiceTicket() ile oluşturulabilir çünkü
 * constructor protected scope ile tanımlanmıştır — test paketi farklı olduğundan
 * reflection veya mock kullanılır.</p>
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("ServiceTicketService Unit Tests")
class ServiceTicketServiceTest {

    @Mock
    private ServiceTicketRepository ticketRepository;

    @InjectMocks
    private ServiceTicketService ticketService;

    private ServiceTicket openTicket;

    @BeforeEach
    void setUp() {
        // ServiceTicket kendi paketinde değil → mock kullan
        openTicket = mock(ServiceTicket.class);
        when(openTicket.getTitle()).thenReturn("Bilgisayar Çalışmıyor");
        when(openTicket.getUserId()).thenReturn("user-abc");
        when(openTicket.getStatus()).thenReturn(Status.OPEN);
        when(openTicket.getPriority()).thenReturn(ServiceTicket.Priority.HIGH);
    }

    // ── createTicket ─────────────────────────────────────────────

    @Test
    @DisplayName("createTicket — save çağrılır ve döner")
    void createTicket_shouldCallSave() {
        ServiceTicket draft = mock(ServiceTicket.class);
        when(ticketRepository.save(draft)).thenReturn(draft);
        when(draft.getId()).thenReturn(1L);
        when(draft.getTitle()).thenReturn("Yeni Talep");

        ServiceTicket result = ticketService.createTicket(draft, "user-abc");

        assertThat(result).isNotNull();
        verify(draft).setUserId("user-abc");
        verify(draft).setStatus(Status.OPEN);
        verify(ticketRepository).save(draft);
    }

    // ── transitionTicket — geçerli geçişler ──────────────────────

    @Test
    @DisplayName("transitionTicket — OPEN → ASSIGNED geçişi geçerlidir")
    void transition_openToAssigned_shouldSucceed() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(openTicket));
        when(ticketRepository.save(openTicket)).thenReturn(openTicket);
        when(openTicket.getStatus()).thenReturn(Status.OPEN);

        ServiceTicket result = ticketService.transitionTicket(
                1L, Status.ASSIGNED, null, "it-uzman", "user-abc");

        verify(openTicket).setStatus(Status.ASSIGNED);
        verify(openTicket).setAssignedTo("it-uzman");
    }

    @Test
    @DisplayName("transitionTicket — IN_PROGRESS → RESOLVED geçişi geçerlidir")
    void transition_inProgressToResolved_shouldSucceed() {
        when(openTicket.getStatus()).thenReturn(Status.IN_PROGRESS);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(openTicket));
        when(ticketRepository.save(openTicket)).thenReturn(openTicket);

        ticketService.transitionTicket(1L, Status.RESOLVED, "Sorun giderildi", null, "user-abc");

        verify(openTicket).setStatus(Status.RESOLVED);
        verify(openTicket).setResolutionNote("Sorun giderildi");
    }

    // ── transitionTicket — geçersiz geçişler ─────────────────────

    @Test
    @DisplayName("transitionTicket — OPEN → CLOSED geçersiz → exception fırlatır")
    void transition_openToClosed_shouldThrowIllegalState() {
        when(openTicket.getStatus()).thenReturn(Status.OPEN);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(openTicket));

        assertThatThrownBy(() ->
                ticketService.transitionTicket(1L, Status.CLOSED, null, null, "user-abc"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("OPEN")
                .hasMessageContaining("CLOSED");
    }

    @Test
    @DisplayName("transitionTicket — CLOSED ticket → exception fırlatır")
    void transition_closedTicket_shouldThrow() {
        when(openTicket.getStatus()).thenReturn(Status.CLOSED);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(openTicket));

        assertThatThrownBy(() ->
                ticketService.transitionTicket(1L, Status.OPEN, null, null, "user-abc"))
                .isInstanceOf(IllegalStateException.class);
    }

    // ── getTicketById ─────────────────────────────────────────────

    @Test
    @DisplayName("getTicketById — başka kullanıcının ticketi için exception fırlatır")
    void getTicketById_shouldThrow_whenWrongUser() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(openTicket));

        assertThatThrownBy(() -> ticketService.getTicketById(1L, "other-user"))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
