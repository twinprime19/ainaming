import { createClient } from '@supabase/supabase-js';
import { BotName } from '../types';

const supabaseUrl = 'https://pqebiwsbpjtxxlkfssuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZWJpd3NicGp0eHhsa2Zzc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMjc5MzgsImV4cCI6MjA0ODcwMzkzOH0.YlA4t_IlIxys46_6g9H9INmV_SBvORVYFo_ONe1LM-M';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const loadNamesFromSupabase = async (): Promise<BotName[]> => {
  try {
    const { data, error } = await supabase
      .from('bot_names')
      .select('*')
      .order('votes', { ascending: false });

    if (error) {
      console.error('Error loading names:', error.message);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error loading names from Supabase:', error);
    return [];
  }
};

export const saveNameToSupabase = async (name: BotName): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bot_names')
      .insert([{
        id: name.id,
        text: name.text,
        votes: name.votes,
        submitter: name.submitter,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error saving name:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error saving name to Supabase:', error);
    return false;
  }
};

export const updateVoteInSupabase = async (id: string, votes: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bot_names')
      .update({ 
        votes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating vote:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating vote in Supabase:', error);
    return false;
  }
};