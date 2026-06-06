-- FinansPortalı — V1 Initial Schema
-- Toyota & 32Bit 2026
--
-- Kolon adları entity field adlarıyla birebir eşleştirilmiştir.
-- (Hibernate camelCase → snake_case dönüşümü baz alınmıştır)

-- ── Hesaplar (Account entity) ───────────────────────────────────
-- Entity: accountName → account_name
--         balance     → balance
--         currencyType → currency_type
--         userId      → user_id
CREATE TABLE IF NOT EXISTS accounts (
    id            BIGSERIAL     PRIMARY KEY,
    account_name  VARCHAR(255)  NOT NULL,
    balance       DECIMAL(18,4) NOT NULL DEFAULT 0,
    currency_type VARCHAR(10)   DEFAULT 'TRY',
    user_id       VARCHAR(255)  NOT NULL
);

-- ── Varlıklar (Asset entity) ─────────────────────────────────────
-- Entity: assetName     → asset_name
--         assetSymbol   → asset_symbol
--         quantity      → quantity
--         purchasePrice → purchase_price
--         userId        → user_id
CREATE TABLE IF NOT EXISTS assets (
    id             BIGSERIAL     PRIMARY KEY,
    asset_name     VARCHAR(255)  NOT NULL,
    asset_symbol   VARCHAR(50)   NOT NULL,
    quantity       FLOAT8        NOT NULL,
    purchase_price DECIMAL(18,4) NOT NULL,
    user_id        VARCHAR(255)  NOT NULL
);

-- ── Kredi talepleri (LoanRequest entity) ─────────────────────────
-- Entity: customerName → customer_name
--         loanAmount   → loan_amount
--         userId       → user_id
CREATE TABLE IF NOT EXISTS loan_requests (
    id            BIGSERIAL     PRIMARY KEY,
    customer_name VARCHAR(255),
    loan_amount   DECIMAL(18,4),
    user_id       VARCHAR(255)  NOT NULL
);

-- ── Haberler (News entity) ────────────────────────────────────────
-- Entity: title         → title
--         summary       → summary
--         content       → content
--         imageUrl      → image_url
--         authorName    → author_name
--         publishedDate → published_date
--         category      → category
--         isActive      → is_active
--         userId        → user_id
CREATE TABLE IF NOT EXISTS news (
    id             BIGSERIAL    PRIMARY KEY,
    title          VARCHAR(500) NOT NULL,
    summary        TEXT,
    content        TEXT,
    image_url      VARCHAR(500),
    author_name    VARCHAR(255),
    published_date TIMESTAMP    DEFAULT NOW(),
    category       VARCHAR(100),
    is_active      BOOLEAN      DEFAULT TRUE,
    user_id        VARCHAR(255)
);

-- ── İşlem geçmişi (referans — entity yok ama tablo gerekli) ───────
CREATE TABLE IF NOT EXISTS transactions (
    id               BIGSERIAL     PRIMARY KEY,
    user_id          VARCHAR(255)  NOT NULL,
    symbol           VARCHAR(50)   NOT NULL,
    transaction_type VARCHAR(10)   NOT NULL,
    quantity         DECIMAL(18,8) NOT NULL,
    price            DECIMAL(18,4) NOT NULL,
    total_amount     DECIMAL(18,4) NOT NULL,
    transaction_date TIMESTAMP     DEFAULT NOW()
);

-- ── Fiyat alarmları (referans — entity yok) ───────────────────────
CREATE TABLE IF NOT EXISTS price_alerts (
    id           BIGSERIAL     PRIMARY KEY,
    user_id      VARCHAR(255)  NOT NULL,
    symbol       VARCHAR(50)   NOT NULL,
    target_price DECIMAL(18,4) NOT NULL,
    alert_type   VARCHAR(10)   NOT NULL,
    is_active    BOOLEAN       DEFAULT TRUE,
    created_at   TIMESTAMP     DEFAULT NOW()
);

-- ── Örnek haber verisi ────────────────────────────────────────────
INSERT INTO news (title, summary, content, author_name, published_date, category, is_active, user_id)
VALUES
    ('BIST 100 yeni rekor kırdı',
     'Borsa İstanbul ana endeksi 14.000 puanı geçti.',
     'Borsa İstanbul ana endeksi bugün 14.000 puanı geçerek tarihi rekor kırdı. Bankacılık ve savunma hisseleri öncü sektörler oldu.',
     'Finans Editörü', NOW(), 'Borsa', TRUE, 'system'),
    ('TCMB faiz kararı açıklandı',
     'Merkez Bankası faiz oranını yüzde 45 olarak sabit tuttu.',
     'Türkiye Cumhuriyet Merkez Bankası Para Politikası Kurulu toplantısında politika faizi yüzde 45 seviyesinde sabit bırakıldı.',
     'Ekonomi Servisi', NOW() - INTERVAL '2 hours', 'Makro', TRUE, 'system'),
    ('Dolar/TL güne nasıl başladı?',
     'Amerikan doları Türk Lirası karşısında 38,42 seviyesinde.',
     'Amerikan doları sabah saatlerinde Türk Lirası karşısında 38,42 seviyesinden işlem görürken günün ilerleyen saatlerinde hafif değer kazandı.',
     'Döviz Masası', NOW() - INTERVAL '4 hours', 'Döviz', TRUE, 'system');
