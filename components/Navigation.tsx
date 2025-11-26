import React from 'react';
import { BookOpen, MessageCircle, PenTool, Home } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const TopBar: React.FC = () => (
  <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md px-6 py-5 flex items-center justify-center transition-all duration-300">
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-serif text-ink font-bold tracking-widest uppercase">Stoa</h1>
      <div className="w-8 h-[1px] bg-bronze-500 mt-1 opacity-50"></div>
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
    <nav className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 bg-stone-900/90 backdrop-blur-lg text-stone-300 rounded-2xl shadow-2xl shadow-stone-900/20 z-50 px-6 py-4 flex justify-between items-center ring-1 ring-white/10">
      {navItems.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 group`}
          >
            <div className={`absolute inset-0 bg-white/10 rounded-xl scale-0 transition-transform duration-200 ${isActive ? 'scale-100' : 'group-hover:scale-75'}`}></div>
            <item.icon 
              size={20} 
              className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`} 
              strokeWidth={isActive ? 2.5 : 2}
            />
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 bg-bronze-500 rounded-full"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};