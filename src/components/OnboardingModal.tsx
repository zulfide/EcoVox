import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import mascotImg from '../assets/images/mascot_voki_1792747282621.jpg';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Halo Rek! Kenalkan, aku Si Voki!',
      subtitle: 'Maskot Pendidikan Vokasi SMK Surabaya',
      message:
        'Selamat datang di EcoVox! Aku bakal nemenin petualangan belajarmu di sekolah. Di sini, kamu bisa mengasah keahlian kejuruan sekaligus menjaga lingkungan sekolah tetap asri dan hijau.',
      highlight: 'Belajar Kejuruan + Lingkungan Sekolah Bersih',
    },
    {
      title: 'Daily Task Rotasi 10 Mapel & Api Streak',
      subtitle: 'Disiplin 1 Mapel Setiap Hari',
      message:
        'Setiap hari kamu HANYA BISA mengerjakan 1 mapel kejuruan yang terjadwal. Kerjakan 10 soal (5 Pilihan Ganda + 5 Pilihan Ganda Kompleks) untuk menjaga api Daily Streak (🔥) tetap menyala dan menambah skor akademik!',
      highlight: 'Kunci konsistensi harian: 1 hari, 1 mapel!',
    },
    {
      title: 'Pilah Sampah & Scan QR di Smart Bin',
      subtitle: 'Daur Ulang Nyata Bersama Petugas Piket',
      message:
        'Kumpulkan botol plastik, kertas, kardus, atau kaleng. Buka menu QR Saya di ponselmu, tunjukkan ke Petugas Piket di dekat Smart Bin untuk ditimbang. Poin kantin dan poin badge akan langsung masuk secara real-time!',
      highlight: 'Anti-curang: Verifikasi fisik langsung di tempat',
    },
    {
      title: 'Nikmati Menu Bergizi di Kantin Sehat',
      subtitle: 'Ubah Sampah Jadi Makanan Sehat',
      message:
        'Poin hasil pilah sampahmu bisa langsung ditukarkan dengan makanan dan minuman lezat di Kantin Sehat: Nasi Pecel, Nasi Campur, Air Mineral dingin, atau Es Teh segar!',
      highlight: 'Pola makan sehat untuk generasi vokasi unggul',
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          title="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot Header Banner */}
        <div className="bg-gradient-to-r from-cyan-600 to-sky-700 px-6 pt-6 pb-4 text-white relative">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/60 shadow-md shrink-0 bg-white">
              <img
                src={mascotImg}
                alt="Si Voki Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-100 text-xs font-semibold backdrop-blur-sm mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Panduan Interaktif</span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {current.title}
              </h3>
              <p className="text-xs text-cyan-100/90">{current.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Speech Bubble Body */}
        <div className="p-6">
          {/* Mascot Speech Bubble Container */}
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-4.5 mb-6 shadow-inner">
            <p className="text-sm text-slate-700 leading-relaxed font-normal mb-3">
              "{current.message}"
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-800 bg-cyan-100/80 px-3 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
              <span>{current.highlight}</span>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === step
                      ? 'w-7 bg-cyan-600'
                      : idx < step
                      ? 'w-3 bg-cyan-300'
                      : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-slate-400 font-mono">
              Langkah {step + 1} dari {steps.length}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-600 transition"
              >
                Lewati Panduan
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (isLast) {
                  onClose();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 ml-auto"
            >
              <span>{isLast ? 'Mulai Sekarang!' : 'Lanjut'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
