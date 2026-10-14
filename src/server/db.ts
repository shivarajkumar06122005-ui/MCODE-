import fs from 'fs';
import path from 'path';
import { Course, PetItem, ShopItem, StudyDay, UserProfile } from '../types';
import {
  DEFAULT_ENVIRONMENTS,
  DEFAULT_PETS,
  DEFAULT_USER,
  INITIAL_COURSE,
  generateStudyHeatmap,
} from '../data/defaultData';

export interface UserRecord extends UserProfile {
  id: string;
  tokens: number;
  streak: number;
  equippedEnvironmentId: string;
  equippedPetId: string;
  theme: 'dark' | 'light';
  scratchpad: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  id: string;
  userId: string;
  date: string;
  minutes: number;
  tokensEarned: number;
  type: 'focus_session' | 'task_completion' | 'quiz_completion';
  timestamp: string;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  reason: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: Record<string, UserRecord>;
  courses: Record<string, Course[]>; // keyed by userId
  environments: Record<string, ShopItem[]>; // keyed by userId
  pets: Record<string, PetItem[]>; // keyed by userId
  activities: ActivityRecord[];
  transactions: TransactionRecord[];
  heatmaps: Record<string, StudyDay[]>; // keyed by userId
  rewardClaims: string[]; // prevents duplicate rewards
}

