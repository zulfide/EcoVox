import React, { useState } from 'react';
import { User, WasteRecord } from '../types';
import {
  getStoredUsers,
  getStoredWasteRecords,
  saveWasteRecords,
  updateUserInStorage,
  getStoredBadges,
  saveBadges,
} from '../utils/storage';
import {
  ShieldCheck,
  QrCode,
  Scale,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  UserCheck,
} from 'lucide-react';

interface OfficerPortalViewProps {
  currentUser: User;
  onStudentUpdated?: (updatedStudent: User) => void;
}

export const OfficerPortalView: React.FC<OfficerPortalViewProps> = ({
  currentUser,
  onStudentUpdated,
}) => {
  const allStudents = getStoredUsers().filter((u) => u.role === 'murid');
  const [targetNis, setTargetNis] = useState(allStudents[0]?.identifier || '');
  const [category, setCategory] = useState<'plastik' | 'kertas' | 'kaleng' | 'organik'>('plastik');
  const [weightKg, setWeightKg] = useState('0.8');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedStudent = allStudents.find((s) => s.identifier === targetNis.trim());

  // Point rate definitions
  const RATES: Record<string, { canteenRate: number; label: string }> = {
    plastik: { canteenRate: 10, label: 'Botol Plastik PET' },
    kertas: { canteenRate: 8, label: 'Kardus & Kertas' },
    kaleng: { canteenRate: 12, label: 'Kaleng Logam' },
    organik: { canteenRate: 5, label: 'Sampah Organik Kompos' },
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!selectedStudent) {
      setFeedback({ type: 'error', message: 'Siswa dengan NIS tersebut tidak ditemukan.' });
      return;
    }

    const weightNum = parseFloat(weightKg);
    if (isNaN(weightNum) || weightNum <= 0) {
      setFeedback({ type: 'error', message: 'Masukkan berat/bobot sampah yang valid (kg).' });
      return;
    }

    // Calculate raw canteen points
    const calculatedCanteen = Math.round(weightNum * RATES[category].canteenRate);

    // Enforce 50 max points limit for student from waste
    const currentWastePoints = selectedStudent.wasteCanteenPointsEarned || 0;
    const remainingQuota = Math.max(0, 50 - currentWastePoints);

    if (remainingQuota <= 0) {
      setFeedback({
        type: 'error',
        message: `Siswa ${selectedStudent.name} telah mencapai batas maksimal 50 poin kantin dari sampah.`,
      });
      return;
    }

    const actualCanteenAwarded = Math.min(calculatedCanteen, remainingQuota);

    // Enforce badge points limit: Maximum 4 points per badge waste quest claim
    const badgePointsAwarded = Math.min(4, Math.max(1, Math.round(weightNum * 2)));

    // Create waste record
    const newRecord: WasteRecord = {
      id: `waste_${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentNis: selectedStudent.identifier,
      category: category,
      quantityKg: weightNum,
      canteenPointsAwarded: actualCanteenAwarded,
      badgePointsAwarded: badgePointsAwarded,
      verifiedBy: currentUser.name,
      verifiedAt: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      stationName: 'Smart Bin Gedung Vokasi',
    };

    // Update student stats
    const updatedStudent: User = {
      ...selectedStudent,
      canteenPoints: selectedStudent.canteenPoints + actualCanteenAwarded,
      wasteCanteenPointsEarned: currentWastePoints + actualCanteenAwarded,
    };

    updateUserInStorage(updatedStudent);
    if (onStudentUpdated) onStudentUpdated(updatedStudent);

    // Save waste record
    const records = getStoredWasteRecords();
    records.unshift(newRecord);
    saveWasteRecords(records);

    // Update Badge "Pahlawan Pilah Sampah"
    const badges = getStoredBadges();
    const wasteBadge = badges.find((b) => b.id === 'badge_waste_hero');
    if (wasteBadge) {
      wasteBadge.currentCount = Math.min(4, wasteBadge.currentCount + badgePointsAwarded);
      if (wasteBadge.currentCount >= wasteBadge.targetCount) {
        wasteBadge.isUnlocked = true;
      }
    }
    saveBadges(badges);

    setFeedback({
      type: 'success',
      message: `Berhasil memverifikasi! +${actualCanteenAwarded} Poin Kantin & +${badgePointsAwarded} Poin Badge disalurkan ke ${selectedStudent.name}.`,
    });
  };

  const records = getStoredWasteRecords();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal Petugas Piket & Bull; Stasiun Smart Bin</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Verifikasi & Validasi Fisik Sampah
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-lg">
            Petugas melakukan verifikasi fisik sampah yang dibawa siswa secara langsung di tempat, memastikan jenis sampah bersih, dan menyalurkan poin anti-curang.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right shrink-0">
          <div className="text-xs text-slate-400">Petugas Yang Bertugas</div>
          <div className="text-sm font-bold text-emerald-400">{currentUser.name}</div>
          <div className="text-[11px] text-slate-400 font-mono">{currentUser.identifier}</div>
        </div>
      </div>

      {/* Main Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Form Input Verifikasi Setoran</span>
          </h3>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Student Selector / NIS input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Siswa / Input NIS
              </label>
              <div className="flex gap-2">
                <select
                  value={targetNis}
                  onChange={(e) => setTargetNis(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {allStudents.map((s) => (
                    <option key={s.id} value={s.identifier}>
                      {s.name} (NIS: {s.identifier} - {s.className || 'XII Vokasi'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Student Card */}
            {selectedStudent && (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Siswa:</span>
                  <span className="font-bold text-slate-800">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Poin Kantin Saat Ini:</span>
                  <span className="font-bold font-mono text-emerald-700">
                    {selectedStudent.canteenPoints} Poin
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Poin Sampah Terkumpul:</span>
                  <span className="font-bold font-mono text-slate-700">
                    {selectedStudent.wasteCanteenPointsEarned} / 50 Poin Max
                  </span>
                </div>
              </div>
            )}

            {/* Waste Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Sampah Anorganik
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(RATES).map(([catKey, val]) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey as any)}
                    className={`p-3 rounded-xl border text-xs text-left transition ${
                      category === catKey
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="truncate">{val.label}</div>
                    <div className="text-[10px] text-emerald-700 font-mono font-semibold mt-0.5">
                      +{val.canteenRate} Poin / kg
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight / Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Berat Timbangan Hasil Pengukuran (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  kg
                </span>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verifikasi Fisik & Berikan Poin</span>
            </button>
          </form>
        </div>

        {/* Right: Operational Guidance & Limits */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Standar Pengawasan Anti-Curang</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>Pastikan botol plastik dalam kondisi kosong dan telah diremukkan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>Kardus dan kertas harus bersih dari minyak atau kontaminasi basah.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span><strong>Batas Poin Badge Sampah:</strong> Maksimal 4 poin per klaim quest.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span><strong>Batas Poin Kantin:</strong> Maksimal 50 poin per siswa dari sumber sampah.</span>
              </li>
            </ul>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/80">
            <div className="text-xs font-bold text-emerald-900 mb-1">
              Unit Smart Bin Terhubung
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed mb-3">
              Kamera sensor di area Smart Bin mendeteksi presensi siswa dan memvalidasi keaslian setoran bersama petugas piket.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sistem Pengawasan Berjalan Aktif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Verifications History Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Log Verifikasi Sampah Hari Ini</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Siswa</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Berat (kg)</th>
                <th className="px-4 py-3">Poin Kantin</th>
                <th className="px-4 py-3">Poin Badge</th>
                <th className="px-4 py-3">Petugas</th>
                <th className="px-4 py-3">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {records.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{r.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">NIS: {r.studentNis}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-700">{r.category}</td>
                  <td className="px-4 py-3 font-mono">{r.quantityKg} kg</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                    +{r.canteenPointsAwarded} Poin
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-cyan-700">
                    +{r.badgePointsAwarded} Pts
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.verifiedBy}</td>
                  <td className="px-4 py-3 text-slate-400 text-[11px] font-mono">{r.verifiedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
