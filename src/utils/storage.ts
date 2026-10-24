import {
  User,
  WasteRecord,
  CanteenVoucher,
  DailyQuizResult,
  Badge,
  ForumPost,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BADGES,
  INITIAL_FORUM_POSTS,
} from '../data/mockData';

const KEYS = {
  CURRENT_USER: 'ecovox_current_user',
  USERS: 'ecovox_users',
  WASTE_RECORDS: 'ecovox_waste_records',
  CANTEEN_VOUCHERS: 'ecovox_canteen_vouchers',
  QUIZ_RESULTS: 'ecovox_quiz_results',
  BADGES: 'ecovox_badges',
  FORUM_POSTS: 'ecovox_forum_posts',
  ONBOARDING_SHOWN: 'ecovox_onboarding_shown',
  SIMULATED_DAY: 'ecovox_simulated_cycle_day',
  CURRENT_DATE: 'ecovox_simulated_current_date',
};

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load users from localStorage', err);
    return INITIAL_USERS;
  }
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse current user', err);
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    // Also sync in users list
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    saveUsers(users);
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
};

export const updateUserInStorage = (updatedUser: User) => {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === updatedUser.id);
  if (idx >= 0) {
    users[idx] = updatedUser;
    saveUsers(users);
  }
  const curr = getCurrentUser();
  if (curr && curr.id === updatedUser.id) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(updatedUser));
  }
};

export const getStoredWasteRecords = (): WasteRecord[] => {
  try {
    const raw = localStorage.getItem(KEYS.WASTE_RECORDS);
    if (!raw) {
      const initial: WasteRecord[] = [
        {
          id: 'waste_rec_1',
          studentId: 'user_murid_2',
          studentName: 'Aisyah Putri Maharani',
          studentNis: '202602',
          category: 'plastik',
          quantityKg: 1.2,
          canteenPointsAwarded: 10,
          badgePointsAwarded: 2,
          verifiedBy: 'Pak Joko Supriyanto',
          verifiedAt: 'Hari ini, 08:30 WIB',
          stationName: 'Smart Bin Gedung A Vokasi',
        },
      ];
      localStorage.setItem(KEYS.WASTE_RECORDS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveWasteRecords = (records: WasteRecord[]) => {
  localStorage.setItem(KEYS.WASTE_RECORDS, JSON.stringify(records));
};

export const getStoredCanteenVouchers = (): CanteenVoucher[] => {
  try {
    const raw = localStorage.getItem(KEYS.CANTEEN_VOUCHERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCanteenVouchers = (vouchers: CanteenVoucher[]) => {
  localStorage.setItem(KEYS.CANTEEN_VOUCHERS, JSON.stringify(vouchers));
};

export const getStoredQuizResults = (): DailyQuizResult[] => {
  try {
    const raw = localStorage.getItem(KEYS.QUIZ_RESULTS);
    if (!raw) {
      const today = getTodayDateString();
      const initial: DailyQuizResult[] = [
        {
          studentId: 'user_murid_2',
          studentName: 'Aisyah Putri Maharani',
          subjectId: 'matematika',
          subjectName: 'Matematika',
          date: today,
          score: 90,
          correctCount: 9,
          totalQuestions: 10,
          submittedAt: '07:45 WIB',
        },
        {
          studentId: 'user_murid_3',
          studentName: 'Rizky Pratama Wijaya',
          subjectId: 'matematika',
          subjectName: 'Matematika',
          date: today,
          score: 80,
          correctCount: 8,
          totalQuestions: 10,
          submittedAt: '08:15 WIB',
        },
        {
          studentId: 'user_murid_5',
          studentName: 'Farhan Malik Akbar',
          subjectId: 'matematika',
          subjectName: 'Matematika',
          date: today,
          score: 100,
          correctCount: 10,
          totalQuestions: 10,
          submittedAt: '06:50 WIB',
        },
      ];
      localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveQuizResults = (results: DailyQuizResult[]) => {
  localStorage.setItem(KEYS.QUIZ_RESULTS, JSON.stringify(results));
};

export const getStoredBadges = (): Badge[] => {
  try {
    const raw = localStorage.getItem(KEYS.BADGES);
    if (!raw) {
      localStorage.setItem(KEYS.BADGES, JSON.stringify(INITIAL_BADGES));
      return INITIAL_BADGES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BADGES;
  }
};

export const saveBadges = (badges: Badge[]) => {
  localStorage.setItem(KEYS.BADGES, JSON.stringify(badges));
};

export const getStoredForumPosts = (): ForumPost[] => {
  try {
    const raw = localStorage.getItem(KEYS.FORUM_POSTS);
    if (!raw) {
      localStorage.setItem(KEYS.FORUM_POSTS, JSON.stringify(INITIAL_FORUM_POSTS));
      return INITIAL_FORUM_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FORUM_POSTS;
  }
};

export const saveForumPosts = (posts: ForumPost[]) => {
  localStorage.setItem(KEYS.FORUM_POSTS, JSON.stringify(posts));
};

export const getHasSeenOnboarding = (userId: string): boolean => {
  try {
    const raw = localStorage.getItem(`${KEYS.ONBOARDING_SHOWN}_${userId}`);
    return raw === 'true';
  } catch {
    return false;
  }
};

export const setHasSeenOnboarding = (userId: string, seen: boolean) => {
  localStorage.setItem(`${KEYS.ONBOARDING_SHOWN}_${userId}`, seen ? 'true' : 'false');
};

export const getTodayDateString = (): string => {
  const customDate = localStorage.getItem(KEYS.CURRENT_DATE);
  if (customDate) return customDate;
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getCycleDay = (): number => {
  const stored = localStorage.getItem(KEYS.SIMULATED_DAY);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) return parsed;
  }
  return 1;
};

export const setCycleDay = (day: number) => {
  const normalized = ((day - 1) % 10) + 1;
  localStorage.setItem(KEYS.SIMULATED_DAY, normalized.toString());
};
