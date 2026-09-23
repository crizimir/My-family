import React, { useState } from 'react';
import { FamilyTreeNode } from '../types/family';
import { GitBranch, Heart, Sparkles, X, User } from 'lucide-react';

interface MinimalistFamilyTreeProps {
  nodes: FamilyTreeNode[];
}

export const MinimalistFamilyTree: React.FC<MinimalistFamilyTreeProps> = ({ nodes }) => {
  const [selectedNode, setSelectedNode] = useState<FamilyTreeNode | null>(null);

  const gen1Paternal = nodes.filter((n) => n.id.startsWith('gp-cuares'));
  const gen1Maternal = nodes.filter((n) => n.id.startsWith('gp-delacruz'));
  const gen2 = nodes.filter((n) => n.generation === 2);
  const gen3 = nodes.filter((n) => n.generation === 3);

  return (
    <section className="py-14 border-t border-[#1a1f2c]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-[#f8b4d9] font-medium tracking-wide mb-1.5">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Roots & Blossoms</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight mb-2">
            Minimalist Family Tree
          </h2>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Generational love and heritage converging into our sweet daughter.
          </p>
        </div>

        {/* Tree Container */}
        <div className="relative bg-[#131620] border border-[#222839] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-x-auto">
          <div className="min-w-[680px] flex flex-col items-center gap-10">
            {/* Generation 1: Grandparents */}
            <div className="w-full flex justify-between px-6">
              {/* Paternal Grandparents */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-[#fde047] tracking-wider uppercase mb-3">
                  Paternal Heritage (Cuares)
                </span>
                <div className="flex items-center gap-4">
                  {gen1Paternal.map((gp) => (
                    <button
                      key={gp.id}
                      onClick={() => setSelectedNode(gp)}
                      className="p-3.5 rounded-2xl bg-[#191d2b] border border-[#272f42] hover:border-[#fde047]/50 text-left transition-all hover:scale-105"
                    >
                      <p className="text-xs font-semibold text-white">{gp.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{gp.relation}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Maternal Grandparents */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-[#fda4af] tracking-wider uppercase mb-3">
                  Maternal Heritage (Dela Cruz)
                </span>
                <div className="flex items-center gap-4">
                  {gen1Maternal.map((gp) => (
                    <button
                      key={gp.id}
                      onClick={() => setSelectedNode(gp)}
                      className="p-3.5 rounded-2xl bg-[#191d2b] border border-[#272f42] hover:border-[#fda4af]/50 text-left transition-all hover:scale-105"
                    >
                      <p className="text-xs font-semibold text-white">{gp.name}</p>
                      <p className="text-[10px] text-[#94a3b8]">{gp.relation}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Connecting lines SVG from Gen 1 to Gen 2 */}
            <div className="w-full h-8 flex justify-around relative pointer-events-none">
              <div className="w-px h-full bg-[#2a3449]" />
              <div className="w-px h-full bg-[#2a3449]" />
            </div>

            {/* Generation 2: Mirwen & Janine */}
            <div className="flex items-center gap-6 relative">
              {gen2.map((parent, idx) => (
                <button
                  key={parent.id}
                  onClick={() => setSelectedNode(parent)}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[#1b2030] border border-[#323d57] hover:border-[#f472b6] text-left transition-all hover:scale-105 shadow-lg shadow-black/40"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#242b3d] shrink-0 border border-[#3b4763]">
                    {parent.avatar ? (
                      <img
                        src={parent.avatar}
                        alt={parent.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-6 h-6 m-3 text-[#94a3b8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{parent.name}</h4>
                    <p className="text-xs text-[#f8b4d9]">{parent.relation}</p>
                    <p className="text-[10px] text-[#64748b]">{parent.subtext}</p>
                  </div>
                </button>
              ))}

              {/* Heart Connector between Parents */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#261523] border border-[#f472b6]/40 flex items-center justify-center pointer-events-none z-10 shadow-md">
                <Heart className="w-4 h-4 text-[#f472b6] fill-[#f472b6]" />
              </div>
            </div>

            {/* Connecting Line to Daughter */}
            <div className="w-px h-10 bg-gradient-to-b from-[#f472b6] to-[#c4b5fd]" />

            {/* Generation 3: Our Precious Daughter */}
            <div className="flex flex-col items-center">
              {gen3.map((daughter) => (
                <button
                  key={daughter.id}
                  onClick={() => setSelectedNode(daughter)}
                  className="group flex flex-col items-center text-center p-6 rounded-3xl bg-gradient-to-b from-[#1f1930] to-[#161426] border border-[#c4b5fd]/40 hover:border-[#c4b5fd] transition-all hover:scale-105 shadow-xl shadow-[#c4b5fd]/10"
                >
                  <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#242b3d] border-2 border-[#c4b5fd] shadow-lg">
                      {daughter.avatar ? (
                        <img
                          src={daughter.avatar}
                          alt={daughter.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-10 h-10 m-5 text-[#c4b5fd]" />
                      )}
                    </div>
                    <span className="absolute -top-1 -right-1 text-sm">👑</span>
                  </div>

                  <h4 className="text-base font-heading font-bold text-white group-hover:text-[#c4b5fd] transition-colors">
                    {daughter.name}
                  </h4>
                  <p className="text-xs text-[#c4b5fd] font-medium mt-0.5">
                    {daughter.relation}
                  </p>
                  <p className="text-[11px] text-[#94a3b8] mt-1 max-w-xs">
                    {daughter.subtext}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Node Detail Modal */}
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-sm bg-[#141722] border border-[#272d3e] rounded-3xl p-6 shadow-2xl text-center">
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-[#1c2130] text-[#94a3b8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden bg-[#1c2130] border border-[#2e374f] mb-4 flex items-center justify-center">
                {selectedNode.avatar ? (
                  <img
                    src={selectedNode.avatar}
                    alt={selectedNode.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-8 h-8 text-[#94a3b8]" />
                )}
              </div>

              <h3 className="text-lg font-heading font-bold text-white mb-1">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-[#f8b4d9] mb-3">{selectedNode.relation}</p>

              <p className="text-xs text-[#cbd5e1] leading-relaxed mb-4">
                {selectedNode.subtext || 'An integral branch in our loving family history.'}
              </p>

              <div className="pt-3 border-t border-[#1f2536] text-[11px] text-[#64748b]">
                Generation {selectedNode.generation}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
