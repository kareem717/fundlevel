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
      companies: {
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
            foreignKeyName: "companies_owner_id_fkey"
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
          company_id: number
          created_at: string
          current_balance: number | null
          iso_currency_code: string | null
          mask: string | null
          name: string
          official_name: string | null
          remaining_remote_content: Json
          remote_id: string
          subtype: Database["public"]["Enums"]["plaid_account_subtype"] | null
          type: Database["public"]["Enums"]["plaid_account_type"]
          unofficial_currency_code: string | null
          updated_at: string | null
        }
        Insert: {
          available_balance?: number | null
          company_id: number
          created_at?: string
          current_balance?: number | null
          iso_currency_code?: string | null
          mask?: string | null
          name: string
          official_name?: string | null
          remaining_remote_content: Json
          remote_id: string
          subtype?: Database["public"]["Enums"]["plaid_account_subtype"] | null
          type: Database["public"]["Enums"]["plaid_account_type"]
          unofficial_currency_code?: string | null
          updated_at?: string | null
        }
        Update: {
          available_balance?: number | null
          company_id?: number
          created_at?: string
          current_balance?: number | null
          iso_currency_code?: string | null
          mask?: string | null
          name?: string
          official_name?: string | null
          remaining_remote_content?: Json
          remote_id?: string
          subtype?: Database["public"]["Enums"]["plaid_account_subtype"] | null
          type?: Database["public"]["Enums"]["plaid_account_type"]
          unofficial_currency_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_credentials: {
        Row: {
          access_token: string
          company_id: number
          created_at: string
          item_id: string
          transaction_cursor: string | null
          updated_at: string | null
        }
        Insert: {
          access_token: string
          company_id: number
          created_at?: string
          item_id: string
          transaction_cursor?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          company_id?: number
          created_at?: string
          item_id?: string
          transaction_cursor?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_credentials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      plaid_transactions: {
        Row: {
          bank_account_id: string | null
          company_id: number
          content: Json
          created_at: string
          id: number
          remote_id: string
          updated_at: string | null
        }
        Insert: {
          bank_account_id?: string | null
          company_id: number
          content: Json
          created_at?: string
          id?: number
          remote_id: string
          updated_at?: string | null
        }
        Update: {
          bank_account_id?: string | null
          company_id?: number
          content?: Json
          created_at?: string
          id?: number
          remote_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plaid_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "plaid_bank_accounts"
            referencedColumns: ["remote_id"]
          },
          {
            foreignKeyName: "plaid_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_books_invoices: {
        Row: {
          company_id: number
          content: Json
          created_at: string
          id: number
          remote_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          content: Json
          created_at?: string
          id?: number
          remote_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          content?: Json
          created_at?: string
          id?: number
          remote_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_books_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_books_oauth_credentials: {
        Row: {
          access_token: string
          access_token_expiry: string
          company_id: number
          created_at: string
          realm_id: string
          refresh_token: string
          refresh_token_expiry: string
          updated_at: string | null
        }
        Insert: {
          access_token: string
          access_token_expiry: string
          company_id?: number
          created_at?: string
          realm_id: string
          refresh_token: string
          refresh_token_expiry: string
          updated_at?: string | null
        }
        Update: {
          access_token?: string
          access_token_expiry?: string
          company_id?: number
          created_at?: string
          realm_id?: string
          refresh_token?: string
          refresh_token_expiry?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quick_books_oauth_credentials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_books_oauth_states: {
        Row: {
          auth_url: string
          company_id: number
          expires_at: string
          redirect_url: string
          state: string
        }
        Insert: {
          auth_url: string
          company_id?: number
          expires_at: string
          redirect_url: string
          state: string
        }
        Update: {
          auth_url?: string
          company_id?: number
          expires_at?: string
          redirect_url?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_books_oauth_states_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
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
      plaid_account_subtype:
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
      plaid_account_type:
        | "investment"
        | "credit"
        | "depository"
        | "loan"
        | "brokerage"
        | "other"
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

