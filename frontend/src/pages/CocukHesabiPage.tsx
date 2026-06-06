import { useState } from 'react'
import styles from './SharedPage.module.css'

const COCUKLAR = [
  { id: 1, ad: 'Ayşe', yas: 10, bakiye: 2840, harcilik: 150, hedef: 'Bisiklet', hedefTutar: 3500, rozetler: ['kitap', 'matematik', 'spor'] },
  { id: 2, ad: 'Can', yas: 7, bakiye: 1240, harcilik: 100, hedef: 'LEGO Seti', hedefTutar: 1800, rozetler: ['kitap'] },
]

const GOREVLER = [
  { id: 1, cocuk: 'Ayşe', gorev: '10 sayfa kitap oku', odül: 10, durum: 'Tamamlandı', tarih: '2026-05-28' },
  { id: 2, cocuk: 'Ayşe', gorev: 'Matematik ödevini yap', odül: 15, durum: 'Tamamlandı', tarih: '2026-05-27' },
  { id: 3, cocuk: 'Can', gorev: 'Odanı topla', odül: 5, durum: 'Bekliyor', tarih: '2026-05-29' },
  { id: 4, cocuk: 'Ayşe', gorev: '30 dakika spor yap', odül: 20, durum: 'Bekliyor', tarih: '2026-05-29' },
]

const KATEGORI_KISITLARI: Record<string, boolean> = {
  'Oyun & Eğlence': true,
  'Yiyecek & İçecek': true,
  'Eğitim Materyalleri': false,
  'Spor Ekipmanları': false,
  'Online Oyunlar': true,
  'Kırtasiye': false,
}

const ROZET_IKONLARI: Record<string, { icon: string; ad: string; renk: string }> = {
  kitap: { icon: '📚', ad: 'Okuma Kurdu', renk: '#0066ff' },
  matematik: { icon: '🔢', ad: 'Matematik Dehası', renk: '#f0b429' },
  spor: { icon: '⚽', ad: 'Sporcu', renk: '#00d4aa' },
  tasarruf: { icon: '💰', ad: 'Tasarruf Şampiyonu', renk: '#a855f7' },
}

