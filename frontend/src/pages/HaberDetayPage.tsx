import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HaberDetayGeri } from '../features/haberler/HaberDetayGeri';
import { HaberDetayBaslik } from '../features/haberler/HaberDetayBaslik';
import { HaberDetayMeta } from '../features/haberler/HaberDetayMeta';
import { HaberDetayIcerik } from '../features/haberler/HaberDetayIcerik';
import { newsApi } from '../api/news';
import type { News } from '../types';
import styles from './HaberDetayPage.module.css';

export function HaberDetayPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) {
        setError('Haber ID bulunamadı');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const newsDetail = await newsApi.getNewsById(parseInt(id));
        setNews(newsDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Haber yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Haber yükleniyor...</div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className={styles.page}>
        <HaberDetayGeri />
        <div className={styles.error}>
          Hata: {error || 'Haber bulunamadı'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HaberDetayGeri />
      <HaberDetayBaslik title={news.title} />
      <HaberDetayMeta 
        source={news.authorName} 
        date={formatDate(news.publishedDate)} 
      />
      <HaberDetayIcerik body={news.content} />
    </div>
  );
}
