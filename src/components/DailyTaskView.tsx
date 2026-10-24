import React, { useState } from 'react';
import { User, SubjectId, Question, DailyQuizResult } from '../types';
import { SUBJECTS, QUESTION_BANK } from '../data/mockData';
import {
  getStoredUsers,
  getStoredQuizResults,
  saveQuizResults,
  updateUserInStorage,
  getTodayDateString,
  getStoredBadges,
  saveBadges,
} from '../utils/storage';
import {
  Calendar,
  Lock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Award,
  RotateCw,
  Search,
  Filter,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DailyTaskViewProps {
  user: User;
  cycleDay: number;
  onAdvanceDay: () => void;
  onUserUpdated: (user: User) => void;
}

export const DailyTaskView: React.FC<DailyTaskViewProps> = ({
  user,
  cycleDay,
  onAdvanceDay,
  onUserUpdated,
}) => {
  const isTeacher = user.role === 'guru';
  const todaySubject = SUBJECTS[(cycleDay - 1) % SUBJECTS.length];
  const questions = QUESTION_BANK[todaySubject.id] || QUESTION_BANK['matematika'];

  // Student State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string[]>>({});
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentScore, setCurrentScore] = useState<DailyQuizResult | null>(null);

  // Teacher Monitoring State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'selesai' | 'belum'>('all');

  const allUsers = getStoredUsers().filter((u) => u.role === 'murid');
  const allQuizResults = getStoredQuizResults();

  // Handle single choice selection (PG)
  const handleSelectSingle = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
  };

  // Handle multiple choice selection (PG Kompleks)
  const handleToggleMultiple = (questionId: number, optionId: string) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return {
        ...prev,
        [questionId]: updated,
      };
    });
  };

  // Submit Quiz with Real-time Scoring
  const handleSubmitQuiz = () => {
    let correctCount = 0;

    questions.forEach((q) => {
      const userAns = selectedAnswers[q.id] || [];
      if (q.type === 'pg') {
        if (userAns.length === 1 && userAns[0] === q.correctAnswers[0]) {
          correctCount++;
        }
      } else {
        // PG Kompleks: must match all correct answers exactly
        const sortedUser = [...userAns].sort().join(',');
        const sortedCorrect = [...q.correctAnswers].sort().join(',');
        if (sortedUser === sortedCorrect) {
          correctCount++;
        }
      }
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const todayStr = getTodayDateString();

    const result: DailyQuizResult = {
      studentId: user.id,
      studentName: user.name,
      subjectId: todaySubject.id,
      subjectName: todaySubject.name,
      date: todayStr,
      score: scorePercentage,
      correctCount: correctCount,
      totalQuestions: questions.length,
      submittedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    // Calculate updated student stats
    const newStreak = user.streak + 1;
    // Academic score: +2 per correct answer, capped at 20 max
    const newAcademicScore = Math.min(20, user.academicScore + Math.round((correctCount / questions.length) * 4));

    const updatedUser: User = {
      ...user,
      streak: newStreak,
      academicScore: newAcademicScore,
      completedTasksToday: true,
      lastCompletedDate: todayStr,
    };

    // Save quiz result
    const results = getStoredQuizResults();
    results.unshift(result);
    saveQuizResults(results);

    // Update Badges Progress if applicable
    const badges = getStoredBadges();
    const streakBadge = badges.find((b) => b.id === 'badge_streak_pejuang');
    if (streakBadge) {
      streakBadge.currentCount = newStreak;
      if (newStreak >= streakBadge.targetCount) {
        streakBadge.isUnlocked = true;
      }
    }
    const masterBadge = badges.find((b) => b.id === 'badge_master_vokasi');
    if (masterBadge) {
      masterBadge.currentCount = Math.min(10, masterBadge.currentCount + 1);
      if (masterBadge.currentCount >= masterBadge.targetCount) {
        masterBadge.isUnlocked = true;
      }
    }
    saveBadges(badges);

    updateUserInStorage(updatedUser);
    onUserUpdated(updatedUser);

    setCurrentScore(result);
    setQuizSubmitted(true);
  };

  // TEACHER MONITORING VIEW
  if (isTeacher) {
    const filteredStudents = allUsers.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.identifier.includes(searchQuery);

      const hasCompleted = student.completedTasksToday;
      if (statusFilter === 'selesai') return matchesSearch && hasCompleted;
      if (statusFilter === 'belum') return matchesSearch && !hasCompleted;
      return matchesSearch;
    });

    const completedCount = allUsers.filter((u) => u.completedTasksToday).length;
    const completionPercent = allUsers.length > 0 ? Math.round((completedCount / allUsers.length) * 100) : 0;

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Teacher Header Banner */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Monitoring Guru &bull; Siklus Hari ke-{cycleDay}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Pemantauan Daily Task Siswa
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Mapel Hari Ini: <strong className="text-slate-800">{todaySubject.name}</strong> (Format: 5 PG + 5 PG Kompleks)
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div className="text-right">
                <div className="text-2xl font-extrabold text-blue-600 font-mono">
                  {completionPercent}%
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {completedCount} dari {allUsers.length} Siswa Selesai
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIS siswa..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({allUsers.length})
            </button>
            <button
              onClick={() => setStatusFilter('selesai')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'selesai'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sudah Selesai ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('belum')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                statusFilter === 'belum'
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Belum ({allUsers.length - completedCount})
            </button>
          </div>
        </div>

        {/* Monitoring Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">NIS & Nama Siswa</th>
                  <th className="px-5 py-3.5">Kelas</th>
                  <th className="px-5 py-3.5">Status Pengerjaan</th>
                  <th className="px-5 py-3.5">Skor / Nilai</th>
                  <th className="px-5 py-3.5">Api Streak</th>
                  <th className="px-5 py-3.5">Waktu Submit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const studentResult = allQuizResults.find(
                      (r) => r.studentId === student.id
                    );
                    const isDone = student.completedTasksToday;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            NIS: {student.identifier}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">
                          {student.className || 'XII Vokasi'}
                        </td>
                        <td className="px-5 py-3.5">
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Selesai</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Belum Mengerjakan</span>
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isDone && studentResult ? (
                            <div className="font-mono font-bold text-slate-900">
                              {studentResult.score}% ({studentResult.correctCount}/{studentResult.totalQuestions})
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-orange-600 font-semibold flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-orange-500" />
                            {student.streak} Hari
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">
                          {isDone && studentResult ? studentResult.submittedAt : '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // STUDENT VIEW: STRICT 1 MAPEL PER DAY RULE
  if (user.completedTasksToday || quizSubmitted) {
    const latestResult = currentScore || allQuizResults.find((r) => r.studentId === user.id);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Completed Screen Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-4 border border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Daily Task Hari Ini Telah Selesai!
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            Hebat, Anda telah menyelesaikan tugas <strong>{todaySubject.name}</strong> hari ini. Sistem telah mengunci mapel lain demi menjaga keteraturan rotasi belajar 1 hari 1 mapel.
          </p>

          {/* Result Highlights */}
          {latestResult && (
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 mb-1">Skor Tugas</div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {latestResult.score}%
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 mb-1">Jawaban Benar</div>
                <div className="text-xl font-bold text-emerald-600 font-mono">
                  {latestResult.correctCount}/{latestResult.totalQuestions}
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                <div className="text-xs text-slate-500 mb-1">Daily Streak</div>
                <div className="text-xl font-bold text-orange-600 font-mono flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  {user.streak} Hari
                </div>
              </div>
            </div>
          )}

          {/* Locked Notice */}
          <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 max-w-md mx-auto mb-6">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mapel lain terkunci otomatis. Kembali lagi besok untuk rotasi berikutnya.</span>
          </div>

          {/* Simulation Helper for Evaluators */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onAdvanceDay}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-slate-300"
              title="Simulasikan pergantian hari untuk menguji siklus rotasi mapel selanjutnya"
            >
              <RotateCw className="w-3.5 h-3.5 text-cyan-600" />
              <span>Simulasikan Hari Berikutnya (+1 Hari)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  if (isQuizActive) {
    const answeredCount = Object.keys(selectedAnswers).filter(
      (k) => (selectedAnswers[Number(k)] || []).length > 0
    ).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Sticky Header */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200 shadow-sm flex items-center justify-between sticky top-4 z-20">
          <div>
            <div className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
              Daily Task &bull; Hari ke-{cycleDay}
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {todaySubject.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700">
                {answeredCount} / {questions.length} Terjawab
              </span>
              <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-cyan-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={answeredCount < questions.length}
              className={`px-4 py-2 text-xs font-bold rounded-xl shadow-md transition ${
                answeredCount === questions.length
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Kirim Jawaban
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const isSingle = q.type === 'pg';
            const userSelected = selectedAnswers[q.id] || [];

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Soal {idx + 1} dari {questions.length}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isSingle
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {isSingle
                      ? 'Pilihan Ganda (1 Jawaban)'
                      : 'Pilihan Ganda Kompleks (Bisa > 1 Jawaban)'}
                  </span>
                </div>

                {/* Prompt */}
                <p className="text-sm font-medium text-slate-900 leading-relaxed mb-4 whitespace-pre-line">
                  {q.prompt}
                </p>

                {/* Options */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isChecked = userSelected.includes(opt.id);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          isSingle
                            ? handleSelectSingle(q.id, opt.id)
                            : handleToggleMultiple(q.id, opt.id)
                        }
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-start gap-3 ${
                          isChecked
                            ? 'bg-cyan-50/70 border-cyan-400 text-cyan-950 font-semibold'
                            : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 shrink-0 rounded flex items-center justify-center text-[11px] font-mono font-bold mt-0.5 transition ${
                            isChecked
                              ? 'bg-cyan-600 text-white'
                              : 'border border-slate-300 text-slate-500 bg-white'
                          } ${isSingle ? 'rounded-full' : 'rounded-md'}`}
                        >
                          {isChecked ? '✓' : opt.id}
                        </div>
                        <span className="leading-relaxed">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Submit Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Pastikan seluruh {questions.length} soal telah terjawab dengan teliti sebelum mengirim.
          </span>
          <button
            type="button"
            onClick={handleSubmitQuiz}
            disabled={answeredCount < questions.length}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition ${
              answeredCount === questions.length
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Kirim & Nilai Sekarang
          </button>
        </div>
      </div>
    );
  }

  // Pre-Quiz Introduction Screen (1 mapel ready to be taken)
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Subject Hero Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Siklus 10 Hari &bull; Hari ke-{cycleDay}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {todaySubject.name}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">
              {todaySubject.description}
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center min-w-[140px]">
            <div className="text-xs text-slate-500">Komposisi Soal</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono mt-0.5">
              10 Soal
            </div>
            <div className="text-[11px] text-cyan-700 font-semibold mt-1">
              5 PG + 5 PG Kompleks
            </div>
          </div>
        </div>

        {/* Anti-double & Rotation Warning */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1.5 mb-6">
          <div className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Aturan Ketat Rotasi Harian:</span>
          </div>
          <p className="leading-relaxed">
            Anda <strong>HANYA BISA mengerjakan 1 mapel per hari</strong>. Setelah tugas ini diselesaikan, mapel lain akan terkunci (*disabled*) hingga jadwal rotasi hari berikutnya.
          </p>
        </div>

        {/* Benefits list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
            <span>Menjaga api Daily Streak bertambah +1 Hari</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
            <Award className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>Menambah akumulasi Skor Nilai Akademik (+0/20)</span>
          </div>
        </div>

        {/* Start Button */}
        <button
          type="button"
          onClick={() => setIsQuizActive(true)}
          className="w-full py-3.5 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl text-sm transition shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <span>Mulai Kerjakan Daily Task ({todaySubject.name})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 10 Mapel Rotation Cycle Preview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Jadwal Siklus 10 Mapel Kejuruan
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SUBJECTS.map((sub, idx) => {
            const isToday = sub.id === todaySubject.id;
            return (
              <div
                key={sub.id}
                className={`p-2.5 rounded-xl border text-xs font-medium transition text-center ${
                  isToday
                    ? 'bg-cyan-50 border-cyan-400 text-cyan-900 font-bold shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5">Hari ke-{idx + 1}</div>
                <div className="truncate">{sub.name}</div>
                {isToday && (
                  <div className="mt-1 text-[10px] font-bold text-cyan-600 uppercase">
                    Aktif Hari Ini
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
