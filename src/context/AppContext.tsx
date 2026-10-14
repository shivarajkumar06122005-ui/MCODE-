import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  DEFAULT_ENVIRONMENTS,
  DEFAULT_PETS,
  DEFAULT_USER,
  INITIAL_COURSE,
  generateStudyHeatmap,
} from '../data/defaultData';
import { Course, PetItem, ShopItem, StudyDay, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { api } from '../services/api';

export type NavigationTab = 'home' | 'lessons' | 'shop' | 'pets' | 'profile';

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'token' | 'success' | 'info';
}

interface AppContextType {
  user: UserProfile;
  updateUser: (fields: Partial<UserProfile>) => void;
  tokens: number;
  addTokens: (amount: number, reason?: string) => void;
  spendTokens: (amount: number) => boolean;
  streak: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Onboarding
  onboardingCompleted: boolean;
  setOnboardingCompleted: (val: boolean) => void;
  
  // Environments & Pets
  environments: ShopItem[];
  equippedEnvironment: ShopItem;
  equipEnvironment: (id: string) => void;
  pets: PetItem[];
  equippedPet: PetItem;
  equipPet: (id: string) => void;
  buyShopItem: (item: ShopItem) => boolean;
  buyPet: (pet: PetItem) => boolean;

  // Courses & Lessons navigation
  course: Course;
  currentUnitId: number | null;
  currentLevelId: number | null;
  openCourse: (courseId: string) => void;
  openUnit: (unitId: number) => void;
  openLevel: (levelId: number) => void;
  closeLevel: () => void;
  backToUnits: () => void;
  backToCourses: () => void;

  // Tasks & Quizzes
  toggleTask: (unitId: number, levelId: number, taskId: string) => void;
  completeLevel: (unitId: number, levelId: number) => void;
  unlockNextUnit: (currentUnitId: number) => void;

  // Scratchpad
  scratchpad: string;
  setScratchpad: (notes: string) => void;

  // Heatmap
  heatmap: StudyDay[];

  // Timer
  timerSeconds: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;

