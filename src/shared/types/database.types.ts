export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      comments: {
        Row: {
          beer_id: number | null
          content: string | null
          created_at: string
          customer_id: string
          establishment_id: number | null
          hidden: boolean
          id: number
          news_id: number | null
          quest_id: number | null
        }
        Insert: {
          beer_id?: number | null
          content?: string | null
          created_at?: string
          customer_id: string
          establishment_id?: number | null
          hidden?: boolean
          id?: number
          news_id?: number | null
          quest_id?: number | null
        }
        Update: {
          beer_id?: number | null
          content?: string | null
          created_at?: string
          customer_id?: string
          establishment_id?: number | null
          hidden?: boolean
          id?: number
          news_id?: number | null
          quest_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "comments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "comments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      constants: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          id: number
          used: boolean
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          id?: number
          used?: boolean
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          id?: number
          used?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "coupons_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      gains: {
        Row: {
          cashback_money: number | null
          created_at: string
          establishment_id: number
          id: number
          receipt_id: number | null
          xp: number | null
        }
        Insert: {
          cashback_money?: number | null
          created_at?: string
          establishment_id: number
          id?: number
          receipt_id?: number | null
          xp?: number | null
        }
        Update: {
          cashback_money?: number | null
          created_at?: string
          establishment_id?: number
          id?: number
          receipt_id?: number | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gains_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          beer_id: number | null
          created_at: string
          id: number
          news_id: number | null
          quest_id: number | null
          user_id: string
        }
        Insert: {
          beer_id?: number | null
          created_at?: string
          id?: number
          news_id?: number | null
          quest_id?: number | null
          user_id: string
        }
        Update: {
          beer_id?: number | null
          created_at?: string
          id?: number
          news_id?: number | null
          quest_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          customer_id: string
          id: number
          note: number
        }
        Insert: {
          created_at?: string
          customer_id?: string
          id?: number
          note: number
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: number
          note?: number
        }
        Relationships: [
          {
            foreignKeyName: "notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      profiles: {
        Row: {
          attached_establishment_id: number | null
          avatar_url: string | null
          birthdate: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string | null
        }
        Insert: {
          attached_establishment_id?: number | null
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          attached_establishment_id?: number | null
          avatar_url?: string | null
          birthdate?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      receipt_lines: {
        Row: {
          amount: number
          created_at: string
          id: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_id: number
        }
        Insert: {
          amount: number
          created_at?: string
          id?: number
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_id: number
        }
        Update: {
          amount?: number
          created_at?: string
          id?: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "receipt_lines_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          establishment_id: number
          id: number
          payment_method: Database["public"]["Enums"]["payment_method"]
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          establishment_id: number
          id?: number
          payment_method: Database["public"]["Enums"]["payment_method"]
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          establishment_id?: number
          id?: number
          payment_method?: Database["public"]["Enums"]["payment_method"]
        }
        Relationships: [
          {
            foreignKeyName: "receipts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "receipts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "receipts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
      spendings: {
        Row: {
          amount: number
          created_at: string
          customer_id: string
          establishment_id: number
          id: number
        }
        Insert: {
          amount: number
          created_at?: string
          customer_id: string
          establishment_id: number
          id?: number
        }
        Update: {
          amount?: number
          created_at?: string
          customer_id?: string
          establishment_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "spendings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spendings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_cashback_balance"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "spendings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_stats_complete"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "spendings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "user_xp_total"
            referencedColumns: ["customer_id"]
          },
        ]
      }
    }
    Views: {
      user_cashback_balance: {
        Row: {
          cashback_available: number | null
          cashback_earned: number | null
          cashback_spent: number | null
          customer_id: string | null
          last_cashback_update: string | null
        }
        Relationships: []
      }
      user_stats_complete: {
        Row: {
          cashback_available: number | null
          cashback_earned: number | null
          cashback_spent: number | null
          coupons_available: number | null
          coupons_used: number | null
          customer_id: string | null
          establishment_count: number | null
          first_receipt_date: string | null
          last_receipt_date: string | null
          receipt_count: number | null
          total_spent: number | null
          total_xp: number | null
        }
        Relationships: []
      }
      user_xp_total: {
        Row: {
          customer_id: string | null
          establishment_count: number | null
          first_receipt_date: string | null
          last_receipt_date: string | null
          receipt_count: number | null
          total_spent: number | null
          total_xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_receipt: {
        Args: {
          p_coupon_ids?: number[]
          p_customer_id: string
          p_establishment_id: number
          p_payment_methods: Json
        }
        Returns: Json
      }
      generate_username_from_fullname: { Args: never; Returns: undefined }
      get_current_user_role: { Args: never; Returns: string }
      get_user_cashback_balance: {
        Args: { p_customer_id: string }
        Returns: Json
      }
      get_user_complete_stats: {
        Args: { p_customer_id: string }
        Returns: Json
      }
      get_user_info: {
        Args: { user_ids: string[] }
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          id: string
        }[]
      }
      get_user_xp_stats: { Args: { p_customer_id: string }; Returns: Json }
      refresh_user_stats: { Args: never; Returns: string }
      sync_auth_to_profiles: {
        Args: never
        Returns: {
          synced_count: number
          user_ids: string[]
        }[]
      }
      sync_existing_users: { Args: never; Returns: undefined }
      update_all_incomplete_profiles: {
        Args: never
        Returns: {
          updated_count: number
          user_ids: string[]
        }[]
      }
      update_profile_from_auth: {
        Args: { user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      payment_method: "card" | "cash" | "cashback" | "coupon"
      user_role: "client" | "employee" | "establishment" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      payment_method: ["card", "cash", "cashback", "coupon"],
      user_role: ["client", "employee", "establishment", "admin"],
    },
  },
} as const
