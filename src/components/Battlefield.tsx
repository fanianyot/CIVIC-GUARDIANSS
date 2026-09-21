import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LevelConfig, 
  DefenderType, 
  PlacedDefender, 
  ActiveEnemy, 
  Projectile, 
  HarmonyDrop, 
  Question, 
  QuestionCategory, 
  CivicScores 
} from '../types/game';
import { DEFENDERS_CONFIG } from '../data/defenders';
import { ENEMIES_CONFIG } from '../data/enemies';
import { questionSessionManager } from '../data/questions';
import { soundManager } from '../utils/audio';
import { multiplayerClient } from '../utils/multiplayerClient';
import { DefenderSprite, EnemySprite } from './GameSprites';
import { QuestionModal } from './QuestionModal';
import { CaptainCivic } from './CaptainCivic';
import { 
  Sparkles, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  FastForward, 
  RotateCcw, 
  Shovel, 
  ArrowLeft,
  Star,
  CheckCircle2,
  BrainCircuit,
  Trophy
} from 'lucide-react';

interface BattlefieldProps {
  level: LevelConfig;
  civicScores: CivicScores;
  onUpdateScores: (newScores: CivicScores) => void;
  onLevelComplete: (stars: number) => void;
  onExit: () => void;
  defenderUpgrades?: Record<DefenderType, number>;
}

const LANES_COUNT = 5;
const COLS_COUNT = 9;

