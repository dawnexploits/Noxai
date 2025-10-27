
import React from 'react';
import type { ChatSession } from '../types';
import { HistoryIcon, TrashIcon, ChatIcon } from './Icons';

interface AllChatsViewProps {
  sessions: ChatSession[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
}

export const AllChatsView: React.FC<AllChatsViewProps> = ({ sessions, onSelect, onDelete, onNewChat }) => {
  return (
    <div className="h-full flex flex-col p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <HistoryIcon className="w-6 h-6" />
          Chat History
        </h2>
        <button
          onClick={onNewChat}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md transition flex items-center gap-2"
        >
          <ChatIcon className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>
      
      {sessions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
          <HistoryIcon className="w-20 h-20 mb-4" />
          <p className="text-lg">No chat history yet.</p>
          <p>Start a new chat to see it here.</p>
        </div>
      ) : (
        <ul className="space-y-3 overflow-y-auto">
          {sessions.slice().reverse().map(session => (
            <li key={session.id} className="bg-slate-800 p-4 rounded-lg flex items-center justify-between group hover:bg-slate-700 transition cursor-pointer" onClick={() => onSelect(session.id)}>
              <div>
                <p className="font-semibold text-slate-200">{session.title}</p>
                <p className="text-sm text-slate-400">
                  {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent onSelect from firing
                  onDelete(session.id);
                }}
                className="p-2 rounded-full text-slate-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                aria-label="Delete chat"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
