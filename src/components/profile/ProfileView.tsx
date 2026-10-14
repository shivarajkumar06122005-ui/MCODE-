import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Coins,
  Edit2,
  Flame,
  GraduationCap,
  RotateCcw,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';

export const ProfileView: React.FC = () => {
  const { user, updateUser, tokens, streak, course, resetAll } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department);

  const completedUnitsCount = course.units.filter((u) => u.status === 'completed').length || 2; // As seen in video (2 Units)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, department });
    setIsEditing(false);
    sound.playTokenReward();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      {/* PROFILE HEADER (matching video 01:29) */}
      <div className="bg-[#181410] border border-[#2b2419] rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center space-y-4">
        {/* Ambient warm aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#d4a340]/10 blur-3xl pointer-events-none" />

        {/* Large Avatar */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#2f2517] to-[#18130d] border-2 border-[#d4a340] flex items-center justify-center shadow-xl shadow-black/50">
          <User className="w-12 h-12 text-[#d4a340]" />
        </div>

        {/* Name and Tagline */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold font-cinzel text-[#f5ebd7] tracking-wide">
              {user.name}
            </h2>
            <CheckCircle2 className="w-5 h-5 text-[#d4a340] fill-[#d4a340]/20" />
          </div>
          <p className="text-xs font-mono tracking-widest text-[#8e806c] uppercase">
            {user.tagline || `${user.department.toUpperCase()} '26`}
          </p>
        </div>

        {/* 3 STAT TILES (matching video 01:29) */}
        <div className="grid grid-cols-3 gap-4 pt-4 max-w-xl mx-auto">
          {/* Streak */}
          <div className="bg-[#120f0c] border border-[#261f15] rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-[#8a7c67] uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>STREAK</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#f5ebd7]">
              {streak} Days
            </div>
          </div>

          {/* Tokens */}
          <div className="bg-[#120f0c] border border-[#261f15] rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-[#d4a340] uppercase">
              <Coins className="w-3.5 h-3.5" />
              <span>TOKENS</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#d4a340]">
              {tokens}
            </div>
          </div>

          {/* Units */}
          <div className="bg-[#120f0c] border border-[#261f15] rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-wider text-[#55c179] uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              <span>ACTIVE</span>
            </div>
            <div className="text-2xl font-mono font-bold text-[#f5ebd7]">
              {completedUnitsCount} Units
            </div>
          </div>
        </div>
      </div>

      {/* ACADEMIC DETAILS & EDIT FORM */}
      <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-[#261f15] pb-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-[#d4a340]" />
            <h3 className="text-base font-bold font-cinzel text-[#ede3d1]">
              Academic Credentials
            </h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-[#8c7f6b] hover:text-[#d4a340] flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#8a7c67] uppercase mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#120f0c] border border-[#2d2419] rounded-xl px-3.5 py-2.5 text-xs text-[#ede5d5] focus:outline-none focus:border-[#d4a340]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#8a7c67] uppercase mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#120f0c] border border-[#2d2419] rounded-xl px-3.5 py-2.5 text-xs text-[#ede5d5] focus:outline-none focus:border-[#d4a340]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-[#d4a340] text-[#140e04] font-bold text-xs uppercase px-5 py-2.5 rounded-xl hover:bg-[#e4b344] transition-colors"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#120f0c] p-3.5 rounded-xl border border-[#231c14]">
              <span className="text-[10px] text-[#7d705c] uppercase font-bold block mb-1">
                Academic Level
              </span>
              <span className="text-[#f5ebd7] font-medium">{user.academicLevel}</span>
            </div>
            <div className="bg-[#120f0c] p-3.5 rounded-xl border border-[#231c14]">
              <span className="text-[10px] text-[#7d705c] uppercase font-bold block mb-1">
                Major Department
              </span>
              <span className="text-[#f5ebd7] font-medium">{user.department}</span>
            </div>
            <div className="bg-[#120f0c] p-3.5 rounded-xl border border-[#231c14]">
              <span className="text-[10px] text-[#7d705c] uppercase font-bold block mb-1">
                Primary Textbook
              </span>
              <span className="text-[#f5ebd7] font-medium">{course.referenceBook}</span>
            </div>
            <div className="bg-[#120f0c] p-3.5 rounded-xl border border-[#231c14]">
              <span className="text-[10px] text-[#7d705c] uppercase font-bold block mb-1">
                Academic Email
              </span>
              <span className="text-[#f5ebd7] font-mono text-[11px]">{user.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* DANGEROUS / DEMO ZONE */}
      <div className="flex justify-end pt-4">
        <button
          onClick={resetAll}
          className="text-xs text-[#6e604f] hover:text-[#d4a340] flex items-center gap-1.5 transition-colors p-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
