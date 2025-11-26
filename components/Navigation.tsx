import React from 'react';
import { BookOpen, MessageCircle, PenTool, Home } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const TopBar: React.FC = () => (
  <header className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 px-4 py-4 flex items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-stone-800 rounded-full flex items-center justify-center text-stone-100 font-serif font-bold">S</div>
      <h1 className="text-xl font-serif text-stone-800 font-bold tracking-tight">Stoa Diária</h1>
    </div>
  </header>
);

export const BottomNav: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: ViewState.HOME, icon: Home, label: 'Início' },
    { view: ViewState.JOURNAL, icon: PenTool, label: 'Diário' },
    { view: ViewState.CHAT, icon: MessageCircle, label: 'Mentor' },
    { view: ViewState.PRACTICES, icon: BookOpen, label: 'Práticas' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe px-6 py-3 flex justify-between items-center z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
            currentView === item.view ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
          <span className="text-[10px] uppercase tracking-wider font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};