import React, { useEffect, useState } from 'react';
import { QuoteData } from '../types';
import { getDailyStoicQuote, FALLBACK_QUOTE } from '../services/geminiService';
import { RefreshCw, Quote, AlertTriangle, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const fetchQuote = async (forceRefresh = false) => {
    setLoading(true);
    
    // Check local storage for today's quote
    const today = new Date().toDateString();
    const stored = localStorage.getItem('daily_stoic_quote');
    
    if (stored && !forceRefresh) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        setQuote(parsed.data);
        setIsFallback(false);
        setLoading(false);
        return;
      }
    }

    const data = await getDailyStoicQuote();
    setQuote(data);
    
    const isOffline = data.text === FALLBACK_QUOTE.text;
    setIsFallback(isOffline);

    if (!isOffline) {
      localStorage.setItem('daily_stoic_quote', JSON.stringify({ date: today, data }));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse space-y-4">
        <div className="w-12 h-12 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
        <p className="font-serif text-stone-400 text-sm tracking-widest uppercase">Consultando os sábios...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 pb-32 max-w-2xl mx-auto space-y-12 animate-[fadeIn_0.8s_ease-out]">
      
      {/* Date & Header */}
      <div className="text-center space-y-2 pt-4">
        <p className="text-stone-500 text-xs font-bold uppercase tracking-[0.2em]">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div className="h-px w-12 bg-stone-300 mx-auto"></div>
      </div>

      {/* Main Quote Card - "Paper" feel */}
      <div className={`relative group transition-all duration-500`}>
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-stone-300/50"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-stone-300/50"></div>
        
        <div className={`relative bg-white p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-stone-100 ${isFallback ? 'ring-1 ring-amber-100' : ''}`}>
          <div className="absolute top-6 left-6 opacity-10 text-stone-900">
            <Quote size={48} className="rotate-180" />
          </div>

          <div className="space-y-8 text-center relative z-10">
            <blockquote className="font-serif text-2xl md:text-3xl leading-relaxed text-stone-900 italic font-light">
              "{quote?.text}"
            </blockquote>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="h-px w-8 bg-stone-800 mb-2"></div>
              <p className="font-sans font-bold text-stone-900 text-sm tracking-widest uppercase">{quote?.author}</p>
              {quote?.source && <p className="font-serif text-stone-500 text-xs italic">{quote.source}</p>}
            </div>
          </div>

          {/* Refresh Action */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button 
              onClick={() => { localStorage.removeItem('daily_stoic_quote'); fetchQuote(true); }} 
              className="p-2 text-stone-300 hover:text-stone-600 transition-colors"
              title="Nova citação"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Reflection Card - "Inverted/Value" feel */}
      <div className="relative overflow-hidden rounded-sm bg-stone-900 text-stone-100 p-8 shadow-2xl shadow-stone-900/10">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-800 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2 text-bronze-500 mb-2">
            {isFallback ? <AlertTriangle size={16} /> : <Sparkles size={16} />}
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest">
              Aplicação Prática
            </h3>
          </div>
          
          <p className="font-serif text-stone-200 leading-8 text-lg md:text-xl font-light">
            {quote?.reflection}
          </p>

          <div className="pt-4 flex justify-start">
            <div className="px-3 py-1 border border-stone-700 rounded-full text-[10px] text-stone-400 uppercase tracking-wider">
              Memento Mori
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};