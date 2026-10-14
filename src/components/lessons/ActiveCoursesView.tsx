import React, { useState } from 'react';
import { BookOpen, ChevronRight, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';

export const ActiveCoursesView: React.FC = () => {
  const { course, openUnit } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold font-cinzel text-[#f4ebd9] tracking-wide">
          Active Courses
        </h2>
        <p className="text-xs text-[#8c7f6b] mt-1">
          Courses generated from your academic syllabus pathways.
        </p>
      </div>

      {/* Grid of Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Course Card - Linear Algebra (matching video at 00:27) */}
        <div
          onClick={() => {
            sound.playClick();
            openUnit(1);
          }}
          className="bg-[#181410] hover:bg-[#1f1913] border border-[#2c2419] hover:border-[#d4a340]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-lg shadow-black/30 group relative overflow-hidden"
        >
          {/* Top subtle glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4a340]/50 to-transparent group-hover:via-[#d4a340] transition-all" />

          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-[#d4a340] uppercase">
                {course.code}
              </span>
              <h3 className="text-xl font-bold font-cinzel text-[#f4ebdc] mt-1 group-hover:text-[#f7d688] transition-colors">
                {course.title}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#231c13] border border-[#352c1d] flex items-center justify-center text-[#d4a340] group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-[#8e806c] line-clamp-1 mb-6">
            Ref: {course.referenceBook}
          </p>

          {/* Progress bar matching video */}
          <div className="space-y-2 pt-2 border-t border-[#241e15]">
            <div className="flex justify-between text-xs text-[#9c8e79]">
              <span>Overall Mastery</span>
              <span className="font-mono text-[#d4a340] font-bold">
                {course.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#221c13] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#b58529] via-[#e4b344] to-[#f4c856] rounded-full transition-all duration-700"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#716451] pt-1">
              <span>{course.totalUnits} Units</span>
              <span className="flex items-center gap-1 text-[#d4a340] group-hover:translate-x-1 transition-transform">
                Enter Pathway <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Add Course Card (matching video) */}
        <div
          onClick={() => {
            sound.playClick();
            setShowAddModal(true);
          }}
          className="border-2 border-dashed border-[#2d2518] hover:border-[#d4a340]/60 bg-[#14100c]/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1a150f] group min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#221b13] border border-[#362b1c] flex items-center justify-center text-[#8e806c] group-hover:text-[#d4a340] group-hover:border-[#d4a340]/50 group-hover:scale-105 transition-all mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-[#8e806c] group-hover:text-[#ede4d3] transition-colors">
            Add Course
          </span>
          <span className="text-[11px] text-[#5e5343] mt-1">
            Import new syllabus with Vision Engine
          </span>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181410] border border-[#2b2419] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold font-cinzel text-[#ede4d3]">
              Import New Course Syllabus
            </h3>
            <p className="text-xs text-[#8c7f6b]">
              Upload any syllabus document or select one of the university modules below:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  sound.playTokenReward();
                  setShowAddModal(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#201a13] hover:bg-[#282117] border border-[#302619] transition-colors text-xs text-[#ede4d3]"
              >
                <div className="font-semibold text-[#f0e4cc]">Abstract Algebra (MATH 112)</div>
                <div className="text-[11px] text-[#817460]">Groups, Rings, Fields & Galois Theory</div>
              </button>
              <button
                onClick={() => {
                  sound.playTokenReward();
                  setShowAddModal(false);
                }}
                className="w-full text-left p-3 rounded-xl bg-[#201a13] hover:bg-[#282117] border border-[#302619] transition-colors text-xs text-[#ede4d3]"
              >
                <div className="font-semibold text-[#f0e4cc]">Quantum Mechanics I (PHYS 137A)</div>
                <div className="text-[11px] text-[#817460]">Wave Mechanics & Hilbert Spaces</div>
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs uppercase tracking-wider text-[#8e806c] hover:text-[#ede4d3]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
