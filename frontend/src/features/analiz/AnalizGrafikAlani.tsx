import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import styles from './AnalizGrafikAlani.module.css'

interface PriceData {
  timestamp: string;
  price: number;
  ma20?: number;
  ma50?: number;
}

interface IndicatorData {
  rsi: number;
  macd: number;
  signal: number;
  volume: number;
}

type Props = { enstruman: string; ma20: boolean; ma50: boolean; trend: boolean }

const MOCK_PRICE_DATA: PriceData[] = [
  { timestamp: '09:00', price: 45.20, ma20: 45.15, ma50: 45.10 },
  { timestamp: '09:30', price: 45.35, ma20: 45.18, ma50: 45.12 },
  { timestamp: '10:00', price: 45.50, ma20: 45.22, ma50: 45.14 },
  { timestamp: '10:30', price: 45.45, ma20: 45.25, ma50: 45.16 },
  { timestamp: '11:00', price: 45.60, ma20: 45.28, ma50: 45.18 },
  { timestamp: '11:30', price: 45.55, ma20: 45.32, ma50: 45.20 },
  { timestamp: '12:00', price: 45.70, ma20: 45.35, ma50: 45.22 },
  { timestamp: '12:30', price: 45.65, ma20: 45.38, ma50: 45.24 },
  { timestamp: '13:00', price: 45.80, ma20: 45.42, ma50: 45.26 },
  { timestamp: '13:30', price: 45.75, ma20: 45.45, ma50: 45.28 },
  { timestamp: '14:00', price: 45.90, ma20: 45.48, ma50: 45.30 },
  { timestamp: '14:30', price: 45.85, ma20: 45.52, ma50: 45.32 },
  { timestamp: '15:00', price: 46.00, ma20: 45.55, ma50: 45.34 },
  { timestamp: '15:30', price: 45.95, ma20: 45.58, ma50: 45.36 },
  { timestamp: '16:00', price: 46.10, ma20: 45.62, ma50: 45.38 },
  { timestamp: '16:30', price: 46.05, ma20: 45.65, ma50: 45.40 },
  { timestamp: '17:00', price: 46.20, ma20: 45.68, ma50: 45.42 },
];

const MOCK_INDICATORS: IndicatorData = {
  rsi: 68.5,
  macd: 0.85,
  signal: 0.72,
  volume: 125000000,
};

export function AnalizGrafikAlani({ enstruman, ma20, ma50, trend }: Props) {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
      
      setPriceData(MOCK_PRICE_DATA);
      setIndicators(MOCK_INDICATORS);
      setCurrentPrice(MOCK_PRICE_DATA[MOCK_PRICE_DATA.length - 1].price);
      setLoading(false);
    };

    fetchAnalysisData();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchAnalysisData, 10000);
    return () => clearInterval(interval);
  }, [enstruman]);

  const gosterilen = [ma20 && 'MA(20)', ma50 && 'MA(50)', trend && 'Trend'].filter(Boolean).join(', ') || '—';
  
  const priceChange = priceData.length > 1 
    ? ((currentPrice - priceData[0].price) / priceData[0].price * 100).toFixed(2)
    : '0.00';
  
  const trendDirection = parseFloat(priceChange) >= 0 ? 'Yükselen' : 'Düşen';

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Grafik yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.grafik}>
        <div className={styles.chartHeader}>
          <h3>{enstruman}</h3>
          <div className={styles.priceInfo}>
            <span className={styles.currentPrice}>{currentPrice.toFixed(2)}</span>
            <span className={`${styles.priceChange} ${parseFloat(priceChange) >= 0 ? styles.up : styles.down}`}>
              {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
            </span>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#5b8dee" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#5b8dee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
              <XAxis
                dataKey="timestamp"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                domain={['auto','auto']}
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                axisLine={false} tickLine={false} width={48}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(8,11,20,0.92)',
                  border: '1px solid rgba(91,141,238,0.25)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: 'JetBrains Mono'
                }}
                cursor={{ stroke: 'rgba(91,141,238,0.3)', strokeWidth: 1 }}
              />
              {ma20 && <ReferenceLine y={45.8} stroke="rgba(251,191,36,0.5)" strokeDasharray="4 4" strokeWidth={1}/>}
              {ma50 && <ReferenceLine y={45.5} stroke="rgba(168,85,247,0.5)" strokeDasharray="4 4" strokeWidth={1}/>}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#5b8dee"
                strokeWidth={1.5}
                fill="url(#priceGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#5b8dee', stroke: 'rgba(255,255,255,0.5)', strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {indicators && (
          <div className={styles.indicators}>
            <div className={styles.indicator}>
              <span className={styles.label}>RSI:</span>
              <span className={styles.value}>{indicators.rsi.toFixed(1)}</span>
            </div>
            <div className={styles.indicator}>
              <span className={styles.label}>MACD:</span>
              <span className={styles.value}>{indicators.macd.toFixed(3)}</span>
            </div>
            <div className={styles.indicator}>
              <span className={styles.label}>Hacim:</span>
              <span className={styles.value}>{(indicators.volume / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        )}
      </div>
      
      <p className={styles.legend}>
        {trendDirection} trend | {gosterilen} gösterildi
      </p>
    </div>
  )
}
