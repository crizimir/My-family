import { supabase } from './supabaseClient';
import {
  Profile,
  TimelineMilestone,
  StatItem,
  PhotoItem,
  StickyNote,
  CherishedLocation,
  TimeCapsuleLetter,
  BucketListItem,
  QuoteItem,
  FamilyTreeNode,
  SocialPost,
  RoutineTask,
  FamilyGoal,
  AudioTrack,
  SiteSettings,
  FamilyFinancialState,
} from '../types/family';

import {
  initialProfiles,
  initialMilestones,
  initialStats,
  initialPhotos,
  initialNotes,
  initialLocations,
  initialLetters,
  initialBucketList,
  initialQuotes,
  initialTreeNodes,
  initialSocialPosts,
  initialRoutines,
  initialGoals,
  initialTracks,
  initialFinancialState,
} from '../data/initialData';

export const DEFAULT_HERO_PHOTO = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  familyName: 'Cuares Family',
  sanctuaryTitle: 'The Cuares Haven',
  tagline: 'Everyday warmth, gentle laughter, and our growing little world.',
  description: 'The digital sanctuary of Mirwen, Janine Rae, and our darling daughter. Documenting our quiet coffee mornings, milestone adventures, handwritten letters, and the sweet ordinary days that mean everything.',
  locationCity: 'Pasig City, Philippines',
  establishedYear: '2018',
  togetherSinceDate: '2018-01-01',
};

const DATA_KEYS = [
  'profiles',
  'milestones',
  'stats',
  'photos',
  'notes',
  'locations',
  'letters',
  'bucketList',
  'quotes',
  'treeNodes',
  'socialPosts',
  'routines',
  'goals',
  'tracks',
  'financialState',
] as const;

type DataKey = (typeof DATA_KEYS)[number];

const INITIAL_DATA: Record<DataKey, unknown> = {
  profiles: initialProfiles,
  milestones: initialMilestones,
  stats: initialStats,
  photos: initialPhotos,
  notes: initialNotes,
  locations: initialLocations,
  letters: initialLetters,
  bucketList: initialBucketList,
  quotes: initialQuotes,
  treeNodes: initialTreeNodes,
  socialPosts: initialSocialPosts,
  routines: initialRoutines,
  goals: initialGoals,
  tracks: initialTracks,
  financialState: initialFinancialState,
};

export interface SanctuaryState {
  profiles: Profile[];
  milestones: TimelineMilestone[];
  stats: StatItem[];
  photos: PhotoItem[];
  notes: StickyNote[];
  locations: CherishedLocation[];
  letters: TimeCapsuleLetter[];
  bucketList: BucketListItem[];
  quotes: QuoteItem[];
  treeNodes: FamilyTreeNode[];
  socialPosts: SocialPost[];
  routines: RoutineTask[];
  goals: FamilyGoal[];
  tracks: AudioTrack[];
  financialState: FamilyFinancialState;
  siteSettings: SiteSettings;
  heroPhoto: string;
}

/**
 * Loads all state from Supabase. On first run (empty database), seeds with initial data.
 */
export async function loadSanctuaryState(): Promise<SanctuaryState> {
  // Load settings (singleton row id=1)
  const { data: settingsRow } = await supabase
    .from('sanctuary_settings')
    .select('data, hero_photo')
    .eq('id', 1)
    .maybeSingle();

  // Load all data keys
  const { data: dataRows } = await supabase
    .from('sanctuary_data')
    .select('key, value');

  const dataMap = new Map<string, unknown>();
  if (dataRows) {
    for (const row of dataRows) {
      dataMap.set(row.key, row.value);
    }
  }

  // Build state, falling back to initial data for any missing keys
  const state: SanctuaryState = {
    profiles: (dataMap.get('profiles') as Profile[]) ?? INITIAL_DATA.profiles,
    milestones: (dataMap.get('milestones') as TimelineMilestone[]) ?? INITIAL_DATA.milestones,
    stats: (dataMap.get('stats') as StatItem[]) ?? INITIAL_DATA.stats,
    photos: (dataMap.get('photos') as PhotoItem[]) ?? INITIAL_DATA.photos,
    notes: (dataMap.get('notes') as StickyNote[]) ?? INITIAL_DATA.notes,
    locations: (dataMap.get('locations') as CherishedLocation[]) ?? INITIAL_DATA.locations,
    letters: (dataMap.get('letters') as TimeCapsuleLetter[]) ?? INITIAL_DATA.letters,
    bucketList: (dataMap.get('bucketList') as BucketListItem[]) ?? INITIAL_DATA.bucketList,
    quotes: (dataMap.get('quotes') as QuoteItem[]) ?? INITIAL_DATA.quotes,
    treeNodes: (dataMap.get('treeNodes') as FamilyTreeNode[]) ?? INITIAL_DATA.treeNodes,
    socialPosts: (dataMap.get('socialPosts') as SocialPost[]) ?? INITIAL_DATA.socialPosts,
    routines: (dataMap.get('routines') as RoutineTask[]) ?? INITIAL_DATA.routines,
    goals: (dataMap.get('goals') as FamilyGoal[]) ?? INITIAL_DATA.goals,
    tracks: (dataMap.get('tracks') as AudioTrack[]) ?? INITIAL_DATA.tracks,
    financialState: (dataMap.get('financialState') as FamilyFinancialState) ?? INITIAL_DATA.financialState,
    siteSettings: (settingsRow?.data as SiteSettings) ?? DEFAULT_SITE_SETTINGS,
    heroPhoto: settingsRow?.hero_photo ?? DEFAULT_HERO_PHOTO,
  };

  // If database was empty, seed it now
  if (!settingsRow) {
    await seedDatabase(state);
  }

  return state;
}

/**
 * Seeds the database with initial data on first run.
 */
async function seedDatabase(state: SanctuaryState): Promise<void> {
  // Insert settings (upsert so it's idempotent if the row already exists)
  await supabase
    .from('sanctuary_settings')
    .upsert({
      id: 1,
      data: state.siteSettings,
      hero_photo: state.heroPhoto,
    }, { onConflict: 'id' });

  // Insert all data keys that don't already exist
  const inserts = DATA_KEYS.map((key) => ({
    key,
    value: state[key],
  }));

  await supabase.from('sanctuary_data').upsert(inserts, { onConflict: 'key' });
}

/**
 * Saves a single data key to the database.
 */
export async function saveDataKey(key: DataKey, value: unknown): Promise<void> {
  await supabase
    .from('sanctuary_data')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
}

/**
 * Saves site settings to the database.
 */
export async function saveSiteSettings(settings: SiteSettings, heroPhoto: string): Promise<void> {
  await supabase
    .from('sanctuary_settings')
    .upsert({
      id: 1,
      data: settings,
      hero_photo: heroPhoto,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
}

export type { DataKey };
