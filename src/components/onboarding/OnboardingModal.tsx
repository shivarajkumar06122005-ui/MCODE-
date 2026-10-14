import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, FileText, Sparkles, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/audio';
import { ThemeToggle } from '../ThemeToggle';

export const OnboardingModal: React.FC = () => {
  const { user, updateUser, setOnboardingCompleted, setActiveTab } = useApp();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [fullName, setFullName] = useState(user.name || 'Ren');
  const [email, setEmail] = useState(user.email || 'ren@gmail.com');
  const [academicLevel, setAcademicLevel] = useState<'Undergraduate' | 'Postgraduate'>(
    user.academicLevel || 'Postgraduate'
  );
  const [department, setDepartment] = useState(user.department || 'Mathematics');
  
  // Syllabus upload state
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const departments = [
    'Mathematics',
    'Theoretical Physics',
    'Computer Science',
    'Philosophy',
    'Literature',
    'Cognitive Science',
  ];

  const handleNextFromIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: fullName || 'Ren', email: email || 'ren@gmail.com' });
    sound.playClick();
    setStep(2);
  };

  const handleNextFromProfile = () => {
    updateUser({ academicLevel, department });
    sound.playClick();
    setStep(3);
  };

  const handleSimulateUpload = (filename: string = 'Linear_Algebra_Syllabus.png') => {
    setIsProcessing(true);
    sound.playClick();
    setTimeout(() => {
      setUploadedFile(filename);
      setIsProcessing(false);
      sound.playTokenReward();
    }, 600);
  };

  const handleFinish = () => {
    sound.playLevelComplete();
    setOnboardingCompleted(true);
    setActiveTab('home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0b09]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      {/* Container matching exact video styling */}
      <div className="w-full max-w-md bg-[#181410] border border-[#2b2419] rounded-2xl p-8 shadow-2xl shadow-black/80 relative overflow-hidden onboarding-card">
        {/* Subtle top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#d4a340] to-transparent opacity-80" />

        {/* Top right theme toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle size="sm" />
        </div>

        {/* STEP 1: IDENTITY */}
        {step === 1 && (
          <form onSubmit={handleNextFromIdentity} className="space-y-6">
            {/* Header with monogram */}
            <div className="flex items-center gap-3 pb-2">
              <div className="w-8 h-8 rounded-full bg-[#272016] border border-[#c6922b]/50 flex items-center justify-center text-[#d4a340] font-cinzel text-sm font-bold shadow-inner">
                M
              </div>
              <h2 className="text-xl font-bold font-cinzel text-[#ede3d1] tracking-wide">
                Identity
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-[#8e806d] uppercase mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Scholar Name"
                  className="w-full bg-[#120f0c] border border-[#2d251a] rounded-xl px-4 py-3 text-[#ede5d5] placeholder-[#5a5040] focus:outline-none focus:border-[#d4a340] transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold tracking-widest text-[#8e806d] uppercase mb-2">
                  Academic Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@uni.example.edu"
                  className="w-full bg-[#120f0c] border border-[#2d251a] rounded-xl px-4 py-3 text-[#ede5d5] placeholder-[#5a5040] focus:outline-none focus:border-[#d4a340] transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setOnboardingCompleted(true)}
                className="text-xs uppercase tracking-wider text-[#796c58] hover:text-[#bba990] transition-colors px-2 py-2"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#d4a340] hover:bg-[#e2b34a] text-[#1a140a] font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#d4a340]/25 transition-all active:scale-95"
              >
                <span>Next: Proceeding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: ACADEMIC PROFILE */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-8 h-8 rounded-full bg-[#272016] border border-[#c6922b]/50 flex items-center justify-center text-[#d4a340] font-cinzel text-sm font-bold shadow-inner">
                M
              </div>
              <h2 className="text-xl font-bold font-cinzel text-[#ede3d1] tracking-wide">
                Academic Profile
              </h2>
            </div>

            <div className="space-y-5">
              {/* Academic Level */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-[#8e806d] uppercase mb-2">
                  Academic Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAcademicLevel('Undergraduate');
                      sound.playClick();
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                      academicLevel === 'Undergraduate'
                        ? 'bg-[#231c13] border-[#d4a340] text-[#f2cb6c] shadow-sm shadow-[#d4a340]/15'
                        : 'bg-[#120f0c] border-[#292218] text-[#8e806d] hover:border-[#3d3324]'
                    }`}
                  >
                    Undergraduate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAcademicLevel('Postgraduate');
                      sound.playClick();
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                      academicLevel === 'Postgraduate'
                        ? 'bg-[#231c13] border-[#d4a340] text-[#f2cb6c] shadow-sm shadow-[#d4a340]/15'
                        : 'bg-[#120f0c] border-[#292218] text-[#8e806d] hover:border-[#3d3324]'
                    }`}
                  >
                    Postgraduate
                  </button>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-[#8e806d] uppercase mb-2">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full appearance-none bg-[#120f0c] border border-[#2d251a] rounded-xl px-4 py-3 text-[#ede5d5] text-sm focus:outline-none focus:border-[#d4a340] transition-colors pr-10 cursor-pointer"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#181410] text-[#ede5d5]">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8e806d] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs uppercase tracking-wider text-[#796c58] hover:text-[#bba990] transition-colors px-2 py-2"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextFromProfile}
                className="bg-[#d4a340] hover:bg-[#e2b34a] text-[#1a140a] font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#d4a340]/25 transition-all active:scale-95"
              >
                <span>Next: Proceeding</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: VISION-TO-PATHWAY */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2">
              <div className="w-8 h-8 rounded-full bg-[#272016] border border-[#c6922b]/50 flex items-center justify-center text-[#d4a340] font-cinzel text-sm font-bold shadow-inner">
                M
              </div>
              <h2 className="text-xl font-bold font-cinzel text-[#ede3d1] tracking-wide">
                Vision-to-Pathway
              </h2>
            </div>

            {!uploadedFile ? (
              <div className="space-y-4">
                {/* Upload Dropzone */}
                <div
                  onClick={() => handleSimulateUpload('Linear_Algebra_Syllabus.png')}
                  className="border-2 border-dashed border-[#4a3d29] hover:border-[#d4a340] bg-[#120f0c] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#1a150f] group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#261f15] border border-[#3f3321] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:border-[#d4a340]/60 transition-all text-[#d4a340]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#ede4d3] mb-1">
                    Upload Syllabus Image
                  </h3>
                  <p className="text-xs text-[#7e715d]">
                    PNG, JPEG or comprehensive PDF/doc
                  </p>
                  <span className="mt-4 inline-block text-[11px] bg-[#221b13] text-[#d4a340] border border-[#d4a340]/30 px-3 py-1 rounded-full">
                    Click to load Linear Algebra Syllabus
                  </span>
                </div>

                {isProcessing && (
                  <div className="text-center py-2 flex items-center justify-center gap-2 text-xs text-[#d4a340]">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Analyzing syllabus structure with vision engine...</span>
                  </div>
                )}
              </div>
            ) : (
              /* Detected Course Card - exactly matching video at 00:18 */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-[#130f0c] border border-[#d4a340]/60 rounded-2xl p-6 text-center shadow-lg shadow-[#d4a340]/10 relative overflow-hidden">
                  <div className="absolute top-2 right-3 flex items-center gap-1 text-[11px] text-[#55c179]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Analyzed</span>
                  </div>

                  <div className="w-14 h-14 mx-auto rounded-full bg-[#261f15] border-2 border-[#d4a340] flex items-center justify-center mb-3 text-[#d4a340] shadow-md shadow-[#d4a340]/30">
                    <FileText className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold font-cinzel text-[#f3e7d5] tracking-wide mb-1">
                    Linear Algebra
                  </h3>
                  <div className="text-[11px] font-bold tracking-widest text-[#d4a340] uppercase mb-2">
                    5 UNITS DETECTED • 25 LEVELS FOUND
                  </div>
                  <p className="text-xs text-[#8c7f6b] max-w-xs mx-auto leading-relaxed">
                    Based on syllabus detected from: Linear Algebra Done Right by S. Axler
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full bg-[#d4a340] hover:bg-[#e2b34a] text-[#140e04] font-bold text-xs tracking-wider uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-[#d4a340]/25 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>Generate My Pathway</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs uppercase tracking-wider text-[#796c58] hover:text-[#bba990] transition-colors px-2 py-2"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Bottom Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          <div
            className={`h-1 rounded-full transition-all ${
              step === 1 ? 'w-6 bg-[#d4a340]' : 'w-2 bg-[#2d251a]'
            }`}
          />
          <div
            className={`h-1 rounded-full transition-all ${
              step === 2 ? 'w-6 bg-[#d4a340]' : 'w-2 bg-[#2d251a]'
            }`}
          />
          <div
            className={`h-1 rounded-full transition-all ${
              step === 3 ? 'w-6 bg-[#d4a340]' : 'w-2 bg-[#2d251a]'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
