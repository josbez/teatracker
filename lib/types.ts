export type TeaType =
  | 'Green'
  | 'Black'
  | 'Oolong'
  | 'White'
  | 'Jasmine'
  | 'Herbal'
  | 'Rooibos'
  | 'Pu-erh';

export type Rating = '👍' | '😐' | '👎';

export interface Tea {
  id: string;
  user_id: string;
  name: string;
  source: string | null;
  type: string | null;
  rating: Rating | null;
  notes: string | null;
  created_at: string;
}
