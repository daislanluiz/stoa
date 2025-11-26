import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createStoicChat } from '../services/geminiService';
import { Send, Sparkles } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Saudações. Aqui estamos, protegidos pelo logos. Que questão perturba sua ataraxia hoje?',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatInstance = useRef<Chat | null>(null);

  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = createStoicChat();
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatInstance.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatInstance.current.sendMessageStream({
        message: input
      });

      let fullResponseText = '';
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullResponseText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponseText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Perdoe-me, mas a conexão com o logos falhou momentaneamente. Tente novamente.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-2xl mx-auto relative">
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-[fadeIn_0.3s_ease-out]`}
          >
            <div className={`max-w-[90%] md:max-w-[80%] space-y-1`}>
              <div className={`text-[10px] uppercase tracking-wider font-bold mb-1 ${msg.role === 'user' ? 'text-right text-stone-400' : 'text-bronze-600 flex items-center gap-1'}`}>
                {msg.role === 'model' && <Sparkles size={10} />}
                {msg.role === 'user' ? 'Você' : 'O Sábio'}
              </div>
              
              <div
                className={`p-0 text-base md:text-lg leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-stone-800 font-sans'
                    : 'text-stone-900 font-serif'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex flex-col items-start space-y-1">
             <div className="text-[10px] uppercase tracking-wider font-bold text-bronze-600 flex items-center gap-1">
                <Sparkles size={10} /> O Sábio
             </div>
             <div className="flex space-x-1 h-6 items-center px-1">
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-0"></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce delay-300"></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-24" />
      </div>

      <div className="absolute bottom-24 left-6 right-6 md:left-0 md:right-0 md:bottom-28">
        <div className="relative bg-white shadow-xl shadow-stone-200/50 rounded-2xl border border-stone-100 flex items-center p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte ao sábio..."
            className="flex-1 bg-transparent text-stone-800 placeholder-stone-400 px-4 py-3 focus:outline-none font-sans"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-stone-900 text-stone-50 rounded-xl hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};