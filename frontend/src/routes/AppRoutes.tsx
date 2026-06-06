import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '../layout/Layout'
import { paths } from './paths'

/* ── Genel Sayfalar (Layout dışında) ── */
import { LandingPage } from '../pages/LandingPage'
import { KayitPage } from '../pages/KayitPage'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { HaberlerPage } from '../pages/HaberlerPage'
import { HaberDetayPage } from '../pages/HaberDetayPage'
import { PiyasaPage } from '../pages/PiyasaPage'
import { AnalizPage } from '../pages/AnalizPage'
import { PortfoyumPage } from '../pages/PortfoyumPage'
import { PortfoyDetayPage } from '../pages/PortfoyDetayPage'
import { PozisyonEklePage } from '../pages/PozisyonEklePage'
import { TicketPage } from '../pages/TicketPage'
import { TwoFactorPage } from '../pages/TwoFactorPage'

/* ── Yeni Sayfalar — 50 Modül ── */
import { PiyasaTahminPage } from '../pages/PiyasaTahminPage'
import { IslemGecmisiPage } from '../pages/IslemGecmisiPage'
import { KartlarimPage } from '../pages/KartlarimPage'
import { AyarlarPage } from '../pages/AyarlarPage'
import { ButcePage } from '../pages/ButcePage'
import { VadeliIslemlerPage } from '../pages/VadeliIslemlerPage'
import { KriptoDeFiPage } from '../pages/KriptoDeFiPage'
import { PortfoyOptPage } from '../pages/PortfoyOptPage'
import { StresTestiPage } from '../pages/StresTestiPage'

/* ── Dinamik import (lazy olmadan) ── */
import { FaturaVergiPage } from '../pages/FaturaVergiPage'
import { KrediPage } from '../pages/KrediPage'
import { SigortaPage } from '../pages/SigortaPage'
import { BESPage } from '../pages/BESPage'
import { GayrimenkulPage } from '../pages/GayrimenkulPage'
import { BorcAlacakPage } from '../pages/BorcAlacakPage'
import { AcikBankacilikPage } from '../pages/AcikBankacilikPage'
import { KYCPage } from '../pages/KYCPage'
import { NakitAkisiPage } from '../pages/NakitAkisiPage'
import { AltinPage } from '../pages/AltinPage'
import { PerformansPage } from '../pages/PerformansPage'
import { AdminPage } from '../pages/AdminPage'
import { APIYonetimiPage } from '../pages/APIYonetimiPage'
import { HazinePage } from '../pages/HazinePage'
import { KurumsalPage } from '../pages/KurumsalPage'
import { SosyalFinansPage } from '../pages/SosyalFinansPage'
import { EgitimAIPage } from '../pages/EgitimAIPage'
import { SeyahatPage } from '../pages/SeyahatPage'
import { BagisPage } from '../pages/BagisPage'
import { ETicaretPage } from '../pages/ETicaretPage'
import { BildirimAyarlariPage } from '../pages/BildirimAyarlariPage'
import { DCAPage } from '../pages/DCAPage'
import { GYOPage } from '../pages/GYOPage'
import { WidgetAyarlariPage } from '../pages/WidgetAyarlariPage'
import { ArbitrajPage } from '../pages/ArbitrajPage'
import { IPOPage } from '../pages/IPOPage'
import { TahvilPage } from '../pages/TahvilPage'
import { SendikasyonPage } from '../pages/SendikasyonPage'
import { AMLPage } from '../pages/AMLPage'
import { TesvikPage } from '../pages/TesvikPage'
import { EmtiaPage } from '../pages/EmtiaPage'
import { CocukHesabiPage } from '../pages/CocukHesabiPage'
import { DonanımCuzdanPage } from '../pages/DonanımCuzdanPage'

