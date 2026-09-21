import React, { useState, useEffect } from 'react';
import { 
  LevelConfig, 
  CivicScores, 
  DefenderType, 
  Achievement, 
  ClassroomGroup 
} from './types/game';
import { LEVELS_CONFIG } from './data/levels';
import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { WorldMap } from './components/WorldMap';
import { Battlefield } from './components/Battlefield';
import { CivicInvestigationModal } from './components/CivicInvestigationModal';
import { ClassroomMultiplayer } from './components/ClassroomMultiplayer';
import { GuardianAcademy } from './components/GuardianAcademy';
import { AchievementsModal } from './components/AchievementsModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { MultiDeviceMabarModal } from './components/MultiDeviceMabarModal';
import { GameAudioControls } from './components/GameAudioControls';

type ActiveView = 'map' | 'battlefield' | 'investigation' | 'multiplayer';

export default function App() {
  // Persistence state loaders
  const [unlockedLevel, setUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('civic_unlocked_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [levelStars, setLevelStars] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('civic_level_stars');
    return saved ? JSON.parse(saved) : {};
  });

  const [civicStarsBalance, setCivicStarsBalance] = useState<number>(() => {
    const saved = localStorage.getItem('civic_stars_balance');
    return saved ? parseInt(saved, 10) : 5; // Starts with 5 stars bonus!
  });

  const [civicScores, setCivicScores] = useState<CivicScores>(() => {
    const saved = localStorage.getItem('civic_scores');
    return saved
      ? JSON.parse(saved)
      : {
          discipline: 100,
          responsibility: 80,
          respect: 80,
          cleanliness: 80,
          community: 80,
        };
  });

  const [defenderUpgrades, setDefenderUpgrades] = useState<Record<DefenderType, number>>(() => {
    const saved = localStorage.getItem('civic_defender_upgrades');
    return saved ? JSON.parse(saved) : {};
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('civic_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // Current View states
  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(LEVELS_CONFIG[0]);
  const [earnedStarsInLevel, setEarnedStarsInLevel] = useState<number>(1);
  const [activeClassroomGroup, setActiveClassroomGroup] = useState<ClassroomGroup | null>(null);

  // Modal Dialogs
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [isMultiDeviceMabarOpen, setIsMultiDeviceMabarOpen] = useState(false);

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('civic_unlocked_level', unlockedLevel.toString());
  }, [unlockedLevel]);

  useEffect(() => {
    localStorage.setItem('civic_level_stars', JSON.stringify(levelStars));
  }, [levelStars]);

  useEffect(() => {
    localStorage.setItem('civic_stars_balance', civicStarsBalance.toString());
  }, [civicStarsBalance]);

  useEffect(() => {
    localStorage.setItem('civic_scores', JSON.stringify(civicScores));
  }, [civicScores]);

  useEffect(() => {
    localStorage.setItem('civic_defender_upgrades', JSON.stringify(defenderUpgrades));
  }, [defenderUpgrades]);

  useEffect(() => {
    localStorage.setItem('civic_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Check achievements progress
  useEffect(() => {
    setAchievements((prev) => {
      let changed = false;
      const next = prev.map((ach) => {
        let newProgress = ach.progress;
        let isNowUnlocked = ach.unlocked;

        if (ach.id === 'home_hero') {
          newProgress = Math.min(5, unlockedLevel >= 5 ? 5 : unlockedLevel);
          if (newProgress >= 5) isNowUnlocked = true;
        } else if (ach.id === 'school_protector') {
          newProgress = Math.min(6, Math.max(0, unlockedLevel - 5));
          if (newProgress >= 6) isNowUnlocked = true;
        } else if (ach.id === 'community_defender') {
          newProgress = Math.min(6, Math.max(0, unlockedLevel - 11));
          if (newProgress >= 6) isNowUnlocked = true;
        } else if (ach.id === 'rule_guardian') {
          newProgress = civicScores.discipline + civicScores.responsibility;
          if (newProgress >= 500) isNowUnlocked = true;
        } else if (ach.id === 'legend_of_order') {
          newProgress = unlockedLevel >= 23 ? 1 : 0;
          if (newProgress >= 1) isNowUnlocked = true;
        }

        if (newProgress !== ach.progress || isNowUnlocked !== ach.unlocked) {
          changed = true;
          return { ...ach, progress: newProgress, unlocked: isNowUnlocked };
        }
        return ach;
      });

      return changed ? next : prev;
    });
  }, [unlockedLevel, civicScores]);

  // Launch a level
  const handleSelectLevel = (level: LevelConfig) => {
    setCurrentLevel(level);
    setActiveView('battlefield');
  };

  // Battlefield Victory Callback -> transition to investigation modal
  const handleBattlefieldComplete = (stars: number) => {
    setEarnedStarsInLevel(stars);
    setActiveView('investigation');
  };

  // Completed Civic Investigation Report Callback
  const handleInvestigationComplete = (score: number, stars: number) => {
    // Record stars for this level
    setLevelStars((prev) => ({
      ...prev,
      [currentLevel.id]: Math.max(prev[currentLevel.id] || 0, stars),
    }));

    // Reward stars for Academy
    setCivicStarsBalance((prev) => prev + stars);

    // Unlock next level if currently on highest unlocked
    if (currentLevel.id >= unlockedLevel && unlockedLevel < 23) {
      setUnlockedLevel((lvl) => lvl + 1);
    }

    // If in multiplayer group, update group stats
    if (activeClassroomGroup) {
      setActiveClassroomGroup((grp) =>
        grp
          ? {
              ...grp,
              score: grp.score + score,
              investigationsCompleted: grp.investigationsCompleted + 1,
            }
          : null
      );
    }

    // Return to Map
    setActiveView('map');
  };

  // Buy Defender Upgrade
  const handleUpgradeDefender = (type: DefenderType, cost: number) => {
    if (civicStarsBalance >= cost) {
      setCivicStarsBalance((b) => b - cost);
      setDefenderUpgrades((prev) => ({
        ...prev,
        [type]: (prev[type] || 0) + 1,
      }));
    }
  };

  // Start Classroom Game
  const handleStartGroupGame = (group: ClassroomGroup) => {
    setActiveClassroomGroup(group);
    setActiveView('map');
  };

  const getAudioThemeLabel = () => {
    if (activeView === 'battlefield') {
      if (currentLevel.bossType) return 'Bos Tempur ⚔️';
      switch (currentLevel.worldId) {
        case 'world1': return 'Rumah Keluarga 🏠';
        case 'world2': return 'Sekolah Ceria 🏫';
        case 'world3': return 'Taman Warga 🌳';
        case 'world4': return 'Ruang Publik 🛣';
        default: return 'Pertempuran';
      }
    }
    return 'Petualangan Sivik 🎵';
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans antialiased text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      {/* Active View Switcher */}
      {activeView === 'map' && (
        <WorldMap
          unlockedLevel={unlockedLevel}
          levelStars={levelStars}
          onSelectLevel={handleSelectLevel}
          onOpenAcademy={() => setIsAcademyOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenMultiplayer={() => setActiveView('multiplayer')}
          onOpenMultiDeviceMabar={() => setIsMultiDeviceMabarOpen(true)}
          onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        />
      )}

      {activeView === 'battlefield' && (
        <Battlefield
          level={currentLevel}
          civicScores={civicScores}
          onUpdateScores={setCivicScores}
          onLevelComplete={handleBattlefieldComplete}
          onExit={() => setActiveView('map')}
          defenderUpgrades={defenderUpgrades}
        />
      )}

      {activeView === 'investigation' && (
        <CivicInvestigationModal
          level={currentLevel}
          onComplete={handleInvestigationComplete}
          onClose={() => setActiveView('map')}
        />
      )}

      {activeView === 'multiplayer' && (
        <ClassroomMultiplayer
          onStartGroupGame={handleStartGroupGame}
          onOpenMultiDeviceMabar={() => setIsMultiDeviceMabarOpen(true)}
          onBack={() => setActiveView('map')}
        />
      )}

      {/* Global Modals */}
      {isAcademyOpen && (
        <GuardianAcademy
          civicStars={civicStarsBalance}
          upgrades={defenderUpgrades}
          onUpgrade={handleUpgradeDefender}
          onClose={() => setIsAcademyOpen(false)}
        />
      )}

      {isAchievementsOpen && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {isTeacherGuideOpen && (
        <TeacherGuideModal
          onClose={() => setIsTeacherGuideOpen(false)}
        />
      )}

      {isMultiDeviceMabarOpen && (
        <MultiDeviceMabarModal
          onStartBattle={() => {
            setIsMultiDeviceMabarOpen(false);
            setActiveView('battlefield');
          }}
          onClose={() => setIsMultiDeviceMabarOpen(false)}
        />
      )}

      {/* Floating Global Audio & Music Controls */}
      <GameAudioControls currentThemeLabel={getAudioThemeLabel()} />
    </div>
  );
}
