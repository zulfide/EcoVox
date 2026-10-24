import React, { useState } from 'react';
import { Flame, ShieldAlert, Sparkles, X, Check } from 'lucide-react';
import { User } from '../types';

interface RestoreStreakModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onRestore: () => void;
}

export const RestoreStreakModal: React.FC<RestoreStreakModalProps> = ({
  isOpen,
  user,
  onClose,
  onRestore,
}) => {
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyRestore = () => {
    onRestore();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mb-3 border border-orange-200 shadow-inner">
            <Flame className="w-8 h-8 fill-orange-500 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Pemulihan Daily Streak
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Status Api Belajar Harian Siswa Vokasi
          </p>
        </div>

        {/* Current State Info */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Streak Saat Ini:</span>
            <span className="font-bold text-orange-600 font-mono text-base flex items-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              {user.streak} Hari
            </span>
          </div>

          <div className="flex items-center justify-between text-sm border-t border-slate-200/60 pt-2">
            <span className="text-slate-600">Sisa Kuota Pemulihan:</span>
            <span
              className={`font-semibold text-xs px-2.5 py-0.5 rounded-full ${
                user.streakRestoreAvailable
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {user.streakRestoreAvailable ? '1x Kesempatan' : 'Habis (0x)'}
            </span>
          </div>
        </div>

        {/* Explain Rule */}
        <div className="flex items-start gap-3 p-3 bg-cyan-50 border border-cyan-100 rounded-xl text-xs text-cyan-900 mb-6">
          <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Fitur Restore Streak memberikan <strong>1x kesempatan</strong> untuk menyalakan kembali api streak jika Anda terlewat 1 hari tidak mengerjakan Daily Task.
          </p>
        </div>

        {/* Action Button */}
        {success ? (
          <div className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Api Streak Berhasil Dipulihkan!</span>
          </div>
        ) : (
          <button
            type="button"
            disabled={!user.streakRestoreAvailable}
            onClick={handleApplyRestore}
            className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              user.streakRestoreAvailable
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {user.streakRestoreAvailable
                ? 'Gunakan Kuota Pulihkan Streak (+1 Hari)'
                : 'Kuota Pemulihan Sudah Digunakan'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
