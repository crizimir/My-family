import React, { useState } from 'react';
import { DayPlanner } from '../components/DayPlanner';
import { SharedBucketList } from '../components/SharedBucketList';
import { GoalsPlanner } from '../components/GoalsPlanner';
import { FinancialPlanner } from '../components/FinancialPlanner';
import { RoutineTask, BucketListItem, FamilyGoal, FamilyFinancialState } from '../types/family';
import { ArrowLeft, Wallet, CheckSquare, Target, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlannerPageProps {
  routines: RoutineTask[];
  bucketList: BucketListItem[];
  goals: FamilyGoal[];
  financialState: FamilyFinancialState;
  onToggleRoutine: (id: string) => void;
  onAddRoutine: (task: Omit<RoutineTask, 'id' | 'completed'>) => void;
  onToggleBucket: (id: string) => void;
  onAddBucket: (item: Omit<BucketListItem, 'id' | 'completed'>) => void;
  onToggleMilestone: (goalId: string, milestoneIndex: number) => void;
  onAddGoal: (goal: Omit<FamilyGoal, 'id' | 'progress'>) => void;
  onUpdateFinancialState: (updater: (prev: FamilyFinancialState) => FamilyFinancialState) => void;
}

export const PlannerPage: React.FC<PlannerPageProps> = ({
  routines,
  bucketList,
  goals,
  financialState,
  onToggleRoutine,
  onAddRoutine,
  onToggleBucket,
  onAddBucket,
  onToggleMilestone,
  onAddGoal,
  onUpdateFinancialState,
}) => {
  const [plannerTab, setPlannerTab] = useState<'finances' | 'routines' | 'goals' | 'bucket'>('finances');

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

      {/* Planner Category Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#121622] border border-[#232c42] rounded-2xl">
          <button
            onClick={() => setPlannerTab('finances')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              plannerTab === 'finances'
                ? 'bg-[#38bdf8] text-slate-900 shadow-md shadow-[#38bdf8]/20'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Financial Planner (Debts & Income)</span>
          </button>

          <button
            onClick={() => setPlannerTab('routines')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              plannerTab === 'routines'
                ? 'bg-[#f472b6] text-white shadow-md shadow-[#f472b6]/20'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Daily Routines ({routines.filter((r) => !r.completed).length} active)</span>
          </button>

          <button
            onClick={() => setPlannerTab('goals')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              plannerTab === 'goals'
                ? 'bg-[#c084fc] text-white shadow-md shadow-[#c084fc]/20'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Family Goals ({goals.length})</span>
          </button>

          <button
            onClick={() => setPlannerTab('bucket')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              plannerTab === 'bucket'
                ? 'bg-[#34d399] text-slate-900 shadow-md shadow-[#34d399]/20'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#1a2030]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Shared Bucket List ({bucketList.length})</span>
          </button>
        </div>
      </div>

      {plannerTab === 'finances' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FinancialPlanner
            financialState={financialState}
            onUpdateFinancialState={onUpdateFinancialState}
          />
        </div>
      )}

      {plannerTab === 'routines' && (
        <DayPlanner
          routines={routines}
          onToggleTask={onToggleRoutine}
          onAddTask={onAddRoutine}
        />
      )}

      {plannerTab === 'bucket' && (
        <SharedBucketList
          items={bucketList}
          onToggleItem={onToggleBucket}
          onAddItem={onAddBucket}
        />
      )}

      {plannerTab === 'goals' && (
        <GoalsPlanner
          goals={goals}
          onToggleMilestone={onToggleMilestone}
          onAddGoal={onAddGoal}
        />
      )}
    </div>
  );
};
