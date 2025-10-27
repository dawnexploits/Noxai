
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createChatSession, streamChatMessage } from '../services/geminiService';
import type { ChatMessage, ChatSession } from '../types';
import { FormattedMessage } from './FormattedMessage';
import { SparkleIcon } from './Icons';

interface ChatComponentProps {
    session: ChatSession;
    onUpdateSession: (session: ChatSession) => void;
    aiConfig: { model: string; systemInstruction: string };
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ session, onUpdateSession, aiConfig }) => {
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>(session.messages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setChatSession(createChatSession({
            model: aiConfig.model,
            systemInstruction: aiConfig.systemInstruction,
            history: session.messages,
        }));
        setMessages(session.messages);
    }, [session.id, aiConfig.model, aiConfig.systemInstruction]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || !chatSession || isLoading) return;
        
        const userMessage: ChatMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        const modelMessage: ChatMessage = { role: 'model', content: '' };
        setMessages(prev => [...prev, modelMessage]);

        const stream = await streamChatMessage(chatSession, input);
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = fullResponse;
                return newMessages;
            });
        }
        
        const finalMessages = [...updatedMessages, { role: 'model', content: fullResponse }];
        onUpdateSession({
            ...session,
            title: session.title === 'New Chat' ? input.substring(0, 30) : session.title,
            messages: finalMessages,
        });

        setIsLoading(false);
    }, [input, chatSession, isLoading, messages, onUpdateSession, session]);
    
    return (
        <div className="h-full flex flex-col p-4 md:p-6 bg-slate-900">
            <div ref={messagesEndRef} className="flex-1 overflow-y-auto pr-4 space-y-6 pb-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                                <SparkleIcon className="w-5 h-5 text-slate-900" />
                            </div>
                        )}
                        <div className={`max-w-xl p-4 rounded-xl ${msg.role === 'user' ? 'bg-slate-700' : 'bg-slate-800'}`}>
                           <FormattedMessage content={msg.content} />
                        </div>
                    </div>
                ))}
                 {isLoading && messages[messages.length - 1]?.role === 'model' && messages[messages.length - 1]?.content === '' && (
                     <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                            <SparkleIcon className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="max-w-xl p-4 rounded-xl bg-slate-800 flex items-center">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2 delay-75"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></div>
                        </div>
                     </div>
                )}
            </div>
            <div className="mt-auto pt-4 border-t border-slate-700">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Ask the AI anything..."
                        rows={1}
                        className="w-full bg-slate-800 border-slate-700 border rounded-full p-3 pr-24 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full font-semibold transition bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
