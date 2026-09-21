import React from 'react';
import { DefenderType, EnemyType } from '../types/game';

interface SpriteProps {
  type: DefenderType | EnemyType;
  isAttacking?: boolean;
  isHurt?: boolean;
  isSlowed?: boolean;
  isStunned?: boolean;
  className?: string;
}

export const DefenderSprite: React.FC<SpriteProps> = ({
  type,
  isAttacking,
  isHurt,
  className = 'w-12 h-12',
}) => {
  const hurtClass = isHurt ? 'filter brightness-150 contrast-125 translate-x-0.5' : '';
  const attackClass = isAttacking ? 'scale-110 -translate-y-0.5' : '';

  switch (type) {
    case 'discipline_defender':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Base Aura */}
            <circle cx="50" cy="50" r="44" fill="#065f46" opacity="0.3" />
            <circle cx="50" cy="50" r="38" fill="#10b981" />
            {/* Body / Uniform */}
            <rect x="34" y="44" width="32" height="36" rx="8" fill="#047857" />
            {/* Tie / Neat Collar */}
            <polygon points="50,46 44,56 50,70 56,56" fill="#fbbf24" />
            <polygon points="42,44 58,44 50,49" fill="#ffffff" />
            {/* Head */}
            <circle cx="50" cy="32" r="18" fill="#fde047" />
            {/* Cap */}
            <path d="M30,26 Q50,14 70,26 L66,32 Q50,22 34,32 Z" fill="#065f46" />
            <circle cx="50" cy="20" r="3" fill="#fbbf24" />
            {/* Eyes */}
            <circle cx="44" cy="33" r="3" fill="#1e293b" />
            <circle cx="56" cy="33" r="3" fill="#1e293b" />
            <circle cx="45" cy="32" r="1" fill="#ffffff" />
            <circle cx="57" cy="32" r="1" fill="#ffffff" />
            {/* Confident Smile */}
            <path d="M45,39 Q50,43 55,39" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Blaster Pencil Arm */}
            <g className={isAttacking ? 'translate-x-1.5' : ''}>
              <rect x="62" y="48" width="24" height="7" rx="3" fill="#f59e0b" transform="rotate(-5 62 48)" />
              <polygon points="86,47 95,50.5 86,54" fill="#f87171" />
              <polygon points="92,49.5 95,50.5 92,51.5" fill="#1e293b" />
            </g>
            {/* Stopwatch Badge */}
            <circle cx="36" cy="62" r="9" fill="#ffffff" stroke="#047857" strokeWidth="2" />
            <circle cx="36" cy="62" r="7" fill="#f8fafc" />
            <line x1="36" y1="62" x2="36" y2="58" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="36" y1="62" x2="40" y2="62" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'responsibility_guardian':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Massive Shield Body */}
            <rect x="22" y="24" width="56" height="64" rx="14" fill="#b45309" />
            <rect x="26" y="28" width="48" height="56" rx="10" fill="#f59e0b" />
            {/* Shield Plate Cross */}
            <rect x="46" y="34" width="8" height="44" fill="#fef3c7" />
            <rect x="32" y="48" width="36" height="8" fill="#fef3c7" />
            {/* Head peeking */}
            <circle cx="50" cy="22" r="14" fill="#fed7aa" />
            {/* Helmet */}
            <path d="M36,18 Q50,8 64,18 L62,26 Q50,20 38,26 Z" fill="#78350f" />
            {/* Determined Eyes */}
            <circle cx="45" cy="22" r="2.5" fill="#1e293b" />
            <circle cx="55" cy="22" r="2.5" fill="#1e293b" />
            {/* Accountability Checkmark Badge */}
            <circle cx="50" cy="52" r="11" fill="#10b981" />
            <path d="M44,52 L48,56 L56,48" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Sturdy Boots */}
            <rect x="30" y="84" width="16" height="8" rx="4" fill="#78350f" />
            <rect x="54" y="84" width="16" height="8" rx="4" fill="#78350f" />
          </svg>
        </div>
      );

    case 'cleanliness_ranger':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Clean Aura */}
            <circle cx="50" cy="50" r="42" fill="#0891b2" opacity="0.3" />
            <circle cx="50" cy="50" r="36" fill="#06b6d4" />
            {/* Apron / Gear */}
            <rect x="34" y="44" width="32" height="36" rx="6" fill="#0284c7" />
            {/* Head */}
            <circle cx="50" cy="30" r="16" fill="#ffedd5" />
            {/* Bandana */}
            <path d="M34,24 Q50,18 66,24 L64,28 Q50,24 36,28 Z" fill="#38bdf8" />
            {/* Clean Visor */}
            <rect x="40" y="27" width="20" height="6" rx="3" fill="#bae6fd" opacity="0.9" />
            <circle cx="45" cy="30" r="2" fill="#0284c7" />
            <circle cx="55" cy="30" r="2" fill="#0284c7" />
            {/* Water Spray Nozzle */}
            <g className={isAttacking ? 'translate-x-2' : ''}>
              <rect x="56" y="52" width="28" height="6" rx="2" fill="#64748b" />
              <polygon points="84,49 92,55 84,61" fill="#0284c7" />
              {/* Soap bubbles emitted */}
              <circle cx="92" cy="52" r="3.5" fill="#a5f3fc" opacity="0.8" />
              <circle cx="97" cy="56" r="2" fill="#e0f2fe" opacity="0.9" />
            </g>
            {/* Broom on back */}
            <line x1="28" y1="28" x2="38" y2="76" stroke="#92400e" strokeWidth="4" strokeLinecap="round" />
            <polygon points="22,22 34,24 30,34 18,32" fill="#fbbf24" />
          </svg>
        </div>
      );

    case 'respect_protector':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Respect Halo Ring */}
            <ellipse cx="50" cy="14" rx="22" ry="6" fill="none" stroke="#a5b4fc" strokeWidth="3" />
            {/* Body Robe */}
            <path d="M32,46 Q50,38 68,46 L72,82 Q50,88 28,82 Z" fill="#4f46e5" />
            {/* Head with respectful bow */}
            <circle cx="50" cy="30" r="16" fill="#fde68a" />
            {/* Polite closed smiling eyes */}
            <path d="M42,30 Q45,27 48,30" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M52,30 Q55,27 58,30" stroke="#312e81" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Warm gentle smile */}
            <path d="M46,36 Q50,40 54,36" stroke="#312e81" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Hands Clapped in Polite Greeting (Salam Santun) */}
            <ellipse cx="50" cy="54" rx="10" ry="12" fill="#fbbf24" />
            <path d="M46,50 Q50,44 54,50 L54,60 Q50,66 46,60 Z" fill="#f59e0b" />
            {/* Golden Heart Emblem */}
            <path d="M50,70 C44,64 36,68 36,74 C36,80 50,86 50,86 C50,86 64,80 64,74 C64,68 56,64 50,70 Z" fill="#f43f5e" />
          </svg>
        </div>
      );

    case 'queue_master':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Body in referee vest */}
            <rect x="32" y="42" width="36" height="38" rx="8" fill="#e11d48" />
            {/* White stripes on vest */}
            <line x1="40" y1="42" x2="40" y2="80" stroke="#ffffff" strokeWidth="3" />
            <line x1="60" y1="42" x2="60" y2="80" stroke="#ffffff" strokeWidth="3" />
            {/* Head */}
            <circle cx="50" cy="28" r="16" fill="#fed7aa" />
            {/* Cap */}
            <path d="M34,22 Q50,14 66,22 L72,25 Q50,22 34,25 Z" fill="#9f1239" />
            {/* Eyes focused */}
            <circle cx="44" cy="28" r="2.5" fill="#1e293b" />
            <circle cx="56" cy="28" r="2.5" fill="#1e293b" />
            {/* Whistle in mouth */}
            <rect x="48" y="32" width="8" height="4" fill="#94a3b8" />
            <circle cx="56" cy="34" r="3" fill="#cbd5e1" />
            {/* Hand holding Octagonal Stop Sign */}
            <g className={isAttacking ? '-translate-y-2' : ''}>
              <line x1="72" y1="40" x2="72" y2="76" stroke="#64748b" strokeWidth="4" />
              {/* Octagon */}
              <polygon points="64,30 80,30 88,38 88,54 80,62 64,62 56,54 56,38" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
              <text x="72" y="49" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">STOP</text>
            </g>
          </svg>
        </div>
      );

    case 'community_helper':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Radiant Sparkle Aura */}
            <circle cx="50" cy="50" r="44" fill="#a855f7" opacity="0.25" className="animate-pulse" />
            <circle cx="50" cy="50" r="36" fill="#c084fc" />
            {/* Friendly Volunteer Outfit */}
            <rect x="34" y="44" width="32" height="38" rx="8" fill="#7e22ce" />
            {/* Head with joyful smile */}
            <circle cx="50" cy="28" r="16" fill="#fef08a" />
            {/* Straw Hat / Sun Hat */}
            <ellipse cx="50" cy="18" rx="28" ry="8" fill="#d97706" />
            <ellipse cx="50" cy="16" rx="16" ry="6" fill="#b45309" />
            {/* Joyful Eyes */}
            <path d="M42,27 Q45,23 48,27" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M52,27 Q55,23 58,27" stroke="#3b0764" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="43" cy="32" r="3" fill="#f43f5e" opacity="0.5" />
            <circle cx="57" cy="32" r="3" fill="#f43f5e" opacity="0.5" />
            {/* Golden Star of Harmony */}
            <polygon points="50,48 53,56 61,56 55,61 57,69 50,64 43,69 45,61 39,56 47,56" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" className="animate-spin origin-center" style={{ transformOrigin: '50px 58px', animationDuration: '4s' }} />
          </svg>
        </div>
      );

    default:
      return <div className="w-10 h-10 rounded-full bg-slate-600" />;
  }
};

