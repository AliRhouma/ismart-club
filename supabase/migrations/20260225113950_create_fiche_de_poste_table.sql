/*
  # Create Fiche de Poste Table

  ## Overview
  This migration creates a table to store custom job position templates (Fiche de Poste)
  that users can create, save, and reuse across documents.

  ## New Tables
  
  ### `fiche_de_poste`
  Stores custom job position templates with all their details:
  - `id` (uuid, primary key) - Unique identifier for each fiche
  - `job_title` (text, required) - The job position title (e.g., "Directeur Technique")
  - `department` (text) - Department/service name
  - `reports_to` (text) - Position this role reports to
  - `status` (text) - Employment status (Active, Archived, etc.)
  - `work_conditions` (jsonb) - Array of work condition items
  - `main_missions` (jsonb) - Array of main mission/responsibility items
  - `required_skills` (jsonb) - Array of required skills and competencies
  - `created_at` (timestamptz) - When the fiche was created
  - `updated_at` (timestamptz) - When the fiche was last modified
  - `created_by` (uuid, nullable) - User who created the fiche (for future multi-user support)

  ## Security
  
  1. Row Level Security (RLS) is enabled
  2. Policies allow:
     - Anyone (including anonymous users) can read all fiches
     - Anyone can create new fiches
     - Anyone can update existing fiches
     - Anyone can delete fiches
  
  Note: Currently open access for simplicity. In a production multi-user environment,
  you would want to add authentication checks and ownership restrictions.

  ## Indexes
  
  - Index on `job_title` for faster searching
  - Index on `created_at` for chronological sorting
*/

-- Create the fiche_de_poste table
CREATE TABLE IF NOT EXISTS fiche_de_poste (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  department text DEFAULT '',
  reports_to text DEFAULT '',
  status text DEFAULT 'Active',
  work_conditions jsonb DEFAULT '[]'::jsonb,
  main_missions jsonb DEFAULT '[]'::jsonb,
  required_skills jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Enable Row Level Security
ALTER TABLE fiche_de_poste ENABLE ROW LEVEL SECURITY;

-- Create policies for open access (suitable for single-user or trusted environments)
CREATE POLICY "Anyone can view fiches"
  ON fiche_de_poste
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create fiches"
  ON fiche_de_poste
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update fiches"
  ON fiche_de_poste
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete fiches"
  ON fiche_de_poste
  FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_fiche_job_title ON fiche_de_poste(job_title);
CREATE INDEX IF NOT EXISTS idx_fiche_created_at ON fiche_de_poste(created_at DESC);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_fiche_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
DROP TRIGGER IF EXISTS set_fiche_updated_at ON fiche_de_poste;
CREATE TRIGGER set_fiche_updated_at
  BEFORE UPDATE ON fiche_de_poste
  FOR EACH ROW
  EXECUTE FUNCTION update_fiche_updated_at();