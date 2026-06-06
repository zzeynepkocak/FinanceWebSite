import { useState } from 'react'
import styles from './SharedPage.module.css'

type WidgetItem = {
  id: string; baslik: string; boyut: '1x1' | '2x1' | '2x2'; aktif: boolean; sabitledi: boolean
}

const VARSAYILAN_WIDGETLAR: WidgetItem[] = [
  { id: 'portfoy', baslik: 'Portföy Özeti', boyut: '2x1', aktif: true, sabitledi: true },
  { id: 'piyasa', baslik: 'Canlı Piyasa Fiyatları', boyut: '2x2', aktif: true, sabitledi: false },
  { id: 'harcama', baslik: 'Aylık Harcama', boyut: '1x1', aktif: true, sabitledi: false },
  { id: 'dcadurumu', baslik: 'DCA Planları', boyut: '1x1', aktif: false, sabitledi: false },
  { id: 'kur', baslik: 'Döviz Kurları', boyut: '2x1', aktif: true, sabitledi: true },
  { id: 'alarm', baslik: 'Fiyat Alarmlari', boyut: '1x1', aktif: false, sabitledi: false },
  { id: 'haberler', baslik: 'Son Haberler', boyut: '2x1', aktif: true, sabitledi: false },
  { id: 'borsa', baslik: 'BIST Top Hisseler', boyut: '2x2', aktif: false, sabitledi: false },
]

const TEMALAR = [
  { isim: 'Varsayılan', birincil: '#00d4aa', ikincil: '#0066ff' },
  { isim: 'Gün Batımı', birincil: '#FF6B6B', ikincil: '#FFE66D' },
  { isim: 'Okyanus', birincil: '#4ECDC4', ikincil: '#45B7D1' },
  { isim: 'Ormansı', birincil: '#56ab2f', ikincil: '#a8e063' },
  { isim: 'Mor Gece', birincil: '#a855f7', ikincil: '#7c3aed' },
]