export const Battlefield: React.FC<BattlefieldProps> = ({
  level,
  civicScores,
  onUpdateScores,
  onLevelComplete,
  onExit,
  defenderUpgrades = {} as Record<DefenderType, number>,
}) => {
  // Game states
  const [harmony, setHarmony] = useState(level.initialHarmony);
  const [placedDefenders, setPlacedDefenders] = useState<PlacedDefender[]>([]);
  const [enemies, setEnemies] = useState<ActiveEnemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [harmonyDrops, setHarmonyDrops] = useState<HarmonyDrop[]>([]);
  const [selectedDefenderType, setSelectedDefenderType] = useState<DefenderType | null>(null);
  const [isShovelActive, setIsShovelActive] = useState(false);
  const [cooldowns, setCooldowns] = useState<Record<DefenderType, number>>({} as any);

  // Safety barriers per lane (Lawnmowers)
  const [safetyBarriers, setSafetyBarriers] = useState<boolean[]>([true, true, true, true, true]);
  const [sweepingBarriers, setSweepingBarriers] = useState<{ lane: number; x: number }[]>([]);

  // Wave progress
  const [currentWave, setCurrentWave] = useState(0);
  const [waveTimer, setWaveTimer] = useState(5);
  const [isHugeWaveNotice, setIsHugeWaveNotice] = useState(false);
  const [isLevelFinished, setIsLevelFinished] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [isDefeat, setIsDefeat] = useState(false);
  const [defeatReason, setDefeatReason] = useState('');

  // Controls
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState<1 | 2>(1);
  const [isMuted, setIsMuted] = useState(soundManager.isMutedState());

  // Question Modal Trigger (Smart Learning Pause System)
  const [pendingDeployment, setPendingDeployment] = useState<{
    defenderType: DefenderType;
    targetPos: { row: number; col: number };
    question: Question;
  } | null>(null);

  // True whenever a question challenge is active: 100% pause all combat logic
  const isSmartLearningPaused = !!pendingDeployment;

  // Cross-device multiplayer assistance notice
  const [allyAssistanceNotice, setAllyAssistanceNotice] = useState<string | null>(null);

  // Bonus Harmony floating toast notification
  const [bonusNotification, setBonusNotification] = useState<{ text: string; id: number } | null>(null);

  const showBonusToast = useCallback((text: string) => {
    setBonusNotification({ text, id: Date.now() });
    setTimeout(() => {
      setBonusNotification((cur) => (cur && cur.text === text ? null : cur));
    }, 3200);
  }, []);

  useEffect(() => {
    // Start world specific BGM theme
    soundManager.startWorldBgm(level.worldId, !!level.bossType);

    const unsub = multiplayerClient.onAssistanceReceived((help) => {
      setHarmony((prev) => prev + 50);
      soundManager.playCorrect();
      setAllyAssistanceNotice(`BANTUAN DITERIMA: ${help.fromGroupName} mengirimkan +50 Energi Harmoni!`);
      setTimeout(() => setAllyAssistanceNotice(null), 4000);
    });

    return () => {
      unsub();
      soundManager.stopBgm();
    };
  }, [level.worldId, level.bossType]);

  // References for animation loop & entity synchronization
  const boardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const dropIdCounter = useRef(0);
  const enemyIdCounter = useRef(0);
  const projIdCounter = useRef(0);

  // Entity refs to avoid tearing down the 60fps game loop
  const enemiesRef = useRef<ActiveEnemy[]>(enemies);
  const placedDefendersRef = useRef<PlacedDefender[]>(placedDefenders);
  const safetyBarriersRef = useRef<boolean[]>(safetyBarriers);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    placedDefendersRef.current = placedDefenders;
  }, [placedDefenders]);

  useEffect(() => {
    safetyBarriersRef.current = safetyBarriers;
  }, [safetyBarriers]);

  // Synchronize lastTimeRef during pause toggles so there is zero time jump
  useEffect(() => {
    lastTimeRef.current = performance.now();
  }, [isSmartLearningPaused, isPaused]);

  // Question category for this level
  const getLevelQuestionCategory = (): QuestionCategory => {
    switch (level.worldId) {
      case 'world1':
        return 'rules_at_home';
      case 'world2':
        return 'rules_at_school';
      case 'world3':
        return 'rules_in_society';
      case 'world4':
      default:
        return 'hots_civic_cases';
    }
  };

  // World visual identity configurations
  const getWorldTheme = () => {
    switch (level.worldId) {
      case 'world1':
        return {
          name: 'Dunia Rumah & Keluarga',
          tag: '🏡 Sektor Rumah',
          skyBg: 'from-sky-300 via-amber-100 to-emerald-100',
          boardBorder: 'border-amber-400',
          laneEven: 'bg-emerald-600/90',
          laneOdd: 'bg-emerald-500/90',
          laneBorder: 'border-emerald-700/60',
          gridDivider: 'border-emerald-400/20',
          accentColor: 'text-amber-600',
          badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'world2':
        return {
          name: 'Dunia Sekolah Ceria',
          tag: '🏫 Sektor Sekolah',
          skyBg: 'from-sky-400 via-blue-100 to-indigo-100',
          boardBorder: 'border-blue-400',
          laneEven: 'bg-sky-700/90',
          laneOdd: 'bg-blue-600/90',
          laneBorder: 'border-blue-800/60',
          gridDivider: 'border-blue-300/20',
          accentColor: 'text-blue-600',
          badgeStyle: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'world3':
        return {
          name: 'Taman & Lingkungan Warga',
          tag: '🌳 Sektor Warga',
          skyBg: 'from-sky-300 via-emerald-100 to-green-100',
          boardBorder: 'border-emerald-400',
          laneEven: 'bg-green-600/90',
          laneOdd: 'bg-emerald-500/90',
          laneBorder: 'border-green-700/60',
          gridDivider: 'border-green-300/20',
          accentColor: 'text-emerald-600',
          badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'world4':
      default:
        return {
          name: 'Ruang Publik & Jalan Raya',
          tag: '🛣 Sektor Publik',
          skyBg: 'from-sky-400 via-slate-100 to-indigo-100',
          boardBorder: 'border-indigo-400',
          laneEven: 'bg-slate-800/95',
          laneOdd: 'bg-slate-700/95',
          laneBorder: 'border-slate-600/60',
          gridDivider: 'border-slate-500/30',
          accentColor: 'text-indigo-600',
          badgeStyle: 'bg-slate-200 text-slate-900 border-slate-400',
        };
    }
  };

  const currentTheme = getWorldTheme();

  // Spawn Harmony Drops with Balanced Tiers: Small (+15), Medium (+25), Large (+35)
  const spawnHarmonyDrop = useCallback(
    (lane?: number, x?: number, overrideValue?: number, overrideSize?: 'small' | 'medium' | 'large') => {
      const targetLane = lane !== undefined ? lane : Math.floor(Math.random() * LANES_COUNT);
      const targetX = x !== undefined ? x : 15 + Math.random() * 70;
      const dropId = `drop_${dropIdCounter.current++}`;

      let val = 25;
      let size: 'small' | 'medium' | 'large' = 'medium';

      const rand = Math.random();
      if (rand < 0.3) {
        val = 15; // Small Harmony Drop: +15
        size = 'small';
      } else if (rand < 0.8) {
        val = 25; // Medium Harmony Drop: +25
        size = 'medium';
      } else {
        val = 35; // Large Harmony Drop: +35
        size = 'large';
      }

      if (overrideValue !== undefined) val = overrideValue;
      if (overrideSize !== undefined) size = overrideSize;

      setHarmonyDrops((prev) => [
        ...prev,
        {
          id: dropId,
          lane: targetLane,
          x: targetX,
          value: val,
          size,
          createdTime: performance.now(),
        },
      ]);
    },
    []
  );

  // Collect Harmony Token
  const collectHarmony = (id: string, value: number) => {
    soundManager.playCollect();
    setHarmony((prev) => prev + value);
    setHarmonyDrops((prev) => prev.filter((d) => d.id !== id));
  };

  // Handle Tile Click (Demolish with Shovel or Deploy Defender)
  const handleTileClick = (row: number, col: number) => {
    if (isPaused || isLevelFinished || isSmartLearningPaused) return;

    // 1. Demolish with shovel
    if (isShovelActive) {
      const existing = placedDefenders.find((d) => d.row === row && d.col === col);
      if (existing) {
        soundManager.playButton();
        setPlacedDefenders((prev) => prev.filter((d) => !(d.row === row && d.col === col)));
        setIsShovelActive(false);
      }
      return;
    }

    // 2. Placing a defender
    if (!selectedDefenderType) return;

    const defenderConfig = DEFENDERS_CONFIG[selectedDefenderType];
    if (harmony < defenderConfig.cost) return;

    // Check if tile is already occupied
    const occupied = placedDefenders.some((d) => d.row === row && d.col === col);
    if (occupied) return;

    // Check cooldown
    if ((cooldowns[selectedDefenderType] || 0) > 0) return;

    // SMART LEARNING PAUSE TRIGGER: Retrieve HOTS Question
    const category = getLevelQuestionCategory();
    const question = questionSessionManager.getRandomQuestion(category);

    // Open question modal and automatically trigger pause
    setPendingDeployment({
      defenderType: selectedDefenderType,
      targetPos: { row, col },
      question,
    });
  };

  // On Question Answered Correctly -> Deploy!
  const handleQuestionSuccess = (targetPos: { row: number; col: number }, q: Question) => {
    if (!pendingDeployment) return;

    const defenderConfig = DEFENDERS_CONFIG[pendingDeployment.defenderType];
    const upgLevel = defenderUpgrades[pendingDeployment.defenderType] || 0;
    const bonusHp = Math.round(defenderConfig.hp * (1 + upgLevel * 0.15));

    // Deduct harmony
    setHarmony((prev) => Math.max(0, prev - defenderConfig.cost));

    // Set cooldown
    setCooldowns((prev) => ({
      ...prev,
      [pendingDeployment.defenderType]: defenderConfig.cooldown || 5,
    }));

    // Deploy defender
    const defInstanceId = `def_${Date.now()}_${Math.random()}`;
    const newDefender: PlacedDefender = {
      instanceId: defInstanceId,
      id: defInstanceId,
      type: pendingDeployment.defenderType,
      row: targetPos.row,
      col: targetPos.col,
      hp: bonusHp,
      maxHp: bonusHp,
      lastAttackTime: performance.now(),
      level: upgLevel,
      productionTimer: 0,
    };

    setPlacedDefenders((prev) => [...prev, newDefender]);
    soundManager.playDeploy();

    // Notify cross-device multiplayer session
    multiplayerClient.sendAction('hots_answer', {
      correct: true,
      topic: q.categoryTitle,
      scoreBoost: 50,
    });
    multiplayerClient.sendAction('place_defender', {
      defenderName: defenderConfig.name,
    });

    // Increase civic scores
    const updatedScores: CivicScores = {
      discipline: civicScores.discipline + q.scoresEffect.discipline,
      responsibility: civicScores.responsibility + q.scoresEffect.responsibility,
      respect: civicScores.respect + q.scoresEffect.respect,
      cleanliness: civicScores.cleanliness + q.scoresEffect.cleanliness,
      community: civicScores.community + q.scoresEffect.community,
    };
    onUpdateScores(updatedScores);

    // Reward correct answers with bonus harmony
    setHarmony((prev) => prev + 20);
    showBonusToast('+20 Harmoni: Bonus Jawaban Tepat! ⭐');

    // Close modal & reset selection
    setPendingDeployment(null);
    setSelectedDefenderType(null);
  };

  // Periodic Bonus Harmony Drop (Every 18s during active play)
  useEffect(() => {
    if (isPaused || isLevelFinished || isSmartLearningPaused) return;

    const interval = setInterval(() => {
      const lane = Math.floor(Math.random() * LANES_COUNT);
      const x = 20 + Math.random() * 55;
      spawnHarmonyDrop(lane, x, 25, 'medium');
      showBonusToast('+25 Harmoni: Bintang Energi Harmoni Jatuh di Arena! ✨');
    }, 18000 / gameSpeed);

    return () => clearInterval(interval);
  }, [isPaused, isLevelFinished, isSmartLearningPaused, gameSpeed, spawnHarmonyDrop, showBonusToast]);

  // On Question Answered Incorrectly
  const handleQuestionFail = (q: Question) => {
    if (!pendingDeployment) return;

    multiplayerClient.sendAction('hots_answer', {
      correct: false,
      topic: q.categoryTitle,
    });

    // Small penalty to score & cooldown
    const updatedScores: CivicScores = {
      ...civicScores,
      discipline: Math.max(0, civicScores.discipline - 5),
    };
    onUpdateScores(updatedScores);

    // Refund harmony, set small 3s cooldown
    setCooldowns((prev) => ({
      ...prev,
      [pendingDeployment.defenderType]: 3,
    }));

    setPendingDeployment(null);
    setSelectedDefenderType(null);
  };

  // Spawn Enemy Wave helper
  const spawnWave = useCallback((waveIndex: number) => {
    const isFinalWave = waveIndex === level.wavesCount - 1;

    if (isFinalWave) {
      soundManager.playAlarm();
      setIsHugeWaveNotice(true);
      setTimeout(() => setIsHugeWaveNotice(false), 3500);
    }

    const enemyTypesToSpawn = [...level.enemyTypes];
    const count = 3 + waveIndex * 2;

    for (let i = 0; i < count; i++) {
      const type = enemyTypesToSpawn[Math.floor(Math.random() * enemyTypesToSpawn.length)];
      const config = ENEMIES_CONFIG[type];
      const lane = Math.floor(Math.random() * LANES_COUNT);

      setTimeout(() => {
        // Guard against spawning if level already finished
        const enemyId = `enemy_${enemyIdCounter.current++}`;
        setEnemies((prev) => [
          ...prev,
          {
            id: enemyId,
            instanceId: enemyId,
            type,
            row: lane,
            x: 100 + i * 8,
            hp: config.hp,
            maxHp: config.hp,
            speed: config.speed,
            slowTimer: 0,
            isSlowed: false,
            isStunned: false,
            stunTimer: 0,
            isAttacking: false,
            isBoss: false,
          },
        ]);
      }, i * 1200);
    }

    // If final wave and boss exists, spawn boss!
    if (isFinalWave && level.bossType) {
      const bossConfig = ENEMIES_CONFIG[level.bossType];
      setTimeout(() => {
        const bossId = `boss_${Date.now()}`;
        setEnemies((prev) => [
          ...prev,
          {
            id: bossId,
            instanceId: bossId,
            type: level.bossType!,
            row: 2, // Middle lane
            x: 105,
            hp: bossConfig.hp,
            maxHp: bossConfig.hp,
            speed: bossConfig.speed,
            slowTimer: 0,
            isSlowed: false,
            isStunned: false,
            stunTimer: 0,
            isAttacking: false,
            isBoss: true,
          },
        ]);
      }, count * 1200 + 1000);
    }
  }, [level]);

  // Main Game Loop (60fps) with SMART LEARNING PAUSE SYSTEM & Continuous Smooth Movement
  useEffect(() => {
    const gameLoop = () => {
      const now = performance.now();
      const rawDelta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // STRICT EDUCATIONAL PAUSE: Halt when paused, level completed, or during question challenge!
      if (isPaused || isLevelFinished || isSmartLearningPaused) {
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Smooth delta clamp to prevent physics jumps or choppy leaps
      const delta = Math.min(rawDelta, 0.05) * gameSpeed;

      // 1. Update Cooldowns
      setCooldowns((prev) => {
        const next = { ...prev };
        let changed = false;
        Object.keys(next).forEach((key) => {
          const k = key as DefenderType;
          if (next[k] > 0) {
            next[k] = Math.max(0, next[k] - delta);
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      // 2. Natural Sun/Harmony drops
      if (Math.random() < 0.005 * gameSpeed) {
        spawnHarmonyDrop();
      }

      // 3. Update Placed Defenders (Shooting / Producing Harmony)
      const currentEnemies = enemiesRef.current;
      setPlacedDefenders((prevDefenders) => {
        const updated = [...prevDefenders];

        updated.forEach((def) => {
          const config = DEFENDERS_CONFIG[def.type];

          // Community Helper produces large harmony drops (+35)
          if (def.type === 'community_helper') {
            def.productionTimer = (def.productionTimer || 0) + delta;
            if (def.productionTimer >= 14) {
              def.productionTimer = 0;
              spawnHarmonyDrop(def.row, (def.col / COLS_COUNT) * 100 + 5, 35, 'large');
            }
          }

          // Shooters: check if enemies in same lane ahead of defender
          if (config.damage > 0) {
            const hasEnemyInLane = currentEnemies.some(
              (e) => e.row === def.row && e.x > (def.col / COLS_COUNT) * 100
            );

            if (hasEnemyInLane) {
              const attackInterval = 1 / config.attackSpeed;
              if (now - def.lastAttackTime >= attackInterval * 1000) {
                def.lastAttackTime = now;

                const isRanger = def.type === 'cleanliness_ranger';
                const pType: Projectile['type'] = isRanger ? 'soap_bubble' : 'pencil';
                setProjectiles((prevProj) => [
                  ...prevProj,
                  {
                    id: `proj_${projIdCounter.current++}`,
                    type: pType,
                    row: def.row,
                    lane: def.row,
                    x: (def.col / COLS_COUNT) * 100 + 6,
                    damage: Math.round(config.damage * (1 + (def.level || 0) * 0.2)),
                    speed: 40,
                    color: isRanger ? '#38bdf8' : '#f59e0b',
                    splashRadius: isRanger ? 1.5 : 0,
                  },
                ]);
                soundManager.playAttack(isRanger ? 'soap_bubble' : 'pencil');
              }
            }
          }
        });

        return updated;
      });

      // 4. Update Projectiles & Check Collisions
      setProjectiles((prevProj) => {
        const nextProj: Projectile[] = [];

        prevProj.forEach((proj) => {
          const newX = proj.x + 40 * delta;

          // Check collision with enemies in the same lane
          let hitEnemy: ActiveEnemy | null = null;
          enemiesRef.current.forEach((enemy) => {
            if (enemy.row === proj.lane && Math.abs(enemy.x - newX) < 4) {
              hitEnemy = enemy;
            }
          });

          if (hitEnemy) {
            soundManager.playHit();
            setEnemies((currentEnemies) =>
              currentEnemies
                .map((en) => {
                  if (en.id === hitEnemy!.id) {
                    const newHp = en.hp - proj.damage;
                    const isDefeated = newHp <= 0;
                    if (isDefeated) {
                      soundManager.playEnemyDefeated();
                    }
                    return {
                      ...en,
                      hp: newHp,
                      isHurt: true,
                    };
                  }
                  return en;
                })
                .filter((en) => en.hp > 0)
            );
          } else if (newX < 105) {
            nextProj.push({ ...proj, x: newX });
          }
        });

        return nextProj;
      });

      // 5. Update Enemies (Continuous smooth movement & combat)
      const currentDefs = placedDefendersRef.current;
      setEnemies((prevEnemies) => {
        const nextEnemies: ActiveEnemy[] = [];

        prevEnemies.forEach((enemy) => {
          // Check if there is a defender blocking this tile
          const blockingDefender = currentDefs.find(
            (d) => d.row === enemy.row && Math.abs((d.col / COLS_COUNT) * 100 - enemy.x) < 4
          );

          if (blockingDefender) {
            // Attack defender
            const config = ENEMIES_CONFIG[enemy.type];
            const attackDmg = config.damage * delta;

            setPlacedDefenders((currentDef) =>
              currentDef
                .map((d) => {
                  if (d.instanceId === blockingDefender.instanceId) {
                    return { ...d, hp: d.hp - attackDmg };
                  }
                  return d;
                })
                .filter((d) => d.hp > 0)
            );

            nextEnemies.push({ ...enemy, isAttacking: true });
          } else {
            // Smooth continuous leftward movement
            const newX = enemy.x - enemy.speed * delta;

            // Check if enemy breaches safety barrier on left (x <= 0)
            if (newX <= 0) {
              const lane = enemy.row;
              if (safetyBarriersRef.current[lane]) {
                // Trigger sweeping barrier (lawnmower sweep)
                setSafetyBarriers((sb) => {
                  const copy = [...sb];
                  copy[lane] = false;
                  return copy;
                });
                setSweepingBarriers((prev) => [...prev, { lane, x: 0 }]);
                soundManager.playWaveStart();
              } else {
                // Defeat condition: enemy breached unprotected lane!
                setIsLevelFinished(true);
                setIsDefeat(true);
                setDefeatReason(
                  `Pasukan ${enemy.type.replace(/_/g, ' ')} berhasil menerobos pertahanan di Jalur ${lane + 1}!`
                );
                soundManager.playDefeat();
              }
            } else {
              nextEnemies.push({ ...enemy, x: newX, isAttacking: false });
            }
          }
        });

        return nextEnemies;
      });

      // 6. Update Sweeping Barriers (Sweep enemies across lane)
      setSweepingBarriers((prevSweepers) => {
        const activeSweepers: { lane: number; x: number }[] = [];

        prevSweepers.forEach((sw) => {
          const newX = sw.x + 80 * delta;
          // Clear any enemies on this lane that the sweeper touches
          setEnemies((enList) => enList.filter((e) => !(e.row === sw.lane && e.x <= newX + 5)));

          if (newX < 110) {
            activeSweepers.push({ ...sw, x: newX });
          }
        });

        return activeSweepers;
      });

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    isPaused,
    gameSpeed,
    isLevelFinished,
    isSmartLearningPaused,
    spawnHarmonyDrop,
  ]);

  // Wave Progression Timer (Smart Learning Pause Aware with Wave Bonus)
  useEffect(() => {
    if (isPaused || isLevelFinished || isSmartLearningPaused) return;

    const timer = setInterval(() => {
      setWaveTimer((prev) => {
        if (prev <= 1) {
          if (currentWave < level.wavesCount) {
            spawnWave(currentWave);
            setCurrentWave((w) => {
              const nextW = w + 1;
              if (w > 0) {
                // Reward completing a wave with Harmony bonus
                setHarmony((h) => h + 35);
                showBonusToast(`+35 Harmoni: Gelombang ${w} Berhasil Dipertahankan! 🛡️`);
              }
              return nextW;
            });
            return 22; // 22 seconds between waves
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000 / gameSpeed);

    return () => clearInterval(timer);
  }, [currentWave, level.wavesCount, isPaused, isLevelFinished, isSmartLearningPaused, gameSpeed, spawnWave, showBonusToast]);

  // Check Victory Condition
  useEffect(() => {
    if (
      currentWave >= level.wavesCount &&
      enemies.length === 0 &&
      !isLevelFinished &&
      waveTimer <= 10
    ) {
      setIsLevelFinished(true);
      setIsVictory(true);
      soundManager.playLevelCompletion();

      const barriersUsed = safetyBarriers.filter((b) => !b).length;
      const starsEarned = barriersUsed === 0 ? 3 : barriersUsed <= 2 ? 2 : 1;
      onLevelComplete(starsEarned);
    }
  }, [currentWave, enemies.length, level.wavesCount, isLevelFinished, safetyBarriers, waveTimer, onLevelComplete]);

  // Restart / Reset Level
  const handleRestart = () => {
    soundManager.playButton();
    setHarmony(level.initialHarmony);
    setPlacedDefenders([]);
    setEnemies([]);
    setProjectiles([]);
    setHarmonyDrops([]);
    setSafetyBarriers([true, true, true, true, true]);
    setSweepingBarriers([]);
    setCurrentWave(0);
    setWaveTimer(5);
    setIsLevelFinished(false);
    setIsVictory(false);
    setIsDefeat(false);
    setPendingDeployment(null);
  };

  const toggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    soundManager.playButton();
  };

  const defenderKeys = Object.keys(DEFENDERS_CONFIG) as DefenderType[];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.skyBg} text-slate-900 flex flex-col select-none overflow-hidden relative`}>
      {/* Animated Floating Cartoon Clouds */}
      <div className="absolute top-2 left-0 right-0 pointer-events-none overflow-hidden h-28 z-0">
        <div className="absolute top-1 w-28 h-12 bg-white/70 rounded-full blur-xs cloud-slow flex items-center justify-center">
          <div className="w-14 h-14 bg-white/70 rounded-full -top-3 -left-2 absolute" />
          <div className="w-10 h-10 bg-white/70 rounded-full -top-2 -right-2 absolute" />
        </div>
        <div className="absolute top-8 w-36 h-14 bg-white/60 rounded-full blur-xs cloud-fast flex items-center justify-center">
          <div className="w-18 h-18 bg-white/60 rounded-full -top-4 -left-3 absolute" />
          <div className="w-12 h-12 bg-white/60 rounded-full -top-3 -right-2 absolute" />
        </div>
      </div>

      {/* Top Playful Cartoon Header Status Bar */}
      <header className="px-3 sm:px-6 py-2.5 bg-white/95 border-b-3 border-amber-300 backdrop-blur-md flex flex-wrap items-center justify-between gap-2.5 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundManager.playButton();
              onExit();
            }}
            className="p-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer shadow-sm"
            title="Kembali ke Peta Petualangan"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shadow-xs ${currentTheme.badgeStyle}`}>
                Level {level.id}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                {level.title}
              </span>
            </div>
            <div className="text-[10px] font-bold text-slate-500 hidden sm:block">
              {currentTheme.name}
            </div>
          </div>
        </div>

        {/* Middle Stats: Harmony Energy & Wave Progress */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Harmony Counter 3D Pill */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-400 border-2 border-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md animate-pulse">
            <Sparkles className="w-4 h-4 fill-amber-200 text-amber-950" />
            <span>{harmony} Harmoni</span>
          </div>

          {/* Wave Indicator */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-2xl border border-slate-200">
            <span className="hidden sm:inline">Gelombang:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: level.wavesCount }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 rounded-full transition-all ${
                    i < currentWave
                      ? 'bg-emerald-500 w-4'
                      : i === currentWave
                      ? 'bg-amber-400 animate-pulse w-6'
                      : 'bg-slate-300 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Controls: Speed, Pause, Sound, Restart */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              soundManager.playButton();
              setGameSpeed((s) => (s === 1 ? 2 : 1));
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
              gameSpeed === 2
                ? 'bg-amber-500 border-amber-600 text-white shadow-sm'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title="Kecepatan Game"
          >
            <FastForward className="w-3.5 h-3.5 inline mr-1" />
            <span>{gameSpeed}x</span>
          </button>

          <button
            onClick={() => {
              soundManager.playButton();
              setIsPaused((p) => !p);
            }}
            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
              isPaused
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={isPaused ? 'Lanjutkan' : 'Jeda'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 transition-all cursor-pointer"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 transition-all cursor-pointer"
            title="Mulai Ulang Level"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Defender Selection Deck with Cartoon 3D Styling */}
      <div className="px-3 sm:px-6 py-2 bg-white/90 border-b-2 border-slate-200 flex items-center gap-2 overflow-x-auto z-20 shadow-xs">
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider hidden md:inline shrink-0">
          Pilih Penjaga:
        </span>

        {defenderKeys.map((type) => {
          const config = DEFENDERS_CONFIG[type];
          const cd = cooldowns[type] || 0;
          const isSelected = selectedDefenderType === type;
          const canAfford = harmony >= config.cost && cd <= 0;

          return (
            <button
              key={type}
              onClick={() => {
                if (cd <= 0) {
                  setIsShovelActive(false);
                  setSelectedDefenderType(isSelected ? null : type);
                  soundManager.playButton();
                }
              }}
              disabled={cd > 0}
              className={`p-1.5 sm:p-2 rounded-2xl border-2 flex items-center gap-2 shrink-0 transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-amber-100 border-amber-500 ring-3 ring-amber-400 shadow-md scale-102'
                  : canAfford
                  ? 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-50 border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                <DefenderSprite type={type} className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="text-left">
                <div className="text-xs font-black text-slate-900 truncate max-w-[90px] sm:max-w-[110px]">
                  {config.name}
                </div>
                <div className="text-[11px] font-black text-amber-600 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 fill-amber-500" />
                  {config.cost}
                </div>
              </div>

              {/* Cooldown Overlay */}
              {cd > 0 && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center font-black text-xs text-amber-300">
                  {Math.ceil(cd)}s
                </div>
              )}
            </button>
          );
        })}

        {/* Shovel / Demolish Tool */}
        <button
          onClick={() => {
            setSelectedDefenderType(null);
            setIsShovelActive((s) => !s);
            soundManager.playButton();
          }}
          className={`p-2 rounded-2xl border-2 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
            isShovelActive
              ? 'bg-rose-500 border-rose-600 text-white ring-2 ring-rose-300 shadow-md'
              : 'bg-white border-slate-200 hover:border-rose-400 text-slate-600'
          }`}
          title="Sekop untuk memindahkan penjaga"
        >
          <Shovel className="w-4 h-4" />
          <span className="text-xs font-black hidden sm:inline">Sekop</span>
        </button>
      </div>

      {/* Battlefield Main Grid Stage */}
      <main className="flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden z-10">
        {/* Huge Wave Alert Banner */}
        {isHugeWaveNotice && (
          <div className="absolute top-6 z-40 px-6 py-3.5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 border-3 border-yellow-300 shadow-2xl text-center animate-bounce">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2 drop-shadow-md">
              <ShieldAlert className="w-7 h-7 text-yellow-300 animate-pulse" />
              GELOMBANG BESAR KETIDAKTERATURAN TIBA!
              <ShieldAlert className="w-7 h-7 text-yellow-300 animate-pulse" />
            </h2>
            <p className="text-xs sm:text-sm text-yellow-100 font-bold mt-0.5">
              Siapkan pertahanan maksimal, Bos Ketidakteraturan mendekati pos!
            </p>
          </div>
        )}

        {/* Smart Learning Pause Freeze Banner & Indicator */}
        {isSmartLearningPaused && (
          <div className="absolute top-4 z-40 px-5 py-2.5 rounded-2xl bg-indigo-900/95 border-3 border-amber-300 text-white font-black text-xs sm:text-sm shadow-2xl flex items-center gap-3 animate-pulse">
            <span className="text-xl">⏸</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-300 uppercase tracking-wider font-extrabold">Learning Pause</span>
              <span>•</span>
              <BrainCircuit className="w-4 h-4 text-amber-300" />
              <span>Question Challenge</span>
            </div>
          </div>
        )}

        {/* Floating Harmony Bonus Notification Toast */}
        {bonusNotification && (
          <div className="absolute top-16 z-40 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-white fill-white" />
            <span>{bonusNotification.text}</span>
          </div>
        )}

        {/* Cross-device Ally Assistance Banner */}
        {allyAssistanceNotice && (
          <div className="absolute top-16 z-40 px-5 py-2.5 rounded-2xl bg-emerald-600 border-2 border-emerald-300 shadow-xl text-center animate-bounce flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
            <span className="font-black text-xs sm:text-sm">{allyAssistanceNotice}</span>
          </div>
        )}

        {/* The 5-Lane Cartoon Battlefield Board */}
        <div
          ref={boardRef}
          className={`relative w-full max-w-5xl aspect-[16/9] max-h-[75vh] rounded-3xl overflow-hidden border-4 ${currentTheme.boardBorder} shadow-2xl ${
            isSmartLearningPaused ? 'brightness-95 contrast-95' : ''
          }`}
        >
          {/* Smart Learning Pause Total Battlefield Freeze Overlay */}
          {isSmartLearningPaused && (
            <div className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none animate-in fade-in duration-150">
              <div className="px-6 py-3.5 rounded-3xl bg-indigo-900/95 border-3 border-amber-300 text-white shadow-2xl flex items-center gap-3 animate-pulse max-w-md text-left">
                <span className="text-3xl">⏸</span>
                <div>
                  <div className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <span>Learning Pause</span>
                    <span>•</span>
                    <span>🧠 Question Challenge</span>
                  </div>
                  <div className="text-[11px] sm:text-xs text-indigo-100 font-medium">
                    Pertempuran dibekukan sepenuhnya untuk refleksi & diskusi nilai kewarganegaraan
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Background Battlefield Graphic (Striped Cartoon Lanes) */}
          <div className="absolute inset-0 grid grid-rows-5 pointer-events-none">
            {Array.from({ length: LANES_COUNT }).map((_, rIdx) => (
              <div
                key={rIdx}
                className={`w-full h-full border-b ${currentTheme.laneBorder} flex items-center justify-between px-3 ${
                  rIdx % 2 === 0 ? currentTheme.laneEven : currentTheme.laneOdd
                }`}
              >
                {/* Lane marker label */}
                <span className="text-[10px] font-black text-white/50">
                  Jalur {rIdx + 1}
                </span>
                <span className="text-[10px] font-bold text-white/30 hidden sm:inline">
                  {currentTheme.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Vertical Grid Columns */}
          <div className="absolute inset-0 grid grid-cols-9 pointer-events-none">
            {Array.from({ length: COLS_COUNT }).map((_, cIdx) => (
              <div
                key={cIdx}
                className={`h-full border-r ${currentTheme.gridDivider}`}
              />
            ))}
          </div>

          {/* Interactive Tiles (5x9) */}
          <div className="absolute inset-0 grid grid-rows-5">
            {Array.from({ length: LANES_COUNT }).map((_, row) => (
              <div key={row} className="grid grid-cols-9">
                {Array.from({ length: COLS_COUNT }).map((_, col) => {
                  const defenderOnTile = placedDefenders.find(
                    (d) => d.row === row && d.col === col
                  );

                  return (
                    <div
                      key={col}
                      onClick={() => handleTileClick(row, col)}
                      className={`relative w-full h-full cursor-pointer transition-colors border border-transparent ${
                        selectedDefenderType && !defenderOnTile
                          ? 'hover:bg-amber-300/30 hover:border-amber-300'
                          : isShovelActive && defenderOnTile
                          ? 'hover:bg-rose-500/30 hover:border-rose-400'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      {/* Defender preview ghost on hover */}
                      {selectedDefenderType && !defenderOnTile && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
                          <DefenderSprite type={selectedDefenderType} className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Lawnmowers / Safety Community Barriers (Leftmost column) */}
          {safetyBarriers.map((isActive, laneIdx) => {
            if (!isActive) return null;
            const topPercent = (laneIdx / LANES_COUNT) * 100;
            return (
              <div
                key={laneIdx}
                className="absolute z-20 flex items-center"
                style={{
                  top: `${topPercent + 2}%`,
                  left: '0.5%',
                  height: `${100 / LANES_COUNT - 4}%`,
                }}
              >
                <div className="px-2 py-1 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 border-2 border-white shadow-md flex items-center gap-1 animate-pulse">
                  <span className="text-[10px] font-black text-white">BENTENG</span>
                </div>
              </div>
            );
          })}

          {/* Sweeping Barriers in action */}
          {sweepingBarriers.map((sw, idx) => {
            const topPercent = (sw.lane / LANES_COUNT) * 100;
            return (
              <div
                key={idx}
                className="absolute z-30 flex items-center transition-all duration-75"
                style={{
                  top: `${topPercent + 2}%`,
                  left: `${sw.x}%`,
                  height: `${100 / LANES_COUNT - 4}%`,
                }}
              >
                <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 border-2 border-white shadow-xl flex items-center gap-1 scale-110">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                  <span className="text-xs font-black text-white">SAPUAN KETERTIBAN!</span>
                </div>
              </div>
            );
          })}

          {/* Render Placed Defenders */}
          {placedDefenders.map((def, idx) => {
            const topPercent = (def.row / LANES_COUNT) * 100;
            const leftPercent = (def.col / COLS_COUNT) * 100;
            const hpPercent = Math.max(0, (def.hp / def.maxHp) * 100);

            return (
              <div
                key={def.instanceId || def.id || `def_${idx}`}
                className="absolute z-10 flex flex-col items-center justify-center transition-all pointer-events-none"
                style={{
                  top: `${topPercent}%`,
                  left: `${leftPercent}%`,
                  width: `${100 / COLS_COUNT}%`,
                  height: `${100 / LANES_COUNT}%`,
                }}
              >
                {/* Defender Health bar */}
                <div className="w-8 h-1.5 rounded-full bg-slate-900/60 border border-white/50 overflow-hidden mb-0.5">
                  <div
                    className={`h-full transition-all ${
                      hpPercent > 50
                        ? 'bg-emerald-400'
                        : hpPercent > 25
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>

                <DefenderSprite type={def.type} className="w-11 h-11 sm:w-13 sm:h-13 filter drop-shadow-md" />
              </div>
            );
          })}

          {/* Render Active Enemies with Continuous Fluid Movement */}
          {enemies.map((enemy, idx) => {
            const topPercent = (enemy.row / LANES_COUNT) * 100;
            const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);

            return (
              <div
                key={enemy.instanceId || enemy.id || `enemy_${idx}`}
                className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
                style={{
                  top: `${topPercent}%`,
                  left: `${enemy.x - 5}%`,
                  width: `${100 / COLS_COUNT}%`,
                  height: `${100 / LANES_COUNT}%`,
                  willChange: 'left',
                }}
              >
                {/* Enemy Health bar */}
                <div className="w-9 h-1.5 rounded-full bg-slate-900/80 border border-white/50 overflow-hidden mb-0.5">
                  <div
                    className={`h-full ${
                      hpPercent > 50
                        ? 'bg-rose-500'
                        : hpPercent > 25
                        ? 'bg-orange-500'
                        : 'bg-red-700'
                    }`}
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>

                <EnemySprite
                  type={enemy.type}
                  isAttacking={enemy.isAttacking}
                  isHurt={enemy.isHurt}
                  isSlowed={enemy.isSlowed}
                  isStunned={enemy.isStunned}
                  className={enemy.isBoss ? 'w-16 h-16' : 'w-11 h-11 sm:w-13 sm:h-13'}
                />
              </div>
            );
          })}

          {/* Render Projectiles with Continuous Fluid Movement */}
          {projectiles.map((proj) => {
            const projLane = proj.lane !== undefined ? proj.lane : proj.row;
            const topPercent = (projLane / LANES_COUNT) * 100 + 40 / LANES_COUNT;

            return (
              <div
                key={proj.id}
                className="absolute z-15 pointer-events-none"
                style={{
                  top: `${topPercent}%`,
                  left: `${proj.x}%`,
                  willChange: 'left',
                }}
              >
                {proj.type === 'pencil' ? (
                  <div className="w-4 h-2 bg-amber-400 rounded-r-full border border-amber-600 shadow-sm flex items-center">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-l" />
                  </div>
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full bg-cyan-300 border border-white shadow-sm" />
                )}
              </div>
            );
          })}

          {/* Render Floating Harmony Drops with Balanced Tiers: Small (+15), Medium (+25), Large (+35) */}
          {harmonyDrops.map((drop) => {
            const topPercent = (drop.lane / LANES_COUNT) * 100 + 10;
            const isLarge = drop.value >= 35 || drop.size === 'large';
            const isSmall = drop.value <= 15 || drop.size === 'small';

            return (
              <div
                key={drop.id}
                onClick={() => {
                  if (!isSmartLearningPaused) {
                    collectHarmony(drop.id, drop.value);
                  }
                }}
                className={`absolute z-30 cursor-pointer animate-bounce hover:scale-125 transition-transform ${
                  isSmartLearningPaused ? 'pointer-events-none' : ''
                }`}
                style={{
                  top: `${topPercent}%`,
                  left: `${drop.x}%`,
                }}
              >
                <div
                  className={`rounded-full border-3 border-white shadow-lg flex items-center justify-center font-black text-slate-950 ${
                    isLarge
                      ? 'w-12 h-12 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-amber-400/80 ring-2 ring-yellow-200 text-xs'
                      : isSmall
                      ? 'w-8 h-8 bg-amber-300 shadow-amber-500/40 text-[10px]'
                      : 'w-10 h-10 bg-amber-400 shadow-amber-500/50 text-xs'
                  }`}
                >
                  <div className="flex flex-col items-center leading-none">
                    <span>+{drop.value}</span>
                    <span className="text-[7px] sm:text-[8px] font-bold opacity-75">
                      {isLarge ? 'SUPER' : 'HARM'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Contextual HOTS Question Modal for deploying defenders */}
      {pendingDeployment && (
        <QuestionModal
          question={pendingDeployment.question}
          defender={DEFENDERS_CONFIG[pendingDeployment.defenderType]}
          targetPos={pendingDeployment.targetPos}
          onSuccess={handleQuestionSuccess}
          onFail={handleQuestionFail}
          onCancel={() => setPendingDeployment(null)}
        />
      )}

      {/* Level Victory / Defeat Overlay with Captain Civic Mascot */}
      {isLevelFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border-4 border-amber-400 rounded-3xl p-6 text-center shadow-2xl space-y-4 text-slate-900 animate-pop-in">
            {isVictory ? (
              <>
                <CaptainCivic mood="celebrating" size="md" showSpeechBubble={false} className="mx-auto" />

                <div>
                  <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                    {Array.from({ length: 3 }).map((_, sIdx) => {
                      const barriersUsed = safetyBarriers.filter((b) => !b).length;
                      const stars = barriersUsed === 0 ? 3 : barriersUsed <= 2 ? 2 : 1;
                      return (
                        <Star
                          key={sIdx}
                          className={`w-7 h-7 ${
                            sIdx < stars ? 'fill-amber-400 text-amber-500 animate-star-burst' : 'text-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <h2 className="text-2xl font-black text-slate-950">
                    KEMENANGAN KETERTIBAN! 🎉
                  </h2>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Kapten Sivik bangga! Nilai disiplin dan kepedulianmu berhasil menjaga keharmonisan lingkungan.
                  </p>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex justify-around text-xs">
                  <div>
                    <span className="text-slate-500 font-bold block">Poin Disiplin</span>
                    <strong className="text-emerald-700 text-sm font-black">
                      {civicScores.discipline} Poin
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">Tanggung Jawab</span>
                    <strong className="text-amber-700 text-sm font-black">
                      {civicScores.responsibility} Poin
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const barriersUsed = safetyBarriers.filter((b) => !b).length;
                    const stars = barriersUsed === 0 ? 3 : barriersUsed <= 2 ? 2 : 1;
                    onLevelComplete(stars);
                  }}
                  className="w-full py-3 rounded-2xl btn-cartoon-green font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Buka Laporan Investigasi Penjaga 📜</span>
                  <Star className="w-4 h-4 fill-white" />
                </button>
              </>
            ) : (
              <>
                <CaptainCivic mood="thinking" size="md" showSpeechBubble={false} className="mx-auto" />

                <div>
                  <h2 className="text-2xl font-black text-rose-700">
                    KETERTIBAN TERGANGGU! ⚠️
                  </h2>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                    {defeatReason || 'Pasukan ketidakteraturan berhasil merusak keharmonisan warga.'}
                  </p>
                </div>

                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 font-medium">
                  <strong>Pesan Kapten Sivik:</strong> "Jangan putus asa! Gunakan penjaga dengan penempatan lebih strategis dan jawab tantangan aturan dengan teliti!"
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      soundManager.playButton();
                      onExit();
                    }}
                    className="flex-1 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs transition-colors cursor-pointer"
                  >
                    Kembali ke Peta
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex-1 py-3 rounded-2xl btn-cartoon-rose font-black text-xs shadow-lg cursor-pointer"
                  >
                    Coba Lagi 🔄
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
