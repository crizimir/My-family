import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { StatisticsSection } from '../components/StatisticsSection';
import { QuoteBoard } from '../components/QuoteBoard';
import { StatItem, QuoteItem, Profile, RoutineTask, SiteSettings } from '../types/family';
import { Users, Calendar, Camera, CalendarCheck, Hourglass, MessageSquare, ArrowRight, Heart, Sparkles, CheckCircle2, Settings, Wallet } from 'lucide-react';

interface HomePageProps {
  stats: StatItem[];
  quotes: QuoteItem[];
  profiles: Profile[];
  routines: RoutineTask[];
  onIncrementHug: () => void;
  onAddQuote: (quote: Omit<QuoteItem, 'id'>) => void;
  heroPhoto?: string;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
  onOpenPhotoSync?: () => void;
  siteSettings?: SiteSettings;
  onOpenCustomizer?: () => void;
  onUpdateTogetherSinceDate?: (newDate: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  quotes,
  profiles,
  routines,
  onIncrementHug,
  onAddQuote,
  heroPhoto,
  onUpdateHeroPhoto,
  onOpenPhotoSync,
  siteSettings,
  onOpenCustomizer,
  onUpdateTogetherSinceDate,
}) => {
  const daysTogether = stats.find((s) => s.id === 'days')?.value || 2980;

  const roomPortals = [
    {
      title: 'Family Profiles',
      desc: 'Meet Mirwen, Janine Rae, and our daughter. Quirks, loves, and comfort notes.',
      to: '/profiles',
      icon: Users,
      badge: `${profiles.length} Profiles`,
      color: 'from-[#f472b6]/20 to-[#fda4af]/5 border-[#f472b6]/30 text-[#f472b6]',
      preview: profiles.map((p) => p.name.split(' ')[0]).join(' · '),
    },
    {
      title: 'Memories & Locations',
      desc: 'Interactive journey milestones from when we first met to our favorite places.',
      to: '/timeline',
      icon: Calendar,
      badge: 'Timeline & Map',
      color: 'from-[#38bdf8]/20 to-[#818cf8]/5 border-[#38bdf8]/30 text-[#38bdf8]',
      preview: '7 Chapters · 6 Cherished Pins',
    },
    {
      title: 'Photo Album & Corkboard',
      desc: 'High-res masonry gallery of tender moments and pastel fridge sticky notes.',
      to: '/gallery',
      icon: Camera,
      badge: 'Masonry & Sticky Notes',
      color: 'from-[#fb923c]/20 to-[#fde047]/5 border-[#fb923c]/30 text-[#fb923c]',
      preview: 'Captured Fragments & Love Notes',
    },
    {
      title: 'Planner, Routines & Goals',
      desc: 'Daily schedule blocks, shared family bucket list, and future horizon goals.',
      to: '/planner',
      icon: CalendarCheck,
      badge: 'Daily Rhythm',
      color: 'from-[#86efac]/20 to-[#34d399]/5 border-[#86efac]/30 text-[#86efac]',
      preview: `${routines.filter((r) => r.completed).length}/${routines.length} Today's Routines Completed`,
    },
    {
      title: 'Time Capsule & Family Tree',
      desc: 'Letters locked until future birthdays and a clean generational family tree.',
      to: '/vault',
      icon: Hourglass,
      badge: 'Digital Vault',
      color: 'from-[#c084fc]/20 to-[#a855f7]/5 border-[#c084fc]/30 text-[#c084fc]',
      preview: 'Live Countdown Timers · 3 Generations',
    },
    {
      title: 'Family Social Journal',
      desc: 'A private micro-feed for everyday stories, snapshots, and sweet banter.',
      to: '/feed',
      icon: MessageSquare,
      badge: 'Private Micro-Feed',
      color: 'from-[#e11d48]/20 to-[#f472b6]/5 border-[#e11d48]/30 text-[#fda4af]',
      preview: 'Stories, Comments & Likes',
    },
    {
      title: 'Family Financial Planner',
      desc: 'Weekly estimated income, debts & payoff road, necessary bills, and emergency savings.',
      to: '/finances',
      icon: Wallet,
      badge: 'Debts & Inflow',
      color: 'from-[#38bdf8]/20 to-[#0284c7]/5 border-[#38bdf8]/30 text-[#7dd3fc]',
      preview: 'Estimated Income · Debts · Weekly Cashflow',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Hero Welcome */}
      <HeroSection
        onScrollToProfiles={() => {
          const el = document.getElementById('portals');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        daysTogether={daysTogether}
        heroPhoto={heroPhoto}
        onUpdateHeroPhoto={onUpdateHeroPhoto}
        onOpenPhotoSync={onOpenPhotoSync}
        siteSettings={siteSettings}
        onOpenCustomizer={onOpenCustomizer}
      />

      {/* Living Statistics Section */}
      <StatisticsSection
        stats={stats}
        onIncrementHug={onIncrementHug}
        togetherSinceDate={siteSettings?.togetherSinceDate}
        onUpdateTogetherSinceDate={onUpdateTogetherSinceDate}
      />

      {/* Sanctuary Room Portals Grid */}
      <section id="portals" className="py-14 border-t border-[#1a1f2c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sanctuary Rooms</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
                Explore The Family Pages
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8] max-w-sm">
              Each dedicated room is fast, focused, and organized so you can visit your favorite memories without clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomPortals.map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.to}
                  to={portal.to}
                  className="group relative bg-[#131620] hover:bg-[#161a27] border border-[#212738] hover:border-[#38435d] rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br border ${portal.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono text-[#94a3b8]">
                        {portal.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#f8b4d9] transition-colors mb-2 flex items-center justify-between">
                      <span>{portal.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>

                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-6">
                      {portal.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1d2334] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748b] truncate max-w-[210px]">{portal.preview}</span>
                    <span className="text-[#f472b6] font-medium group-hover:underline">
                      Enter Room →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Board Carousel */}
      <QuoteBoard quotes={quotes} onAddQuote={onAddQuote} />
    </div>
  );
};
