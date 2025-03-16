export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          created_at: string
          email: string
          id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      linked_account_plaid_credentials: {
        Row: {
          access_token: string
          created_at: string
          item_id: string
          linked_account_id: number
          updated_at: string | null
        }
        Insert: {
          access_token: string
          created_at?: string
          item_id: string
          linked_account_id: number
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          created_at?: string
          item_id?: string
          linked_account_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linked_account_plaid_credentials_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: true
            referencedRelation: "linked_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      linked_accounts: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          owner_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          name: string
          owner_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          owner_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "linked_accounts_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_bank_accounts: {
        Row: {
          available_balance: number | null
          balance_last_updated_at: string | null
          created_at: string
          current_balance: number | null
          holder_category:
            | Database["public"]["Enums"]["bank_account_holder_categories"]
            | null
          id: number
          iso_currency_code: string | null
          limit_amount: number | null
          linked_account_id: number
          mask: string | null
          name: string
          official_name: string | null
          persistant_account_id: string
          remote_id: string
          subtype: Database["public"]["Enums"]["bank_account_sub_types"] | null
          type: Database["public"]["Enums"]["bank_account_types"]
          unofficial_currency_code: string | null
          updated_at: string | null
          verification_name: string
          verification_status: Database["public"]["Enums"]["bank_account_verification_statuses"]
        }
        Insert: {
          available_balance?: number | null
          balance_last_updated_at?: string | null
          created_at?: string
          current_balance?: number | null
          holder_category?:
            | Database["public"]["Enums"]["bank_account_holder_categories"]
            | null
          id?: number
          iso_currency_code?: string | null
          limit_amount?: number | null
          linked_account_id: number
          mask?: string | null
          name: string
          official_name?: string | null
          persistant_account_id: string
          remote_id: string
          subtype?: Database["public"]["Enums"]["bank_account_sub_types"] | null
          type: Database["public"]["Enums"]["bank_account_types"]
          unofficial_currency_code?: string | null
          updated_at?: string | null
          verification_name: string
          verification_status: Database["public"]["Enums"]["bank_account_verification_statuses"]
        }
        Update: {
          available_balance?: number | null
          balance_last_updated_at?: string | null
          created_at?: string
          current_balance?: number | null
          holder_category?:
            | Database["public"]["Enums"]["bank_account_holder_categories"]
            | null
          id?: number
          iso_currency_code?: string | null
          limit_amount?: number | null
          linked_account_id?: number
          mask?: string | null
          name?: string
          official_name?: string | null
          persistant_account_id?: string
          remote_id?: string
          subtype?: Database["public"]["Enums"]["bank_account_sub_types"] | null
          type?: Database["public"]["Enums"]["bank_account_types"]
          unofficial_currency_code?: string | null
          updated_at?: string | null
          verification_name?: string
          verification_status?: Database["public"]["Enums"]["bank_account_verification_statuses"]
        }
        Relationships: [
          {
            foreignKeyName: "plaid_bank_accounts_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: false
            referencedRelation: "linked_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_transactions: {
        Row: {
          account_owner: string | null
          amount: number
          authorized_date: string | null
          authorized_datetime: string | null
          check_number: string | null
          counterparties: Json | null
          created_at: string
          date: string
          id: number
          iso_currency_code: string | null
          location_address: string | null
          location_city: string | null
          location_country: string | null
          location_lat: number | null
          location_lon: number | null
          location_postal_code: string | null
          location_region: string | null
          location_store_number: string | null
          logo_url: string | null
          merchant_entity_id: string | null
          merchant_name: string | null
          name: string
          original_description: string | null
          payment_channel: Database["public"]["Enums"]["transaction_payment_channels"]
          payment_meta_by_order_of: string | null
          payment_meta_payee: string | null
          payment_meta_payer: string | null
          payment_meta_payment_method: string | null
          payment_meta_payment_processor: string | null
          payment_meta_ppd_id: string | null
          payment_meta_reference_number: string | null
          pending: boolean
          pending_transaction_id: string | null
          personal_finance_category_confidence_level:
            | Database["public"]["Enums"]["transaction_personal_finance_category_confidence_levels"]
            | null
          personal_finance_category_detailed: string | null
          personal_finance_category_icon_url: string
          personal_finance_category_primary: string | null
          plaid_bank_account_id: number
          posted_datetime: string | null
          transaction_code:
            | Database["public"]["Enums"]["transaction_codes"]
            | null
          transaction_id: string
          unofficial_currency_code: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          account_owner?: string | null
          amount: number
          authorized_date?: string | null
          authorized_datetime?: string | null
          check_number?: string | null
          counterparties?: Json | null
          created_at?: string
          date: string
          id?: number
          iso_currency_code?: string | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lon?: number | null
          location_postal_code?: string | null
          location_region?: string | null
          location_store_number?: string | null
          logo_url?: string | null
          merchant_entity_id?: string | null
          merchant_name?: string | null
          name: string
          original_description?: string | null
          payment_channel: Database["public"]["Enums"]["transaction_payment_channels"]
          payment_meta_by_order_of?: string | null
          payment_meta_payee?: string | null
          payment_meta_payer?: string | null
          payment_meta_payment_method?: string | null
          payment_meta_payment_processor?: string | null
          payment_meta_ppd_id?: string | null
          payment_meta_reference_number?: string | null
          pending: boolean
          pending_transaction_id?: string | null
          personal_finance_category_confidence_level?:
            | Database["public"]["Enums"]["transaction_personal_finance_category_confidence_levels"]
            | null
          personal_finance_category_detailed?: string | null
          personal_finance_category_icon_url: string
          personal_finance_category_primary?: string | null
          plaid_bank_account_id: number
          posted_datetime?: string | null
          transaction_code?:
            | Database["public"]["Enums"]["transaction_codes"]
            | null
          transaction_id: string
          unofficial_currency_code?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          account_owner?: string | null
          amount?: number
          authorized_date?: string | null
          authorized_datetime?: string | null
          check_number?: string | null
          counterparties?: Json | null
          created_at?: string
          date?: string
          id?: number
          iso_currency_code?: string | null
          location_address?: string | null
          location_city?: string | null
          location_country?: string | null
          location_lat?: number | null
          location_lon?: number | null
          location_postal_code?: string | null
          location_region?: string | null
          location_store_number?: string | null
          logo_url?: string | null
          merchant_entity_id?: string | null
          merchant_name?: string | null
          name?: string
          original_description?: string | null
          payment_channel?: Database["public"]["Enums"]["transaction_payment_channels"]
          payment_meta_by_order_of?: string | null
          payment_meta_payee?: string | null
          payment_meta_payer?: string | null
          payment_meta_payment_method?: string | null
          payment_meta_payment_processor?: string | null
          payment_meta_ppd_id?: string | null
          payment_meta_reference_number?: string | null
          pending?: boolean
          pending_transaction_id?: string | null
          personal_finance_category_confidence_level?:
            | Database["public"]["Enums"]["transaction_personal_finance_category_confidence_levels"]
            | null
          personal_finance_category_detailed?: string | null
          personal_finance_category_icon_url?: string
          personal_finance_category_primary?: string | null
          plaid_bank_account_id?: number
          posted_datetime?: string | null
          transaction_code?:
            | Database["public"]["Enums"]["transaction_codes"]
            | null
          transaction_id?: string
          unofficial_currency_code?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_plaid_bank_account_id_fkey"
            columns: ["plaid_bank_account_id"]
            isOneToOne: false
            referencedRelation: "plaid_bank_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_books_oauth_credentials: {
        Row: {
          access_token: string
          access_token_expiry: string
          created_at: string
          linked_account_id: number
          realm_id: string
          refresh_token: string
          refresh_token_expiry: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          access_token_expiry: string
          created_at?: string
          linked_account_id?: number
          realm_id: string
          refresh_token: string
          refresh_token_expiry: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          access_token_expiry?: string
          created_at?: string
          linked_account_id?: number
          realm_id?: string
          refresh_token?: string
          refresh_token_expiry?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_books_oauth_credentials_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: true
            referencedRelation: "linked_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_books_oauth_states: {
        Row: {
          auth_url: string
          expires_at: string
          linked_account_id: number
          redirect_url: string
          state: string
        }
        Insert: {
          auth_url: string
          expires_at: string
          linked_account_id?: number
          redirect_url: string
          state: string
        }
        Update: {
          auth_url?: string
          expires_at?: string
          linked_account_id?: number
          redirect_url?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_books_oauth_states_linked_account_id_fkey"
            columns: ["linked_account_id"]
            isOneToOne: true
            referencedRelation: "linked_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bank_account_holder_categories: "business" | "personal" | "unrecognized"
      bank_account_sub_types:
        | "401a"
        | "401k"
        | "403B"
        | "457b"
        | "529"
        | "auto"
        | "brokerage"
        | "business"
        | "cash isa"
        | "cash management"
        | "cd"
        | "checking"
        | "commercial"
        | "construction"
        | "consumer"
        | "credit card"
        | "crypto exchange"
        | "ebt"
        | "education savings account"
        | "fixed annuity"
        | "gic"
        | "health reimbursement arrangement"
        | "home equity"
        | "hsa"
        | "isa"
        | "ira"
        | "keogh"
        | "lif"
        | "life insurance"
        | "line of credit"
        | "lira"
        | "loan"
        | "lrif"
        | "lrsp"
        | "money market"
        | "mortgage"
        | "mutual fund"
        | "non-custodial wallet"
        | "non-taxable brokerage account"
        | "other"
        | "other insurance"
        | "other annuity"
        | "overdraft"
        | "paypal"
        | "payroll"
        | "pension"
        | "prepaid"
        | "prif"
        | "profit sharing plan"
        | "rdsp"
        | "resp"
        | "retirement"
        | "rlif"
        | "roth"
        | "roth 401k"
        | "rrif"
        | "rrsp"
        | "sarsep"
        | "savings"
        | "sep ira"
        | "simple ira"
        | "sipp"
        | "stock plan"
        | "student"
        | "thrift savings plan"
        | "tfsa"
        | "trust"
        | "ugma"
        | "utma"
        | "variable annuity"
      bank_account_types:
        | "investment"
        | "credit"
        | "depository"
        | "loan"
        | "brokerage"
        | "other"
      bank_account_verification_statuses:
        | "automatically_verified"
        | "pending_automatic_verification"
        | "pending_manual_verification"
        | "manually_verified"
        | "verification_expired"
        | "verification_failed"
        | "database_matched"
        | "database_insights_pass"
        | "database_insights_pass_with_caution"
        | "database_insights_fail"
      transaction_codes:
        | "adjustment"
        | "atm"
        | "bank charge"
        | "bill payment"
        | "cash"
        | "cashback"
        | "cheque"
        | "direct debit"
        | "interest"
        | "purchase"
        | "standing order"
        | "transfer"
      transaction_payment_channels: "online" | "in_store" | "other"
      transaction_personal_finance_category_confidence_levels:
        | "very_high"
        | "high"
        | "medium"
        | "low"
        | "unkown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

