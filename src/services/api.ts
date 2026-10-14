import { Course, PetItem, ShopItem, StudyDay, UserProfile } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'x-user-id': 'default_scholar',
  };
};

export const api = {
  // Auth & Profile
  async fetchMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async updateProfile(updates: Partial<UserProfile & { theme?: 'dark' | 'light' }>) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async completeOnboarding(data: { name: string; email: string; academicLevel: string; department: string }) {
    const res = await fetch(`${API_BASE}/auth/onboarding`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to complete onboarding');
    return res.json();
  },

  async syncWithServer(payload: {
    user?: Partial<UserProfile & { tokens?: number; streak?: number; theme?: 'dark' | 'light'; onboardingCompleted?: boolean }>;
    course?: Course;
    environments?: ShopItem[];
    pets?: PetItem[];
    scratchpad?: string;
  }) {
    const res = await fetch(`${API_BASE}/user/sync`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to sync with server');
    return res.json();
  },

  // Courses & Pathways
  async fetchCourses(): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/courses`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },

  async toggleTask(courseId: string, taskId: string, unitId: number, levelId: number) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ unitId, levelId }),
    });
    if (!res.ok) throw new Error('Failed to toggle task');
    return res.json();
  },

  async completeLevel(courseId: string, levelId: number, unitId: number) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/levels/${levelId}/complete`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ unitId }),
    });
    if (!res.ok) throw new Error('Failed to complete level');
    return res.json();
  },

  async submitGatewayQuiz(courseId: string, unitId: number, answers?: Record<number, number>) {
    const res = await fetch(`${API_BASE}/courses/${courseId}/units/${unitId}/gateway-quiz`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) throw new Error('Failed to submit gateway quiz');
    return res.json();
  },

  // Shop & Inventory
  async fetchShopCatalog(): Promise<{ tokens: number; environments: ShopItem[]; pets: PetItem[] }> {
    const res = await fetch(`${API_BASE}/shop/catalog`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch shop catalog');
    return res.json();
  },

  async purchaseItem(itemId: string, category: 'environment' | 'pet' | 'perk', price: number) {
    const res = await fetch(`${API_BASE}/shop/purchase`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ itemId, category, price }),
    });
    if (!res.ok) throw new Error('Failed to purchase item');
    return res.json();
  },

  async equipItem(itemId: string, category: 'environment' | 'pet') {
    const res = await fetch(`${API_BASE}/user/equip`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ itemId, category }),
    });
    if (!res.ok) throw new Error('Failed to equip item');
    return res.json();
  },

  // Focus & Study Activity
  async logFocusSession(minutes: number = 25) {
    const res = await fetch(`${API_BASE}/study/focus-session`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ minutes }),
    });
    if (!res.ok) throw new Error('Failed to log focus session');
    return res.json();
  },

  async fetchScratchpad(): Promise<{ scratchpad: string }> {
    const res = await fetch(`${API_BASE}/study/scratchpad`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch scratchpad');
    return res.json();
  },

  async saveScratchpad(scratchpad: string) {
    const res = await fetch(`${API_BASE}/study/scratchpad`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ scratchpad }),
    });
    if (!res.ok) throw new Error('Failed to save scratchpad');
    return res.json();
  },

  async fetchHeatmap(): Promise<StudyDay[]> {
    const res = await fetch(`${API_BASE}/study/heatmap`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch heatmap');
    return res.json();
  },

  // AI Perks
  async simplifyConcept(concept: string, context?: string): Promise<{ explanation: string }> {
    const res = await fetch(`${API_BASE}/ai/simplify-concept`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ concept, context }),
    });
    if (!res.ok) throw new Error('Failed to simplify concept');
    return res.json();
  },

  async exportLatex(theorem?: string): Promise<{ latex: string }> {
    const res = await fetch(`${API_BASE}/ai/latex-export`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ theorem }),
    });
    if (!res.ok) throw new Error('Failed to export LaTeX');
    return res.json();
  },

  async resetAll() {
    const res = await fetch(`${API_BASE}/user/reset`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to reset user');
    return res.json();
  },
};
