# FinansPortalı

Toyota & 32Bit 2026 — Kurumsal Finans Portalı

---

## Genel Bakış

FinansPortalı, gerçek zamanlı piyasa verilerini, portföy yönetimini, finans haberlerini ve BT servis talebi yönetimini tek ekranda sunan kurumsal bir web uygulamasıdır.

### Mimari

```
React Frontend (TypeScript)
    ↕ JWT / REST
Spring Boot Backend (Java 21)
    ↕ JPA/Hibernate
PostgreSQL ← Flyway migrations
    +
Keycloak (OAuth2/OIDC SSO)
    +
Kafka → LogConsumer → OpenSearch
    +
OpenTelemetry → Grafana / Prometheus
```

---

## Teknik Yığın

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite, React Router v7 |
| Backend | Java 21, Spring Boot 3.3.5 |
| ORM | Spring Data JPA / Hibernate |
| Veritabanı | PostgreSQL 16 (Docker), H2 (yerel dev) |
| Migration | Flyway |
| Güvenlik | Spring Security + Keycloak 24 (JWT/OAuth2) |
| 2FA | TOTP (Google Authenticator uyumlu) |
| Loglama | Log4j2 (Console + File + Kafka Appender) |
| İzleme | OpenTelemetry + Prometheus + Grafana |
| Log Arama | Kafka → OpenSearch → OpenSearch Dashboards |
| Cache | Caffeine (in-process, 5 dak TTL) |
| Mesajlaşma | Apache Kafka |
| İş Akışı | Spring State Machine (jBPM ilhamlı BT Ticket) |
| API Dokümantasyon | OpenAPI 3 / Swagger UI |
| Test | JUnit 5 + Mockito + Spring Security Test |
| Container | Docker + Docker Compose |

---

## Hızlı Başlangıç

### Ön gereksinimler

- Java 21 (ya da Docker)
- Node.js 20+
- Docker Desktop

### 1. Yerel Geliştirme (mock auth, H2)

```bash
# Backend (H2, tüm güvenlik açık)
cd finance-portal-main
./mvnw spring-boot:run

# Frontend (ayrı terminal)
cd frontend
npm install
npm run dev
# http://localhost:5173 → "Giriş Yap" butonuna tıklayın
```

`.env` dosyasında `VITE_MOCK_AUTH=true` olduğundan Keycloak'a gerek yoktur.

### 2. Tam Sistem (Docker Compose)

```bash
# Ortam değişkeni (isteğe bağlı, varsayılan demo key kullanılır)
export FINNHUB_API_KEY=your_key_here

# Tüm servisleri başlat
docker compose up --build

# Servisler hazır olduğunda:
# Frontend:              http://localhost:3000
# Backend Swagger:       http://localhost:8081/swagger-ui.html
# Keycloak Admin:        http://localhost:8080  (admin/admin)
# Grafana:               http://localhost:3001  (admin/admin)
# Prometheus:            http://localhost:9090
# OpenSearch:            http://localhost:9200
# OpenSearch Dashboards: http://localhost:5601
```

---

## Keycloak Kurulumu

Realm dosyası `keycloak/realm-toyota-finance.json` otomatik içe aktarılır.

| Bilgi | Değer |
|-------|-------|
| Admin URL | http://localhost:8080 |
| Admin | admin / admin |
| Realm | toyota-finance |
| Client | finance-portal-app |

Kullanıcı eklemek için: Keycloak Admin → toyota-finance realm → Users → Add user

---

## API Dokümantasyonu

Swagger UI: `http://localhost:8081/swagger-ui.html`

### Versiyonlama

Tüm endpoint'ler `/api/v1/` prefix'i kullanır:

| Kaynak | Endpoint |
|--------|----------|
| Hesaplar | `GET/POST /api/v1/accounts` |
| Varlıklar | `GET/POST /api/v1/assets` |
| Haberler (public) | `GET /api/v1/news` |
| Kredi Talepleri | `GET/POST/PUT/DELETE /api/v1/loans` |
| Piyasa Verileri | `GET /api/v1/market/quote?symbol=AAPL` |
| BT Ticket'ları | `GET/POST/PATCH /api/v1/tickets` |
| 2FA Kurulum | `POST /api/v1/auth/2fa/setup` |
| 2FA Doğrulama | `POST /api/v1/auth/2fa/verify` |

---

## BT Servis Talebi (jBPM İş Akışı)

Ticket durumları arasındaki geçişler:

