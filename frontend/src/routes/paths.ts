/**
 * Uygulama genelinde kullanılan route path'leri.
 * Tek yerden yönetim; link ve yönlendirmelerde bu sabitleri kullanın.
 */
export const paths = {
  // ── Genel sayfalar (Layout dışı) ──
  landing: '/',
  giris:   '/giris',
  kayit:   '/kayit',
  login:   '/giris',

  // ── Korumalı panel kökü ──
  home:      '/panel',
  dashboard: '/panel',

  // 1 – Ana Panel
  // (dashboard = /panel index route)

  // 2 – Grafik & Analiz
  analiz: '/panel/analiz',

  // 3 – İşlem Geçmişi
  islemGecmisi: '/panel/islem-gecmisi',

  // 4 – Piyasalar
  piyasa: '/panel/piyasa',

  // 4b – Gerçek Zamanlı Piyasa Tahminleri (YENİ)
  piyasaTahmin: '/panel/piyasa-tahmin',

  // 5 – Kart & Limit Yönetimi
  kartlarim: '/panel/kartlarim',

  // 6 – Güvenlik, Ayarlar & UX
  ayarlar:       '/panel/ayarlar',
  twoFactor:     '/panel/guvenlik/2fa',
  aktifOturumlar:'/panel/guvenlik/oturumlar',

  // 7 – Bütçe & Tasarruf
  butce: '/panel/butce',

  // 8 – Fatura, Vergi & Beyanname
  faturaVergi: '/panel/fatura-vergi',

  // 9 – Kredi & Finansal Sağlık
  kredi: '/panel/kredi',

  // 10 – Müşteri Desteği
  tickets: '/panel/destek',

  // 11 – Kurumsal & Ticari Finans
  kurumsal: '/panel/kurumsal',

  // 12 – Admin Paneli
  admin: '/panel/admin',

  // 13 – Kripto & DeFi
  kripto: '/panel/kripto',

  // 14 – Portföy Optimizasyonu
  portfoyOpt: '/panel/portfoy-optimizasyonu',

  // 15 – Kripto İşlemleri
  kriptoIslem: '/panel/kripto-islem',

  // 16 – Bildirim & Otomasyon
  bildirimAyarlari: '/panel/bildirim-ayarlari',

  // 17 – Sosyal Finans
  sosyalFinans: '/panel/sosyal-finans',

  // 18 – Gelişmiş Kart Özellikleri & Sadakat
  sadakat: '/panel/sadakat',

  // 19 – Eğitim & AI Desteği
  egitimAI: '/panel/egitim-ai',

  // 20 – Seyahat & Çoklu Para Birimi
  seyahat: '/panel/seyahat',

  // 21 – Sigorta & Risk
  sigorta: '/panel/sigorta',

  // 22 – BES & Emeklilik
  bes: '/panel/bes',

  // 23 – E-Ticaret & Satıcı Finansmanı
  eticaret: '/panel/e-ticaret',

  // 24 – Gayrimenkul & Duran Varlık
  gayrimenkul: '/panel/gayrimenkul',

  // 25 – Borç, Alacak & Senet
  borcAlacak: '/panel/borc-alacak',

  // 26 – Donasyon & Bağış
  bagis: '/panel/bagis',

  // 27 – Açık Bankacılık (PSD2)
  acikBankacilik: '/panel/acik-bankacilik',

  // 28 – KYC & Kimlik Doğrulama
  kyc: '/panel/kyc',

  // 29 – Vadeli İşlemler & Kaldıraçlı İşlemler
  vadeliIslemler: '/panel/vadeli-islemler',

  // 30 – Gelişmiş Emir Tipleri
  gelismisEmir: '/panel/gelismis-emir',

  // 31 – Nakit Akışı & Likidite
  nakitAkisi: '/panel/nakit-akisi',

  // 32 – Kurumsal Nakit & Hazine
  hazine: '/panel/hazine',

  // 33 – Teşvik, Hibe & Fon
  tesvik: '/panel/tesvik',

  // 34 – Altın, Gümüş & Kıymetli Maden
  altin: '/panel/altin',

  // 35 – Girişim Sermayesi & Melek Yatırım
  girisim: '/panel/girisim',

  // 36 – Miras & Varlık Devir
  miras: '/panel/miras',

  // 37 – Performans Analitik & Benchmarking
  performans: '/panel/performans',

  // 38 – Donanım Cüzdan & Soğuk Depolama
  donanımCuzdan: '/panel/donanim-cuzdan',

  // 39 – Finansal Check-Up & Stres Testi
  stresTesti: '/panel/stres-testi',

  // 40 – Platform Geliştirici & API
  apiYonetimi: '/panel/api-yonetimi',

  // 41 – Emtia & Tarım & Enerji
  emtia: '/panel/emtia',

  // 42 – Çocuk Finansmanı (Junior)
  cocukHesabi: '/panel/cocuk-hesabi',

  // 43 – Otomatik Yatırım (DCA)
  dca: '/panel/dca',

  // 44 – GYO & Fraksiyonel Gayrimenkul
  gyo: '/panel/gyo',

  // 45 – Widget & Dashboard Ayarları
  widgetAyarlari: '/panel/widget-ayarlari',

  // 46 – Arbitraj & Fiyat Farkı Monitörü
  arbitraj: '/panel/arbitraj',

  // 47 – Halka Arz (IPO) & Ön Satış
  ipo: '/panel/ipo',

  // 48 – Tahvil, Bono & Sabit Getirili
  tahvil: '/panel/tahvil',

  // 49 – Sendikasyon & Büyük Krediler
  sendikasyon: '/panel/sendikasyon',

  // 50 – AML & Uyumluluk
  aml: '/panel/aml-uyumluluk',

  // Legacy / common
  portfoyum:   '/panel/portfoyum',
  portfoyDetay:(id: string) => `/panel/portfoyum/${id}`,
  pozisyonEkle:(portfoyId: string) => `/panel/portfoyum/${portfoyId}/pozisyon-ekle`,
  haberler:    '/panel/haberler',
  haberDetay:  (id: string) => `/panel/haberler/${id}`,
  profil:      '/panel/profil',
} as const
