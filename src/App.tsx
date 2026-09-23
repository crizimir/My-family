import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
} from './types/family';

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
} from './data/initialData';

import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { PersistentAudioPlayer } from './components/PersistentAudioPlayer';
import { Footer } from './components/Footer';
import { QuickAddModal } from './components/QuickAddModal';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ProfilesPage } from './pages/ProfilesPage';
import { TimelinePage } from './pages/TimelinePage';
import { GalleryPage } from './pages/GalleryPage';
import { PlannerPage } from './pages/PlannerPage';
import { FinancesPage } from './pages/FinancesPage';
import { VaultPage } from './pages/VaultPage';
import { FeedPage } from './pages/FeedPage';
import { PhotoSyncModal } from './components/PhotoSyncModal';
import { CustomizeEverythingModal } from './components/CustomizeEverythingModal';
import { getMediaAsset, saveMediaAsset } from './utils/photoStorage';
import { calculateDaysTogetherLive } from './utils/dateCalculations';
import { LoginScreen } from './components/LoginScreen';
import { Camera, Settings } from 'lucide-react';

const STORAGE_KEY = 'cuares_family_data_v4';

const initialSiteSettings: SiteSettings = {
  familyName: 'Cuares Family',
  sanctuaryTitle: 'The Cuares Haven',
  tagline: 'Everyday warmth, gentle laughter, and our growing little world.',
  description: 'The digital sanctuary of Mirwen, Janine Rae, and our darling daughter. Documenting our quiet coffee mornings, milestone adventures, handwritten letters, and the sweet ordinary days that mean everything.',
  locationCity: 'Pasig City, Philippines',
  establishedYear: '2018',
  togetherSinceDate: '2018-01-01',
};

