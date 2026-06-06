import { useState } from 'react'
import styles from './SharedPage.module.css'

const FONLAR = [
  { ad: 'Hisse Senedi Fonu', kod: 'BES-HSF', deger: 42800, yüzde: 38, getiri12ay: 24.8, renk: '#0066ff' },
  { ad: 'Devlet Tahvili Fonu', kod: 'BES-DTF', deger: 28500, yüzde: 25, getiri12ay: 18.2, renk: '#00a651' },
  { ad: 'Kira Sertifikası Fonu', kod: 'BES-KSF', deger: 22700, yüzde: 20, getiri12ay: 16.4, renk: '#f0b429' },
  { ad: 'Altın Fonu', kod: 'BES-ALT', deger: 12400, yüzde: 11, getiri12ay: 31.2, renk: '#e5a800' },
  { ad: 'Para Piyasası Fonu', kod: 'BES-PPF', deger: 6700, yüzde: 6, getiri12ay: 41.5, renk: '#9945ff' },
]

const DAGITIM_PROFILLERI = {
  agresif: [
    { ad: 'Hisse Senedi', yuzde: 60, renk: '#0066ff' },
    { ad: 'Kira Sertifikası', yuzde: 20, renk: '#f0b429' },
    { ad: 'Tahvil', yuzde: 10, renk: '#00a651' },
    { ad: 'Altın', yuzde: 10, renk: '#e5a800' },
  ],
  dengeli: [
    { ad: 'Hisse Senedi', yuzde: 40, renk: '#0066ff' },
    { ad: 'Tahvil', yuzde: 30, renk: '#00a651' },
    { ad: 'Kira Sertifikası', yuzde: 20, renk: '#f0b429' },
    { ad: 'Para Piyasası', yuzde: 10, renk: '#9945ff' },
  ],
  muhafazakar: [
    { ad: 'Para Piyasası', yuzde: 40, renk: '#9945ff' },
    { ad: 'Tahvil', yuzde: 35, renk: '#00a651' },
    { ad: 'Kira Sertifikası', yuzde: 20, renk: '#f0b429' },
    { ad: 'Hisse Senedi', yuzde: 5, renk: '#0066ff' },
  ],
}

