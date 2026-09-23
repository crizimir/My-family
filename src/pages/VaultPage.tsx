import React from 'react';
import { TimeCapsule } from '../components/TimeCapsule';
import { MinimalistFamilyTree } from '../components/MinimalistFamilyTree';
import { TimeCapsuleLetter, FamilyTreeNode } from '../types/family';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VaultPageProps {
  letters: TimeCapsuleLetter[];
  treeNodes: FamilyTreeNode[];
  onAddLetter: (letter: Omit<TimeCapsuleLetter, 'id' | 'sealedAt'>) => void;
}

export const VaultPage: React.FC<VaultPageProps> = ({ letters, treeNodes, onAddLetter }) => {
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

      <TimeCapsule letters={letters} onAddLetter={onAddLetter} />
      <MinimalistFamilyTree nodes={treeNodes} />
    </div>
  );
};
