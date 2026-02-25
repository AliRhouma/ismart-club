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
      fiche_de_poste: {
        Row: {
          id: string
          job_title: string
          department: string
          reports_to: string
          status: string
          work_conditions: Json
          main_missions: Json
          required_skills: Json
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          job_title: string
          department?: string
          reports_to?: string
          status?: string
          work_conditions?: Json
          main_missions?: Json
          required_skills?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          job_title?: string
          department?: string
          reports_to?: string
          status?: string
          work_conditions?: Json
          main_missions?: Json
          required_skills?: Json
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
    }
  }
}

export interface FicheDePoste {
  id: string
  job_title: string
  department: string
  reports_to: string
  status: string
  work_conditions: string[]
  main_missions: string[]
  required_skills: string[]
  created_at: string
  updated_at: string
  created_by: string | null
}