export const EnemySprite: React.FC<SpriteProps> = ({
  type,
  isAttacking,
  isHurt,
  isSlowed,
  isStunned,
  className = 'w-12 h-12',
}) => {
  const hurtClass = isHurt ? 'filter brightness-150 saturate-150 -translate-x-1' : '';
  const slowClass = isSlowed ? 'filter hue-rotate-180 opacity-90' : '';
  const stunClass = isStunned ? 'animate-bounce' : '';
  const attackClass = isAttacking ? 'scale-105' : '';

  switch (type) {
    case 'trash_monster':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Slime Trash Body */}
            <path d="M22,78 C18,60 26,42 38,34 C44,30 58,28 66,36 C76,44 82,62 78,78 C76,86 24,88 22,78 Z" fill="#65a30d" />
            {/* Muddy Trash Layers */}
            <circle cx="36" cy="66" r="10" fill="#4d7c0f" />
            <circle cx="62" cy="62" r="12" fill="#3f6212" />
            {/* Discarded crumpled plastic bottle */}
            <rect x="52" y="38" width="8" height="18" rx="3" fill="#38bdf8" opacity="0.8" transform="rotate(25 52 38)" />
            <rect x="54" y="34" width="4" height="4" fill="#0284c7" transform="rotate(25 54 34)" />
            {/* Fishbone */}
            <line x1="28" y1="46" x2="42" y2="40" stroke="#f1f5f9" strokeWidth="2" />
            <line x1="32" y1="41" x2="30" y2="47" stroke="#f1f5f9" strokeWidth="2" />
            <line x1="36" y1="39" x2="34" y2="45" stroke="#f1f5f9" strokeWidth="2" />
            {/* Googly Mean Eyes */}
            <circle cx="40" cy="46" r="6" fill="#facc15" />
            <circle cx="58" cy="48" r="7" fill="#facc15" />
            <circle cx="42" cy="46" r="3" fill="#1e293b" />
            <circle cx="60" cy="48" r="3.5" fill="#1e293b" />
            {/* Grumpy mouth with crooked tooth */}
            <path d="M38,62 Q48,56 60,62" stroke="#14532d" strokeWidth="3" strokeLinecap="round" fill="none" />
            <polygon points="46,59 50,59 48,65" fill="#ffffff" />
          </svg>
        </div>
      );

    case 'latecomer':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Sweating Panicked Runner */}
            {/* Body */}
            <rect x="34" y="42" width="30" height="34" rx="6" fill="#ea580c" />
            {/* Flying Necktie */}
            <path d="M48,46 L40,54 L30,50 L34,44 Z" fill="#fbbf24" />
            {/* Head tilted forward */}
            <circle cx="54" cy="28" r="16" fill="#fed7aa" />
            {/* Disheveled Messy Hair */}
            <path d="M38,24 Q48,8 68,18 Q72,28 66,32 Q58,16 42,26 Z" fill="#7c2d12" />
            {/* Shocked Eyes */}
            <ellipse cx="50" cy="28" rx="4" ry="5" fill="#ffffff" />
            <ellipse cx="60" cy="28" rx="4" ry="5" fill="#ffffff" />
            <circle cx="51" cy="28" r="2" fill="#1e293b" />
            <circle cx="61" cy="28" r="2" fill="#1e293b" />
            {/* Sweat Drops */}
            <circle cx="68" cy="20" r="3" fill="#38bdf8" />
            <circle cx="72" cy="28" r="2" fill="#38bdf8" />
            {/* Gasping mouth */}
            <ellipse cx="56" cy="37" rx="3.5" ry="5" fill="#7c2d12" />
            {/* Broken Late Alarm Clock in hand */}
            <circle cx="24" cy="54" r="12" fill="#f87171" stroke="#b91c1c" strokeWidth="2" />
            <circle cx="24" cy="54" r="9" fill="#ffffff" />
            <line x1="24" y1="54" x2="24" y2="48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="54" x2="28" y2="54" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
            {/* Legs in sprint */}
            <line x1="40" y1="76" x2="28" y2="90" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
            <line x1="56" y1="76" x2="68" y2="90" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'queue_breaker':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Sneaky sharp profile */}
            <path d="M30,44 L64,36 L68,76 L32,80 Z" fill="#db2777" />
            {/* Head */}
            <circle cx="56" cy="26" r="16" fill="#fbcfe8" />
            {/* Mask / Sneaky shades */}
            <rect x="42" y="24" width="26" height="8" rx="3" fill="#1e293b" />
            {/* Smirk */}
            <path d="M48,35 Q56,40 64,34" stroke="#831843" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Elbow Thrust / Cutting Sign */}
            <line x1="42" y1="54" x2="20" y2="44" stroke="#be185d" strokeWidth="6" strokeLinecap="round" />
            {/* "ME FIRST!" banner on chest */}
            <rect x="36" y="56" width="28" height="12" rx="3" fill="#fdf2f8" />
            <text x="50" y="65" fill="#be185d" fontSize="7" fontWeight="bold" textAnchor="middle">ME 1ST</text>
          </svg>
        </div>
      );

    case 'noise_maker':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Body */}
            <rect x="34" y="44" width="32" height="36" rx="8" fill="#ca8a04" />
            {/* Head shouting */}
            <circle cx="52" cy="28" r="16" fill="#fef08a" />
            {/* Giant Open Mouth */}
            <ellipse cx="58" cy="32" rx="7" ry="9" fill="#713f12" />
            <ellipse cx="58" cy="35" rx="4" ry="4" fill="#ef4444" />
            {/* Eyes squinting shut screaming */}
            <path d="M44,24 L50,26 L44,28" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Mega Megaphone in hand */}
            <polygon points="34,50 12,38 12,68 34,58" fill="#eab308" stroke="#a16207" strokeWidth="2" />
            <rect x="30" y="50" width="10" height="8" fill="#64748b" />
            {/* Sound blast waves */}
            <path d="M8,44 Q2,53 8,62" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M4,38 Q-4,53 4,68" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
          </svg>
        </div>
      );

    case 'rule_breaker':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Tough Leather Jacket */}
            <rect x="30" y="42" width="40" height="38" rx="8" fill="#dc2626" />
            <line x1="50" y1="42" x2="50" y2="80" stroke="#1e293b" strokeWidth="3" />
            {/* Head */}
            <circle cx="50" cy="26" r="16" fill="#fee2e2" />
            {/* Mohawk / Spiky Rebel Hair */}
            <polygon points="46,12 50,4 54,12 58,6 62,14" fill="#991b1b" />
            {/* Scowl Eyes */}
            <line x1="42" y1="23" x2="48" y2="26" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="58" y1="26" x2="52" y2="23" stroke="#7f1d1d" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="46" cy="27" r="2.5" fill="#1e293b" />
            <circle cx="54" cy="27" r="2.5" fill="#1e293b" />
            {/* Crossed Out Lawbook in arm */}
            <rect x="18" y="46" width="16" height="22" rx="2" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <line x1="18" y1="46" x2="34" y2="68" stroke="#ef4444" strokeWidth="3" />
            <line x1="34" y1="46" x2="18" y2="68" stroke="#ef4444" strokeWidth="3" />
          </svg>
        </div>
      );

    case 'facility_destroyer':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Heavy Bruiser Body */}
            <rect x="26" y="38" width="48" height="42" rx="10" fill="#991b1b" />
            {/* Paint Splatters on Body */}
            <circle cx="36" cy="50" r="5" fill="#38bdf8" />
            <circle cx="58" cy="62" r="7" fill="#eab308" />
            {/* Big Bald Tough Head */}
            <circle cx="50" cy="24" r="17" fill="#fca5a5" />
            {/* Angry Scar on Face */}
            <line x1="42" y1="16" x2="48" y2="24" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
            <circle cx="44" cy="24" r="3" fill="#1e293b" />
            <circle cx="56" cy="24" r="3" fill="#1e293b" />
            {/* Heavy Demolition Mallet in hand */}
            <g className={isAttacking ? 'rotate-12 origin-bottom' : ''}>
              <rect x="16" y="34" width="8" height="44" rx="2" fill="#78350f" transform="rotate(-15 16 34)" />
              <rect x="6" y="24" width="22" height="14" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="2" transform="rotate(-15 6 24)" />
            </g>
          </svg>
        </div>
      );

    case 'selfish_citizen':
      return (
        <div className={`relative transition-transform duration-100 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Large bulky shape */}
            <rect x="24" y="36" width="52" height="46" rx="12" fill="#7e22ce" />
            {/* Crossed Arms */}
            <ellipse cx="50" cy="58" rx="20" ry="8" fill="#581c87" />
            {/* Head looking away snubbed */}
            <circle cx="50" cy="24" r="16" fill="#e9d5ff" />
            {/* Turned head and nose in the air */}
            <polygon points="56,22 64,24 56,26" fill="#c084fc" />
            {/* Snobbish closed eye */}
            <line x1="42" y1="22" x2="48" y2="24" stroke="#581c87" strokeWidth="2" strokeLinecap="round" />
            {/* "NOT MY PROBLEM" emblem */}
            <circle cx="50" cy="70" r="7" fill="#a855f7" />
            <line x1="46" y1="70" x2="54" y2="70" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </div>
      );

    // BOSSES
    case 'home_boss':
    case 'school_boss':
    case 'community_boss':
    case 'king_of_disorder':
    case 'lord_of_chaos':
      return (
        <div className={`relative transition-transform duration-150 ${hurtClass} ${slowClass} ${stunClass} ${attackClass} ${className}`}>
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl animate-pulse-subtle">
            {/* Fiery Boss Aura */}
            <circle cx="60" cy="60" r="54" fill="#7f1d1d" opacity="0.4" />
            <circle cx="60" cy="60" r="46" fill="#450a0a" />
            {/* Spiky Obsidian Armor */}
            <path d="M30,50 L60,30 L90,50 L96,96 L24,96 Z" fill="#18181b" stroke="#ef4444" strokeWidth="3" />
            {/* Glowing Demonic Core */}
            <polygon points="60,54 72,70 60,86 48,70" fill="#dc2626" className="animate-pulse" />
            {/* Boss Horns / Crown of Disorder */}
            <polygon points="36,36 28,14 44,28" fill="#b91c1c" />
            <polygon points="84,36 92,14 76,28" fill="#b91c1c" />
            <polygon points="60,26 60,6 68,22" fill="#ef4444" />
            {/* Blazing Red Eyes */}
            <ellipse cx="48" cy="46" rx="6" ry="4" fill="#fef08a" />
            <ellipse cx="72" cy="46" rx="6" ry="4" fill="#fef08a" />
            <circle cx="48" cy="46" r="3" fill="#ef4444" />
            <circle cx="72" cy="46" r="3" fill="#ef4444" />
            {/* Jagged Fangs Mouth */}
            <path d="M44,66 Q60,76 76,66 L72,72 L66,68 L60,74 L54,68 L48,72 Z" fill="#ffffff" />
            {/* Crown of Chaos */}
            <polygon points="44,22 52,14 60,22 68,14 76,22 74,28 46,28" fill="#eab308" stroke="#b45309" strokeWidth="1.5" />
          </svg>
        </div>
      );

    default:
      return <div className="w-10 h-10 rounded-full bg-red-600" />;
  }
};
