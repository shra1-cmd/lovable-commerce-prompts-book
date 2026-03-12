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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donation_type: string
          donor_email: string | null
          donor_name: string
          donor_phone: string | null
          id: string
          is_anonymous: boolean | null
          notes: string | null
          payment_method: string | null
          payment_status: string
          purpose: string | null
          receipt_sent: boolean | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donation_type: string
          donor_email?: string | null
          donor_name: string
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          purpose?: string | null
          receipt_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donation_type?: string
          donor_email?: string | null
          donor_name?: string
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean | null
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          purpose?: string | null
          receipt_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          detailed_description: string | null
          end_date: string | null
          event_date: string
          event_type: string
          id: string
          image_url: string | null
          location: string
          max_participants: number | null
          registered_participants: number | null
          registration_fee: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          detailed_description?: string | null
          end_date?: string | null
          event_date: string
          event_type: string
          id?: string
          image_url?: string | null
          location: string
          max_participants?: number | null
          registered_participants?: number | null
          registration_fee?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          detailed_description?: string | null
          end_date?: string | null
          event_date?: string
          event_type?: string
          id?: string
          image_url?: string | null
          location?: string
          max_participants?: number | null
          registered_participants?: number | null
          registration_fee?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string
          created_at: string
          date_taken: string | null
          description: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          location: string | null
          photographer: string | null
          title: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          category: string
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          location?: string | null
          photographer?: string | null
          title: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          date_taken?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          location?: string | null
          photographer?: string | null
          title?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          age: number | null
          created_at: string
          email: string
          full_name: string
          gender: string | null
          id: string
          interests: string[] | null
          location: string | null
          phone: string | null
          programs_of_interest: string[] | null
          registration_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          email: string
          full_name: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          phone?: string | null
          programs_of_interest?: string[] | null
          registration_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          interests?: string[] | null
          location?: string | null
          phone?: string | null
          programs_of_interest?: string[] | null
          registration_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          beneficiaries_count: number | null
          budget_allocated: number | null
          budget_spent: number | null
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          detailed_description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          location: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          beneficiaries_count?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          detailed_description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          beneficiaries_count?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          detailed_description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          author_name: string | null
          author_role: string | null
          category: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          read_time_minutes: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_name?: string | null
          author_role?: string | null
          category: string
          content: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_name?: string | null
          author_role?: string | null
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          read_time_minutes?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          address: string | null
          availability: string | null
          background_check_status: string | null
          created_at: string
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          experience_level: string | null
          full_name: string
          id: string
          interests: string[] | null
          joined_date: string | null
          phone: string | null
          skills: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          availability?: string | null
          background_check_status?: string | null
          created_at?: string
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level?: string | null
          full_name: string
          id?: string
          interests?: string[] | null
          joined_date?: string | null
          phone?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          availability?: string | null
          background_check_status?: string | null
          created_at?: string
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          experience_level?: string | null
          full_name?: string
          id?: string
          interests?: string[] | null
          joined_date?: string | null
          phone?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_contact: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          office_hours: string | null
          phone: string | null
          section_name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          office_hours?: string | null
          phone?: string | null
          section_name?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          office_hours?: string | null
          phone?: string | null
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          last_updated_by: string | null
          section_name: string
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          last_updated_by?: string | null
          section_name: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          last_updated_by?: string | null
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      website_hero: {
        Row: {
          background_image_url: string | null
          created_at: string
          cta_primary: string | null
          cta_secondary: string | null
          description: string | null
          id: string
          section_name: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string
          cta_primary?: string | null
          cta_secondary?: string | null
          description?: string | null
          id?: string
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          created_at?: string
          cta_primary?: string | null
          cta_secondary?: string | null
          description?: string | null
          id?: string
          section_name?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      website_mission: {
        Row: {
          created_at: string
          id: string
          mission_description: string | null
          mission_title: string | null
          section_name: string
          updated_at: string
          vision_description: string | null
          vision_title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mission_description?: string | null
          mission_title?: string | null
          section_name?: string
          updated_at?: string
          vision_description?: string | null
          vision_title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mission_description?: string | null
          mission_title?: string | null
          section_name?: string
          updated_at?: string
          vision_description?: string | null
          vision_title?: string | null
        }
        Relationships: []
      }
      website_stats: {
        Row: {
          beneficiaries_count: number | null
          created_at: string
          events_count: number | null
          id: string
          programs_count: number | null
          section_name: string
          updated_at: string
          volunteers_count: number | null
        }
        Insert: {
          beneficiaries_count?: number | null
          created_at?: string
          events_count?: number | null
          id?: string
          programs_count?: number | null
          section_name?: string
          updated_at?: string
          volunteers_count?: number | null
        }
        Update: {
          beneficiaries_count?: number | null
          created_at?: string
          events_count?: number | null
          id?: string
          programs_count?: number | null
          section_name?: string
          updated_at?: string
          volunteers_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
