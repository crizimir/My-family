import React, { useState } from 'react';
import {
  X,
  Settings,
  User,
  Calendar,
  BarChart2,
  MapPin,
  Quote,
  Sparkles,
  Layers,
  Clock,
  Target,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  Camera,
  Heart,
  Save,
  FileText,
} from 'lucide-react';
import {
  Profile,
  TimelineMilestone,
  StatItem,
  CherishedLocation,
  QuoteItem,
  FamilyTreeNode,
  RoutineTask,
  FamilyGoal,
  SiteSettings,
} from '../types/family';
import { processImageFile } from '../utils/photoStorage';

interface CustomizeEverythingModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  heroPhoto: string;
  onUpdateHeroPhoto: (url: string) => void;
  profiles: Profile[];
  onUpdateProfiles: (profiles: Profile[]) => void;
  stats: StatItem[];
  onUpdateStats: (stats: StatItem[]) => void;
  milestones: TimelineMilestone[];
  onUpdateMilestones: (milestones: TimelineMilestone[]) => void;
  quotes: QuoteItem[];
  onUpdateQuotes: (quotes: QuoteItem[]) => void;
  locations: CherishedLocation[];
  onUpdateLocations: (locations: CherishedLocation[]) => void;
  treeNodes: FamilyTreeNode[];
  onUpdateTreeNodes: (nodes: FamilyTreeNode[]) => void;
  routines: RoutineTask[];
  onUpdateRoutines: (routines: RoutineTask[]) => void;
  goals: FamilyGoal[];
  onUpdateGoals: (goals: FamilyGoal[]) => void;
  onResetAllData: () => void;
  onClearToBlank: () => void;
}

type TabType =
  | 'site'
  | 'profiles'
  | 'stats'
  | 'timeline'
  | 'quotes'
  | 'locations'
  | 'tree'
  | 'routines'
  | 'goals'
  | 'backup';

