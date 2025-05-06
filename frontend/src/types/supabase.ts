export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          created_at?: string
        }
      }
      trips: {
        Row: {
          id: string
          confirmation_id: string
          user_id: string
          trip_details: {
            destination: string
            nights: number
            startDate: string
            guestCount: number
          }
          campgrounds: {
            id: string
            price: number
            city: string
          }[]
          created_at: string
          status: 'planned' | 'active' | 'completed'
          guide_url?: string
        }
        Insert: {
          id: string
          confirmation_id: string
          user_id: string
          trip_details: {
            destination: string
            nights: number
            startDate: string
            guestCount: number
          }
          campgrounds: {
            id: string
            price: number
            city: string
          }[]
          created_at?: string
          status?: 'planned' | 'active' | 'completed'
          guide_url?: string
        }
        Update: {
          id?: string
          confirmation_id?: string
          user_id?: string
          trip_details?: {
            destination: string
            nights: number
            startDate: string
            guestCount: number
          }
          campgrounds?: {
            id: string
            price: number
            city: string
          }[]
          created_at?: string
          status?: 'planned' | 'active' | 'completed'
          guide_url?: string
        }
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
  }
} 