function AppContent() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Sanctuary Password Authentication (Password: mirwenjanineforever)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cuares_sanctuary_auth_v1') === 'true';
    } catch {
      return false;
    }
  });

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    try {
      localStorage.setItem('cuares_sanctuary_auth_v1', 'true');
    } catch {
      // ignore
    }
  };

  const handleLockSanctuary = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('cuares_sanctuary_auth_v1');
    } catch {
      // ignore
    }
  };

  // Persistent States
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profiles`);
      return saved ? JSON.parse(saved) : initialProfiles;
    } catch {
      return initialProfiles;
    }
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_milestones`);
      return saved ? JSON.parse(saved) : initialMilestones;
    } catch {
      return initialMilestones;
    }
  });

  const [stats, setStats] = useState<StatItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stats`);
      return saved ? JSON.parse(saved) : initialStats;
    } catch {
      return initialStats;
    }
  });

  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_photos`);
      return saved ? JSON.parse(saved) : initialPhotos;
    } catch {
      return initialPhotos;
    }
  });

  const [notes, setNotes] = useState<StickyNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
      return saved ? JSON.parse(saved) : initialNotes;
    } catch {
      return initialNotes;
    }
  });

  const [locations, setLocations] = useState<CherishedLocation[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_locations`);
      return saved ? JSON.parse(saved) : initialLocations;
    } catch {
      return initialLocations;
    }
  });

  const [letters, setLetters] = useState<TimeCapsuleLetter[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_letters`);
      return saved ? JSON.parse(saved) : initialLetters;
    } catch {
      return initialLetters;
    }
  });

  const [bucketList, setBucketList] = useState<BucketListItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bucket`);
      return saved ? JSON.parse(saved) : initialBucketList;
    } catch {
      return initialBucketList;
    }
  });

  const [quotes, setQuotes] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quotes`);
      return saved ? JSON.parse(saved) : initialQuotes;
    } catch {
      return initialQuotes;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      return saved ? JSON.parse(saved) : initialSocialPosts;
    } catch {
      return initialSocialPosts;
    }
  });

  const [routines, setRoutines] = useState<RoutineTask[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_routines`);
      return saved ? JSON.parse(saved) : initialRoutines;
    } catch {
      return initialRoutines;
    }
  });

  const [goals, setGoals] = useState<FamilyGoal[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : initialGoals;
    } catch {
      return initialGoals;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_siteSettings`);
      return saved ? JSON.parse(saved) : initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  });

  const [treeNodes, setTreeNodes] = useState<FamilyTreeNode[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tree`);
      return saved ? JSON.parse(saved) : initialTreeNodes;
    } catch {
      return initialTreeNodes;
    }
  });

  // Dedicated Audio Tracks State (Hailee Steinfeld, Ed Sheeran, Ariana Grande)
  const [tracks, setTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tracks`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((t: AudioTrack) => t.id === 'track-1' || t.id === 'track-4')) {
          return initialTracks;
        }
        return parsed;
      }
      return initialTracks;
    } catch {
      return initialTracks;
    }
  });

  // Dedicated Financial Planner State (Debts, Income This Week, Expenses, Savings)
  const [financialState, setFinancialState] = useState<FamilyFinancialState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_finances`);
      return saved ? JSON.parse(saved) : initialFinancialState;
    } catch {
      return initialFinancialState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_finances`, JSON.stringify(financialState));
    } catch {
      // ignore
    }
  }, [financialState]);

  // Master Customizer Modal State
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Live days together computed from togetherSinceDate including today
  const liveDaysResult = useMemo(() => {
    return calculateDaysTogetherLive(siteSettings.togetherSinceDate);
  }, [siteSettings.togetherSinceDate]);

  const daysTogether = liveDaysResult.days;

  // Sync days into stats state automatically
  useEffect(() => {
    setStats((prev) =>
      prev.map((s) => (s.id === 'days' ? { ...s, value: liveDaysResult.days } : s))
    );
  }, [liveDaysResult.days]);

  // Handler to adjust calendar start date and automatically recalculate live days
  const handleUpdateTogetherSinceDate = (newDate: string) => {
    setSiteSettings((prev) => ({
      ...prev,
      togetherSinceDate: newDate,
    }));
    const calc = calculateDaysTogetherLive(newDate);
    setStats((prev) =>
      prev.map((s) => (s.id === 'days' ? { ...s, value: calc.days } : s))
    );
  };

  // Audio Player State - PERSISTENT ACROSS ALL PAGES
  const [isAudioPlayerOpen, setIsAudioPlayerOpen] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Quick Add Modal State
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Real Photo Upload Modal State & Hero Photo State
  const [isPhotoSyncOpen, setIsPhotoSyncOpen] = useState(false);
  const [heroPhoto, setHeroPhoto] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_heroPhoto`) || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80';
  });

  // Load any IndexedDB custom images on mount
  useEffect(() => {
    getMediaAsset('hero_cover').then((hero) => {
      if (hero) setHeroPhoto(hero);
    });
    getMediaAsset('avatar_mirwen').then((av) => {
      if (av) setProfiles((prev) => prev.map((p) => p.id === 'mirwen' ? { ...p, avatar: av } : p));
    });
    getMediaAsset('avatar_janine').then((av) => {
      if (av) setProfiles((prev) => prev.map((p) => p.id === 'janine' ? { ...p, avatar: av } : p));
    });
    getMediaAsset('avatar_daughter').then((av) => {
      if (av) setProfiles((prev) => prev.map((p) => p.id === 'daughter' ? { ...p, avatar: av } : p));
    });
  }, []);

  const handleUpdateAvatar = (profileId: string, dataUrl: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, avatar: dataUrl } : p))
    );
    saveMediaAsset(`avatar_${profileId}`, dataUrl);
  };

  const handleUpdateHeroPhoto = (dataUrl: string) => {
    setHeroPhoto(dataUrl);
    try {
      localStorage.setItem(`${STORAGE_KEY}_heroPhoto`, dataUrl);
    } catch {
      // ignore
    }
    saveMediaAsset('hero_cover', dataUrl);
  };

  const handleAddBatchPhotos = (newBatch: PhotoItem[]) => {
    setPhotos((prev) => [...newBatch, ...prev]);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_profiles`, JSON.stringify(profiles));
      localStorage.setItem(`${STORAGE_KEY}_milestones`, JSON.stringify(milestones));
      localStorage.setItem(`${STORAGE_KEY}_stats`, JSON.stringify(stats));
      localStorage.setItem(`${STORAGE_KEY}_photos`, JSON.stringify(photos));
      localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
      localStorage.setItem(`${STORAGE_KEY}_locations`, JSON.stringify(locations));
      localStorage.setItem(`${STORAGE_KEY}_letters`, JSON.stringify(letters));
      localStorage.setItem(`${STORAGE_KEY}_bucket`, JSON.stringify(bucketList));
      localStorage.setItem(`${STORAGE_KEY}_quotes`, JSON.stringify(quotes));
      localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(socialPosts));
      localStorage.setItem(`${STORAGE_KEY}_routines`, JSON.stringify(routines));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goals));
      localStorage.setItem(`${STORAGE_KEY}_siteSettings`, JSON.stringify(siteSettings));
      localStorage.setItem(`${STORAGE_KEY}_tree`, JSON.stringify(treeNodes));
      localStorage.setItem(`${STORAGE_KEY}_tracks`, JSON.stringify(tracks));
    } catch {
      // safe fallback
    }
  }, [
    profiles,
    milestones,
    stats,
    photos,
    notes,
    locations,
    letters,
    bucketList,
    quotes,
    socialPosts,
    routines,
    goals,
    siteSettings,
    treeNodes,
    tracks,
  ]);

  // Handlers
  const handleUpdateTrack = (trackId: string, updates: Partial<AudioTrack>) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, ...updates } : t))
    );
  };

  const handleHeartProfile = (id: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hearts: p.hearts + 1 } : p))
    );
  };

  const handleAddMilestone = (newM: Omit<TimelineMilestone, 'id'>) => {
    const item: TimelineMilestone = {
      ...newM,
      id: `m_${Date.now()}`,
    };
    setMilestones((prev) => [...prev, item]);
  };

  const handleIncrementHug = () => {
    setStats((prev) =>
      prev.map((s) => (s.id === 'hugs' ? { ...s, value: s.value + 1 } : s))
    );
  };

  const handleAddPhoto = (newP: Omit<PhotoItem, 'id' | 'likes'>) => {
    const item: PhotoItem = {
      ...newP,
      id: `p_${Date.now()}`,
      likes: 1,
    };
    setPhotos((prev) => [item, ...prev]);
  };

  const handleLikePhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleAddNote = (newN: Omit<StickyNote, 'id'>) => {
    const item: StickyNote = {
      ...newN,
      id: `n_${Date.now()}`,
    };
    setNotes((prev) => [item, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleAddLocation = (newLoc: Omit<CherishedLocation, 'id'>) => {
    const item: CherishedLocation = {
      ...newLoc,
      id: `loc_${Date.now()}`,
    };
    setLocations((prev) => [...prev, item]);
  };

  const handleAddLetter = (newL: Omit<TimeCapsuleLetter, 'id' | 'sealedAt'>) => {
    const item: TimeCapsuleLetter = {
      ...newL,
      id: `tc_${Date.now()}`,
      sealedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };
    setLetters((prev) => [...prev, item]);
  };

  const handleToggleBucket = (id: string) => {
    setBucketList((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              completed: !b.completed,
              completedDate: !b.completed
                ? new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : undefined,
            }
          : b
      )
    );
  };

  const handleAddBucket = (newB: Omit<BucketListItem, 'id' | 'completed'>) => {
    const item: BucketListItem = {
      ...newB,
      id: `bl_${Date.now()}`,
      completed: false,
    };
    setBucketList((prev) => [...prev, item]);
  };

  const handleAddQuote = (newQ: Omit<QuoteItem, 'id'>) => {
    const item: QuoteItem = {
      ...newQ,
      id: `q_${Date.now()}`,
    };
    setQuotes((prev) => [item, ...prev]);
  };

  const handleAddPost = (newPost: Omit<SocialPost, 'id' | 'likes' | 'comments' | 'userLiked'>) => {
    const item: SocialPost = {
      ...newPost,
      id: `sp_${Date.now()}`,
      likes: 1,
      userLiked: true,
      comments: [],
    };
    setSocialPosts((prev) => [item, ...prev]);
  };

  const handleLikePost = (id: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.userLiked;
          return {
            ...p,
            userLiked: isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string, author: string) => {
    setSocialPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c_${Date.now()}`,
                author,
                text,
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
  };

  const handleToggleRoutine = (id: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleAddRoutine = (newTask: Omit<RoutineTask, 'id' | 'completed'>) => {
    const item: RoutineTask = {
      ...newTask,
      id: `r_${Date.now()}`,
      completed: false,
    };
    setRoutines((prev) => [...prev, item]);
  };

  const handleToggleMilestone = (goalId: string, milestoneIndex: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = [...g.milestones];
          updated[milestoneIndex] = {
            ...updated[milestoneIndex],
            done: !updated[milestoneIndex].done,
          };
          const doneCount = updated.filter((m) => m.done).length;
          const newProgress = Math.round((doneCount / updated.length) * 100);
          return {
            ...g,
            milestones: updated,
            progress: newProgress,
          };
        }
        return g;
      })
    );
  };

  const handleAddGoal = (newGoal: Omit<FamilyGoal, 'id' | 'progress'>) => {
    const item: FamilyGoal = {
      ...newGoal,
      id: `g_${Date.now()}`,
      progress: 0,
    };
    setGoals((prev) => [...prev, item]);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all family memory entries to default?')) {
      localStorage.clear();
      setSiteSettings(initialSiteSettings);
      setTreeNodes(initialTreeNodes);
      setProfiles(initialProfiles);
      setMilestones(initialMilestones);
      setStats(initialStats);
      setPhotos(initialPhotos);
      setNotes(initialNotes);
      setLocations(initialLocations);
      setLetters(initialLetters);
      setBucketList(initialBucketList);
      setQuotes(initialQuotes);
      setSocialPosts(initialSocialPosts);
      setRoutines(initialRoutines);
      setGoals(initialGoals);
      setTracks(initialTracks);
      setFinancialState(initialFinancialState);
    }
  };

  const handleClearToBlank = () => {
    setSiteSettings({
      familyName: 'Our Family',
      sanctuaryTitle: 'Our Family Sanctuary',
      tagline: 'Welcome to our private family haven.',
      description: 'Customize this story with your family memories, love notes, and journeys.',
      locationCity: 'Our City, Country',
      establishedYear: `${new Date().getFullYear()}`,
      togetherSinceDate: `${new Date().getFullYear()}-01-01`,
    });
    setProfiles([
      {
        id: 'mirwen',
        name: 'Mirwen H. Cuares',
        role: 'Dad & Family Member',
        nickname: 'Mirwen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        colorScheme: 'amber',
        bio: 'Write Mirwen’s real story and thoughts here...',
        birthday: 'Add Birthday',
        favoriteThings: {
          coffeeOrDrink: 'Favorite Drink',
          comfortFood: 'Comfort Food',
          hobby: 'Favorite Hobby',
          song: 'Favorite Song',
        },
        loveNote: 'Write a real personal note here.',
        quirk: 'Add a personal quirk.',
        hearts: 0,
      },
      {
        id: 'janine',
        name: 'Janine Rae D Cuares',
        role: 'Mom & Family Member',
        nickname: 'Janine',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        colorScheme: 'rose',
        bio: 'Write Janine’s real story and thoughts here...',
        birthday: 'Add Birthday',
        favoriteThings: {
          coffeeOrDrink: 'Favorite Drink',
          comfortFood: 'Comfort Food',
          hobby: 'Favorite Hobby',
          song: 'Favorite Song',
        },
        loveNote: 'Write a real personal note here.',
        quirk: 'Add a personal quirk.',
        hearts: 0,
      },
      {
        id: 'daughter',
        name: 'Our Daughter',
        role: 'Our Sweet Daughter',
        nickname: 'Sweetheart',
        avatar: 'https://images.unsplash.com/photo-1595454223600-91fbdd921f64?auto=format&fit=crop&w=400&q=80',
        colorScheme: 'lavender',
        bio: 'Write our daughter’s real story and milestones here...',
        birthday: 'Add Birthday',
        favoriteThings: {
          coffeeOrDrink: 'Warm Milk / Juice',
          comfortFood: 'Favorite Snack',
          hobby: 'Favorite Activity',
          song: 'Favorite Song',
        },
        loveNote: 'A tender note for our daughter.',
        quirk: 'Cute quirk.',
        hearts: 0,
      },
    ]);
    setMilestones([]);
    setQuotes([]);
    setLocations([]);
    setRoutines([]);
    setGoals([]);
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-[#e2e8f0] relative flex flex-col justify-between">
      <ScrollToTop />

      {/* 1. Loading Screen */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* 2. Professional Sanctuary Login Gatekeeper */}
      {!isAuthenticated && (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}

      <div>
        {/* Navigation Top Bar with multi-page routes */}
        <Navbar
          onOpenQuickAdd={() => setQuickAddOpen(true)}
          isAudioPlaying={isAudioPlaying}
          onToggleAudioPlayer={() => setIsAudioPlayerOpen((prev) => !prev)}
          onOpenPhotoSync={() => setIsPhotoSyncOpen(true)}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onLockSanctuary={handleLockSanctuary}
        />

        {/* Page Routes */}
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  stats={stats}
                  quotes={quotes}
                  profiles={profiles}
                  routines={routines}
                  onIncrementHug={handleIncrementHug}
                  onAddQuote={handleAddQuote}
                  heroPhoto={heroPhoto}
                  onUpdateHeroPhoto={handleUpdateHeroPhoto}
                  onOpenPhotoSync={() => setIsPhotoSyncOpen(true)}
                  siteSettings={siteSettings}
                  onOpenCustomizer={() => setIsCustomizerOpen(true)}
                  onUpdateTogetherSinceDate={handleUpdateTogetherSinceDate}
                />
              }
            />
            <Route
              path="/profiles"
              element={
                <ProfilesPage
                  profiles={profiles}
                  onHeartProfile={handleHeartProfile}
                  onUpdateAvatar={handleUpdateAvatar}
                  onOpenPhotoSync={() => setIsPhotoSyncOpen(true)}
                  onOpenCustomizer={() => setIsCustomizerOpen(true)}
                />
              }
            />
            <Route
              path="/timeline"
              element={
                <TimelinePage
                  milestones={milestones}
                  locations={locations}
                  onAddMilestone={handleAddMilestone}
                  onAddLocation={handleAddLocation}
                />
              }
            />
            <Route
              path="/gallery"
              element={
                <GalleryPage
                  photos={photos}
                  notes={notes}
                  onAddPhoto={handleAddPhoto}
                  onLikePhoto={handleLikePhoto}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onOpenPhotoSync={() => setIsPhotoSyncOpen(true)}
                />
              }
            />
            <Route
              path="/planner"
              element={
                <PlannerPage
                  routines={routines}
                  bucketList={bucketList}
                  goals={goals}
                  financialState={financialState}
                  onToggleRoutine={handleToggleRoutine}
                  onAddRoutine={handleAddRoutine}
                  onToggleBucket={handleToggleBucket}
                  onAddBucket={handleAddBucket}
                  onToggleMilestone={handleToggleMilestone}
                  onAddGoal={handleAddGoal}
                  onUpdateFinancialState={setFinancialState}
                />
              }
            />
            <Route
              path="/finances"
              element={
                <FinancesPage
                  financialState={financialState}
                  onUpdateFinancialState={setFinancialState}
                />
              }
            />
            <Route
              path="/vault"
              element={
                <VaultPage
                  letters={letters}
                  treeNodes={treeNodes}
                  onAddLetter={handleAddLetter}
                />
              }
            />
            <Route
              path="/feed"
              element={
                <FeedPage
                  posts={socialPosts}
                  onAddPost={handleAddPost}
                  onLikePost={handleLikePost}
                  onAddComment={handleAddComment}
                />
              }
            />
          </Routes>
        </main>
      </div>

      {/* Global Footer */}
      <Footer onResetData={handleResetData} />

      {/* Persistent Audio Pop-up - stays playing across all pages */}
      <PersistentAudioPlayer
        tracks={tracks}
        isOpen={isAudioPlayerOpen}
        onClose={() => setIsAudioPlayerOpen(false)}
        isPlaying={isAudioPlaying}
        setIsPlaying={setIsAudioPlaying}
        onUpdateTrack={handleUpdateTrack}
      />

      {/* Quick Add Memory Action Modal */}
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSelectAction={(action) => {
          switch (action) {
            case 'post':
              navigate('/feed');
              break;
            case 'photo':
              navigate('/gallery');
              break;
            case 'note':
              navigate('/gallery');
              break;
            case 'milestone':
              navigate('/timeline');
              break;
            case 'bucket':
              navigate('/planner');
              break;
            case 'goal':
              navigate('/planner');
              break;
          }
        }}
      />

      {/* Real Photo Upload & Assignment Modal */}
      <PhotoSyncModal
        isOpen={isPhotoSyncOpen}
        onClose={() => setIsPhotoSyncOpen(false)}
        profiles={profiles}
        onUpdateAvatar={handleUpdateAvatar}
        heroPhoto={heroPhoto}
        onUpdateHeroPhoto={handleUpdateHeroPhoto}
        onAddPhotos={handleAddBatchPhotos}
      />

      {/* Master Customizer: Edit EVERYTHING on this App */}
      <CustomizeEverythingModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        siteSettings={siteSettings}
        onUpdateSiteSettings={setSiteSettings}
        heroPhoto={heroPhoto}
        onUpdateHeroPhoto={handleUpdateHeroPhoto}
        profiles={profiles}
        onUpdateProfiles={setProfiles}
        stats={stats}
        onUpdateStats={setStats}
        milestones={milestones}
        onUpdateMilestones={setMilestones}
        quotes={quotes}
        onUpdateQuotes={setQuotes}
        locations={locations}
        onUpdateLocations={setLocations}
        treeNodes={treeNodes}
        onUpdateTreeNodes={setTreeNodes}
        routines={routines}
        onUpdateRoutines={setRoutines}
        goals={goals}
        onUpdateGoals={setGoals}
        onResetAllData={handleResetData}
        onClearToBlank={handleClearToBlank}
      />

      {/* Persistent Floating Quick-Access Controls */}
      <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-30 flex flex-col gap-2.5 items-end pointer-events-none">
        {/* Customize Everything Quick Trigger */}
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="pointer-events-auto px-4 py-2.5 rounded-full bg-[#0d1527]/95 hover:bg-[#162238] text-white border border-[#38bdf8]/50 shadow-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2 group shadow-black/80"
          title="Customize all names, text, dates, stats, and milestones"
        >
          <div className="w-5 h-5 rounded-full bg-[#38bdf8]/20 flex items-center justify-center text-[#38bdf8]">
            <Settings className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" />
          </div>
          <span className="text-xs font-semibold text-[#7dd3fc] pr-1">
            Customize Everything
          </span>
        </button>

        {/* Real Photo Upload Trigger */}
        <button
          onClick={() => setIsPhotoSyncOpen(true)}
          className="pointer-events-auto px-4 py-2.5 rounded-full bg-[#171b28]/95 hover:bg-[#202638] text-white border border-[#f472b6]/40 shadow-2xl backdrop-blur-md transition-all hover:scale-105 flex items-center gap-2 group shadow-black/80"
          title="Upload your real camera photos"
        >
          <div className="w-5 h-5 rounded-full bg-[#f472b6]/20 flex items-center justify-center text-[#f472b6]">
            <Camera className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-[#f8b4d9] pr-1">
            Upload Real Photos
          </span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
