import { SavedCalculation } from '../types';

const STORAGE_KEY = 'hanwha_saved_executive_calculations';

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load saved calculations:', err);
    return [];
  }
}

export function saveCalculation(item: Omit<SavedCalculation, 'id' | 'createdAt'>): SavedCalculation {
  const current = getSavedCalculations();
  const newItem: SavedCalculation = {
    ...item,
    id: 'calc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };

  const updated = [newItem, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save calculation to localStorage:', err);
  }
  return newItem;
}

export function deleteSavedCalculation(id: string): SavedCalculation[] {
  const current = getSavedCalculations();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete calculation from localStorage:', err);
  }
  return updated;
}

export function clearAllSavedCalculations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear saved calculations from localStorage:', err);
  }
}
