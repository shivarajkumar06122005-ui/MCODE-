export interface UserProfile {
  name: string;
  email: string;
  academicLevel: 'Undergraduate' | 'Postgraduate';
  department: string;
  avatarUrl?: string;
  tagline?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  type: 'read' | 'watch' | 'theory' | 'practice';
  completed: boolean;
  tokenReward: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface LevelItem {
  id: number;
  name: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
  progress: number;
  tasks: TaskItem[];
  quiz?: QuizQuestion;
  coords: { x: number; y: number }; // Percentage position on pathway illustration
}

export interface UnitItem {
  id: number;
  roman: string;
  title: string;
  subtitle: string;
  status: 'locked' | 'current' | 'completed';
  topics: string[];
  levels: LevelItem[];
  gatewayQuiz: {
    title: string;
    description: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
  coords: { angle: number; radius: number }; // Angle in degrees for radial constellation
}

export interface Course {
  id: string;
  code: string;
  title: string;
  instructor?: string;
  referenceBook: string;
  progress: number; // 0 - 100
  totalUnits: number;
  totalLevels: number;
  units: UnitItem[];
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'environment' | 'perk' | 'pet';
  description: string;
  price: number;
  image: string;
  equipped?: boolean;
  owned?: boolean;
}

export interface PetItem {
  id: string;
  name: string;
  title: string;
  description: string;
  quote?: string;
  image: string;
  price: number;
  owned: boolean;
  equipped: boolean;
  buff: string;
}

export interface StudyDay {
  date: string;
  minutes: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}
