import React from 'react';
import { Sparkles, MessageCircle, X } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type MascotMood = 'waving' | 'proud' | 'thinking' | 'celebrating' | 'cheering';

interface CaptainCivicProps {
  mood?: MascotMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  subMessage?: string;
  onCloseMessage?: () => void;
  onClick?: () => void;
  className?: string;
  showSpeechBubble?: boolean;
}

export const CaptainCivic: React.FC<CaptainCivicProps> = ({
  mood = 'waving',
  size = 'md',
  message,
  subMessage,
  onCloseMessage,
  onClick,
  className = '',
  showSpeechBubble = true,
}) => {
  const sizeMap = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  };

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      {/* Interactive Mascot Avatar */}
      <div
        onClick={() => {
          soundManager.playButton();
          if (onClick) onClick();
        }}
        className={`relative ${sizeMap[size]} shrink-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 filter drop-shadow-xl animate-float select-none`}
        title="Kapten Sivik - Penjaga Cilik Pancasila"
      >
        <svg viewBox="0 0 140 140" className="w-full h-full">
          <defs>
            <radialGradient id="capeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe4c4" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Glowing Aura */}
          <circle cx="70" cy="70" r="62" fill="#38bdf8" opacity="0.15" className="animate-pulse" />

          {/* Billowing Red Superhero Cape */}
          <path
            d="M42,55 C22,75 20,115 32,130 C45,120 54,95 50,70 Z"
            fill="url(#capeGlow)"
          />
          <path
            d="M98,55 C118,75 120,115 108,130 C95,120 86,95 90,70 Z"
            fill="url(#capeGlow)"
          />

          {/* Body / School Uniform Vest */}
          <rect x="46" y="58" width="48" height="52" rx="14" fill="#1e293b" />
          <rect x="52" y="60" width="36" height="46" rx="8" fill="#ffffff" />
          {/* Red Tie / Garuda Scarf */}
          <polygon points="70,62 63,74 70,90 77,74" fill="#dc2626" />
          {/* Golden Pancasila Star Shield on Chest */}
          <circle cx="70" cy="94" r="11" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="1.5" />
          <polygon
            points="70,87 72.5,92 78,92.5 73.8,96 75.5,101 70,98 64.5,101 66.2,96 62,92.5 67.5,92"
            fill="#ffffff"
          />

          {/* Head */}
          <circle cx="70" cy="42" r="28" fill="url(#skinGradient)" stroke="#ea580c" strokeWidth="1.5" />

          {/* Friendly Rosy Cheeks */}
          <circle cx="52" cy="48" r="5" fill="#f87171" opacity="0.6" />
          <circle cx="88" cy="48" r="5" fill="#f87171" opacity="0.6" />

          {/* Cute Big Cartoon Eyes */}
          <circle cx="56" cy="40" r="5.5" fill="#0f172a" />
          <circle cx="84" cy="40" r="5.5" fill="#0f172a" />
          {/* Eye Sparkles */}
          <circle cx="58" cy="38" r="2" fill="#ffffff" />
          <circle cx="86" cy="38" r="2" fill="#ffffff" />
          <circle cx="54" cy="42" r="0.9" fill="#ffffff" />
          <circle cx="82" cy="42" r="0.9" fill="#ffffff" />

          {/* Eyebrows */}
          {mood === 'thinking' ? (
            <>
              <path d="M50,33 Q56,36 62,33" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M78,32 Q84,28 90,32" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M50,32 Q56,28 62,32" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M78,32 Q84,28 90,32" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Cheerful Smile */}
          {mood === 'celebrating' || mood === 'cheering' ? (
            <path
              d="M58,49 Q70,62 82,49 Z"
              fill="#dc2626"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M60,49 Q70,57 80,49"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* Cheerful Grade 4 Boy Hair */}
          <path
            d="M42,34 C42,16 60,10 70,10 C80,10 98,16 98,34 C95,24 85,20 70,20 C55,20 45,24 42,34 Z"
            fill="#451a03"
          />
          {/* Spiky energetic bangs */}
          <path d="M50,22 Q58,16 66,22 Q72,14 80,22 Q88,18 92,26" fill="#451a03" />

          {/* Hero Headband (Merah Putih / Red and White Hero Band) */}
          <path
            d="M44,28 Q70,22 96,28 L95,33 Q70,27 45,33 Z"
            fill="#ef4444"
          />
          <circle cx="70" cy="29" r="4.5" fill="url(#goldGradient)" stroke="#b45309" strokeWidth="1" />
          <polygon points="70,26 71.5,28.5 74,28.7 72,30.5 72.8,33 70,31.7 67.2,33 68,30.5 66,28.7 68.5,28.5" fill="#ffffff" />

          {/* Arms according to mood */}
          {mood === 'waving' && (
            <g className="animate-bounce origin-bottom">
              {/* Left hand waving */}
              <path d="M46,65 Q30,55 24,42 Q28,38 35,46 Q40,55 48,68 Z" fill="url(#skinGradient)" stroke="#ea580c" strokeWidth="1" />
              <circle cx="25" cy="40" r="6" fill="url(#skinGradient)" />
            </g>
          )}

          {mood === 'cheering' && (
            <g>
              {/* Both hands giving thumbs up */}
              <circle cx="36" cy="62" r="8" fill="url(#skinGradient)" />
              <rect x="32" y="52" width="6" height="10" rx="3" fill="url(#skinGradient)" />
              <circle cx="104" cy="62" r="8" fill="url(#skinGradient)" />
              <rect x="102" y="52" width="6" height="10" rx="3" fill="url(#skinGradient)" />
            </g>
          )}

          {mood === 'celebrating' && (
            <g>
              {/* Holding Golden Star Trophy */}
              <polygon
                points="112,24 116,34 126,35 118,42 121,52 112,46 103,52 106,42 98,35 108,34"
                fill="url(#goldGradient)"
                stroke="#b45309"
                strokeWidth="1.5"
                className="animate-spin origin-center"
              />
            </g>
          )}

          {mood === 'thinking' && (
            <g>
              {/* Hand on chin & lightbulb overhead */}
              <circle cx="68" cy="56" r="6" fill="url(#skinGradient)" />
              {/* Lightbulb */}
              <circle cx="108" cy="18" r="8" fill="#facc15" className="animate-pulse" />
              <rect x="106" y="26" width="4" height="4" fill="#94a3b8" />
            </g>
          )}

          {/* Sturdy Boots */}
          <rect x="50" y="108" width="16" height="12" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          <rect x="74" y="108" width="16" height="12" rx="4" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
          <rect x="48" y="116" width="20" height="5" rx="2.5" fill="#f8fafc" />
          <rect x="72" y="116" width="20" height="5" rx="2.5" fill="#f8fafc" />
        </svg>
      </div>

      {/* Speech Bubble Guide */}
      {showSpeechBubble && message && (
        <div className="relative max-w-sm sm:max-w-md bg-white border-3 border-amber-400 rounded-3xl p-4 shadow-xl text-slate-800 animate-pop-in">
          {/* Speech bubble pointer */}
          <div className="absolute top-6 -left-3 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-amber-400 border-b-8 border-b-transparent" />
          <div className="absolute top-6 -left-2 w-0 h-0 border-t-7 border-t-transparent border-r-11 border-r-white border-b-7 border-b-transparent" />

          {/* Mascot Header */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                Kapten Sivik (Penjaga Kelas 4)
              </span>
            </div>
            {onCloseMessage && (
              <button
                onClick={onCloseMessage}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                title="Tutup pesan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-sm font-bold text-slate-900 leading-snug">
            {message}
          </div>

          {subMessage && (
            <div className="mt-1.5 text-xs text-slate-600 leading-relaxed font-medium bg-amber-50/80 rounded-xl p-2 border border-amber-200/60">
              {subMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
