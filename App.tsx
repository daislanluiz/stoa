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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      <TopBar />
      
      <main className="w-full">
        {renderView()}
      </main>

      <BottomNav currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;