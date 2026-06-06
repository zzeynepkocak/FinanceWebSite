import { useState } from 'react'
import styles from './SharedPage.module.css'

/* ── Mock data ── */
const ALL_ISLEMLER = [
  { id: 1, tarih: '2026-05-30', saat: '14:22', tip: 'Alış', sembol: 'GARAN', aciklama: 'Garanti Bankası Alış', tutar: +50000, adet: 508, fiyat: 98.40, kategori: 'Hisse', durum: 'Tamamlandı' },
  { id: 2, tarih: '2026-05-30', saat: '11:05', tip: 'Satış', sembol: 'THYAO', aciklama: 'THY Satış', tutar: -28750, adet: 100, fiyat: 287.50, kategori: 'Hisse', durum: 'Tamamlandı' },
  { id: 3, tarih: '2026-05-29', saat: '16:40', tip: 'Transfer', sembol: 'TRY', aciklama: 'Hesap içi transfer', tutar: -15000, adet: null, fiyat: null, kategori: 'Transfer', durum: 'Tamamlandı' },
  { id: 4, tarih: '2026-05-29', saat: '09:30', tip: 'Alış', sembol: 'BTC', aciklama: 'Bitcoin Alış', tutar: +25000, adet: 0.065, fiyat: 384615, kategori: 'Kripto', durum: 'Tamamlandı' },
  { id: 5, tarih: '2026-05-28', saat: '15:12', tip: 'Ödeme', sembol: 'TRY', aciklama: 'Elektrik faturası', tutar: -820, adet: null, fiyat: null, kategori: 'Fatura', durum: 'Tamamlandı' },
  { id: 6, tarih: '2026-05-28', saat: '10:05', tip: 'Alış', sembol: 'USDTRY', aciklama: 'USD Alış', tutar: +38420, adet: 1000, fiyat: 38.42, kategori: 'Döviz', durum: 'Tamamlandı' },
  { id: 7, tarih: '2026-05-27', saat: '13:55', tip: 'Satış', sembol: 'ASELS', aciklama: 'Aselsan Satış', tutar: -88600, adet: 2000, fiyat: 44.30, kategori: 'Hisse', durum: 'Tamamlandı' },
  { id: 8, tarih: '2026-05-27', saat: '08:45', tip: 'Provizyon', sembol: 'AMZN', aciklama: 'Amazon alış provizyon', tutar: +12000, adet: 8, fiyat: 1500, kategori: 'Hisse', durum: 'Beklemede' },
  { id: 9, tarih: '2026-05-26', saat: '17:30', tip: 'Yatırma', sembol: 'TRY', aciklama: 'EFT ile yatırım', tutar: +100000, adet: null, fiyat: null, kategori: 'Nakit', durum: 'Tamamlandı' },
  { id: 10, tarih: '2026-05-26', saat: '12:00', tip: 'Ödeme', sembol: 'TRY', aciklama: 'Netflix abonelik', tutar: -299, adet: null, fiyat: null, kategori: 'Abonelik', durum: 'Tamamlandı' },
  { id: 11, tarih: '2026-05-25', saat: '10:30', tip: 'Alış', sembol: 'ETH', aciklama: 'Ethereum Alış', tutar: +18500, adet: 0.5, fiyat: 37000, kategori: 'Kripto', durum: 'Tamamlandı' },
  { id: 12, tarih: '2026-05-25', saat: '09:15', tip: 'Çekme', sembol: 'TRY', aciklama: 'ATM çekimi', tutar: -2000, adet: null, fiyat: null, kategori: 'Nakit', durum: 'Tamamlandı' },
]

const TIP_RENKLERI: Record<string, string> = {
  Alış: '#00d4aa', Satış: '#ff4757', Transfer: '#f0b429', Ödeme: '#e17055',
  Provizyon: '#6c5ce7', Yatırma: '#0066ff', Çekme: '#fd79a8',
}

