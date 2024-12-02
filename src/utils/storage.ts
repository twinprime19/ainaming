import { BotName } from '../types';

const STORAGE_KEY = 'ai_bot_names_global';

export const loadNames = (): BotName[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error loading names from storage:', error);
    return [];
  }
};

export const saveNames = (names: BotName[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(names));
  } catch (error) {
    console.error('Error saving names to storage:', error);
  }
};

// Utility function to clear data for testing purposes
export const clearStoredNames = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing stored names:', error);
  }
};