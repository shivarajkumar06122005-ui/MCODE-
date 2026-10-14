import React, { useState } from 'react';
import {
  Check,
  Coins,
  FileCode,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IMAGES } from '../../data/imageAssets';
import { sound } from '../../utils/audio';

import { api } from '../../services/api';

export const ShopView: React.FC = () => {
  const {
    tokens,
    environments,
    equipEnvironment,
    buyShopItem,
    pets,
    equipPet,
    buyPet,
    spendTokens,
    addToast,
  } = useApp();

  const [activePerkModal, setActivePerkModal] = useState<string | null>(null);
  const [liveLatex, setLiveLatex] = useState<string | null>(null);
  const [liveExplanation, setLiveExplanation] = useState<string | null>(null);

  
const environmentImages: Record<string, string> = {
  carrara_atrium: IMAGES.carraraMarble,
  scholars_desk: IMAGES.scholarsDesk,
  vintage_library: IMAGES.vintageLibrary,
  botanists_sanctuary: IMAGES.botanistsSanctuary,
};

const petImages: Record<string, string> = {
  lumis: IMAGES.petLumis,
  frodo: IMAGES.petFrodo,
  astrofel: IMAGES.petAstrofel,
  vellum: IMAGES.petVellum,
  quill: IMAGES.petQuill,
};

  const perks = [
    {
      id: 'latex_template',
      name: 'AI LaTeX Template',
      description: 'Export clean paper-ready LaTeX proof for your current homework.',
      price: 50,
      icon: <FileCode className="w-5 h-5 text-indigo-400" />,
      actionLabel: 'Use Perk',
    },
    {
      id: 'dynamic_flashcards',
      name: 'Dynamic Flashcards',
      description: 'AI flashcards generated for current unit definitions and axioms.',
      price: 75,
      icon: <Layers className="w-5 h-5 text-amber-400" />,
      actionLabel: 'Review Cards',
    },
    {
      id: 'concept_simplifier',
      name: 'Concept Simplifier',
      description: 'Translates dense abstract proofs into plain intuition and analogies.',
      price: 60,
      icon: <Lightbulb className="w-5 h-5 text-yellow-400" />,
      actionLabel: 'Explain Proof',
    },
  ];

  const handleBuyPerk = (price: number, perkId: string) => {
    if (tokens < price) {
      sound.playClick();
      addToast('Not enough tokens! Complete lessons to earn more tokens.', 'info');
      return;
    }
    spendTokens(price);
    sound.playTokenReward();
    setActivePerkModal(perkId);

    if (perkId === 'latex_template') {
      api.exportLatex().then((res) => {
        if (res?.latex) setLiveLatex(res.latex);
      }).catch(() => {});
    } else if (perkId === 'concept_simplifier') {
      api.simplifyConcept('Vector Spaces').then((res) => {
        if (res?.explanation) setLiveExplanation(res.explanation);
      }).catch(() => {});
    }
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header matching video 00:59 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#292217] pb-6">
        <div>
          <h2 className="text-3xl font-bold font-cinzel text-[#f5ebd7] tracking-wide">
            The Emporium
          </h2>
          <p className="text-xs font-bold tracking-widest text-[#8e806c] uppercase mt-1">
            SPEND YOUR EARNED TOKENS WISELY
          </p>
        </div>

        {/* Tokens pill */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1b1610] border border-[#d4a340]/50 shadow-md shadow-[#d4a340]/10">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#c89222] to-[#f4c856] flex items-center justify-center text-[#211604]">
            <Coins className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-[#f2e7d3] font-mono">
            {tokens} Tokens
          </span>
        </div>
      </div>

      {/* SECTION 1: COZY ENVIRONMENTS (VISUAL THEMES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold font-cinzel text-[#ede3d1]">
            Cozy Environments
          </h3>
          <span className="text-[10px] font-bold tracking-wider text-[#d4a340] bg-[#241c12] px-2 py-0.5 rounded-full border border-[#3c2f1d]">
            VISUAL THEMES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {environments.map((env) => (
            <div
              key={env.id}
              className={`bg-[#181410] border rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                env.equipped
                  ? 'border-[#d4a340] shadow-[#d4a340]/15'
                  : 'border-[#292116] hover:border-[#3d3222]'
              }`}
            >
              {/* Image Preview */}
              <div className="relative h-44 overflow-hidden bg-[#110e0a]">
                <img
                  src={environmentImages[env.id] || env.image}
                  alt={env.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181410] via-transparent to-transparent" />
                {env.equipped && (
                  <div className="absolute top-3 right-3 bg-[#d4a340] text-[#120f0a] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                    EQUIPPED
                  </div>
                )}
              </div>

              {/* Details & Action */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-base font-bold font-cinzel text-[#f4ebdc]">
                    {env.name}
                  </h4>
                  <p className="text-xs text-[#8c7e6a] mt-1 leading-relaxed">
                    {env.description}
                  </p>
                </div>

                {env.owned ? (
                  <button
                    onClick={() => equipEnvironment(env.id)}
                    disabled={env.equipped}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                      env.equipped
                        ? 'bg-[#221c13] text-[#d4a340] border border-[#d4a340]/40 cursor-default'
                        : 'bg-[#241d14] hover:bg-[#31271b] text-[#efe6d6] border border-[#3b2f1f]'
                    }`}
                  >
                    {env.equipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </>
                    ) : (
                      <span>EQUIP</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => buyShopItem(env)}
                    className="w-full bg-[#d4a340] hover:bg-[#e4b344] active:scale-[0.99] text-[#140e04] font-bold text-xs tracking-wider uppercase py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-[#d4a340]/25 transition-all"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>BUY FOR {env.price}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: STUDY PERKS (CONSUMABLES) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold font-cinzel text-[#ede3d1]">
            Study Perks
          </h3>
          <span className="text-[10px] font-bold tracking-wider text-[#a0907a] bg-[#201912] px-2 py-0.5 rounded-full border border-[#332719]">
            CONSUMABLES
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div
              key={perk.id}
              className="bg-[#181410] border border-[#292116] hover:border-[#3d3222] rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#211a12] border border-[#302619] flex items-center justify-center">
                    {perk.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-cinzel text-[#f4ebdc]">
                      {perk.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#d4a340]">
                      {perk.price} Tokens
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#8c7e6a] leading-relaxed">
                  {perk.description}
                </p>
              </div>

              <button
                onClick={() => handleBuyPerk(perk.price, perk.id)}
                className="w-full bg-[#201a12] hover:bg-[#2b2217] border border-[#382b1a] text-[#f2e7d3] hover:text-[#d4a340] text-xs font-bold tracking-wider uppercase py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Coins className="w-3.5 h-3.5 text-[#d4a340]" />
                <span>BUY • {perk.price}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: STUDY PETS (matching video at 01:00) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold font-cinzel text-[#ede3d1]">
            Study Pets
          </h3>
          <span className="text-[10px] font-bold tracking-wider text-[#d4a340] bg-[#241c12] px-2 py-0.5 rounded-full border border-[#3c2f1d]">
            COMPANIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className={`bg-[#181410] border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
                pet.equipped
                  ? 'border-[#d4a340] shadow-[#d4a340]/15'
                  : 'border-[#292116] hover:border-[#3e3221]'
              }`}
            >
              {/* Pet Image */}
              <div className="relative aspect-square bg-[#130f0b] p-3 flex items-center justify-center">
                <img
                  src={petImages[pet.id] || pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                {pet.equipped && (
                  <div className="absolute top-2 right-2 bg-[#d4a340] text-[#120f0a] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow-md">
                    EQUIPPED
                  </div>
                )}
              </div>

              {/* Pet Info & Actions */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold font-cinzel text-[#f4ebdc]">
                    {pet.name}
                  </h4>
                  <p className="text-[11px] text-[#8a7c67] mt-1 leading-snug line-clamp-2">
                    {pet.description}
                  </p>
                </div>

                {pet.owned ? (
                  <button
                    onClick={() => equipPet(pet.id)}
                    disabled={pet.equipped}
                    className={`w-full py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 ${
                      pet.equipped
                        ? 'bg-[#221c13] text-[#d4a340] border border-[#d4a340]/40 cursor-default'
                        : 'bg-[#241d14] hover:bg-[#31271b] text-[#efe6d6] border border-[#3b2f1f]'
                    }`}
                  >
                    {pet.equipped ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>EQUIPPED</span>
                      </>
                    ) : (
                      <span>EQUIP</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => buyPet(pet)}
                    className="w-full bg-[#d4a340] hover:bg-[#e4b344] active:scale-[0.99] text-[#140e04] font-bold text-xs tracking-wider uppercase py-2 rounded-xl flex items-center justify-center gap-1 shadow-md shadow-[#d4a340]/20 transition-all"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>BUY • {pet.price}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perk Interactive Modal Dialog */}
      {activePerkModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181410] border border-[#d4a340]/60 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-cinzel text-[#f5ebd7]">
              {activePerkModal === 'latex_template' && 'AI LaTeX Proof Exporter'}
              {activePerkModal === 'dynamic_flashcards' && 'Dynamic Flashcards: Unit 1'}
              {activePerkModal === 'concept_simplifier' && 'Concept Simplifier: Vector Spaces'}
            </h3>

            {activePerkModal === 'latex_template' && (
              <div className="space-y-3">
                <p className="text-xs text-[#8c7f6b]">
                  LaTeX boilerplate formatted for submission:
                </p>
                <pre className="bg-[#110e0a] p-3 rounded-xl border border-[#2b2216] text-[11px] font-mono text-[#55c179] overflow-x-auto max-h-60">
{liveLatex || `\\documentclass{article}
\\usepackage{amsmath, amsthm, amssymb}
\\title{MATH 110A - Unit 1: Vector Spaces}
\\author{Ren}
\\begin{document}
\\maketitle
\\begin{theorem}[Dimension of Product Space]
Let $V, W$ be finite-dimensional vector spaces over $F$.
Then $\\dim(V \\times W) = \\dim(V) + \\dim(W)$.
\\end{theorem}
\\begin{proof}
Let $(v_1, \\dots, v_n)$ be a basis of $V$ and $(w_1, \\dots, w_m)$ be a basis of $W$...
\\end{proof}
\\end{document}`}
                </pre>
              </div>
            )}

            {activePerkModal === 'dynamic_flashcards' && (
              <div className="bg-[#120f0b] p-4 rounded-xl border border-[#292015] space-y-2">
                <span className="text-[10px] text-[#d4a340] uppercase font-bold">Card 1 of 5</span>
                <p className="text-sm font-semibold text-[#ede4d3]">
                  What are the 8 fundamental axioms of a Vector Space over F?
                </p>
                <p className="text-xs text-[#a29480] pt-2 border-t border-[#231a10]">
                  Commutativity, Associativity of addition, Additive identity, Additive inverse, Multiplicative identity, Distributive properties (scalar over vector addition and vector over scalar addition), and Associativity of scalar multiplication.
                </p>
              </div>
            )}

            {activePerkModal === 'concept_simplifier' && (
              <div className="bg-[#120f0b] p-4 rounded-xl border border-[#292015] space-y-2">
                <span className="text-[10px] text-[#d4a340] uppercase font-bold">Visual Intuition</span>
                <p className="text-sm font-semibold text-[#ede4d3]">
                  Why is a Vector Space defined without coordinates?
                </p>
                <p className="text-xs text-[#a29480] leading-relaxed">
                  {liveExplanation || `Think of space as an infinite fabric. Points don't have natural numbers attached to them until you pick a perspective (a basis). Linear algebra studies the geometry of the fabric itself, regardless of which coordinate grid you draw over it!`}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePerkModal(null)}
                className="bg-[#d4a340] text-[#120e06] font-bold text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-[#e4b344]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
