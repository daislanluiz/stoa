import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { getJournalInsight } from '../services/geminiService';
import { Save, Wand2, Trash2, Calendar } from 'lucide-react';

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
      mood: 'neutral', // Simplified for this demo
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
    <div className="px-6 py-6 pb-24 max-w-2xl mx-auto space-y-8">
      
      {/* Input Area */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif text-stone-800">Diário Filosófico</h2>
        <p className="text-stone-500 text-sm">"Não admita o sono nos seus olhos macios antes de ter examinado todas as ações do dia." — Pitágoras</p>
        
        <div className="relative">
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Sobre o que você refletiu hoje? O que você fez bem? O que poderia ter feito melhor?"
            className="w-full h-40 p-4 rounded-xl border border-stone-200 bg-white text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 resize-none shadow-sm"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => saveEntry(currentText)}
            disabled={!currentText.trim() || analyzing}
            className="flex-1 py-3 px-4 bg-stone-200 text-stone-800 font-medium rounded-lg hover:bg-stone-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            <span>Salvar Apenas</span>
          </button>
          
          <button
            onClick={handleAnalyzeAndSave}
            disabled={!currentText.trim() || analyzing}
            className="flex-1 py-3 px-4 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Wand2 size={18} />
            )}
            <span>Salvar & Analisar</span>
          </button>
        </div>
      </div>

      {/* History */}
      <div className="space-y-6">
        <h3 className="text-lg font-serif text-stone-700 border-b border-stone-200 pb-2">Entradas Anteriores</h3>
        
        {entries.length === 0 ? (
          <p className="text-stone-400 italic text-center py-8">O papel está em branco, aguardando sua sabedoria.</p>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center text-xs text-stone-400 uppercase tracking-wider font-semibold gap-2">
                  <Calendar size={14} />
                  {new Date(entry.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
                <button onClick={() => deleteEntry(entry.id)} className="text-stone-300 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
              
              <p className="text-stone-800 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              
              {entry.aiInsight && (
                <div className="bg-stone-50 p-4 rounded-lg border-l-4 border-stone-400 mt-4">
                  <p className="text-xs text-stone-500 font-bold uppercase mb-1 flex items-center gap-1">
                    <Wand2 size={12} /> Insight Estoico
                  </p>
                  <p className="text-stone-600 text-sm italic">{entry.aiInsight}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};