export function CocukHesabiPage() {
  const [aktifTab, setAktifTab] = useState('hesaplar')
  const [secilenCocuk, setSecilenCocuk] = useState(1)
  const [kisitlamalar, setKisitlamalar] = useState(KATEGORI_KISITLARI)
  const [harcalikOto, setHarcalikOto] = useState(true)

  const cocuk = COCUKLAR.find(c => c.id === secilenCocuk)

  const toggleKisitlama = (kat: string) => {
    setKisitlamalar(prev => ({ ...prev, [kat]: !prev[kat] }))
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Çocuk Hesapları (Kumbara)</h1>
          <p className={styles.pageSub}>Dijital harçlık, görev ödülleri ve ebeveyn kontrolleri</p>
        </div>
        <button className="btn btn-primary">+ Çocuk Hesabı Aç</button>
      </div>

      {/* Çocuk Seçici */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {COCUKLAR.map(c => (
          <button key={c.id} onClick={() => setSecilenCocuk(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1rem', borderRadius: 'var(--radius)', border: `1px solid ${secilenCocuk === c.id ? 'rgba(0,212,170,0.4)' : 'var(--border)'}`, background: secilenCocuk === c.id ? 'var(--accent-dim)' : 'var(--bg-surface)', cursor: 'pointer' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.id === 1 ? 'rgba(168,85,247,0.2)' : 'rgba(0,102,255,0.2)', border: `1px solid ${c.id === 1 ? 'rgba(168,85,247,0.4)' : 'rgba(0,102,255,0.4)'}`, display: 'grid', placeItems: 'center', fontWeight: 700, color: c.id === 1 ? '#a855f7' : '#0066ff' }}>
              {c.ad[0]}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: secilenCocuk === c.id ? 'var(--accent)' : 'var(--text)' }}>{c.ad}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{c.yas} yaşında</div>
            </div>
          </button>
        ))}
      </div>

      {cocuk && (
        <div className={styles.metricsRow}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>{cocuk.ad} Kumbara Bakiyesi</span>
            <span className={styles.metricValue}>₺{cocuk.bakiye.toLocaleString('tr-TR')}</span>
            <span className={`${styles.metricChange} ${styles.up}`}>+₺{cocuk.harcilik} bu hafta</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Hedef: {cocuk.hedef}</span>
            <span className={styles.metricValue}>%{Math.round((cocuk.bakiye / cocuk.hedefTutar) * 100)}</span>
            <span className={`${styles.metricChange} ${styles.up}`}>₺{cocuk.hedefTutar - cocuk.bakiye} kaldı</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Kazanılan Rozet</span>
            <span className={styles.metricValue}>{cocuk.rozetler.length}</span>
            <span className={`${styles.metricChange} ${styles.up}`}>adet başarım</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Haftalık Harçlık</span>
            <span className={styles.metricValue}>₺{cocuk.harcilik}</span>
            <span className={`${styles.metricChange} ${styles.neutral}`}>otomatik aktarım</span>
          </div>
        </div>
      )}

      <div className={styles.tabs}>
        {[
          { k: 'hesaplar', l: 'Kumbara' },
          { k: 'gorevler', l: 'Görev & Ödüller' },
          { k: 'harcilik', l: 'Harçlık Otomasyonu' },
          { k: 'kontrol', l: 'Ebeveyn Kontrolleri' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'hesaplar' && cocuk && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>{cocuk.ad}'nin Hedefi: {cocuk.hedef}</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Biriktirilen</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{cocuk.bakiye} / ₺{cocuk.hedefTutar}</span>
              </div>
              <div className={styles.progressBar} style={{ height: 10 }}>
                <div className={styles.progressFill} style={{ width: `${Math.round((cocuk.bakiye / cocuk.hedefTutar) * 100)}%` }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Haftalık ₺{cocuk.harcilik} harçlık ile yaklaşık {Math.ceil((cocuk.hedefTutar - cocuk.bakiye) / (cocuk.harcilik * 4))} ay içinde hedefe ulaşabilir.
              </div>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Başarım Rozetleri</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {Object.entries(ROZET_IKONLARI).map(([key, r]) => {
                const kazanildi = cocuk.rozetler.includes(key)
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', padding: '0.75rem', borderRadius: 'var(--radius)', border: `1px solid ${kazanildi ? r.renk + '44' : 'var(--border)'}`, background: kazanildi ? r.renk + '11' : 'var(--bg-card)', opacity: kazanildi ? 1 : 0.4, minWidth: 80 }}>
                    <span style={{ fontSize: '1.8rem', filter: kazanildi ? 'none' : 'grayscale(100%)' }}>{r.icon}</span>
                    <span style={{ fontSize: '0.65rem', color: kazanildi ? r.renk : 'var(--text-dim)', fontWeight: kazanildi ? 700 : 400, textAlign: 'center' }}>{r.ad}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'gorevler' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {GOREVLER.filter(g => g.cocuk === cocuk?.ad).map(g => (
            <div key={g.id} className={styles.sectionCard}>
              <div className={styles.cardBody} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: g.durum === 'Tamamlandı' ? 'rgba(0,212,170,0.1)' : 'rgba(240,180,41,0.1)', border: `1px solid ${g.durum === 'Tamamlandı' ? 'rgba(0,212,170,0.3)' : 'rgba(240,180,41,0.3)'}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {g.durum === 'Tamamlandı' ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="var(--profit)" strokeWidth="2" strokeLinecap="round"/></svg>
                  ) : (
                    <div style={{ width: 10, height: 10, border: '2px solid var(--warning)', borderRadius: '50%' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{g.gorev}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{g.tarih}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>+₺{g.odül}</div>
                  {g.durum === 'Bekliyor' && <button className="btn btn-secondary" style={{ fontSize: '0.65rem', marginTop: '0.3rem' }}>Onayla</button>}
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary" style={{ alignSelf: 'flex-start', fontSize: '0.82rem' }}>+ Yeni Görev Ata</button>
        </div>
      )}

      {aktifTab === 'harcilik' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Dijital Harçlık Otomasyonu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel}>Otomatik Harçlık Aktarımı</div>
                  <div className={styles.settingDesc}>Her hafta belirlenen tutarı çocuk hesabına otomatik aktar</div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={harcalikOto} onChange={() => setHarcalikOto(h => !h)} />
                  <span className={styles.slider} />
                </label>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Sıklık</label>
                <select className={styles.select} style={{ width: '100%' }}>
                  <option>Her Hafta (Pazartesi)</option>
                  <option>Her Ay (1. gün)</option>
                  <option>Her 2 Haftada Bir</option>
                </select>
              </div>
              {COCUKLAR.map(c => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{ fontWeight: 600, width: 60 }}>{c.ad}</span>
                  <input type="number" className={styles.input} defaultValue={c.harcilik} style={{ width: 100 }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>₺/dönem</span>
                </div>
              ))}
              <button className="btn btn-primary" style={{ width: '100%' }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {aktifTab === 'kontrol' && (
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Harcama Kategorisi Kısıtlamaları</span></div>
            <div className={styles.cardBody}>
              {Object.entries(kisitlamalar).map(([kat, kisitli]) => (
                <div key={kat} className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>{kat}</div>
                    <div className={styles.settingDesc}>{kisitli ? 'Ebeveyn onayı gerekli' : 'Serbestçe harcayabilir'}</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={kisitli} onChange={() => toggleKisitlama(kat)} />
                    <span className={styles.slider} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
