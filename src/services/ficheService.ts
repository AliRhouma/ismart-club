import { supabase } from '../lib/supabase';
import type { FicheDePoste } from '../types/supabase';

export interface CreateFicheInput {
  job_title: string;
  department?: string;
  reports_to?: string;
  status?: string;
  work_conditions?: string[];
  main_missions?: string[];
  required_skills?: string[];
}

export interface UpdateFicheInput extends CreateFicheInput {
  id: string;
}

export const ficheService = {
  async getAll(): Promise<FicheDePoste[]> {
    const { data, error } = await supabase
      .from('fiche_de_poste')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching fiches:', error);
      throw new Error('Failed to fetch fiches');
    }

    return (data || []).map(row => ({
      ...row,
      work_conditions: (row.work_conditions as string[]) || [],
      main_missions: (row.main_missions as string[]) || [],
      required_skills: (row.required_skills as string[]) || [],
    }));
  },

  async getById(id: string): Promise<FicheDePoste | null> {
    const { data, error } = await supabase
      .from('fiche_de_poste')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching fiche:', error);
      throw new Error('Failed to fetch fiche');
    }

    if (!data) return null;

    return {
      ...data,
      work_conditions: (data.work_conditions as string[]) || [],
      main_missions: (data.main_missions as string[]) || [],
      required_skills: (data.required_skills as string[]) || [],
    };
  },

  async create(input: CreateFicheInput): Promise<FicheDePoste> {
    const { data, error } = await supabase
      .from('fiche_de_poste')
      .insert({
        job_title: input.job_title,
        department: input.department || '',
        reports_to: input.reports_to || '',
        status: input.status || 'Active',
        work_conditions: input.work_conditions || [],
        main_missions: input.main_missions || [],
        required_skills: input.required_skills || [],
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating fiche:', error);
      throw new Error('Failed to create fiche');
    }

    return {
      ...data,
      work_conditions: (data.work_conditions as string[]) || [],
      main_missions: (data.main_missions as string[]) || [],
      required_skills: (data.required_skills as string[]) || [],
    };
  },

  async update(input: UpdateFicheInput): Promise<FicheDePoste> {
    const { data, error } = await supabase
      .from('fiche_de_poste')
      .update({
        job_title: input.job_title,
        department: input.department || '',
        reports_to: input.reports_to || '',
        status: input.status || 'Active',
        work_conditions: input.work_conditions || [],
        main_missions: input.main_missions || [],
        required_skills: input.required_skills || [],
      })
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating fiche:', error);
      throw new Error('Failed to update fiche');
    }

    return {
      ...data,
      work_conditions: (data.work_conditions as string[]) || [],
      main_missions: (data.main_missions as string[]) || [],
      required_skills: (data.required_skills as string[]) || [],
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('fiche_de_poste')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting fiche:', error);
      throw new Error('Failed to delete fiche');
    }
  },

  async search(query: string): Promise<FicheDePoste[]> {
    const { data, error } = await supabase
      .from('fiche_de_poste')
      .select('*')
      .ilike('job_title', `%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching fiches:', error);
      throw new Error('Failed to search fiches');
    }

    return (data || []).map(row => ({
      ...row,
      work_conditions: (row.work_conditions as string[]) || [],
      main_missions: (row.main_missions as string[]) || [],
      required_skills: (row.required_skills as string[]) || [],
    }));
  },
};
