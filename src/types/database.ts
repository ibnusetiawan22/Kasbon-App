import type { DebtType } from "@/types/debt";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      debts: {
        Row: {
          amount: number;
          counterpart_name: string;
          created_at: string;
          due_date: string | null;
          id: string;
          note: string | null;
          settled_at: string | null;
          type: DebtType;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          counterpart_name: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          note?: string | null;
          settled_at?: string | null;
          type: DebtType;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          counterpart_name?: string;
          created_at?: string;
          due_date?: string | null;
          id?: string;
          note?: string | null;
          settled_at?: string | null;
          type?: DebtType;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "debts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [key: string]: never;
    };
    Functions: {
      [key: string]: never;
    };
    Enums: {
      debt_type: DebtType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};