```
OPEN → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
     ↘ REJECTED  ↗ REJECTED    ↗ REJECTED
```

Örnek kullanım:

```bash
# Ticket oluştur
curl -X POST http://localhost:8081/api/v1/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"VPN Bağlanamıyorum","priority":"HIGH","category":"Ağ"}'

# Durumu ilerlet (OPEN → ASSIGNED)
curl -X PATCH http://localhost:8081/api/v1/tickets/1/transition \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"ASSIGNED","assignedTo":"it-uzman@toyota.com"}'
```

---

## İki Faktörlü Doğrulama (2FA / TOTP)

```bash
# 1. QR kod al
curl -X POST http://localhost:8081/api/v1/auth/2fa/setup

# 2. Dönen qrCodeDataUri'yi tarayıcıda açın → Google Authenticator ile tarayın

# 3. Kodu doğrula
curl -X POST http://localhost:8081/api/v1/auth/2fa/verify \
  -H "Content-Type: application/json" \
  -d '{"secret":"BASE32SECRET","code":"123456"}'
```

---

## İzleme

### Grafana

`http://localhost:3001` adresinde Prometheus veri kaynağı önceden yapılandırılmıştır.

**Önerilen panolar (import):**
- JVM Micrometer: ID 4701
- Spring Boot Statistics: ID 12685

### Log Arama (OpenSearch)

1. `http://localhost:5601` adresini açın
2. Discover → Index pattern: `finance-portal-logs*`

---

## Testleri Çalıştır

```bash
# Tüm testler
./mvnw test

# Rapor
target/surefire-reports/
```

---

## Proje Yapısı

```
finance-portal-main/
├── src/main/java/com/toyota/finance/
│   ├── config/           # Security, OpenAPI, Cache, Kafka
│   ├── controller/       # REST endpoint'leri (/api/v1/)
│   ├── dto/              # ApiResponse<T>
│   ├── entity/           # JPA entity sınıfları
│   ├── exception/        # GlobalExceptionHandler
│   ├── kafka/            # LogConsumer (Kafka → OpenSearch)
│   ├── repository/       # Spring Data JPA
│   └── service/          # İş mantığı katmanı
├── src/main/resources/
│   ├── application.yml   # Profil tabanlı konfigürasyon
│   ├── log4j2.xml        # Log4j2 (Console + File + Kafka)
│   └── db/migration/     # Flyway SQL migrationları
├── src/test/             # JUnit 5 + Mockito birim testleri
├── frontend/             # React + TypeScript (Vite)
├── monitoring/
│   ├── prometheus.yml
│   ├── otel-collector-config.yml
│   └── grafana/
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Geliştirme Profilleri

| Profil | Veritabanı | Güvenlik | Flyway |
|--------|-----------|---------|--------|
| `local` | H2 (in-memory) | Tümü açık | Kapalı |
| `docker` | PostgreSQL | Keycloak JWT | Açık |

---

## Gereksinim Kontrol Listesi

| # | Gereksinim | Durum |
|---|-----------|-------|
| 1 | ReactJS Frontend | ✅ |
| 2 | Java 21 | ✅ |
| 3 | Spring Boot 3.3.5 | ✅ |
| 4 | Log4j2 (Console + File + Kafka) | ✅ |
| 5 | PostgreSQL + Spring Data JPA | ✅ |
| 6 | Flyway Migrations (V1, V2) | ✅ |
| 7 | JWT + Keycloak Auth | ✅ |
| 8 | 2FA (TOTP — Google Authenticator) | ✅ |
| 9 | OpenTelemetry Collector | ✅ |
| 10 | Grafana + Prometheus | ✅ |
| 11 | OpenSearch + Dashboards | ✅ |
| 12 | Kafka → OpenSearch Log Pipeline | ✅ |
| 13 | Docker + Docker Compose | ✅ |
| 14 | Git Repository | ✅ |
| 15 | jBPM IT Service Tickets (Spring State Machine) | ✅ |
| 16 | Cache (Caffeine — Redis compatible API) | ✅ |
| 17 | REST API Versioning (/api/v1/) | ✅ |
| 18 | OpenAPI 3 / Swagger UI | ✅ |
| 19 | Javadocs (tüm servis ve controller sınıfları) | ✅ |
| 20 | README (bu dosya) | ✅ |
| 21 | Unit Tests — JUnit 5 + Mockito (3 test sınıfı) | ✅ |
| 22 | Error Handling (GlobalExceptionHandler) | ✅ |
| 23 | Layered Architecture / OOP | ✅ |
