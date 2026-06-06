-- FinansPortalı — V2 Service Tickets
-- BT Servis Talebi tablosu (jBPM ilhamlı iş akışı)

CREATE TABLE IF NOT EXISTS service_tickets (
    id               BIGSERIAL     PRIMARY KEY,
    title            VARCHAR(255)  NOT NULL,
    description      TEXT,
    user_id          VARCHAR(255)  NOT NULL,
    assigned_to      VARCHAR(255),
    status           VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    priority         VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM',
    category         VARCHAR(100),
    resolution_note  TEXT,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP
);

-- Hızlı sorgu için indeksler
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON service_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status   ON service_tickets(status);
