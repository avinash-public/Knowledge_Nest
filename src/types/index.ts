export interface Book {
    id: string;
    title: string;
    author: string;
    cover_url: string;
    category: string;
    rating: number;
    available: boolean;
    description?: string;
    price?: number; // <--- ADD THIS
  }