export const CustomizeEverythingModal: React.FC<CustomizeEverythingModalProps> = ({
  isOpen,
  onClose,
  siteSettings,
  onUpdateSiteSettings,
  heroPhoto,
  onUpdateHeroPhoto,
  profiles,
  onUpdateProfiles,
  stats,
  onUpdateStats,
  milestones,
  onUpdateMilestones,
  quotes,
  onUpdateQuotes,
  locations,
  onUpdateLocations,
  treeNodes,
  onUpdateTreeNodes,
  routines,
  onUpdateRoutines,
  goals,
  onUpdateGoals,
  onResetAllData,
  onClearToBlank,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('site');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Local draft state for site settings
  const [localSettings, setLocalSettings] = useState<SiteSettings>(siteSettings);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(
    profiles[0]?.id || null
  );

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const saveSettings = () => {
    onUpdateSiteSettings(localSettings);
    showToast('Site settings saved!');
  };

  // Profile operations
  const handleProfileFieldChange = (id: string, field: string, value: any) => {
    const updated = profiles.map((p) => {
      if (p.id !== id) return p;
      if (field.startsWith('fav_')) {
        const sub = field.replace('fav_', '');
        return {
          ...p,
          favoriteThings: { ...p.favoriteThings, [sub]: value },
        };
      }
      return { ...p, [field]: value };
    });
    onUpdateProfiles(updated);
  };

  const handleAddProfile = () => {
    const newPerson: Profile = {
      id: `person_${Date.now()}`,
      name: 'New Family Member',
      role: 'Family Member',
      nickname: 'Nickname',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      colorScheme: 'lavender',
      bio: 'Tell their story here...',
      birthday: 'Month Day',
      favoriteThings: {
        coffeeOrDrink: 'Favorite Drink',
        comfortFood: 'Comfort Food',
        hobby: 'Favorite Hobby',
        song: 'Favorite Song',
      },
      loveNote: 'A gentle note about this person.',
      quirk: 'A funny or endearing quirk.',
      hearts: 10,
    };
    onUpdateProfiles([...profiles, newPerson]);
    setEditingProfileId(newPerson.id);
    showToast('Added new member! Customize below.');
  };

  const handleDeleteProfile = (id: string) => {
    if (profiles.length <= 1) {
      showToast('You must have at least one profile.');
      return;
    }
    const filtered = profiles.filter((p) => p.id !== id);
    onUpdateProfiles(filtered);
    setEditingProfileId(filtered[0]?.id || null);
    showToast('Member removed.');
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const bundle = {
      siteSettings: localSettings,
      heroPhoto,
      profiles,
      stats,
      milestones,
      quotes,
      locations,
      treeNodes,
      routines,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cuares_family_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported site data as JSON!');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.siteSettings) {
          setLocalSettings(data.siteSettings);
          onUpdateSiteSettings(data.siteSettings);
        }
        if (data.heroPhoto) onUpdateHeroPhoto(data.heroPhoto);
        if (data.profiles) onUpdateProfiles(data.profiles);
        if (data.stats) onUpdateStats(data.stats);
        if (data.milestones) onUpdateMilestones(data.milestones);
        if (data.quotes) onUpdateQuotes(data.quotes);
        if (data.locations) onUpdateLocations(data.locations);
        if (data.treeNodes) onUpdateTreeNodes(data.treeNodes);
        if (data.routines) onUpdateRoutines(data.routines);
        if (data.goals) onUpdateGoals(data.goals);
        showToast('Successfully imported your custom data!');
      } catch (err) {
        showToast('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const currentProfile = profiles.find((p) => p.id === editingProfileId) || profiles[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#10121a] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2434] flex items-center justify-between bg-[#141724]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-semibold text-white flex items-center gap-2">
                <span>Customize Everything</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/30">
                  Full Control
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Modify names, dates, stories, milestones, photos, and counters to match your exact family life.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1f2434] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-[#38bdf8]/20 border-b border-[#38bdf8]/30 px-4 py-2 text-xs text-white font-medium flex items-center justify-center gap-2 animate-fade-in">
            <Check className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1f2434] bg-[#121520] px-4 overflow-x-auto gap-1">
          {[
            { id: 'site', label: 'Site & Hero', icon: Settings },
            { id: 'profiles', label: 'Family Members', icon: User },
            { id: 'stats', label: 'Statistics', icon: BarChart2 },
            { id: 'timeline', label: 'Milestones', icon: Calendar },
            { id: 'quotes', label: 'Quotes', icon: Quote },
            { id: 'locations', label: 'Places / Map', icon: MapPin },
            { id: 'tree', label: 'Family Tree', icon: Layers },
            { id: 'routines', label: 'Routines', icon: Clock },
            { id: 'goals', label: 'Goals', icon: Target },
            { id: 'backup', label: 'Backup & Wipe', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#38bdf8] text-white bg-[#1a1f30]'
                    : 'border-transparent text-[#94a3b8] hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#38bdf8]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar bg-[#0f1118]">
          {/* 1. SITE & HERO TAB */}
          {activeTab === 'site' && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">General Site & Hero Info</h3>
                <p className="text-xs text-[#94a3b8]">
                  Customize the website title, family name, city location, and introduction text.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Family / Wordmark Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.familyName}
                    onChange={(e) => setLocalSettings({ ...localSettings, familyName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="e.g. Cuares Family"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Sanctuary / House Name
                  </label>
                  <input
                    type="text"
                    value={localSettings.sanctuaryTitle}
                    onChange={(e) => setLocalSettings({ ...localSettings, sanctuaryTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="e.g. The Cuares Haven"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={localSettings.locationCity}
                    onChange={(e) => setLocalSettings({ ...localSettings, locationCity: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="e.g. Pasig City, Philippines"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={localSettings.establishedYear}
                    onChange={(e) => setLocalSettings({ ...localSettings, establishedYear: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="e.g. 2018"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Together Since Date (Calculates Live Days Together)
                  </label>
                  <input
                    type="date"
                    value={localSettings.togetherSinceDate}
                    onChange={(e) => setLocalSettings({ ...localSettings, togetherSinceDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={localSettings.tagline}
                    onChange={(e) => setLocalSettings({ ...localSettings, tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="Main hero banner heading"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    Hero Description / Story
                  </label>
                  <textarea
                    rows={3}
                    value={localSettings.description}
                    onChange={(e) => setLocalSettings({ ...localSettings, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                    placeholder="Brief story introducing your family sanctuary..."
                  />
                </div>
              </div>

              {/* Hero Photo Setting */}
              <div className="p-4 rounded-xl bg-[#151926] border border-[#22283a] space-y-3">
                <h4 className="text-xs font-semibold text-white">Main Sanctuary Hero Cover Photo</h4>
                <div className="flex items-center gap-4">
                  <img
                    src={heroPhoto}
                    alt="Hero Cover"
                    className="w-24 h-16 rounded-lg object-cover border border-[#2e374d]"
                  />
                  <div className="space-y-1.5 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#1e2333] hover:bg-[#283045] text-white border border-[#2e374d] rounded-lg cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
                      <span>Upload New Cover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const dataUrl = await processImageFile(file);
                            onUpdateHeroPhoto(dataUrl);
                            showToast('Cover photo updated!');
                          }
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-[#94a3b8]">Or paste an image URL:</p>
                    <input
                      type="text"
                      value={heroPhoto}
                      onChange={(e) => onUpdateHeroPhoto(e.target.value)}
                      className="w-full px-2.5 py-1 bg-[#10131d] border border-[#2b3347] rounded-lg text-white text-[11px] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={saveSettings}
                className="px-5 py-2 text-xs font-medium bg-[#38bdf8] hover:bg-[#0ea5e9] text-black rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Site Settings</span>
              </button>
            </div>
          )}

          {/* 2. FAMILY PROFILES TAB */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Family Member Profiles</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Click any member to edit their name, nickname, bio, birthday, favorite drink, food, hobby, and photo.
                  </p>
                </div>
                <button
                  onClick={handleAddProfile}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Family Member</span>
                </button>
              </div>

              {/* Profile Picker Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#1f2434]">
                {profiles.map((p) => {
                  const isSelected = p.id === currentProfile?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setEditingProfileId(p.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#1e2333] border-[#38bdf8] text-white shadow-sm'
                          : 'bg-[#141724] border-[#22283a] text-[#94a3b8] hover:text-white'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
                      <span>{p.name || 'Unnamed'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editing Form for Current Profile */}
              {currentProfile && (
                <div className="bg-[#141724] border border-[#22283a] rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2536]">
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <img
                          src={currentProfile.avatar}
                          alt={currentProfile.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-[#38bdf8]/40"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer rounded-2xl transition-opacity">
                          <Camera className="w-4 h-4 text-[#38bdf8]" />
                          <span className="text-[9px]">Change</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const dataUrl = await processImageFile(file);
                                handleProfileFieldChange(currentProfile.id, 'avatar', dataUrl);
                                showToast('Photo updated!');
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-white">{currentProfile.name}</h4>
                        <p className="text-xs text-[#94a3b8]">{currentProfile.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProfile(currentProfile.id)}
                      className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Profile</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={currentProfile.name}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Nickname</label>
                      <input
                        type="text"
                        value={currentProfile.nickname}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'nickname', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Role in Family</label>
                      <input
                        type="text"
                        value={currentProfile.role}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Birthday</label>
                      <input
                        type="text"
                        value={currentProfile.birthday}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'birthday', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                        placeholder="e.g. October 14"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Color Theme</label>
                      <select
                        value={currentProfile.colorScheme}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'colorScheme', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      >
                        <option value="amber">Amber / Warm Gold</option>
                        <option value="rose">Rose / Blush Pink</option>
                        <option value="lavender">Lavender / Soft Purple</option>
                        <option value="peach">Peach / Pastel Coral</option>
                        <option value="mint">Mint / Sage Green</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Favorite Drink</label>
                      <input
                        type="text"
                        value={currentProfile.favoriteThings.coffeeOrDrink}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'fav_coffeeOrDrink', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Comfort Food</label>
                      <input
                        type="text"
                        value={currentProfile.favoriteThings.comfortFood}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'fav_comfortFood', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Hobby</label>
                      <input
                        type="text"
                        value={currentProfile.favoriteThings.hobby}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'fav_hobby', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Favorite Song</label>
                      <input
                        type="text"
                        value={currentProfile.favoriteThings.song}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'fav_song', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Bio / Story</label>
                      <textarea
                        rows={2}
                        value={currentProfile.bio}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'bio', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Love Note</label>
                      <textarea
                        rows={2}
                        value={currentProfile.loveNote}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'loveNote', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2 md:col-span-3">
                      <label className="block text-[11px] font-medium text-[#94a3b8] mb-1">Quirk / Habit</label>
                      <input
                        type="text"
                        value={currentProfile.quirk}
                        onChange={(e) => handleProfileFieldChange(currentProfile.id, 'quirk', e.target.value)}
                        className="w-full px-3 py-1.5 bg-[#171b28] border border-[#2b3347] rounded-xl text-white text-xs focus:border-[#38bdf8] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. STATISTICS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Animated Stat Counters</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Edit counter values, labels, and descriptions displayed on the Home page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newStat: StatItem = {
                      id: `stat_${Date.now()}`,
                      label: 'New Counter',
                      value: 100,
                      suffix: '+',
                      description: 'Custom description',
                      accent: '#f472b6',
                    };
                    onUpdateStats([...stats, newStat]);
                    showToast('Counter added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Counter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                  <div key={stat.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].label = e.target.value;
                          onUpdateStats(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white font-medium text-xs focus:outline-none"
                        placeholder="Label"
                      />
                      <button
                        onClick={() => {
                          const updated = stats.filter((s) => s.id !== stat.id);
                          onUpdateStats(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Value</label>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...stats];
                            updated[idx].value = Number(e.target.value) || 0;
                            onUpdateStats(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Suffix</label>
                        <input
                          type="text"
                          value={stat.suffix || ''}
                          onChange={(e) => {
                            const updated = [...stats];
                            updated[idx].suffix = e.target.value;
                            onUpdateStats(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                          placeholder="+, km, etc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#94a3b8]">Description</label>
                      <input
                        type="text"
                        value={stat.description}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx].description = e.target.value;
                          onUpdateStats(updated);
                        }}
                        className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TIMELINE MILESTONES TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Timeline Milestones</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Add, edit, or delete the major milestones of your journey together.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newM: TimelineMilestone = {
                      id: `m_${Date.now()}`,
                      title: 'New Milestone',
                      date: 'Month Year',
                      year: new Date().getFullYear(),
                      description: 'Milestone story...',
                      category: 'milestone',
                      location: 'City / Place',
                    };
                    onUpdateMilestones([newM, ...milestones]);
                    showToast('Milestone added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={m.title}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].title = e.target.value;
                          onUpdateMilestones(updated);
                        }}
                        className="w-full sm:w-1/2 px-2.5 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white font-medium text-xs focus:outline-none"
                        placeholder="Milestone title"
                      />
                      <button
                        onClick={() => {
                          const updated = milestones.filter((item) => item.id !== m.id);
                          onUpdateMilestones(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Display Date</label>
                        <input
                          type="text"
                          value={m.date}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].date = e.target.value;
                            onUpdateMilestones(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                          placeholder="e.g. June 2021"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Year (Sorting)</label>
                        <input
                          type="number"
                          value={m.year}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].year = Number(e.target.value) || 2020;
                            onUpdateMilestones(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Location</label>
                        <input
                          type="text"
                          value={m.location || ''}
                          onChange={(e) => {
                            const updated = [...milestones];
                            updated[idx].location = e.target.value;
                            onUpdateMilestones(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                          placeholder="Place name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#94a3b8]">Description</label>
                      <textarea
                        rows={2}
                        value={m.description}
                        onChange={(e) => {
                          const updated = [...milestones];
                          updated[idx].description = e.target.value;
                          onUpdateMilestones(updated);
                        }}
                        className="w-full px-2.5 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Family Quote Board</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Add heartwarming or hilarious quotes said by family members.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newQ: QuoteItem = {
                      id: `q_${Date.now()}`,
                      quote: 'Add a new funny or sweet quote here...',
                      author: 'Mirwen',
                      context: 'During morning coffee',
                      year: `${new Date().getFullYear()}`,
                    };
                    onUpdateQuotes([newQ, ...quotes]);
                    showToast('Quote added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quote</span>
                </button>
              </div>

              <div className="space-y-3">
                {quotes.map((q, idx) => (
                  <div key={q.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={q.quote}
                        onChange={(e) => {
                          const updated = [...quotes];
                          updated[idx].quote = e.target.value;
                          onUpdateQuotes(updated);
                        }}
                        className="w-full px-2.5 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        placeholder="Quote text"
                      />
                      <button
                        onClick={() => {
                          const updated = quotes.filter((item) => item.id !== q.id);
                          onUpdateQuotes(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Speaker</label>
                        <input
                          type="text"
                          value={q.author}
                          onChange={(e) => {
                            const updated = [...quotes];
                            updated[idx].author = e.target.value;
                            onUpdateQuotes(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Context / Situation</label>
                        <input
                          type="text"
                          value={q.context}
                          onChange={(e) => {
                            const updated = [...quotes];
                            updated[idx].context = e.target.value;
                            onUpdateQuotes(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Year</label>
                        <input
                          type="text"
                          value={q.year}
                          onChange={(e) => {
                            const updated = [...quotes];
                            updated[idx].year = e.target.value;
                            onUpdateQuotes(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LOCATIONS TAB */}
          {activeTab === 'locations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Cherished Places</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Pin memorable locations where you met, traveled, or created special memories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newLoc: CherishedLocation = {
                      id: `loc_${Date.now()}`,
                      name: 'Special Place',
                      coordinates: { x: 50, y: 50 },
                      date: '2023',
                      description: 'What happened here...',
                      memoryType: 'Adventure',
                    };
                    onUpdateLocations([...locations, newLoc]);
                    showToast('Location added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Place</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {locations.map((loc, idx) => (
                  <div key={loc.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={loc.name}
                        onChange={(e) => {
                          const updated = [...locations];
                          updated[idx].name = e.target.value;
                          onUpdateLocations(updated);
                        }}
                        className="px-2.5 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white font-medium text-xs focus:outline-none"
                        placeholder="Place name"
                      />
                      <button
                        onClick={() => {
                          const updated = locations.filter((l) => l.id !== loc.id);
                          onUpdateLocations(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Memory Type</label>
                        <select
                          value={loc.memoryType}
                          onChange={(e) => {
                            const updated = [...locations];
                            updated[idx].memoryType = e.target.value as any;
                            onUpdateLocations(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        >
                          <option value="First Met">First Met</option>
                          <option value="Wedding">Wedding</option>
                          <option value="Home">Home</option>
                          <option value="Vacation">Vacation</option>
                          <option value="Birthplace">Birthplace</option>
                          <option value="Adventure">Adventure</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Year / Date</label>
                        <input
                          type="text"
                          value={loc.date}
                          onChange={(e) => {
                            const updated = [...locations];
                            updated[idx].date = e.target.value;
                            onUpdateLocations(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#94a3b8]">Description</label>
                      <textarea
                        rows={2}
                        value={loc.description}
                        onChange={(e) => {
                          const updated = [...locations];
                          updated[idx].description = e.target.value;
                          onUpdateLocations(updated);
                        }}
                        className="w-full px-2.5 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. FAMILY TREE TAB */}
          {activeTab === 'tree' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Minimalist Family Tree</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Configure the family roots, relationships, and generations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newNode: FamilyTreeNode = {
                      id: `node_${Date.now()}`,
                      name: 'Family Member',
                      relation: 'Relation',
                      generation: 2,
                      subtext: 'Notes',
                    };
                    onUpdateTreeNodes([...treeNodes, newNode]);
                    showToast('Tree node added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tree Node</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {treeNodes.map((node, idx) => (
                  <div key={node.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={node.name}
                        onChange={(e) => {
                          const updated = [...treeNodes];
                          updated[idx].name = e.target.value;
                          onUpdateTreeNodes(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white font-medium text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = treeNodes.filter((n) => n.id !== node.id);
                          onUpdateTreeNodes(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Relation</label>
                        <input
                          type="text"
                          value={node.relation}
                          onChange={(e) => {
                            const updated = [...treeNodes];
                            updated[idx].relation = e.target.value;
                            onUpdateTreeNodes(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Generation</label>
                        <select
                          value={node.generation}
                          onChange={(e) => {
                            const updated = [...treeNodes];
                            updated[idx].generation = Number(e.target.value) as any;
                            onUpdateTreeNodes(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        >
                          <option value={1}>Gen 1 (Grandparents / Parents)</option>
                          <option value={2}>Gen 2 (Parents / You)</option>
                          <option value={3}>Gen 3 (Children)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-[#94a3b8]">Subtext / Life Note</label>
                      <input
                        type="text"
                        value={node.subtext || ''}
                        onChange={(e) => {
                          const updated = [...treeNodes];
                          updated[idx].subtext = e.target.value;
                          onUpdateTreeNodes(updated);
                        }}
                        className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. ROUTINES TAB */}
          {activeTab === 'routines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Daily Routines</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Configure your family morning, afternoon, and evening routine blocks.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newR: RoutineTask = {
                      id: `r_${Date.now()}`,
                      timeSlot: '08:00 AM',
                      period: 'Morning',
                      title: 'New Routine Task',
                      assignedTo: 'All',
                      completed: false,
                      icon: 'Sun',
                    };
                    onUpdateRoutines([...routines, newR]);
                    showToast('Routine task added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Routine</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {routines.map((r, idx) => (
                  <div key={r.id} className="p-3 rounded-xl bg-[#141724] border border-[#22283a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                      <input
                        type="text"
                        value={r.timeSlot}
                        onChange={(e) => {
                          const updated = [...routines];
                          updated[idx].timeSlot = e.target.value;
                          onUpdateRoutines(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        placeholder="Time"
                      />
                      <input
                        type="text"
                        value={r.title}
                        onChange={(e) => {
                          const updated = [...routines];
                          updated[idx].title = e.target.value;
                          onUpdateRoutines(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none sm:col-span-2"
                        placeholder="Task title"
                      />
                      <select
                        value={r.period}
                        onChange={(e) => {
                          const updated = [...routines];
                          updated[idx].period = e.target.value as any;
                          onUpdateRoutines(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                        <option value="Bedtime">Bedtime</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        const updated = routines.filter((item) => item.id !== r.id);
                        onUpdateRoutines(updated);
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 self-end sm:self-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. GOALS TAB */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-0.5">Family Goals & Objectives</h3>
                  <p className="text-xs text-[#94a3b8]">
                    Track short-term and long-term milestones for your family horizon.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newG: FamilyGoal = {
                      id: `g_${Date.now()}`,
                      title: 'New Family Goal',
                      type: 'short-term',
                      targetDate: 'Late 2026',
                      progress: 25,
                      category: 'Home',
                      milestones: [{ text: 'First step', done: true }],
                    };
                    onUpdateGoals([...goals, newG]);
                    showToast('Goal added!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] border border-[#38bdf8]/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map((g, idx) => (
                  <div key={g.id} className="p-3.5 rounded-xl bg-[#141724] border border-[#22283a] space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={g.title}
                        onChange={(e) => {
                          const updated = [...goals];
                          updated[idx].title = e.target.value;
                          onUpdateGoals(updated);
                        }}
                        className="px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white font-medium text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const updated = goals.filter((item) => item.id !== g.id);
                          onUpdateGoals(updated);
                        }}
                        className="p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Type</label>
                        <select
                          value={g.type}
                          onChange={(e) => {
                            const updated = [...goals];
                            updated[idx].type = e.target.value as any;
                            onUpdateGoals(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        >
                          <option value="short-term">Short-term</option>
                          <option value="long-term">Long-term</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Target</label>
                        <input
                          type="text"
                          value={g.targetDate}
                          onChange={(e) => {
                            const updated = [...goals];
                            updated[idx].targetDate = e.target.value;
                            onUpdateGoals(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94a3b8]">Progress %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={g.progress}
                          onChange={(e) => {
                            const updated = [...goals];
                            updated[idx].progress = Number(e.target.value) || 0;
                            onUpdateGoals(updated);
                          }}
                          className="w-full px-2 py-1 bg-[#171b28] border border-[#2b3347] rounded-lg text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. BACKUP & WIPE TAB */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Backup, Restore & Clean Slate</h3>
                <p className="text-xs text-[#94a3b8]">
                  Export all your customized data to a backup file, import an existing backup, or clear everything to a blank canvas.
                </p>
              </div>

              {/* Export / Import Box */}
              <div className="p-5 rounded-2xl bg-[#141724] border border-[#22283a] space-y-4">
                <h4 className="text-xs font-semibold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#38bdf8]" />
                  <span>Export & Import JSON</span>
                </h4>
                <p className="text-xs text-[#94a3b8]">
                  Download a complete backup of everything you've written so you never lose your work. You can restore it on any device anytime.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 text-xs font-medium bg-[#38bdf8] hover:bg-[#0ea5e9] text-black rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-[#38bdf8]/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="px-4 py-2 text-xs font-medium bg-[#1e2333] hover:bg-[#283045] text-white border border-[#2e374d] rounded-xl cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Restore from JSON File</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      className="hidden"
                      onChange={handleImportJSON}
                    />
                  </label>
                </div>
              </div>

              {/* Start with Blank Canvas */}
              <div className="p-5 rounded-2xl bg-[#18151b] border border-amber-500/30 space-y-3">
                <h4 className="text-xs font-semibold text-amber-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Start with Blank Canvas (Wipe All Sample Text)</span>
                </h4>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  If the current sample names, stories, and milestones don't match your real family, click below to wipe all fabricated text and replace them with a clean empty template so you can enter your exact details from scratch.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('Wipe sample stories and start with an empty template?')) {
                      onClearToBlank();
                      showToast('Canvas wiped clean! Fill in your real family details.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-medium bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Clear All Sample Stories & Start Fresh</span>
                </button>
              </div>

              {/* Reset to Default Demo Data */}
              <div className="p-5 rounded-2xl bg-[#181313] border border-red-500/20 space-y-3">
                <h4 className="text-xs font-semibold text-red-300 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  <span>Reset Everything to Factory Defaults</span>
                </h4>
                <p className="text-xs text-[#94a3b8]">
                  Restore the initial starter templates and mock dataset.
                </p>

                <button
                  onClick={() => {
                    if (window.confirm('Reset all website data to initial starter state?')) {
                      onResetAllData();
                      showToast('Site reset to initial defaults.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory State</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2434] bg-[#141724] flex items-center justify-between">
          <div className="text-[11px] text-[#94a3b8] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>All modifications are saved instantly to your device.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-medium bg-[#38bdf8] hover:bg-[#0ea5e9] text-black rounded-xl transition-colors font-medium shadow-md shadow-[#38bdf8]/20"
          >
            Done Editing
          </button>
        </div>
      </div>
    </div>
  );
};
