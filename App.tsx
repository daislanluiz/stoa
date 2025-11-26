import React, { useState } from 'react';
import { ViewState } from './types';
import { TopBar, BottomNav } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { ChatView } from './components/ChatView';
import { JournalView } from './components/JournalView';
import { PracticesView } from './components/PracticesView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return <HomeView />;
      case ViewState.CHAT:
        return <ChatView />;
      case ViewState.JOURNAL:
        return <JournalView />;
      case ViewState.PRACTICES:
        return <PracticesView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-stone-200 relative overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 bg-noise opacity-40 pointer-events-none z-0 mix-blend-multiply"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar />
        
        <main className="w-full flex-1">
          {renderView()}
        </main>

        <BottomNav currentView={currentView} setView={setCurrentView} />
      </div>
    </div>
  );
};

export default App;