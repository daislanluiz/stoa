export enum ViewState {
  HOME = 'HOME',
  JOURNAL = 'JOURNAL',
  CHAT = 'CHAT',
  PRACTICES = 'PRACTICES'
}

export interface QuoteData {
  author: string;
  text: string;
  reflection: string;
  source?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'peaceful' | 'anxious' | 'neutral' | 'angry' | 'joyful';
  aiInsight?: string;
}

export interface Practice {
  id: string;
  title: string;
  description: string;
  steps: string[];
  iconName: string;
}