export function WidgetAyarlariPage() {
  const [widgetlar, setWidgetlar] = useState<WidgetItem[]>(VARSAYILAN_WIDGETLAR)
  const [gizleMod, setGizleMod] = useState(false)
  const [secilenTema, setSecilenTema] = useState(0)
  const [ozelRenk, setOzelRenk] = useState('#00d4aa')
  const [suruklenan, setSuruklenan] = useState<string | null>(null)
  const [ustunde, setUstunde] = useState<string | null>(null)

  const toggleWidget = (id: string) => {
    setWidgetlar(prev => prev.map(w => w.id === id ? { ...w, aktif: !w.aktif } : w))
  }

  const toggleSabitle = (id: string) => {
    setWidgetlar(prev => prev.map(w => w.id === id ? { ...w, sabitledi: !w.sabitledi } : w))
  }

  const boyutDegistir = (id: string, boyut: WidgetItem['boyut']) => {
    setWidgetlar(prev => prev.map(w => w.id === id ? { ...w, boyut } : w))
  }

  const handleDrop = (hedefId: string) => {
    if (!suruklenan || suruklenan === hedefId) return
    setWidgetlar(prev => {
      const idx1 = prev.findIndex(w => w.id === suruklenan)
      const idx2 = prev.findIndex(w => w.id === hedefId)
      const yeni = [...prev]
      ;[yeni[idx1], yeni[idx2]] = [yeni[idx2], yeni[idx1]]
      return yeni
    })
    setSuruklenan(null)
    setUstunde(null)
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Widget & Dashboard Ayarları</h1>
          <p className={styles.pageSub}>Kişisel dashboard düzeninizi, tema ve gizlilik tercihlerinizi yönetin</p>
        </div>
        <button className="btn btn-primary">Düzeni Kaydet</button>
      </div>

      {/* Gizlilik Modu */}
      <div className={styles.sectionCard}>
        <div className={styles.cardBody}>
          <div className={styles.settingRow} style={{ border: 'none', padding: 0 }}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Gizlilik Bulanıklığı (Blur Modu)</div>
              <div className={styles.settingDesc}>Tüm sayısal değerleri gizler — ortak ortamlarda ekranınızı koruyun</div>
            </div>
            <label className={styles.switch}>
              <input type="checkbox" checked={gizleMod} onChange={() => setGizleMod(g => !g)} />
              <span className={styles.slider} />
            </label>
          </div>
          {gizleMod && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['₺48.240', '%12.4', '₺2.840', '1.847 Takipçi'].map(v => (
                <div key={v} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.35rem 0.65rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', filter: 'blur(5px)', userSelect: 'none' }}>{v}</div>
              ))}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', alignSelf: 'center' }}>← Örnek — Tüm değerler bu şekilde görünür</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.grid2}>
        {/* Widget Yönetimi */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Widget Listesi & Boyut Kontrolü</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {widgetlar.map(w => (
              <div key={w.id} className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingLabel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {w.sabitledi && <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>★</span>}
                    {w.baslik}
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem' }}>
                    {(['1x1', '2x1', '2x2'] as const).map(b => (
                      <button key={b} onClick={() => boyutDegistir(w.id, b)} disabled={!w.aktif} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: 4, border: `1px solid ${w.boyut === b ? 'var(--accent)' : 'var(--border)'}`, background: w.boyut === b ? 'var(--accent-dim)' : 'transparent', color: w.boyut === b ? 'var(--accent)' : 'var(--text-dim)', cursor: w.aktif ? 'pointer' : 'not-allowed', opacity: w.aktif ? 1 : 0.4 }}>
                        {b}
                      </button>
                    ))}
                    <button onClick={() => toggleSabitle(w.id)} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', borderRadius: 4, border: '1px solid var(--border)', background: w.sabitledi ? 'rgba(240,180,41,0.1)' : 'transparent', color: w.sabitledi ? 'var(--warning)' : 'var(--text-dim)', cursor: 'pointer' }}>
                      {w.sabitledi ? 'Sabitlendi' : 'Sabitle'}
                    </button>
                  </div>
                </div>
                <label className={styles.switch}>
                  <input type="checkbox" checked={w.aktif} onChange={() => toggleWidget(w.id)} />
                  <span className={styles.slider} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Tema */}
        <div className={styles.sectionCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>Özel Tema Rengi</span></div>
          <div className={styles.cardBody} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {TEMALAR.map((t, i) => (
                <button key={t.isim} onClick={() => { setSecilenTema(i); setOzelRenk(t.birincil) }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', background: 'none', border: `2px solid ${secilenTema === i ? t.birincil : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '0.5rem 0.65rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.birincil }} />
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: t.ikincil }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: secilenTema === i ? t.birincil : 'var(--text-dim)', fontWeight: secilenTema === i ? 700 : 400 }}>{t.isim}</span>
                </button>
              ))}
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block', marginBottom: '0.4rem' }}>Özel Renk Seçici</label>
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <input type="color" value={ozelRenk} onChange={e => setOzelRenk(e.target.value)} style={{ width: 44, height: 36, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
                <input className={styles.input} value={ozelRenk} onChange={e => setOzelRenk(e.target.value)} style={{ fontFamily: 'var(--font-mono)' }} />
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Temayı Uygula</button>
          </div>
        </div>
      </div>

      {/* Dashboard Önizleme */}
      <div className={styles.sectionCard}>
        <div className={styles.cardHeader}><span className={styles.cardTitle}>Dashboard Düzen Önizlemesi (Sürükle & Bırak)</span></div>
        <div className={styles.cardBody}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {widgetlar.filter(w => w.aktif).map(w => (
              <div
                key={w.id}
                draggable
                onDragStart={() => setSuruklenan(w.id)}
                onDragOver={e => { e.preventDefault(); setUstunde(w.id) }}
                onDrop={() => handleDrop(w.id)}
                onDragEnd={() => { setSuruklenan(null); setUstunde(null) }}
                style={{
                  gridColumn: w.boyut === '1x1' ? 'span 1' : 'span 2',
                  gridRow: w.boyut === '2x2' ? 'span 2' : 'span 1',
                  background: ustunde === w.id ? 'var(--accent-dim)' : 'var(--bg-card)',
                  border: `1px dashed ${suruklenan === w.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem',
                  cursor: 'grab',
                  minHeight: 60,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  transition: 'background 0.15s',
                  opacity: suruklenan === w.id ? 0.5 : 1,
                }}
              >
                {w.sabitledi && <span style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>★ Sabitlendi</span>}
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)' }}>{w.baslik}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>{w.boyut}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
