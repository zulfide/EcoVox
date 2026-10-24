import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { getStoredUsers, setCurrentUser } from '../utils/storage';
import { GraduationCap, BookOpen, ShieldCheck, ArrowRight, UserCheck, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('murid');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const allUsers = getStoredUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Harap masukkan NIS atau NIP Anda.');
      return;
    }

    // Find user by identifier and role
    const matched = allUsers.find(
      (u) =>
        u.identifier.toLowerCase() === identifier.trim().toLowerCase() &&
        u.role === selectedRole
    );

    if (matched) {
      setCurrentUser(matched);
      onLoginSuccess(matched);
    } else {
      // If user doesn't exist, create a fresh user with 0 stats for murid
      const newUser: User = {
        id: `user_${selectedRole}_${Date.now()}`,
        role: selectedRole,
        name:
          selectedRole === 'murid'
            ? `Siswa (${identifier})`
            : selectedRole === 'guru'
            ? `Bapak/Ibu Guru (${identifier})`
            : `Petugas Piket (${identifier})`,
        identifier: identifier.trim(),
        className:
          selectedRole === 'murid'
            ? 'XII Vokasi Surabaya'
            : selectedRole === 'guru'
            ? 'Tenaga Pendidik Vokasi'
            : 'Petugas Piket Sekolah',
        streak: 0,
        streakRestoreAvailable: true,
        canteenPoints: 0,
        wasteCanteenPointsEarned: 0,
        academicScore: 0,
        completedTasksToday: false,
        activeCycleDay: 1,
      };
      setCurrentUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  const setDemoAccount = (role: UserRole, id: string) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword('demo123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Subtle Background Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-900 to-slate-950 pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/5">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            EcoVox
          </h1>
          <p className="text-sm text-slate-400 max-w-xs mx-auto">
            Portal Vokasi Berkelanjutan SMK Surabaya. Silakan masuk sesuai hak akses Anda.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-xl">
          {/* Role Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Pilih Peran Akun
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('murid');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  selectedRole === 'murid'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1" />
                <span>Murid</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('guru');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  selectedRole === 'guru'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4 mb-1" />
                <span>Guru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedRole('petugas');
                  setError(null);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all ${
                  selectedRole === 'petugas'
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1" />
                <span>Petugas</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {selectedRole === 'murid'
                  ? 'Nomor Induk Siswa (NIS)'
                  : 'Nomor Induk Pegawai (NIP)'}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  selectedRole === 'murid'
                    ? 'Contoh: 202601'
                    : selectedRole === 'guru'
                    ? 'Contoh: 19850312'
                    : 'Contoh: 19781204'
                }
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kata Sandi / PIN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.99]"
            >
              <span>Masuk ke Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Pilih Akun Demo Uji Coba:
              </span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setDemoAccount('murid', '202601')}
                className="w-full text-left px-3 py-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-cyan-300 group-hover:text-cyan-200">
                    Budi Santoso
                  </span>
                  <span className="text-slate-400"> (Murid - NIS: 202601)</span>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300" />
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('guru', '19850312')}
                className="w-full text-left px-3 py-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-emerald-300 group-hover:text-emerald-200">
                    Dra. Siti Rahma
                  </span>
                  <span className="text-slate-400"> (Guru - NIP: 19850312)</span>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-300" />
              </button>

              <button
                type="button"
                onClick={() => setDemoAccount('petugas', '19781204')}
                className="w-full text-left px-3 py-2 bg-slate-900/60 hover:bg-slate-700/60 border border-slate-700/50 rounded-lg text-xs text-slate-300 transition flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-amber-300 group-hover:text-amber-200">
                    Pak Joko Supriyanto
                  </span>
                  <span className="text-slate-400"> (Petugas Piket - NIP: 19781204)</span>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Sistem Terpadu Vokasi Berkelanjutan Kota Surabaya &middot; Versi 2026
        </div>
      </div>
    </div>
  );
};
