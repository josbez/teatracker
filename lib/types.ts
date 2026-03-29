export interface Tea {
  id: string;
  user_id: string;
  name: string;
  source_url: string | null;
  type: string | null;
  rating: number | null;
  notes: string | null;
  created_at: string;
}

export interface SteepSession {
  id: string;
  user_id: string;
  duration_seconds: number;
  created_at: string;
}
