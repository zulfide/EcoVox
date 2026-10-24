export type UserRole = 'murid' | 'guru' | 'petugas';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  identifier: string; // NIS for student, NIP for teacher/officer
  className?: string;
  avatar?: string;
  streak: number;
  lastCompletedDate?: string; // YYYY-MM-DD
  streakRestoreAvailable: boolean; // 1x chance
  canteenPoints: number;
  wasteCanteenPointsEarned: number; // Max 50 from waste
  academicScore: number; // 0 to 20
  completedTasksToday: boolean;
  activeCycleDay: number; // 1 to 10
}

export type SubjectId =
  | 'matematika'
  | 'english'
  | 'bahasa_indonesia'
  | 'informatika'
  | 'produktif_kejuruan'
  | 'ppkn'
  | 'sejarah'
  | 'seni_budaya'
  | 'pjok'
  | 'kewirausahaan';

export interface Subject {
  id: SubjectId;
  name: string;
  dayIndex: number; // 1 to 10
  icon: string;
  description: string;
}

export type QuestionType = 'pg' | 'pg_kompleks';

export interface Question {
  id: number;
  type: QuestionType;
  prompt: string;
  options: { id: string; text: string }[];
  correctAnswers: string[]; // 1 item for PG, >= 2 items for PG Kompleks
  explanation: string;
}

export interface DailyQuizResult {
  studentId: string;
  studentName: string;
  subjectId: SubjectId;
  subjectName: string;
  date: string; // YYYY-MM-DD
  score: number; // e.g. 80/100
  correctCount: number;
  totalQuestions: number;
  submittedAt: string;
}

export interface CanteenItem {
  id: string;
  name: string;
  points: number;
  category: 'makanan' | 'minuman';
  description: string;
  image?: string;
  inStock: boolean;
}

export interface CanteenVoucher {
  id: string;
  voucherCode: string;
  studentId: string;
  studentName: string;
  itemId: string;
  itemName: string;
  pointsCost: number;
  createdAt: string;
  status: 'aktif' | 'selesai' | 'kedaluwarsa';
}

export interface WasteRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNis: string;
  category: 'plastik' | 'kertas' | 'kaleng' | 'organik';
  quantityKg: number;
  canteenPointsAwarded: number;
  badgePointsAwarded: number;
  verifiedBy: string; // Officer name
  verifiedAt: string;
  stationName: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  targetCount: number;
  currentCount: number;
  isUnlocked: boolean;
  requiresTeacherVerification?: boolean;
  verificationStatus?: 'belum' | 'menunggu' | 'disetujui' | 'ditolak';
  studentProof?: string;
  category: 'akademik' | 'sampah' | 'streak' | 'sosial';
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  subject: string;
  title: string;
  content: string;
  createdAt: string;
  answers: ForumAnswer[];
  likes: number;
}

export interface ForumAnswer {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  isTeacherVerified?: boolean;
}
