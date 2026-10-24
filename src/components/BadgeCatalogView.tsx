import React, { useState } from 'react';
import { User, Badge } from '../types';
import {
  getStoredBadges,
  saveBadges,
  getStoredUsers,
  updateUserInStorage,
} from '../utils/storage';
import {
  Award,
  Flame,
  Recycle,
  Utensils,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Send,
  XCircle,
} from 'lucide-react';

interface BadgeCatalogViewProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

export const BadgeCatalogView: React.FC<BadgeCatalogViewProps> = ({
  user,
  onUserUpdated,
}) => {
  const isTeacher = user.role === 'guru';
  const [badges, setBadges] = useState<Badge[]>(getStoredBadges());
  const [claimModalBadge, setClaimModalBadge] = useState<Badge | null>(null);
  const [proofNote, setProofNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame':
        return <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />;
      case 'recycle':
        return <Recycle className="w-6 h-6 text-emerald-600" />;
      case 'utensils':
        return <Utensils className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-cyan-600" />;
    }
  };

  // Student requests teacher verification
  const handleRequestVerification = (badge: Badge) => {
    setClaimModalBadge(badge);
    setProofNote('');
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalBadge) return;

    const updated = badges.map((b) => {
      if (b.id === claimModalBadge.id) {
        return {
          ...b,
          verificationStatus: 'menunggu' as const,
          studentProof: proofNote.trim() || 'Siswa telah menyelesaikan pemilahan dan penimbangan di Smart Bin.',
        };
      }
      return b;
    });

    setBadges(updated);
    saveBadges(updated);
    setClaimModalBadge(null);
    setActionSuccess('Pengajuan verifikasi badge berhasil dikirim ke Bapak/Ibu Guru!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Teacher verifies badge
  const handleTeacherAction = (badgeId: string, approve: boolean) => {
    const updated = badges.map((b) => {
      if (b.id === badgeId) {
        return {
          ...b,
          verificationStatus: (approve ? 'disetujui' : 'ditolak') as any,
          isUnlocked: approve ? true : b.isUnlocked,
          currentCount: approve ? b.targetCount : b.currentCount,
        };
      }
      return b;
    });

    setBadges(updated);
    saveBadges(updated);
    setActionSuccess(
      approve
        ? 'Badge siswa berhasil disetujui (Approved)!'
        : 'Pengajuan badge siswa ditolak.'
    );
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-cyan-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3 border border-cyan-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Katalog Prestasi & Penilaian Vokasi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {isTeacher ? 'Verifikasi Badge & Prestasi Siswa' : 'Katalog Badge & Nilai Saya'}
          </h2>
          <p className="text-xs md:text-sm text-cyan-100/90 mt-1 max-w-xl leading-relaxed">
            {isTeacher
              ? 'Tinjau bukti kegiatan pemilahan sampah, konsistensi daily task, dan capaian vokasi siswa untuk memberikan verifikasi resmi.'
              : 'Kumpulkan lencana prestasi dari konsistensi belajar harian dan kontribusi menjaga kebersihan lingkungan sekolah.'}
          </p>
        </div>

        {/* Academic Score Pill strictly for student */}
        {!isTeacher && (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right shrink-0">
            <div className="text-xs text-cyan-200 font-medium">Skor Akademik Terkumpul</div>
            <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
              +{user.academicScore} / 20 Skor
            </div>
            <div className="text-[11px] text-cyan-200/80 mt-1">
              Dari Daily Task 10 Mapel
            </div>
          </div>
        )}
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Teacher Verification Queue Panel */}
      {isTeacher && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Daftar Pengajuan Badge Siswa (Perlu Verifikasi)</span>
            </h3>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {badges.filter((b) => b.verificationStatus === 'menunggu').length} Menunggu
            </span>
          </div>

          <div className="space-y-3">
            {badges
              .filter((b) => b.verificationStatus === 'menunggu')
              .map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{badge.title}</div>
                      <p className="text-xs text-slate-500 mb-1">{badge.description}</p>
                      {badge.studentProof && (
                        <div className="text-xs bg-white p-2 rounded-lg border border-slate-200 text-slate-700 italic">
                          "Catatan Siswa: {badge.studentProof}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTeacherAction(badge.id, false)}
                      className="px-3.5 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTeacherAction(badge.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      Setujui (Approve)
                    </button>
                  </div>
                </div>
              ))}

            {badges.filter((b) => b.verificationStatus === 'menunggu').length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                Tidak ada pengajuan verifikasi badge yang tertunda saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {badges.map((badge) => {
          const progressPercent = Math.min(
            100,
            Math.round((badge.currentCount / badge.targetCount) * 100)
          );

          return (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 border transition flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 shadow-inner">
                    {getBadgeIcon(badge.icon)}
                  </div>

                  <div>
                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Terbuka (Unlocked)</span>
                      </span>
                    ) : badge.verificationStatus === 'menunggu' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Menunggu Guru</span>
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">
                        Terkunci
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {badge.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5 font-medium">
                    <span className="text-slate-600">Progres Quest:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {badge.currentCount} / {badge.targetCount}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        badge.isUnlocked ? 'bg-emerald-500' : 'bg-cyan-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action for student if badge needs verification */}
              {!isTeacher && badge.requiresTeacherVerification && !badge.isUnlocked && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleRequestVerification(badge)}
                    className="w-full py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ajukan Verifikasi Guru</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Claim / Proof Submission Modal */}
      {claimModalBadge && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Pengajuan Verifikasi: {claimModalBadge.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Tuliskan catatan atau keterangan kegiatan pemilahan sampah Anda untuk diverifikasi guru.
            </p>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Siswa / Bukti Kegiatan:
                </label>
                <textarea
                  rows={3}
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="Contoh: Sudah menyetorkan 1 kg botol plastik di Smart Bin Gedung A bersama Pak Joko..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimModalBadge(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition"
                >
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
