export type WorldId = 'world1' | 'world2' | 'world3' | 'world4';

export interface WorldInfo {
  id: WorldId;
  name: string;
  theme: string;
  description: string;
  bgGradient: string;
  laneColor: string;
  gridColor: string;
  accentColor: string;
  icon: string;
  levelRange: [number, number];
}

export type DefenderType = 
  | 'discipline_defender' 
  | 'responsibility_guardian' 
  | 'cleanliness_ranger' 
  | 'respect_protector' 
  | 'queue_master' 
  | 'community_helper';

export interface DefenderConfig {
  id: DefenderType;
  name: string;
  indonesianName: string;
  title: string;
  cost: number;
  cooldown?: number;
  hp: number;
  maxHp: number;
  damage: number;
  attackSpeed: number; // seconds between attacks
  range: number; // number of tiles, 9 = whole lane
  specialAbility: string;
  represents: string[];
  color: string;
  borderColor: string;
  bgBadge: string;
  description: string;
}

export interface PlacedDefender {
  id?: string;
  instanceId: string;
  type: DefenderType;
  row: number;
  col: number;
  hp: number;
  maxHp: number;
  lastAttackTime: number;
  lastProduceTime?: number;
  productionTimer?: number;
  level?: number;
  isAttacking?: boolean;
}

export type EnemyType = 
  | 'trash_monster' 
  | 'latecomer' 
  | 'queue_breaker' 
  | 'noise_maker' 
  | 'rule_breaker' 
  | 'facility_destroyer' 
  | 'selfish_citizen'
  | 'home_boss'
  | 'school_boss'
  | 'community_boss'
  | 'king_of_disorder'
  | 'lord_of_chaos';

export interface EnemyConfig {
  id: EnemyType;
  name: string;
  indonesianName?: string;
  represents: string;
  hp: number;
  speed: number; // pixels per second or tile fractional step
  damage: number; // damage per second to defender
  attackPower?: number;
  color: string;
  isBoss?: boolean;
  special?: string;
  description: string;
}

export interface ActiveEnemy {
  id?: string;
  instanceId: string;
  type: EnemyType;
  row: number;
  x: number; // from 0 (left) to 100 (right) percentage of lane width
  hp: number;
  maxHp: number;
  speed: number;
  slowTimer: number;
  stunTimer: number;
  isAttacking: boolean;
  isHurt?: boolean;
  isSlowed?: boolean;
  isStunned?: boolean;
  isBoss?: boolean;
  targetDefenderId?: string;
}

export interface Projectile {
  id: string;
  row: number;
  lane?: number;
  x: number; // percentage
  targetX?: number;
  damage: number;
  speed: number; // speed per sec
  color: string;
  type: 'pencil' | 'soap_bubble' | 'respect_wave' | 'stop_sign' | 'book';
  splashRadius?: number;
  areaEffect?: boolean;
  slowEffect?: boolean;
}

export interface HarmonySpark {
  id: string;
  x: number; // percentage
  y: number; // percentage
  value: number;
  createdAt: number;
}

export interface HarmonyDrop {
  id: string;
  lane: number;
  x: number;
  y?: number;
  value: number;
  size?: 'small' | 'medium' | 'large';
  createdAt?: number;
}

export type QuestionCategory = 
  | 'meaning_of_rules'
  | 'rules_at_home'
  | 'rules_at_school'
  | 'rules_in_society'
  | 'disciplined_behavior'
  | 'consequences_of_breaking_rules'
  | 'hots_civic_cases';

export interface Question {
  id: string;
  category: QuestionCategory;
  categoryTitle: string;
  question: string;
  scenario?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isHots?: boolean;
  scoresEffect: {
    discipline: number;
    responsibility: number;
    respect: number;
    cleanliness: number;
    community: number;
  };
}

export interface LevelConfig {
  id: number;
  worldId: WorldId;
  title: string;
  subtitle: string;
  storyIntro: string;
  learningFocus: string;
  wavesCount: number;
  spawnDelay: number;
  allowedDefenders: DefenderType[];
  initialHarmony: number;
  enemyTypes: EnemyType[];
  bossType?: EnemyType;
  investigationChallenge: {
    caseTitle: string;
    caseScenario: string;
    violatedRuleOptions: string[];
    correctViolatedRule: number;
    importanceOptions: string[];
    correctImportance: number;
    consequenceOptions: string[];
    correctConsequence: number;
    solutionOptions: string[];
    correctSolution: number;
  };
}

export interface CivicScores {
  discipline: number;
  responsibility: number;
  respect: number;
  cleanliness: number;
  community: number;
}

export interface Achievement {
  id: string;
  title: string;
  indonesianTitle: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface ClassroomGroup {
  id: string;
  name: string;
  color: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  investigationsCompleted: number;
  roles: {
    operator: string;
    ruleAnalyst: string;
    disciplineAnalyst: string;
    problemSolver: string;
    recorder: string;
    presenter: string;
  };
}
