import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paths } from '../../routes/paths';
import { newsApi } from '../../api/news';
import type { News } from '../../types';
import styles from './HaberlerListe.module.css';

type Props = { 
  kategori?: string; 
};

export function HaberlerListe({ kategori }: Props) {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        let newsData: News[];
        
        if (kategori) {
          newsData = await newsApi.getNewsByCategory(kategori);
        } else {
          newsData = await newsApi.getAllNews();
        }
        
        setNews(newsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Haberler yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [kategori]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.liste}>
        <div className={styles.loading}>Haberler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.liste}>
        <div className={styles.error}>Hata: {error}</div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className={styles.liste}>
        <div className={styles.empty}>
          {kategori ? `"${kategori}" kategorisinde henüz haber bulunmuyor.` : 'Henüz haber bulunmuyor.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.liste}>
      {news.map((item) => (
        <article key={item.id} className={styles.kart}>
          <Link to={paths.haberDetay(item.id.toString())} className={styles.link}>
            <h3 className={styles.baslik}>{item.title}</h3>
            <p className={styles.ozet}>{item.summary}</p>
            <span className={styles.meta}>
              {item.authorName} | {formatDate(item.publishedDate)}
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}
