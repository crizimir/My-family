export interface Profile {
  id: string;
  name: string;
  role: string;
  nickname: string;
  avatar: string;
  colorScheme: 'peach' | 'rose' | 'lavender' | 'mint' | 'amber';
  bio: string;
  birthday: string;
  favoriteThings: {
    coffeeOrDrink: string;
    comfortFood: string;
    hobby: string;
    song: string;
  };
  loveNote: string;
  quirk: string;
  hearts: number;
}

export interface TimelineMilestone {
  id: string;
  date: string;
  year: number;
  title: string;
  description: string;
  category: 'love' | 'milestone' | 'travel' | 'daughter';
  location?: string;
  imageUrl?: string;
  iconName?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  accent: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  location: string;
  category: 'all' | 'family' | 'daughter' | 'travel' | 'everyday';
  aspect: 'tall' | 'wide' | 'square';
  likes: number;
}

export interface StickyNote {
  id: string;
  content: string;
  author: 'Mirwen' | 'Janine' | 'Daughter' | 'Family';
  color: 'peach' | 'rose' | 'sage' | 'lilac' | 'butter';
  rotation: number;
  date: string;
  pinned: boolean;
}

export interface CherishedLocation {
  id: string;
  name: string;
  coordinates: { x: number; y: number }; // percentage on map
  date: string;
  description: string;
  memoryType: 'First Met' | 'Wedding' | 'Home' | 'Vacation' | 'Birthplace' | 'Adventure';
  photoUrl?: string;
}

export interface TimeCapsuleLetter {
  id: string;
  title: string;
  recipient: string;
  author: string;
  unlockDate: string; // ISO date string
  previewHint: string;
  content: string;
  sealedAt: string;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'Travel' | 'Home' | 'Milestone' | 'Fun';
  completed: boolean;
  completedDate?: string;
  targetYear?: string;
  assignee?: string;
}

export interface QuoteItem {
  id: string;
  quote: string;
  author: string;
  context: string;
  year: string;
}

export interface FamilyTreeNode {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
  generation: 1 | 2 | 3;
  subtext?: string;
  note?: string;
  parentId?: string;
}

export interface SocialPost {
  id: string;
  author: string;
  authorAvatar: string;
  date: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  mediaType: 'text' | 'image' | 'video-mock';
  likes: number;
  userLiked?: boolean;
  comments: {
    id: string;
    author: string;
    text: string;
    time: string;
  }[];
  tags: string[];
}

export interface RoutineTask {
  id: string;
  timeSlot: string; // e.g. "07:30 AM"
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime';
  title: string;
  assignedTo: 'Mirwen' | 'Janine' | 'Daughter' | 'All';
  completed: boolean;
  icon: string;
  notes?: string;
}

export interface FamilyGoal {
  id: string;
  title: string;
  type: 'short-term' | 'long-term';
  targetDate: string;
  progress: number; // 0 to 100
  category: 'Adventure' | 'Home' | 'Education' | 'Wellness';
  milestones: { text: string; done: boolean }[];
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  genre: string;
  audioKey: string;
  vibeSnippet?: string;
  audioUrl?: string; // Optional custom audio file data URL or stream URL
  spotifySearchUrl?: string;
  youtubeSearchUrl?: string;
}

export interface SiteSettings {
  familyName: string;
  sanctuaryTitle: string;
  tagline: string;
  description: string;
  locationCity: string;
  establishedYear: string;
  togetherSinceDate: string; // e.g. "2018-01-01"
}

// Financial Planner Types
export interface DebtItem {
  id: string;
  name: string;
  creditor: string;
  totalAmount: number;
  remainingAmount: number;
  minimumPayment: number;
  dueDate: string; // e.g. "Every 15th" or "2026-10-15"
  category: 'Credit Card' | 'Personal Loan' | 'Car / Vehicle' | 'Housing / Mortgage' | 'Gadget / Appliance' | 'Family & Friends' | 'Other';
  interestRate?: string;
  status: 'active' | 'paid_off';
  notes?: string;
}

export interface IncomeItem {
  id: string;
  source: string;
  earner: 'Mirwen' | 'Janine' | 'Shared' | 'Other';
  estimatedAmount: number;
  actualAmount: number;
  expectedDate: string; // e.g. "Friday" or "Sep 25"
  frequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'One-time';
  status: 'expected' | 'received';
  notes?: string;
}

export interface ExpenseBillItem {
  id: string;
  title: string;
  amount: number;
  category: 'Groceries & Food' | 'Utilities & Electricity' | 'Baby & Daughter Needs' | 'Rent & Housing' | 'Internet & Tech' | 'Transportation' | 'Healthcare' | 'Other';
  dueDate: string;
  isPaid: boolean;
  priority: 'Essential' | 'Necessary' | 'Flexible';
  notes?: string;
}

export interface SavingsVaultGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Emergency Safety Net' | 'Daughter Education' | 'Home Sanctuary' | 'Family Vacation' | 'Investment' | 'Vehicle & Transport' | 'Other';
  targetDate?: string;
  notes?: string;
}

export interface FinancialGoalItem {
  id: string;
  title: string;
  targetAmount: number;
  allocatedAmount: number; // money already allocated
  category: 'Major Purchase' | 'Investment' | 'Retirement' | 'Family Trip' | 'Education' | 'Home Expansion' | 'Other';
  targetDate?: string;
  notes?: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FinancialTransaction {
  id: string;
  itemId: string; // id of the bill, debt, savings, or goal
  itemType: 'debt' | 'expense' | 'savings' | 'goal' | 'income';
  itemTitle: string;
  amount: number;
  date: string; // formatted date, e.g. "Sep 23, 2026"
  note?: string;
  createdAt: number;
}

export interface FamilyFinancialState {
  currency: string; // e.g. '₱' or '$'
  currencyCode: string; // e.g. 'PHP' or 'USD'
  weekLabel: string; // e.g. "Current Week: Sep 21 – Sep 27"
  incomes: IncomeItem[];
  debts: DebtItem[];
  expenses: ExpenseBillItem[];
  savings: SavingsVaultGoal[];
  financialGoals?: FinancialGoalItem[];
  transactions?: FinancialTransaction[];
}
