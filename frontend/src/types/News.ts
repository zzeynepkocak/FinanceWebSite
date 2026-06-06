export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  publishedDate: string; // ISO string format
  category: string;
  isActive: boolean;
  userId: string;
}
