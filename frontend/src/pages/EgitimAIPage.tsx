import { useState } from 'react'
import styles from './SharedPage.module.css'

const KURSLAR = [
  { id: 1, baslik: 'Bütçe Yönetimine Giriş', sure: '45 dk', seviye: 'Başlangıç', tamamlandi: 100, kategori: 'Bütçe' },
  { id: 2, baslik: 'Borsa ve Hisse Senetleri', sure: '1s 20dk', seviye: 'Orta', tamamlandi: 65, kategori: 'Yatırım' },
  { id: 3, baslik: 'Kripto Para Temelleri', sure: '55 dk', seviye: 'Orta', tamamlandi: 30, kategori: 'Kripto' },
  { id: 4, baslik: 'Emeklilik Planlaması (BES)', sure: '40 dk', seviye: 'Başlangıç', tamamlandi: 0, kategori: 'Emeklilik' },
  { id: 5, baslik: 'Teknik Analiz Temelleri', sure: '2s 10dk', seviye: 'İleri', tamamlandi: 0, kategori: 'Analiz' },
  { id: 6, baslik: 'Döviz ve Enflasyon Koruması', sure: '50 dk', seviye: 'Orta', tamamlandi: 0, kategori: 'Döviz' },
]

const HABERLER = [
  { id: 1, baslik: 'TCMB politika faizini %42.5 olarak sabit tuttu', kaynak: 'KAP', zaman: '14:32', tip: 'kap' },
  { id: 2, baslik: 'THYAO: Mayıs ayı yolcu rakamları açıklandı — %12 artış', kaynak: 'KAP', zaman: '13:15', tip: 'kap' },
  { id: 3, baslik: "Fed tutanakları: Faiz indirim beklentisi 2026 sonuna ertelendi", kaynak: 'Reuters', zaman: '11:48', tip: 'haber' },
  { id: 4, baslik: 'Altın ons fiyatı 3.420 dolarda rekor kırdı', kaynak: 'Bloomberg', zaman: '10:22', tip: 'haber' },
  { id: 5, baslik: 'BIST100 günü %0.8 primle kapattı, hacim düşük', kaynak: 'Borsa İstanbul', zaman: '18:05', tip: 'kap' },
]

const ONERI_HARCAMALAR = [
  { kategori: 'Restoran & Yemek', tutar: 4200, tavsiye: 2800, tasarruf: 1400 },
  { kategori: 'Online Alışveriş', tutar: 3800, tavsiye: 2000, tasarruf: 1800 },
  { kategori: 'Abonelikler', tutar: 1200, tavsiye: 600, tasarruf: 600 },
  { kategori: 'Eğlence', tutar: 2100, tavsiye: 1400, tasarruf: 700 },
]

type ChatMsg = { rol: 'kullanici' | 'ai'; icerik: string }

const AI_YANIT_MAP: Record<string, string> = {
  default: "Harcamalarınızı analiz ettim. Bu ay restoran giderleriniz geçen aya göre %28 arttı. Hafta içi öğle yemeklerini evden götürerek aylık yaklaşık ₺1.200 tasarruf edebilirsiniz.",
  bütçe: "Bütçe planlamasında 50/30/20 kuralını öneriyorum: Gelirinizin %50'si zorunlu giderler, %30'u isteğe bağlı, %20'si tasarruf/yatırım için.",
  yatırım: "Risk toleransınıza göre portföyünüzün %60'ını hisse/ETF, %30'unu tahvil/altın ve %10'unu likit tutmanızı tavsiye ederim.",
  kripto: "Kripto varlıklara portföyünüzün maksimum %5-10'unu ayırmanızı öneririm. Dollar Cost Averaging (DCA) stratejisi oynaklık riskini azaltır.",
}