export function BESPage() {
  const [aktifTab, setAktifTab] = useState('ozet')
  const [seciliProfil, setSeciliProfil] = useState<'agresif' | 'dengeli' | 'muhafazakar'>('dengeli')
  const [otoDurum, setOtoDurum] = useState(true)
  const [emekliYasi, setEmekliYasi] = useState('65')
  const [mevcutYas, setMevcutYas] = useState('32')
  const [aylikKatki, setAylikKatki] = useState('3500')

  const toplamBirikim = FONLAR.reduce((s, f) => s + f.deger, 0)
  const devletKatkisi = toplamBirikim * 0.30
  const kalanYil = Math.max(0, parseInt(emekliYasi) - parseInt(mevcutYas))
  const projeksiyon = (parseFloat(aylikKatki) || 0) * 12 * kalanYil * 1.18 // ~%18 ortalama getiri varsayımı

  const secilenProfil = DAGITIM_PROFILLERI[seciliProfil]

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>BES — Bireysel Emeklilik Sistemi</h1>
          <p className={styles.pageSub}>Emeklilik birikimi ve fon yönetimi</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary">Katkı Payı Artır</button>
          <button className="btn btn-primary">Fon Değiştir</button>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Toplam Birikim</span>
          <span className={styles.metricValue}>₺{toplamBirikim.toLocaleString('tr-TR')}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>+%22.4 (12 ay)</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Devlet Katkısı</span>
          <span className={styles.metricValue} style={{ color: 'var(--profit)' }}>₺{devletKatkisi.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</span>
          <span className={`${styles.metricChange} ${styles.up}`}>%30 katkı</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Aylık Katkı Payı</span>
          <span className={styles.metricValue}>₺3.500</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>Otomatik</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Emekliliğe Kalan</span>
          <span className={styles.metricValue}>{kalanYil} yıl</span>
          <span className={`${styles.metricChange} ${styles.neutral}`}>{emekliYasi} yaşında</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {[
          { k: 'ozet', l: 'Genel Bakış' },
          { k: 'fonlar', l: 'Fon Dağılımı' },
          { k: 'wizard', l: 'Profil Sihirbazı' },
          { k: 'projeksiyon', l: 'Emeklilik Projeksiyonu' },
        ].map(t => (
          <button key={t.k} className={`${styles.tab} ${aktifTab === t.k ? styles.tabActive : ''}`} onClick={() => setAktifTab(t.k)}>{t.l}</button>
        ))}
      </div>

      {aktifTab === 'ozet' && (
        <>
          <div className={styles.grid2}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}><span className={styles.cardTitle}>Devlet Katkısı Detayı</span></div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Devlet %30 Katkısı (Toplam)</div>
                  <div style={{ fontSize: '1.5rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--profit)' }}>₺{devletKatkisi.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                </div>
                {[
                  { etiket: 'Kendi Katkım', deger: `₺${toplamBirikim.toLocaleString('tr-TR')}` },
                  { etiket: 'Devlet Katkısı (%30)', deger: `₺${devletKatkisi.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` },
                  { etiket: 'Fon Getirisi', deger: '₺8.420' },
                  { etiket: 'Toplam Net Değer', deger: `₺${(toplamBirikim + devletKatkisi + 8420).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{r.etiket}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.deger}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Otomatik Kayıt</span>
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>Otomatik Kayıt Aktif</div>
                    <div className={styles.settingDesc}>İşveren tarafından otomatik kaydedildiniz (6645 sayılı Kanun)</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={otoDurum} onChange={e => setOtoDurum(e.target.checked)} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                {!otoDurum && (
                  <div style={{ padding: '0.75rem', background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--loss)' }}>
                    ⚠ Otomatik kaydı iptal etmek devlet katkısı alamamanıza yol açabilir. Emin misiniz?
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary" style={{ fontSize: '0.72rem' }} onClick={() => setOtoDurum(true)}>Vazgeç</button>
                      <button className="btn btn-secondary" style={{ fontSize: '0.72rem', color: 'var(--loss)' }}>İptal Et</button>
                    </div>
                  </div>
                )}
                <div className={styles.settingRow}>
                  <div className={styles.settingInfo}>
                    <div className={styles.settingLabel}>Otomatik Fon Dengesi</div>
                    <div className={styles.settingDesc}>6 ayda bir hedef dağılıma yeniden dengele</div>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {aktifTab === 'fonlar' && (
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Mevcut Fon Dağılımı</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FONLAR.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: f.renk, flexShrink: 0 }}></div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{f.ad}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{f.kod}</div>
                </div>
                <div style={{ minWidth: 80, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₺{f.deger.toLocaleString('tr-TR')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>%{f.yüzde}</div>
                </div>
                <div style={{ minWidth: 60, textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--profit)', fontWeight: 600 }}>+%{f.getiri12ay}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>12 aylık</div>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${f.yüzde}%`, background: f.renk }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {aktifTab === 'wizard' && (
        <div className={styles.grid3}>
          {(['agresif', 'dengeli', 'muhafazakar'] as const).map(profil => (
            <div
              key={profil}
              className={styles.sectionCard}
              style={{ cursor: 'pointer', borderColor: seciliProfil === profil ? 'var(--accent)' : 'var(--border)', transition: 'border-color 0.2s' }}
              onClick={() => setSeciliProfil(profil)}
            >
              <div className={styles.cardHeader} style={{ background: seciliProfil === profil ? 'var(--accent-dim)' : 'transparent' }}>
                <span className={styles.cardTitle} style={{ color: seciliProfil === profil ? 'var(--accent)' : 'var(--text)' }}>
                  {{ agresif: '🚀 Agresif', dengeli: '⚖️ Dengeli', muhafazakar: '🛡 Muhafazakâr' }[profil]}
                </span>
                {seciliProfil === profil && <span style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>Seçili</span>}
              </div>
              <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {DAGITIM_PROFILLERI[profil].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: f.renk, flexShrink: 0 }}></div>
                    <span style={{ flex: 1, fontSize: '0.78rem' }}>{f.ad}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600 }}>%{f.yuzde}</span>
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem' }}>
                  <div className={styles.progressBar} style={{ height: 8 }}>
                    {secilenProfil === DAGITIM_PROFILLERI[profil] && DAGITIM_PROFILLERI[profil].map((f, i) => (
                      <div key={i} style={{ width: `${f.yuzde}%`, height: '100%', background: f.renk, display: 'inline-block' }}></div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  {{ agresif: 'Yüksek risk, yüksek getiri potansiyeli', dengeli: 'Orta risk, dengeli büyüme', muhafazakar: 'Düşük risk, sermaye koruma' }[profil]}
                </div>
              </div>
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <button className="btn btn-primary" style={{ minWidth: 200 }}>Seçilen Profili Uygula</button>
          </div>
        </div>
      )}

      {aktifTab === 'projeksiyon' && (
        <div className={styles.grid2}>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Projeksiyon Parametreleri</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Şu Anki Yaşınız</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" value={mevcutYas} onChange={e => setMevcutYas(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Hedef Emeklilik Yaşı</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" value={emekliYasi} onChange={e => setEmekliYasi(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.3rem' }}>Aylık Katkı Payı (₺)</label>
                <input className={styles.input} style={{ width: '100%' }} type="number" value={aylikKatki} onChange={e => setAylikKatki(e.target.value)} />
              </div>
            </div>
          </div>
          <div className={styles.sectionCard}>
            <div className={styles.cardHeader}><span className={styles.cardTitle}>Projeksiyon Sonucu</span></div>
            <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,212,170,0.3)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Tahmini Emeklilik Birikimi</div>
                <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>₺{projeksiyon.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>%18 yıllık getiri varsayımıyla</div>
              </div>
              {[
                { etiket: 'Toplam Katkı', deger: `₺${((parseFloat(aylikKatki) || 0) * 12 * kalanYil).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` },
                { etiket: 'Devlet Katkısı (%30)', deger: `₺${((parseFloat(aylikKatki) || 0) * 12 * kalanYil * 0.30).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` },
                { etiket: 'Tahmini Aylık Emekli Maaşı', deger: `₺${(projeksiyon / (20 * 12)).toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` },
                { etiket: 'Kalan Yıl', deger: `${kalanYil} yıl` },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-dim)' }}>{r.etiket}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{r.deger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
