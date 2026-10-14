import React from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { Toasts } from './components/Toasts';
import { HomeView } from './components/dashboard/HomeView';
import { UnitsRadialMap } from './components/lessons/UnitsRadialMap';
import { UnitPathView } from './components/lessons/UnitPathView';
import { ShopView } from './components/shop/ShopView';
import { PetsView } from './components/pets/PetsView';
import { ProfileView } from './components/profile/ProfileView';
import { AppProvider, useApp } from './context/AppContext';

const MainLayout: React.FC = () => {
  const { activeTab, currentUnitId, onboardingCompleted, theme } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-row transition-colors duration-300 ${
        theme === 'light' ? 'bg-[#f7f4ee] text-[#1e1912] app-light' : 'bg-[#12100d] text-[#efe7d7] app-dark'
      }`}
    >
      {/* Onboarding Modal matching the video tutorial */}
      {!onboardingCompleted && <OnboardingModal />}

      {/* Toast Notifications */}
      <Toasts />

      {/* Left Sidebar Navigation */}
      <Navigation />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && <HomeView />}

          {activeTab === 'lessons' && (
            <>
              {currentUnitId !== null ? (
                <UnitPathView unitId={currentUnitId} />
              ) : (
                <UnitsRadialMap />
              )}
            </>
          )}

          {activeTab === 'shop' && <ShopView />}

          {activeTab === 'pets' && <PetsView />}

          {activeTab === 'profile' && <ProfileView />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
