import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createStoicChat } from '../services/geminiService';
import { Send, User, Sparkles } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Saudações. Eu sou um estudante da natureza e da razão. O que perturba a sua tranquilidade hoje? Podemos examinar isso juntos.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Persist chat instance
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
      
      // Temporary placeholder message that we will update
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
        text: 'Perdoe-me, mas houve uma falha na minha conexão com o logos. Tente novamente em breve.',
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
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-stone-200 text-stone-600' : 'bg-stone-800 text-stone-100'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>

              {/* Bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-200 text-stone-800 rounded-br-none'
                    : 'bg-white border border-stone-200 text-stone-800 shadow-sm rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="flex flex-row items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex space-x-1 h-5 items-center">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-0"></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-stone-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Pergunte ao sábio..."
            className="w-full bg-white border border-stone-300 text-stone-800 placeholder-stone-400 rounded-full py-3 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent shadow-sm transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-stone-800 text-white rounded-full hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};