  // Toasts
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'token' | 'success' | 'info') => void;
  removeToast: (id: string) => void;

  // Reset
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('corollary_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [tokens, setTokens] = useState<number>(() => {
    const saved = localStorage.getItem('corollary_tokens');
    return saved ? Number(saved) : 245;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('corollary_streak');
    return saved ? Number(saved) : 5;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('corollary_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const toggleTheme = () => {
    sound.playClick();
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    api.updateProfile({ theme: nextTheme }).catch(() => {});
  };

  useEffect(() => {
    localStorage.setItem('corollary_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [onboardingCompleted, setOnboardingCompletedState] = useState<boolean>(() => {
    const saved = localStorage.getItem('corollary_onboarded');
    return saved !== null ? saved === 'true' : true;
  });

  const [environments, setEnvironments] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem('corollary_environments');
    return saved ? JSON.parse(saved) : DEFAULT_ENVIRONMENTS;
  });

  const [pets, setPets] = useState<PetItem[]>(() => {
    const saved = localStorage.getItem('corollary_pets');
    return saved ? JSON.parse(saved) : DEFAULT_PETS;
  });

  const [course, setCourse] = useState<Course>(() => {
    const saved = localStorage.getItem('corollary_course');
    return saved ? JSON.parse(saved) : INITIAL_COURSE;
  });

  const [currentUnitId, setCurrentUnitId] = useState<number | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);

  const [scratchpad, setScratchpadState] = useState<string>(() => {
    return localStorage.getItem('corollary_scratchpad') || 'Linear maps preserve linear combinations: T(av + bw) = aT(v) + bT(w).';
  });

  const [heatmap, setHeatmap] = useState<StudyDay[]>(() => generateStudyHeatmap());

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Scratchpad save debounce
  const scratchpadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setScratchpad = (notes: string) => {
    setScratchpadState(notes);
    localStorage.setItem('corollary_scratchpad', notes);
    if (scratchpadTimeoutRef.current) clearTimeout(scratchpadTimeoutRef.current);
    scratchpadTimeoutRef.current = setTimeout(() => {
      api.saveScratchpad(notes).catch(() => {});
    }, 600);
  };

  // Sync with Backend Server on Initial Mount
  useEffect(() => {
    // Initial sync with backend server
    api.fetchMe()
      .then((u) => {
        if (u) {
          setUser({
            name: u.name,
            email: u.email,
            academicLevel: u.academicLevel,
            department: u.department,
            tagline: u.tagline,
          });
          setTokens(u.tokens);
          setStreak(u.streak);
          if (u.theme) setTheme(u.theme);
          if (u.scratchpad) setScratchpadState(u.scratchpad);
          if (typeof u.onboardingCompleted === 'boolean') {
            setOnboardingCompletedState(u.onboardingCompleted);
          }
        }
      })
      .catch(() => {
        // Hydrate backend if server restarted fresh
        api.syncWithServer({ user, course, environments, pets, scratchpad }).catch(() => {});
      });

    api.fetchCourses()
      .then((courses) => {
        if (courses && courses.length > 0) {
          setCourse(courses[0]);
        }
      })
      .catch(() => {});

    api.fetchShopCatalog()
      .then((cat) => {
        if (cat) {
          if (cat.environments) setEnvironments(cat.environments);
          if (cat.pets) setPets(cat.pets);
          if (typeof cat.tokens === 'number') setTokens(cat.tokens);
        }
      })
      .catch(() => {});

    api.fetchHeatmap()
      .then((hm) => {
        if (hm && hm.length > 0) setHeatmap(hm);
      })
      .catch(() => {});
  }, []);

  // Sync to local storage for instant offline fallback
  useEffect(() => { localStorage.setItem('corollary_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('corollary_tokens', String(tokens)); }, [tokens]);
  useEffect(() => { localStorage.setItem('corollary_streak', String(streak)); }, [streak]);
  useEffect(() => { localStorage.setItem('corollary_onboarded', String(onboardingCompleted)); }, [onboardingCompleted]);
  useEffect(() => { localStorage.setItem('corollary_environments', JSON.stringify(environments)); }, [environments]);
  useEffect(() => { localStorage.setItem('corollary_pets', JSON.stringify(pets)); }, [pets]);
  useEffect(() => { localStorage.setItem('corollary_course', JSON.stringify(course)); }, [course]);

  // Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            sound.playTimerBell();
            addToast('Focus Session Complete! +25 Tokens earned', 'token');
            addTokens(25);
            api.logFocusSession(25).then((res) => {
              if (res?.currentTokens) setTokens(res.currentTokens);
              if (res?.heatmap) setHeatmap(res.heatmap);
            }).catch(() => {});
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const addToast = (message: string, type: 'token' | 'success' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addTokens = (amount: number, reason?: string) => {
    sound.playTokenReward();
    setTokens((prev) => prev + amount);
    if (reason) {
      addToast(`+${amount} Tokens added!`, 'token');
    }
  };

  const spendTokens = (amount: number): boolean => {
    if (tokens < amount) return false;
    setTokens((prev) => prev - amount);
    sound.playClick();
    return true;
  };

  const equippedEnvironment =
    environments.find((e) => e.equipped) || environments[0];

  const equippedPet =
    pets.find((p) => p.equipped) || pets[0];

  const equipEnvironment = (id: string) => {
    setEnvironments((prev) =>
      prev.map((e) => ({
        ...e,
        equipped: e.id === id,
      }))
    );
    sound.playClick();
    addToast('Sanctuary environment equipped!', 'success');
    api.equipItem(id, 'environment').catch(() => {});
  };

  const equipPet = (id: string) => {
    setPets((prev) =>
      prev.map((p) => ({
        ...p,
        equipped: p.id === id,
      }))
    );
    sound.playClick();
    const pet = pets.find((p) => p.id === id);
    addToast(`${pet?.name || 'Pet'} is now keeping you company!`, 'success');
    api.equipItem(id, 'pet').catch(() => {});
  };

  const buyShopItem = (item: ShopItem): boolean => {
    if (tokens < item.price) {
      addToast('Not enough tokens yet. Complete lessons to earn more!', 'info');
      return false;
    }
    spendTokens(item.price);
    setEnvironments((prev) =>
      prev.map((e) => (e.id === item.id ? { ...e, owned: true, equipped: true } : { ...e, equipped: false }))
    );
    addToast('Purchase Successful', 'success');
    api.purchaseItem(item.id, 'environment', item.price).then((res) => {
      if (res?.currentTokens !== undefined) setTokens(res.currentTokens);
    }).catch(() => {});
    return true;
  };

  const buyPet = (pet: PetItem): boolean => {
    if (tokens < pet.price) {
      addToast('Not enough tokens yet. Complete lessons to earn more!', 'info');
      return false;
    }
    spendTokens(pet.price);
    setPets((prev) =>
      prev.map((p) => (p.id === pet.id ? { ...p, owned: true, equipped: true } : { ...p, equipped: false }))
    );
    addToast(`Purchase Successful! ${pet.name} is now your companion.`, 'success');
    api.purchaseItem(pet.id, 'pet', pet.price).then((res) => {
      if (res?.currentTokens !== undefined) setTokens(res.currentTokens);
    }).catch(() => {});
    return true;
  };

  const openCourse = (_courseId: string) => {
    setActiveTab('lessons');
    setCurrentUnitId(null);
    setCurrentLevelId(null);
    sound.playClick();
  };

  const openUnit = (unitId: number) => {
    setActiveTab('lessons');
    setCurrentUnitId(unitId);
    setCurrentLevelId(null);
    sound.playClick();
  };

  const openLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    sound.playClick();
  };

  const closeLevel = () => {
    setCurrentLevelId(null);
    sound.playClick();
  };

  const backToUnits = () => {
    setCurrentUnitId(null);
    setCurrentLevelId(null);
    sound.playClick();
  };

  const backToCourses = () => {
    setCurrentUnitId(null);
    setCurrentLevelId(null);
    sound.playClick();
  };

  const toggleTask = (unitId: number, levelId: number, taskId: string) => {
    setCourse((prevCourse) => {
      const updatedUnits = prevCourse.units.map((unit) => {
        if (unit.id !== unitId) return unit;

        const updatedLevels = unit.levels.map((level) => {
          if (level.id !== levelId) return level;

          let justCompleted = false;
          let rewardAmount = 10;

          const updatedTasks = level.tasks.map((task) => {
            if (task.id === taskId) {
              const nextState = !task.completed;
              if (nextState) {
                justCompleted = true;
                rewardAmount = task.tokenReward || 10;
              }
              return { ...task, completed: nextState };
            }
            return task;
          });

          const completedCount = updatedTasks.filter((t) => t.completed).length;
          const nextProgress = Math.round((completedCount / updatedTasks.length) * 100);

          if (justCompleted) {
            addTokens(rewardAmount, 'task');
          }

          return {
            ...level,
            tasks: updatedTasks,
            progress: nextProgress,
          };
        });

        return { ...unit, levels: updatedLevels };
      });

      return { ...prevCourse, units: updatedUnits };
    });

    // Synchronize to backend server
    api.toggleTask(course.id, taskId, unitId, levelId).then((res) => {
      if (res?.currentTokens !== undefined) setTokens(res.currentTokens);
      if (res?.course) setCourse(res.course);
    }).catch(() => {});
  };

  const completeLevel = (unitId: number, levelId: number) => {
    sound.playLevelComplete();
    addTokens(20, 'level');
    setCourse((prev) => {
      const updatedUnits = prev.units.map((u) => {
        if (u.id !== unitId) return u;
        const updatedLevels = u.levels.map((lvl) => {
          if (lvl.id === levelId) {
            return {
              ...lvl,
              status: 'completed' as const,
              progress: 100,
              tasks: lvl.tasks.map((t) => ({ ...t, completed: true })),
            };
          }
          if (lvl.id === levelId + 1 && lvl.status === 'locked') {
            return { ...lvl, status: 'unlocked' as const };
          }
          return lvl;
        });
        return { ...u, levels: updatedLevels };
      });
      return { ...prev, units: updatedUnits };
    });
    addToast('Level completed! +20 Tokens earned', 'success');

    api.completeLevel(course.id, levelId, unitId).then((res) => {
      if (res?.currentTokens !== undefined) setTokens(res.currentTokens);
      if (res?.course) setCourse(res.course);
    }).catch(() => {});
  };

  const unlockNextUnit = (unitId: number) => {
    sound.playLevelComplete();
    setCourse((prev) => {
      const updatedUnits = prev.units.map((u) => {
        if (u.id === unitId) {
          return { ...u, status: 'completed' as const };
        }
        if (u.id === unitId + 1) {
          return { ...u, status: 'current' as const };
        }
        return u;
      });
      return { ...prev, progress: Math.min(100, prev.progress + 20), units: updatedUnits };
    });
    addToast('Unit Unlocked! Unit II: Linear Transformations is ready', 'success');

    api.submitGatewayQuiz(course.id, unitId).then((res) => {
      if (res?.currentTokens !== undefined) setTokens(res.currentTokens);
      if (res?.course) setCourse(res.course);
    }).catch(() => {});
  };

  const startTimer = () => {
    sound.playClick();
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...fields }));
    api.updateProfile(fields).catch(() => {});
  };

  const setOnboardingCompleted = (val: boolean) => {
    setOnboardingCompletedState(val);
    localStorage.setItem('corollary_onboarded', String(val));
    if (val) {
      api.completeOnboarding({
        name: user.name,
        email: user.email,
        academicLevel: user.academicLevel,
        department: user.department,
      }).catch(() => {});
    }
  };

  const resetAll = () => {
    api.resetAll().catch(() => {});
    localStorage.clear();
    setUser(DEFAULT_USER);
    setTokens(245);
    setStreak(5);
    setEnvironments(DEFAULT_ENVIRONMENTS);
    setPets(DEFAULT_PETS);
    setCourse(INITIAL_COURSE);
    setCurrentUnitId(null);
    setCurrentLevelId(null);
    setActiveTab('home');
    setOnboardingCompleted(true);
    addToast('Application reset to initial demo state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        tokens,
        addTokens,
        spendTokens,
        streak,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        onboardingCompleted,
        setOnboardingCompleted,
        environments,
        equippedEnvironment,
        equipEnvironment,
        pets,
        equippedPet,
        equipPet,
        buyShopItem,
        buyPet,
        course,
        currentUnitId,
        currentLevelId,
        openCourse,
        openUnit,
        openLevel,
        closeLevel,
        backToUnits,
        backToCourses,
        toggleTask,
        completeLevel,
        unlockNextUnit,
        scratchpad,
        setScratchpad,
        heatmap,
        timerSeconds,
        isTimerRunning,
        startTimer,
        pauseTimer,
        resetTimer,
        toasts,
        addToast,
        removeToast,
        resetAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
