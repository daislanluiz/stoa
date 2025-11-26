import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { getJournalInsight } from '../services/geminiService';
import { Save, Wand2, Trash2, Calendar, Feather } from 'lucide-react';

export const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('stoic_journal_entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = async (text: string, insight: string = '') => {
    if (!text.trim()) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: text,
      mood: 'neutral',
      aiInsight: insight
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('stoic_journal_entries', JSON.stringify(updated));
    setCurrentText('');
  };

  const handleAnalyzeAndSave = async () => {
    if (!currentText.trim()) return;
    setAnalyzing(true);
    const insight = await getJournalInsight(currentText);
    setAnalyzing(false);
    saveEntry(currentText, insight);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('stoic_journal_entries', JSON.stringify(updated));
  };

  return (
    <div className="px-6 py-8 pb-32 max-w-2xl mx-auto space-y-10">
      
      {/* Input Area */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-stone-900">Exame de Consciência</h2>
          <p className="text-stone-500 text-xs uppercase tracking-widest font-semibold">
            Reflexão Noturna
          </p>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-stone-100 to-stone-50 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-white rounded-xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-stone-100">
            <textarea
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Escreva livremente aqui..."
              className="w-full h-48 p-6 rounded-xl bg-transparent text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-0 resize-none font-serif text-lg leading-relaxed"
            />
            
            <div className="flex border-t border-stone-100 p-2 gap-2">
              <button
                onClick={() => saveEntry(currentText)}
                disabled={!currentText.trim() || analyzing}
                className="flex-1 py-2 px-4 text-stone-500 font-medium text-sm rounded-lg hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                <span>Salvar</span>
              </button>
              
              <button
                onClick={handleAnalyzeAndSave}
                disabled={!currentText.trim() || analyzing}
                className="flex-1 py-2 px-4 bg-stone-900 text-stone-50 font-medium text-sm rounded-lg hover:bg-stone-800 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Wand2 size={16} />
                )}
                <span>Analisar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-px bg-stone-200 flex-1"></div>
          <span className="text-stone-400 text-xs font-serif italic">Memórias</span>
          <div className="h-px bg-stone-200 flex-1"></div>
        </div>
        
        {entries.length === 0 ? (
          <div className="text-center py-12 opacity-40">
            <Feather size={48} className="mx-auto mb-4 text-stone-300" />
            <p className="text-stone-400 font-serif italic">O papel está em branco.</p>
          </div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="group relative pl-6 border-l border-stone-200 hover:border-bronze-400 transition-colors duration-300 space-y-3">
              <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-stone-200 group-hover:bg-bronze-500 transition-colors duration-300 ring-4 ring-paper"></div>
              
              <div className="flex justify-between items-start">
                <div className="flex items-center text-xs text-stone-400 font-bold uppercase tracking-wider gap-2">
                  <Calendar size={12} />
                  {new Date(entry.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="text-stone-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </div>
              
              <p className="text-stone-800 font-serif text-base leading-relaxed opacity-90">{entry.content}</p>
              
              {entry.aiInsight && (
                <div className="bg-stone-100/50 p-4 rounded-lg mt-3">
                  <div className="flex items-center gap-2 mb-2 text-bronze-600">
                    <Wand2 size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">O Conselho do Sábio</span>
                  </div>
                  <p className="text-stone-600 text-sm italic font-serif leading-relaxed">{entry.aiInsight}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};