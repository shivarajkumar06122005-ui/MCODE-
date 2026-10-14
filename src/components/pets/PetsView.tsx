import React from 'react';
import { Check, Wand2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';

export const PetsView: React.FC = () => {
  const { pets, equipPet, setActiveTab } = useApp();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header matching video 01:20 */}
      <div>
        <h2 className="text-2xl font-bold font-cinzel text-[#f5ebd7] tracking-wide">
          My Pets & Companions
        </h2>
        <p className="text-xs text-[#8c7f6b] mt-1">
          Scholarly companions who accompany you during intense study sessions and grant perks.
        </p>
      </div>

      {/* Grid of Companions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className={`bg-[#181410] border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
              pet.equipped
                ? 'border-[#d4a340] shadow-[#d4a340]/20'
                : 'border-[#2a2217] hover:border-[#3d3222]'
            }`}
          >
            {/* Companion Portrait */}
            <div className="relative aspect-video bg-[#130f0b] overflow-hidden flex items-center justify-center p-4">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300 hover:scale-105"
              />
              {pet.equipped && (
                <div className="absolute top-3 right-3 bg-[#d4a340] text-[#120f0a] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-md">
                  EQUIPPED
                </div>
              )}
            </div>

            {/* Information */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold font-cinzel text-[#f4ebdc]">
                    {pet.name}
                  </h3>
                  <span className="text-[11px] font-medium text-[#d4a340] bg-[#221c13] px-2 py-0.5 rounded-full border border-[#3b2f1e]">
                    {pet.buff}
                  </span>
                </div>

                <p className="text-xs text-[#8e806c] leading-relaxed">
                  {pet.description}
                </p>

                {pet.quote && (
                  <p className="text-[11px] font-serif-quote italic text-[#b8a994] pt-1">
                    "{pet.quote}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              {pet.owned ? (
                <button
                  onClick={() => equipPet(pet.id)}
                  disabled={pet.equipped}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                    pet.equipped
                      ? 'bg-[#221c13] text-[#d4a340] border border-[#d4a340]/40 cursor-default'
                      : 'bg-[#241d14] hover:bg-[#31271b] text-[#efe6d6] border border-[#3b2f1f]'
                  }`}
                >
                  {pet.equipped ? (
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
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('shop');
                  }}
                  className="w-full bg-[#1e1811] hover:bg-[#282017] text-[#c9baa6] hover:text-[#d4a340] border border-[#312517] text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#d4a340]" />
                  <span>Acquire in Shop ({pet.price} Tokens)</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
