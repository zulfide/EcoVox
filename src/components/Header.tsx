import React from 'react';
import { User } from '../types';
import { Flame, Coins, Award, LogOut, HelpCircle, GraduationCap, Leaf } from 'lucide-react';

interface HeaderProps {
  user: User;
  activeMenu: string;
  onLogout: () => void;
  onOpenOnboarding: () => void;
  onOpenRestoreStreak: () => void;
  onNavigateToCanteen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeMenu,
  onLogout,
  onOpenOnboarding,
  onOpenRestoreStreak,
  onNavigateToCanteen,
}) => {
  const isWasteTheme = activeMenu === 'waste_scan';

  return (
    <header
      className={`h-16 px-4 md:px-6 flex items-center justify-between gap-4 border-b transition-colors duration-300 select-none ${
        isWasteTheme
          ? 'bg-slate-900 border-emerald-800/50 text-emerald-50'
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white transition-colors ${
            isWasteTheme
              ? 'bg-emerald-600 shadow-md shadow-emerald-600/20'
              : 'bg-cyan-600 shadow-md shadow-cyan-600/20'
          }`}
        >
          {isWasteTheme ? <Leaf className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-extrabold tracking-tight ${
                isWasteTheme ? 'text-emerald-400' : 'text-slate-900'
              }`}
            >
              EcoVox
            </span>
            <span
              className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                user.role === 'murid'
                  ? 'bg-cyan-100 text-cyan-800'
                  : user.role === 'guru'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {user.role === 'murid'
                ? 'Siswa'
                : user.role === 'guru'
                ? 'Guru'
                : 'Petugas Piket'}
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Middle Indicators (STRICTLY FOR MURID ONLY; HIDDEN FOR GURU & PETUGAS) */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {user.role === 'murid' && (
          <div className="flex items-center gap-2 md:gap-3">
            {/* Streak Counter with Restore Modal Trigger */}
            <button
              type="button"
              onClick={onOpenRestoreStreak}
              title="Klik untuk detail / pemulihan streak"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition active:scale-95 ${
                isWasteTheme
                  ? 'bg-emerald-950/80 text-orange-400 border border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="font-mono tabular-nums">{user.streak} Hari</span>
            </button>

            {/* Canteen Points */}
            <button
              type="button"
              onClick={onNavigateToCanteen}
              title="Poin Kantin Sehat - Klik untuk tukar menu"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition active:scale-95 ${
                isWasteTheme
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-mono tabular-nums">{user.canteenPoints} Poin</span>
            </button>

            {/* Academic Score */}
            <div
              title="Skor Nilai Akademik Tugas Harian"
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                isWasteTheme
                  ? 'bg-emerald-950/80 text-cyan-400 border border-emerald-800'
                  : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-mono tabular-nums">+{user.academicScore}/20 Skor</span>
            </div>
          </div>
        )}

        {/* For Guru & Petugas: Clean info badge instead of student stats */}
        {user.role !== 'murid' && (
          <div
            className={`hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-lg ${
              isWasteTheme
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <span>{user.name}</span>
            <span aria-hidden="true">&middot;</span>
            <span className="font-mono">{user.identifier}</span>
          </div>
        )}
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Si Voki Tutorial Guide Launcher */}
        <button
          type="button"
          onClick={onOpenOnboarding}
          title="Panduan Si Voki"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
            isWasteTheme
              ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-700/50'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">Panduan Voki</span>
        </button>

        {/* User Quick Info */}
        <div className="hidden lg:flex flex-col text-right">
          <span
            className={`text-xs font-bold truncate max-w-[140px] ${
              isWasteTheme ? 'text-emerald-100' : 'text-slate-900'
            }`}
          >
            {user.name}
          </span>
          <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
            {user.className || user.identifier}
          </span>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Keluar Akun"
          className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
            isWasteTheme
              ? 'text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 border border-rose-900/40'
              : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-200'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
