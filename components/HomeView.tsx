import React, { useEffect, useState } from 'react';
import { QuoteData } from '../types';
import { getDailyStoicQuote } from '../services/geminiService';
import { RefreshCw, Quote, Sun } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    setLoading(true);
    // Check local storage for today's quote to save API calls and maintain "Daily" feel
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_stoic_quote');
    
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setQuote(parsed.data);
        setLoading(false);
        return;
      }
    }

    const data = await getDailyStoicQuote();
    setQuote(data);
    localStorage.setItem('daily_stoic_quote', JSON.stringify({ date: today, data }));
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-stone-400 animate-pulse">
        <div className="w-16 h-16 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin mb-4"></div>
        <p className="font-serif italic">Consultando os sábios...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 pb-24 max-w-2xl mx-auto space-y-8">
      
      {/* Date Header */}
      <div className="text-center space-y-1">
        <p className="text-stone-500 text-sm uppercase tracking-widest font-semibold">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h2 className="text-3xl font-serif text-stone-800">Momento Presente</h2>
      </div>

      {/* Quote Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-stone-300">
          <Quote size={64} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <blockquote className="font-serif text-xl md:text-2xl leading-relaxed text-stone-800">
            "{quote?.text}"
          </blockquote>
          
          <div className="flex items-center justify-between border-t border-stone-100 pt-4">
            <div>
              <p className="font-bold text-stone-900">{quote?.author}</p>
              {quote?.source && <p className="text-xs text-stone-500 italic">{quote.source}</p>}
            </div>
            <button onClick={() => { localStorage.removeItem('daily_stoic_quote'); fetchQuote(); }} className="text-stone-400 hover:text-stone-600 transition-colors p-2 rounded-full hover:bg-stone-50" title="Nova citação">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Reflection Card */}
      <div className="bg-stone-100/50 p-6 rounded-xl border border-stone-200/50">
        <div className="flex items-center space-x-2 mb-3 text-stone-600">
          <Sun size={18} />
          <h3 className="font-semibold text-sm uppercase tracking-wide">Reflexão do Dia</h3>
        </div>
        <p className="text-stone-700 leading-relaxed text-sm md:text-base">
          {quote?.reflection}
        </p>
      </div>

    </div>
  );
};