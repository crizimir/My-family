import React from 'react';
import { InteractiveTimeline } from '../components/InteractiveTimeline';
import { CherishedMap } from '../components/CherishedMap';
import { TimelineMilestone, CherishedLocation } from '../types/family';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimelinePageProps {
  milestones: TimelineMilestone[];
  locations: CherishedLocation[];
  onAddMilestone: (milestone: Omit<TimelineMilestone, 'id'>) => void;
  onAddLocation: (location: Omit<CherishedLocation, 'id'>) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  milestones,
  locations,
  onAddMilestone,
  onAddLocation,
}) => {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary Home</span>
        </Link>
      </div>

      <InteractiveTimeline milestones={milestones} onAddMilestone={onAddMilestone} />
      <CherishedMap locations={locations} onAddLocation={onAddLocation} />
    </div>
  );
};
