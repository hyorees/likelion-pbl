export interface Database {
  public: {
    Tables: {
      lions: {
        Row: {
          id: string;
          name: string;
          gender: string;
          track: string;
          part: string;
          github: string;
          description: string;
          introduction: string;
          tech_stack: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['lions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['lions']['Insert']>;
      };
    };
  };
}