export function IslemGecmisiPage() {
  const [search, setSearch] = useState('')
  const [tipFilter, setTipFilter] = useState('Tümü')
  const [kategoriFilter, setKategoriFilter] = useState('Tümü')
  const [minTutar, setMinTutar] = useState('')
  const [maxTutar, setMaxTutar] = useState('')
  const [sortCol, setSortCol] = useState<string>('tarih')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [expandedRow, setExpandedRow] = useState<number | null>(null)
  const PAGE_SIZE = 8

  const tipOptions = ['Tümü', 'Alış', 'Satış', 'Transfer', 'Ödeme', 'Provizyon', 'Yatırma', 'Çekme']
  const kategoriler = ['Tümü', 'Hisse', 'Kripto', 'Döviz', 'Fatura', 'Transfer', 'Abonelik', 'Nakit']

  const filtered = ALL_ISLEMLER.filter(r => {
    if (tipFilter !== 'Tümü' && r.tip !== tipFilter) return false
    if (kategoriFilter !== 'Tümü' && r.kategori !== kategoriFilter) return false
    if (minTutar && Math.abs(r.tutar) < Number(minTutar)) return false
    if (maxTutar && Math.abs(r.tutar) > Number(maxTutar)) return false
    if (search && !`${r.sembol} ${r.aciklama} ${r.kategori}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    let va: any = (a as any)[sortCol], vb: any = (b as any)[sortCol]
    if (typeof va === 'string') return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    return sortAsc ? va - vb : vb - va
  })

  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const handleSort = (col: string) => {
    if (sortCol === col) setSortAsc(!sortAsc)
    else { setSortCol(col); setSortAsc(false) }
  }

  const SortIcon = ({ col }: { col: string }) => (
    <span style={{ color: sortCol === col ? 'var(--accent)' : 'var(--text-dim)', marginLeft: 4 }}>
      {sortCol === col ? (sortAsc ? '▲' : '▼') : '⇅'}
    </span>
  )

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>İşlem Geçmişi</h1>
          <p className={styles.pageSub}>{filtered.length} işlem bulundu</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn btn-secondary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Excel
          </button>
          <button className="btn btn-secondary">PDF</button>
          <button className="btn btn-secondary">CSV</button>
        </div>
      </div>

      {/* Filtreler */}
      <div className={styles.filterBar}>
        {/* Arama */}
        <div className={styles.searchBox}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input placeholder="Sembol, açıklama ara…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Tip filtre */}
        <div className={styles.filterGroup}>
          {tipOptions.map(t => (
            <button
              key={t}
              className={`${styles.filterTag} ${tipFilter === t ? styles.filterTagActive : ''}`}
              onClick={() => setTipFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Kategori */}
        <select className={styles.select} value={kategoriFilter} onChange={e => setKategoriFilter(e.target.value)}>
          {kategoriler.map(k => <option key={k}>{k}</option>)}
        </select>

        {/* Tutar aralığı */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <input className={styles.input} placeholder="Min ₺" value={minTutar} onChange={e => setMinTutar(e.target.value)} style={{ width: 90 }} />
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>–</span>
          <input className={styles.input} placeholder="Maks ₺" value={maxTutar} onChange={e => setMaxTutar(e.target.value)} style={{ width: 90 }} />
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className={styles.bulkBar}>
          <span>{selected.length} işlem seçildi</span>
          <button className="btn btn-secondary" onClick={() => setSelected([])}>İptal</button>
          <button className="btn btn-secondary">Toplu İndir</button>
          <button className="btn btn-danger">Sil</button>
        </div>
      )}

      {/* Tablo */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input type="checkbox"
                  checked={selected.length === pageData.length && pageData.length > 0}
                  onChange={e => setSelected(e.target.checked ? pageData.map(r => r.id) : [])}
                />
              </th>
              <th onClick={() => handleSort('tarih')} style={{ cursor: 'pointer' }}>Tarih <SortIcon col="tarih" /></th>
              <th onClick={() => handleSort('tip')} style={{ cursor: 'pointer' }}>Tip <SortIcon col="tip" /></th>
              <th onClick={() => handleSort('sembol')} style={{ cursor: 'pointer' }}>Sembol <SortIcon col="sembol" /></th>
              <th>Açıklama</th>
              <th onClick={() => handleSort('kategori')} style={{ cursor: 'pointer' }}>Kategori <SortIcon col="kategori" /></th>
              <th onClick={() => handleSort('tutar')} style={{ cursor: 'pointer', textAlign: 'right' }}>Tutar <SortIcon col="tutar" /></th>
              <th>Durum</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {pageData.map(r => (
              <>
                <tr key={r.id} className={selected.includes(r.id) ? styles.rowSelected : ''}>
                  <td>
                    <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    <div>{r.tarih}</div>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.68rem' }}>{r.saat}</div>
                  </td>
                  <td>
                    <span className={styles.tipBadge} style={{ background: `${TIP_RENKLERI[r.tip]}22`, color: TIP_RENKLERI[r.tip], borderColor: `${TIP_RENKLERI[r.tip]}44` }}>
                      {r.tip}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{r.sembol}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{r.aciklama}</td>
                  <td><span className="badge badge-neutral">{r.kategori}</span></td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600,
                    color: r.tutar > 0 ? 'var(--profit)' : 'var(--loss)' }}>
                    {r.tutar > 0 ? '+' : ''}{r.tutar.toLocaleString('tr-TR')} ₺
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', color: r.durum === 'Tamamlandı' ? 'var(--profit)' : 'var(--warning)' }}>
                      ● {r.durum}
                    </span>
                  </td>
                  <td>
                    <button
                      className={styles.expandBtn}
                      onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}
                    >
                      {expandedRow === r.id ? '▲' : '▼'}
                    </button>
                  </td>
                </tr>
                {expandedRow === r.id && (
                  <tr key={`${r.id}-exp`} className={styles.expandedRow}>
                    <td colSpan={9}>
                      <div className={styles.expandedContent}>
                        <div className={styles.expandGrid}>
                          {r.adet && <div><span>Adet</span><strong>{r.adet}</strong></div>}
                          {r.fiyat && <div><span>Birim Fiyat</span><strong>{r.fiyat.toLocaleString('tr-TR')} ₺</strong></div>}
                          <div><span>İşlem ID</span><strong>TXN-{r.id.toString().padStart(6, '0')}</strong></div>
                          <div><span>Zaman Damgası</span><strong>{r.tarih} {r.saat}</strong></div>
                          <div><span>Toplam Tutar</span><strong style={{ color: r.tutar > 0 ? 'var(--profit)' : 'var(--loss)' }}>{r.tutar > 0 ? '+' : ''}{r.tutar.toLocaleString('tr-TR')} ₺</strong></div>
                        </div>
                        <button className={styles.copyBtn} title="Kopyala">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          ID Kopyala
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Toplam {filtered.length} kayıt, Sayfa {page} / {totalPages}
        </span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </div>
    </div>
  )
}