export function EgitimAIPage() {
  const [aktifTab, setAktifTab] = useState('akademi')
  const [demoMod, setDemoMod] = useState(false)
  const [sohbet, setSohbet] = useState<ChatMsg[]>([
    { rol: 'ai', icerik: 'Merhaba! Ben FinanceBot, kişisel finans koçunuzum. Harcamalarınız, tasarruf hedefleriniz veya yatırım sorularınız için buradayım.' }
  ])
  const [mesaj, setMesaj] = useState('')

  const mesajGonder = () => {
    if (!mesaj.trim()) return
    const m = mesaj.toLowerCase()
    const anahtar = Object.keys(AI_YANIT_MAP).find(k => m.includes(k)) || 'default'
    setSohbet(prev => [
      ...prev,
      { rol: 'kullanici', icerik: mesaj },
      { rol: 'ai', icerik: AI_YANIT_MAP[anahtar] }
    ])
    setMesaj('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Eğitim & Yapay Zeka Desteği</h1>
          <p className={styles.pageSub}>Finansal okuryazarlık akademisi, AI bütçe koçu ve kişiselleştirilmiş öneriler</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Demo (Sanal) Hesap</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={demoMod} onChange={() => setDemoMod(d => !d)} />
            <span className={styles.slider} />
          </label>
        </div>
      </div>

      {demoMod && (
        <div className={`${styles.alertCard} ${styles.alertWarn}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2L14 13H2L8 2Z" stroke="var(--warning)" strokeWidth="1.5" fill="none"/><line x1="8" y1="6" x2="8" y2="9.5" stroke="var(--warning)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.75" fill="var(--warning)"/></svg>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--warning)' }}>Demo Hesap Aktif</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Tüm işlemler sanal para ile gerçekleştirilmektedir. Gerçek fonlarınız etkilenmez.</div>
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        {[
          { k: 'akademi', l: 'Video Akademi' },
          { k: 'ai', l: 'AI Bütçe Koçu' },
          { k: 'oneriler', l: 'Tasarruf Önerileri' },
          { k: 'haberler', l: 'Haberler & KAP' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'akademi' && (
        <div className={styles.grid2}>
          {KURSLAR.map(k => (
            <div key={k.id} className={styles.sectionCard} style={{ cursor: 'pointer' }}>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)', marginBottom: '0.25rem' }}>{k.baslik}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{k.sure} · {k.kategori}</div>
                  </div>
                  <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 600, background: k.seviye === 'Başlangıç' ? 'rgba(0,212,170,0.1)' : k.seviye === 'Orta' ? 'rgba(240,180,41,0.1)' : 'rgba(255,71,87,0.1)', color: k.seviye === 'Başlangıç' ? 'var(--profit)' : k.seviye === 'Orta' ? 'var(--warning)' : 'var(--loss)', border: '1px solid transparent' }}>
                    {k.seviye}
                  </span>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>İlerleme</span>
                    <span style={{ color: k.tamamlandi === 100 ? 'var(--profit)' : 'var(--text)' }}>{k.tamamlandi}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${k.tamamlandi}%`, background: k.tamamlandi === 100 ? 'var(--profit)' : 'var(--accent)' }} />
                  </div>
                </div>
                <button className={k.tamamlandi === 100 ? 'btn btn-secondary' : 'btn btn-primary'} style={{ fontSize: '0.75rem' }}>
                  {k.tamamlandi === 100 ? 'Tekrar İzle' : k.tamamlandi > 0 ? 'Devam Et' : 'Başla'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aktifTab === 'ai' && (
        <div className={styles.sectionCard} style={{ maxWidth: 580, margin: '0 auto' }}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>AI Bütçe Koçu — FinanceBot</span></div>
          <div style={{ height: 360, overflowY: 'auto', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sohbet.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.rol === 'kullanici' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius)', background: m.rol === 'kullanici' ? 'var(--accent-dim)' : 'var(--bg-card)', border: `1px solid ${m.rol === 'kullanici' ? 'rgba(0,212,170,0.3)' : 'var(--border)'}`, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.6 }}>
                  {m.icerik}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem' }}>
            <input
              className={styles.input}
              style={{ flex: 1 }}
              placeholder="Bütçe, tasarruf veya yatırım sorunuzu yazın..."
              value={mesaj}
              onChange={e => setMesaj(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && mesajGonder()}
            />
            <button className="btn btn-primary" style={{ fontSize: '0.78rem' }} onClick={mesajGonder}>Gönder</button>
          </div>
        </div>
      )}

      {aktifTab === 'oneriler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={`${styles.alertCard} ${styles.alertInfo}`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#0066ff" strokeWidth="1.5"/><line x1="8" y1="7" x2="8" y2="11" stroke="#0066ff" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="5" r="0.75" fill="#0066ff"/></svg>
            <div style={{ fontSize: '0.8rem' }}>
              <strong>AI Analizi:</strong> Bu ay toplam harcamalarınızda <strong style={{ color: 'var(--loss)' }}>₺4.500</strong> tasarruf potansiyeli tespit edildi.
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Kategori</th>
                  <th>Mevcut Harcama</th>
                  <th>Tavsiye Edilen</th>
                  <th>Tasarruf Potansiyeli</th>
                  <th>Hedef</th>
                </tr>
              </thead>
              <tbody>
                {ONERI_HARCAMALAR.map((h, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{h.kategori}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--loss)' }}>₺{h.tutar.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>₺{h.tavsiye.toLocaleString('tr-TR')}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 700 }}>₺{h.tasarruf.toLocaleString('tr-TR')}</td>
                    <td style={{ minWidth: 120 }}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${Math.round((h.tavsiye / h.tutar) * 100)}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aktifTab === 'haberler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {HABERLER.map(h => (
            <div key={h.id} className={styles.sectionCard} style={{ cursor: 'pointer' }}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ padding: '0.18rem 0.5rem', borderRadius: 100, fontSize: '0.68rem', fontWeight: 700, background: h.tip === 'kap' ? 'rgba(0,102,255,0.1)' : 'rgba(0,212,170,0.1)', color: h.tip === 'kap' ? '#0066ff' : 'var(--accent)', border: `1px solid ${h.tip === 'kap' ? 'rgba(0,102,255,0.3)' : 'rgba(0,212,170,0.3)'}`, whiteSpace: 'nowrap' }}>
                  {h.kaynak}
                </span>
                <div style={{ flex: 1, fontSize: '0.82rem', fontWeight: 500, color: 'var(--text)' }}>{h.baslik}</div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{h.zaman}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
