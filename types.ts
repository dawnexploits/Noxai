
export enum UserTier {
  STANDARD = 'Nox Standard',
  PRO = 'Nox Pro',
}

export interface LanguageOption {
  id: string;
  name: string;
  note: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}