const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadDatabase();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;

        return {
          ...parsed,
          users: parsed.users || {},
          courses: parsed.courses || {},
          environments: parsed.environments || {},
          pets: parsed.pets || {},
          activities: parsed.activities || [],
          transactions: parsed.transactions || [],
          heatmaps: parsed.heatmaps || {},
          rewardClaims: parsed.rewardClaims || [],
        } as DatabaseSchema;
      }
    } catch (err) {
      console.error('[DB] Failed to parse db.json, creating new database.', err);
    }
    return this.createInitialData();
  }

  private createInitialData(): DatabaseSchema {
    const defaultUserId = 'default_scholar';
    const initialUser: UserRecord = {
      ...DEFAULT_USER,
      id: defaultUserId,
      tokens: 245,
      streak: 5,
      equippedEnvironmentId: 'carrara_atrium',
      equippedPetId: 'frodo',
      theme: 'dark',
      scratchpad: 'Linear maps preserve linear combinations: T(av + bw) = aT(v) + bT(w).',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const schema: DatabaseSchema = {
      users: {
        [defaultUserId]: initialUser,
      },
      courses: {
        [defaultUserId]: [JSON.parse(JSON.stringify(INITIAL_COURSE))],
      },
      environments: {
        [defaultUserId]: JSON.parse(JSON.stringify(DEFAULT_ENVIRONMENTS)),
      },
      pets: {
        [defaultUserId]: JSON.parse(JSON.stringify(DEFAULT_PETS)),
      },
      activities: [],
      transactions: [
        {
          id: 'tx_init',
          userId: defaultUserId,
          amount: 245,
          type: 'credit',
          reason: 'Initial onboarding stipend',
          timestamp: new Date().toISOString(),
        },
      ],
      heatmaps: {
        [defaultUserId]: generateStudyHeatmap(),
      },
      rewardClaims: [],
    };

    this.saveData(schema);
    return schema;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      const target = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(target, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to save database to disk:', err);
    }
  }

  // --- User Operations ---
  public getUser(userId: string = 'default_scholar'): UserRecord {
    if (!this.data.users[userId]) {
      this.data.users[userId] = {
        ...DEFAULT_USER,
        id: userId,
        tokens: 245,
        streak: 5,
        equippedEnvironmentId: 'carrara_atrium',
        equippedPetId: 'frodo',
        theme: 'dark',
        scratchpad: 'Linear maps preserve linear combinations: T(av + bw) = aT(v) + bT(w).',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.data.courses[userId] = [JSON.parse(JSON.stringify(INITIAL_COURSE))];
      this.data.environments[userId] = JSON.parse(JSON.stringify(DEFAULT_ENVIRONMENTS));
      this.data.pets[userId] = JSON.parse(JSON.stringify(DEFAULT_PETS));
      this.data.heatmaps[userId] = generateStudyHeatmap();
      this.saveData();
    }
    return this.data.users[userId];
  }

  public updateUser(userId: string = 'default_scholar', updates: Partial<UserRecord>): UserRecord {
    const user = this.getUser(userId);
    const updated = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.data.users[userId] = updated;
    this.saveData();
    return updated;
  }

  public updateTokens(userId: string = 'default_scholar', delta: number, reason: string): { tokens: number; tx: TransactionRecord } {
    const user = this.getUser(userId);
    const nextTokens = Math.max(0, user.tokens + delta);
    user.tokens = nextTokens;
    user.updatedAt = new Date().toISOString();

    const tx: TransactionRecord = {
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      userId,
      amount: Math.abs(delta),
      type: delta >= 0 ? 'credit' : 'debit',
      reason,
      timestamp: new Date().toISOString(),
    };

    this.data.transactions.push(tx);
    this.saveData();
    return { tokens: nextTokens, tx };
  }

  // --- Courses Operations ---
  
  public claimRewardOnce(
    userId: string,
    rewardKey: string,
    amount: number,
    reason: string
  ): { awarded: boolean; tokens: number } {
    const user = this.getUser(userId);
    const claimKey = `${userId}:${rewardKey}`;

    if (this.data.rewardClaims.includes(claimKey)) {
      return { awarded: false, tokens: user.tokens };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Reward amount must be positive');
    }

    this.data.rewardClaims.push(claimKey);

    user.tokens += amount;
    user.updatedAt = new Date().toISOString();

    this.data.transactions.push({
      id: 'tx_' + Math.random().toString(36).substring(2, 9),
      userId,
      amount,
      type: 'credit',
      reason,
      timestamp: new Date().toISOString(),
    });

    this.saveData();

    return { awarded: true, tokens: user.tokens };
  }

  public getCourses(userId: string = 'default_scholar'): Course[] {
    this.getUser(userId); // ensure seeded
    return this.data.courses[userId] || [];
  }

  public getCourse(userId: string = 'default_scholar', courseId: string): Course | null {
    const courses = this.getCourses(userId);
    return courses.find((c) => c.id === courseId) || null;
  }

  public addCourse(userId: string = 'default_scholar', course: Course): Course {
    this.getUser(userId);
    if (!this.data.courses[userId]) {
      this.data.courses[userId] = [];
    }
    this.data.courses[userId].push(course);
    this.saveData();
    return course;
  }

  public updateCourse(userId: string = 'default_scholar', updatedCourse: Course): Course {
    this.getUser(userId);
    const courses = this.data.courses[userId] || [];
    const idx = courses.findIndex((c) => c.id === updatedCourse.id);
    if (idx !== -1) {
      courses[idx] = updatedCourse;
    } else {
      courses.push(updatedCourse);
    }
    this.data.courses[userId] = courses;
    this.saveData();
    return updatedCourse;
  }

  // --- Environments & Pets Operations ---
  public getEnvironments(userId: string = 'default_scholar'): ShopItem[] {
    this.getUser(userId);
    return this.data.environments[userId] || DEFAULT_ENVIRONMENTS;
  }

  public setEnvironments(userId: string = 'default_scholar', items: ShopItem[]) {
    this.data.environments[userId] = items;
    this.saveData();
  }

  public getPets(userId: string = 'default_scholar'): PetItem[] {
    this.getUser(userId);
    return this.data.pets[userId] || DEFAULT_PETS;
  }

  public setPets(userId: string = 'default_scholar', pets: PetItem[]) {
    this.data.pets[userId] = pets;
    this.saveData();
  }

  // --- Activities & Heatmap ---
  public logActivity(userId: string = 'default_scholar', activity: Omit<ActivityRecord, 'id' | 'userId' | 'timestamp'>): ActivityRecord {
    const record: ActivityRecord = {
      ...activity,
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      userId,
      timestamp: new Date().toISOString(),
    };
    this.data.activities.push(record);

    // Update heatmap
    const heatmaps = this.data.heatmaps[userId] || generateStudyHeatmap();
    const todayStr = new Date().toISOString().split('T')[0];
    const dayItem = heatmaps.find((d) => d.date === todayStr);
    if (dayItem) {
      dayItem.minutes += activity.minutes;
      dayItem.intensity = Math.min(4, Math.floor(dayItem.minutes / 20) + 1) as 0 | 1 | 2 | 3 | 4;
    } else {
      heatmaps.push({
        date: todayStr,
        minutes: activity.minutes,
        intensity: 2,
      });
    }
    this.data.heatmaps[userId] = heatmaps;
    this.saveData();
    return record;
  }

  public getHeatmap(userId: string = 'default_scholar'): StudyDay[] {
    this.getUser(userId);
    return this.data.heatmaps[userId] || generateStudyHeatmap();
  }

  public resetUser(userId: string = 'default_scholar'): UserRecord {
    delete this.data.users[userId];
    delete this.data.courses[userId];
    delete this.data.environments[userId];
    delete this.data.pets[userId];
    delete this.data.heatmaps[userId];
    return this.getUser(userId);
  }
}

export const db = new DatabaseManager();
