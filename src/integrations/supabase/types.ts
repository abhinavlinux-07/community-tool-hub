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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      hardware_samples: {
        Row: {
          brand: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          max_loan_hours: number | null
          model: string | null
          name: string
          sample_type: string
          specifications: Json | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          max_loan_hours?: number | null
          model?: string | null
          name: string
          sample_type: string
          specifications?: Json | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          max_loan_hours?: number | null
          model?: string | null
          name?: string
          sample_type?: string
          specifications?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      impact_metrics: {
        Row: {
          co2_reduced: number | null
          community_score: number | null
          id: string
          money_saved: number | null
          total_loans: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          co2_reduced?: number | null
          community_score?: number | null
          id?: string
          money_saved?: number | null
          total_loans?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          co2_reduced?: number | null
          community_score?: number | null
          id?: string
          money_saved?: number | null
          total_loans?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          due_date: string | null
          feedback: string | null
          fine_amount: number | null
          hardware_sample_id: string | null
          id: string
          purpose: string | null
          rating: number | null
          requested_at: string
          returned_at: string | null
          status: Database["public"]["Enums"]["loan_status"]
          tool_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          due_date?: string | null
          feedback?: string | null
          fine_amount?: number | null
          hardware_sample_id?: string | null
          id?: string
          purpose?: string | null
          rating?: number | null
          requested_at?: string
          returned_at?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          tool_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          due_date?: string | null
          feedback?: string | null
          fine_amount?: number | null
          hardware_sample_id?: string | null
          id?: string
          purpose?: string | null
          rating?: number | null
          requested_at?: string
          returned_at?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          tool_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loans_hardware_sample_id_fkey"
            columns: ["hardware_sample_id"]
            isOneToOne: false
            referencedRelation: "hardware_samples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loans_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          created_at: string
          id: string
          inspected_by: string | null
          loan_id: string | null
          new_condition: Database["public"]["Enums"]["tool_condition"]
          next_service_date: string | null
          notes: string | null
          previous_condition:
            | Database["public"]["Enums"]["tool_condition"]
            | null
          repair_cost: number | null
          tool_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inspected_by?: string | null
          loan_id?: string | null
          new_condition: Database["public"]["Enums"]["tool_condition"]
          next_service_date?: string | null
          notes?: string | null
          previous_condition?:
            | Database["public"]["Enums"]["tool_condition"]
            | null
          repair_cost?: number | null
          tool_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inspected_by?: string | null
          loan_id?: string | null
          new_condition?: Database["public"]["Enums"]["tool_condition"]
          next_service_date?: string | null
          notes?: string | null
          previous_condition?:
            | Database["public"]["Enums"]["tool_condition"]
            | null
          repair_cost?: number | null
          tool_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "tools"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          organization: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          brand: string | null
          category: Database["public"]["Enums"]["tool_category"]
          co2_per_use: number | null
          condition: Database["public"]["Enums"]["tool_condition"]
          created_at: string
          daily_rate: number | null
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          model: string | null
          name: string
          replacement_value: number | null
          specifications: Json | null
          total_loans: number | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category: Database["public"]["Enums"]["tool_category"]
          co2_per_use?: number | null
          condition?: Database["public"]["Enums"]["tool_condition"]
          created_at?: string
          daily_rate?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          model?: string | null
          name: string
          replacement_value?: number | null
          specifications?: Json | null
          total_loans?: number | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: Database["public"]["Enums"]["tool_category"]
          co2_per_use?: number | null
          condition?: Database["public"]["Enums"]["tool_condition"]
          created_at?: string
          daily_rate?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          model?: string | null
          name?: string
          replacement_value?: number | null
          specifications?: Json | null
          total_loans?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "community_member" | "architect" | "admin" | "tool_doctor"
      loan_status:
        | "pending"
        | "approved"
        | "rejected"
        | "active"
        | "returned"
        | "overdue"
      tool_category:
        | "power_tool"
        | "hand_tool"
        | "hardware_sample"
        | "measurement"
        | "safety_equipment"
      tool_condition:
        | "excellent"
        | "good"
        | "needs_repair"
        | "under_maintenance"
        | "retired"
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
      app_role: ["community_member", "architect", "admin", "tool_doctor"],
      loan_status: [
        "pending",
        "approved",
        "rejected",
        "active",
        "returned",
        "overdue",
      ],
      tool_category: [
        "power_tool",
        "hand_tool",
        "hardware_sample",
        "measurement",
        "safety_equipment",
      ],
      tool_condition: [
        "excellent",
        "good",
        "needs_repair",
        "under_maintenance",
        "retired",
      ],
    },
  },
} as const
