import React from 'react';
import { User } from '../types';
import { getStoredWasteRecords } from '../utils/storage';
import {
  QrCode,
  ShieldCheck,
  Trash2,
  AlertCircle,
  Clock,
  ArrowRight,
  Leaf,
  Sparkles,
} from 'lucide-react';

interface WasteScanViewProps {
  user: User;
  onNavigateToPortal: () => void;
}

export const WasteScanView: React.FC<WasteScanViewProps> = ({
  user,
  onNavigateToPortal,
}) => {
  const isOfficerOrTeacher = user.role === 'petugas' || user.role === 'guru';
  const allWasteRecords = getStoredWasteRecords();
  const studentRecords = allWasteRecords.filter((r) => r.studentId === user.id);

  // Dynamic token for QR
  const qrToken = `ECOVOX-VERIFY-${user.identifier}-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Dynamic Emerald Theme Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <Leaf className="w-3.5 h-3.5" />
            <span>Bank Sampah & Smart Bin Vokasi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Pemilahan Sampah Pintar
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
            Sistem terintegrasi anti-curang. Setorkan botol plastik, kertas, kardus, atau kaleng di unit Smart Bin sekolah dengan pengawasan langsung oleh Petugas Piket.
          </p>
        </div>

        {/* Ambient Leaf Glow */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: QR Code Display for Student */}
        {!isOfficerOrTeacher ? (
          <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
              <span>QR Identitas Siswa</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Tunjukkan QR Ini ke Petugas Piket
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs">
              Petugas akan memindai QR ini di dekat Smart Bin untuk memverifikasi fisik sampah yang Anda setorkan.
            </p>

            {/* Generated QR Code Canvas / Visual Block */}
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-400 shadow-md mb-4 relative group">
              {/* High Fidelity Stylized QR Code */}
              <div className="w-48 h-48 bg-slate-950 p-3 rounded-xl flex flex-col justify-between items-center text-white relative">
                {/* Simulated QR Pattern */}
                <div className="w-full flex justify-between">
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-xs" />
                  </div>
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-xs" />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center my-1 text-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center mb-1">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-300">
                    {user.identifier}
                  </span>
                </div>

                <div className="w-full flex justify-between">
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 bg-emerald-400 rounded-xs" />
                  </div>
                  <div className="w-10 h-10 grid grid-cols-2 gap-1 p-1">
                    <div className="bg-emerald-400 rounded-xs" />
                    <div className="bg-emerald-400 rounded-xs" />
                    <div className="bg-emerald-400 rounded-xs" />
                    <div className="bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>
            </div>

            {/* Token details */}
            <div className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-left space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Nama Siswa:</span>
                <span className="text-slate-800 font-bold font-sans">{user.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>NIS:</span>
                <span className="text-slate-800 font-bold">{user.identifier}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Kelas:</span>
                <span className="text-slate-800 font-sans">{user.className || 'XII Vokasi'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* For Officer / Teacher: Station Control Card */
          <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stasiun Petugas Piket</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Verifikasi Setoran Sampah Siswa
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Sebagai petugas, Anda dapat memindai atau memasukkan NIS siswa untuk menimbang sampah secara fisik dan memberikan poin real-time ke akun mereka.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-900 font-medium">Smart Bin Gedung A (Utama)</span>
                  <span className="font-bold text-emerald-700">Online &bull; Sensor Normal</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium">Smart Bin Bengkel Otomotif</span>
                  <span className="font-bold text-slate-600">Online &bull; Sensor Normal</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToPortal}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Buka Portal Petugas Piket Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right Column: Rules, Quota limits, and Anti-Cheat */}
        <div className="md:col-span-6 space-y-5">
          {/* Points Quota Card */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Batas Poin Sampah & Kantin</span>
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600">Poin Kantin dari Sampah:</span>
                  <span className="font-bold font-mono text-emerald-700">
                    {user.wasteCanteenPointsEarned} / 50 Poin Maksimal
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (user.wasteCanteenPointsEarned / 50) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Batas maksimal perolehan poin kantin dari sampah adalah 50 poin per siswa.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-xs text-emerald-900">
                <div className="font-bold mb-0.5">Batas Poin Badge Sampah:</div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Maksimal <strong>4 poin</strong> per klaim/quest badge sampah untuk mencegah kecurangan.
                </p>
              </div>
            </div>
          </div>

          {/* Anti-Cheat Workflow */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Alur Verifikasi Anti-Cheat</span>
            </h3>

            <ol className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>Siswa membawa sampah botol/kertas ke stasiun Smart Bin sekolah.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>Tunjukkan QR identitas di layar HP kepada Petugas Piket.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>Petugas memverifikasi fisik jenis sampah dan menimbang beratnya.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <span>Poin langsung masuk secara real-time ke akun siswa!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Waste Deposit History */}
      {!isOfficerOrTeacher && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Riwayat Setoran Sampah Terverifikasi</span>
          </h3>

          {studentRecords.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Belum ada riwayat setoran sampah. Bawa sampahmu ke Smart Bin hari ini!
            </div>
          ) : (
            <div className="space-y-2">
              {studentRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 capitalize">
                        {rec.category} ({rec.quantityKg} kg)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Diverifikasi oleh {rec.verifiedBy} &bull; {rec.verifiedAt}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold font-mono text-emerald-700">
                      +{rec.canteenPointsAwarded} Poin Kantin
                    </span>
                    <div className="text-[10px] text-slate-400">
                      +{rec.badgePointsAwarded} Poin Quest
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