/**
 * Uygulama Route yapısı — 50 Modül tam yönlendirme.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ── Genel sayfalar — Layout dışında ── */}
      <Route path={paths.landing} element={<LandingPage />} />
      <Route path={paths.giris}   element={<LoginPage />} />
      <Route path={paths.kayit}   element={<KayitPage />} />

      {/* ── Korumalı panel — Layout içinde ── */}
      <Route path={paths.home} element={<Layout />}>

        {/* ── 1. Dashboard ── */}
        <Route index element={<DashboardPage />} />

        {/* ── 2. Analiz & Grafik ── */}
        <Route path="analiz" element={<AnalizPage />} />

        {/* ── 3. İşlem Geçmişi ── */}
        <Route path="islem-gecmisi" element={<IslemGecmisiPage />} />

        {/* ── 4. Piyasalar ── */}
        <Route path="piyasa" element={<PiyasaPage />} />

        {/* ── 4b. Gerçek Zamanlı Piyasa Tahminleri ── */}
        <Route path="piyasa-tahmin" element={<PiyasaTahminPage />} />

        {/* ── 5. Kart Yönetimi ── */}
        <Route path="kartlarim" element={<KartlarimPage />} />

        {/* ── 6. Güvenlik & Ayarlar ── */}
        <Route path="ayarlar" element={<AyarlarPage />} />
        <Route path="guvenlik/2fa" element={<TwoFactorPage />} />
        <Route path="guvenlik/oturumlar" element={<AyarlarPage />} />

        {/* ── 7. Bütçe & Tasarruf ── */}
        <Route path="butce" element={<ButcePage />} />

        {/* ── 8. Fatura & Vergi ── */}
        <Route path="fatura-vergi" element={<FaturaVergiPage />} />

        {/* ── 9. Kredi & Skor ── */}
        <Route path="kredi" element={<KrediPage />} />

        {/* ── 10. Müşteri Desteği ── */}
        <Route path="destek" element={<TicketPage />} />

        {/* ── 11. Kurumsal Finans ── */}
        <Route path="kurumsal" element={<KurumsalPage />} />

        {/* ── 12. Admin Paneli ── */}
        <Route path="admin" element={<AdminPage />} />

        {/* ── 13. Kripto & DeFi ── */}
        <Route path="kripto" element={<KriptoDeFiPage />} />

        {/* ── 14. Portföy Optimizasyonu ── */}
        <Route path="portfoy-optimizasyonu" element={<PortfoyOptPage />} />

        {/* ── 15. Kripto İşlemler ── */}
        <Route path="kripto-islem" element={<KriptoDeFiPage />} />

        {/* ── 16. Bildirim Ayarları ── */}
        <Route path="bildirim-ayarlari" element={<BildirimAyarlariPage />} />

        {/* ── 17. Sosyal Finans ── */}
        <Route path="sosyal-finans" element={<SosyalFinansPage />} />

        {/* ── 18. Sadakat & Cashback ── */}
        <Route path="sadakat" element={<KartlarimPage />} />

        {/* ── 19. Eğitim & AI ── */}
        <Route path="egitim-ai" element={<EgitimAIPage />} />

        {/* ── 20. Seyahat & Çoklu Para ── */}
        <Route path="seyahat" element={<SeyahatPage />} />

        {/* ── 21. Sigorta & Risk ── */}
        <Route path="sigorta" element={<SigortaPage />} />

        {/* ── 22. BES & Emeklilik ── */}
        <Route path="bes" element={<BESPage />} />

        {/* ── 23. E-Ticaret ── */}
        <Route path="e-ticaret" element={<ETicaretPage />} />

        {/* ── 24. Gayrimenkul ── */}
        <Route path="gayrimenkul" element={<GayrimenkulPage />} />

        {/* ── 25. Borç & Alacak ── */}
        <Route path="borc-alacak" element={<BorcAlacakPage />} />

        {/* ── 26. Bağış & Sosyal ── */}
        <Route path="bagis" element={<BagisPage />} />

        {/* ── 27. Açık Bankacılık ── */}
        <Route path="acik-bankacilik" element={<AcikBankacilikPage />} />

        {/* ── 28. KYC & Kimlik ── */}
        <Route path="kyc" element={<KYCPage />} />

        {/* ── 29. Vadeli İşlemler ── */}
        <Route path="vadeli-islemler" element={<VadeliIslemlerPage />} />

        {/* ── 30. Gelişmiş Emirler ── */}
        <Route path="gelismis-emir" element={<VadeliIslemlerPage />} />

        {/* ── 31. Nakit Akışı ── */}
        <Route path="nakit-akisi" element={<NakitAkisiPage />} />

        {/* ── 32. Hazine ── */}
        <Route path="hazine" element={<HazinePage />} />

        {/* ── 33. Teşvik & Hibe ── */}
        <Route path="tesvik" element={<TesvikPage />} />

        {/* ── 34. Altın & Kıymetli Maden ── */}
        <Route path="altin" element={<AltinPage />} />

        {/* ── 35. Girişim Sermayesi ── */}
        <Route path="girisim" element={<IPOPage />} />

        {/* ── 36. Miras & Varlık Devir ── */}
        <Route path="miras" element={<AyarlarPage />} />

        {/* ── 37. Performans Analitik ── */}
        <Route path="performans" element={<PerformansPage />} />

        {/* ── 38. Donanım Cüzdan ── */}
        <Route path="donanim-cuzdan" element={<DonanımCuzdanPage />} />

        {/* ── 39. Stres Testi & Check-Up ── */}
        <Route path="stres-testi" element={<StresTestiPage />} />

        {/* ── 40. API Yönetimi ── */}
        <Route path="api-yonetimi" element={<APIYonetimiPage />} />

        {/* ── 41. Emtia & Enerji ── */}
        <Route path="emtia" element={<EmtiaPage />} />

        {/* ── 42. Çocuk Hesabı ── */}
        <Route path="cocuk-hesabi" element={<CocukHesabiPage />} />

        {/* ── 43. DCA Otomatik Yatırım ── */}
        <Route path="dca" element={<DCAPage />} />

        {/* ── 44. GYO & Fraksiyonel ── */}
        <Route path="gyo" element={<GYOPage />} />

        {/* ── 45. Widget & Tema ── */}
        <Route path="widget-ayarlari" element={<WidgetAyarlariPage />} />

        {/* ── 46. Arbitraj Monitör ── */}
        <Route path="arbitraj" element={<ArbitrajPage />} />

        {/* ── 47. IPO & Halka Arz ── */}
        <Route path="ipo" element={<IPOPage />} />

        {/* ── 48. Tahvil & Bono ── */}
        <Route path="tahvil" element={<TahvilPage />} />

        {/* ── 49. Sendikasyon ── */}
        <Route path="sendikasyon" element={<SendikasyonPage />} />

        {/* ── 50. AML & Uyumluluk ── */}
        <Route path="aml-uyumluluk" element={<AMLPage />} />

        {/* ── Portföy (mevcut) ── */}
        <Route path="portfoyum" element={<PortfoyumPage />} />
        <Route path="portfoyum/:id" element={<PortfoyDetayPage />} />
        <Route path="portfoyum/:id/pozisyon-ekle" element={<PozisyonEklePage />} />

        {/* ── Haberler (mevcut) ── */}
        <Route path="haberler" element={<HaberlerPage />} />
        <Route path="haberler/:id" element={<HaberDetayPage />} />

        {/* ── Profil ── */}
        <Route path="profil" element={<AyarlarPage />} />

      </Route>

      <Route path="*" element={<Navigate to={paths.landing} replace />} />
    </Routes>
  )
}
