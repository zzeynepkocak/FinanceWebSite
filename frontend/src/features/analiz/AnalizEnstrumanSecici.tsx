import { useState, useEffect } from 'react';
import styles from './AnalizEnstrumanSecici.module.css'

interface Instrument {
  symbol: string;
  name: string;
  category: string;
}

const MOCK_ENSTRUMANLAR: Instrument[] = [
  { symbol: 'USD/TRY', name: 'Amerikan Doları', category: 'Döviz' },
  { symbol: 'EUR/TRY', name: 'Euro', category: 'Döviz' },
  { symbol: 'GBP/TRY', name: 'İngiliz Sterlini', category: 'Döviz' },
  { symbol: 'BIST 100', name: 'BIST 100 Endeksi', category: 'Endeks' },
  { symbol: 'GARAN', name: 'Garanti Bankası', category: 'Hisse' },
  { symbol: 'AKBNK', name: 'Akbank', category: 'Hisse' },
  { symbol: 'THYAO', name: 'Türk Hava Yolları', category: 'Hisse' },
  { symbol: 'XAU/TRY', name: 'Altın (Gram)', category: 'Emtia' },
  { symbol: 'BRENT', name: 'Brent Petrol', category: 'Emtia' },
  { symbol: 'XAG/TRY', name: 'Gümüş (Gram)', category: 'Emtia' },
];

type Props = { value: string; onChange: (v: string) => void }

export function AnalizEnstrumanSecici({ value, onChange }: Props) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstruments = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setInstruments(MOCK_ENSTRUMANLAR);
      setLoading(false);
    };

    fetchInstruments();
  }, []);

  const selectedInstrument = instruments.find(inst => inst.symbol === value);

  if (loading) {
    return (
      <div className={styles.row}>
        <label className={styles.label}>Enstrüman:</label>
        <select className={styles.select} disabled>
          <option>Yükleniyor...</option>
        </select>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <label className={styles.label}>Enstrüman:</label>
      <select className={styles.select} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Seçiniz...</option>
        {instruments.map((instrument) => (
          <option key={instrument.symbol} value={instrument.symbol}>
            {instrument.symbol} - {instrument.name}
          </option>
        ))}
      </select>
      {selectedInstrument && (
        <span className={styles.category}>{selectedInstrument.category}</span>
      )}
      <span className={styles.hint}>+ Karşılaştır: EUR/TRY</span>
    </div>
  )
}
