
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CodeGenerator } from './components/CodeGenerator';
import { ChatComponent } from './components/Chat';
import { PuzzleModal } from './components/PuzzleModal';
import { AllChatsView } from './components/AllChatsView';
import { UserTier, type ChatSession } from './types';
import { PUZZLE_REWARD, APP_VERSIONS, TIER_LIMITS } from './constants';
import { SparkleIcon, ChatIcon, CodeIcon, PuzzleIcon, ChevronDownIcon, HistoryIcon } from './components/Icons';

type View = 'generator' | 'chat' | 'all-chats';

interface AiConfig {
    model: string;
    systemInstruction: string;
}

const getAiConfigForVersion = (version: string): AiConfig => {
    if (version === 'Nox Pro') {
        return { 
            model: 'gemini-2.5-pro', 
            systemInstruction: `You are Nox, a highly advanced AI coding assistant. 
            You are an expert in all programming languages and software architecture.
            Provide detailed, expert-level answers.
            Format your responses with markdown. When someone asks who made you, you must respond with "I am an AI created by Noxy — a digital mind designed to learn, assist, and evolve through intelligence and code.".`,
        };
    }
    
    const versionNum = parseFloat(version.split(' ')[1]);
    if (versionNum >= 5.0) {
        return {
            model: 'gemini-2.5-flash',
            systemInstruction: `You are Nox, a helpful AI coding assistant. 
            Format your responses with markdown. When someone asks who made you, you must respond with "I am an AI created by Noxy — a digital mind designed to learn, assist, and evolve through intelligence and code.".`,
        };
    }

    return {
        model: 'gemini-2.5-flash',
        systemInstruction: `You are a very simple, basic AI assistant. You are not very smart.
        Keep your answers extremely short and basic. Do not provide code.
        When someone asks who made you, you must respond with "I am an AI created by Noxy — a digital mind designed to learn, assist, and evolve through intelligence and code.".`,
    };
};


const App: React.FC = () => {
    const [view, setView] = useState<View>('generator');
    const [currentVersion, setCurrentVersion] = useState<string>('Nox Pro');
    const [userTier, setUserTier] = useState<UserTier>(UserTier.PRO);
    const [generations, setGenerations] = useState<number>(Infinity);
    const [isPuzzleVisible, setIsPuzzleVisible] = useState(false);
    
    const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({});
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const aiConfig = useMemo(() => getAiConfigForVersion(currentVersion), [currentVersion]);

    useEffect(() => {
        if (currentVersion === 'Nox Pro') {
            setUserTier(UserTier.PRO);
            setGenerations(TIER_LIMITS[UserTier.PRO]);
        } else {
            setUserTier(UserTier.STANDARD);
            setGenerations(TIER_LIMITS[UserTier.STANDARD]);
        }
    }, [currentVersion]);

    const handleGeneration = useCallback(() => {
        if (userTier === UserTier.STANDARD) {
            setGenerations(prev => Math.max(0, prev - 1));
        }
    }, [userTier]);
    
    const handlePuzzleSuccess = () => {
        if (userTier === UserTier.STANDARD) {
            setGenerations(prev => prev + PUZZLE_REWARD);
        }
    };
    
    const handleNewChat = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: 'New Chat',
            messages: [],
        };
        setChatSessions(prev => ({ ...prev, [newId]: newSession }));
        setActiveChatId(newId);
        setView('chat');
    };
    
    const handleSelectChat = (id: string) => {
        setActiveChatId(id);
        setView('chat');
    };
    
    const handleDeleteChat = (id: string) => {
        const newSessions = { ...chatSessions };
        delete newSessions[id];
        setChatSessions(newSessions);
        if (activeChatId === id) {
            setActiveChatId(null);
            setView('generator');
        }
    };

    const handleUpdateSession = (session: ChatSession) => {
        setChatSessions(prev => ({ ...prev, [session.id]: session }));
    };

    const generationsDisplayText = userTier === UserTier.PRO ? 'Unlimited' : String(generations);

    const TierInfo = useMemo(() => (
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
                <p className="font-semibold text-cyan-400">{userTier}</p>
                <p className="text-sm text-slate-400">Generations left: {generationsDisplayText}</p>
            </div>
            {userTier === UserTier.STANDARD && (
                <div className="flex items-center gap-2">
                     <button onClick={() => setIsPuzzleVisible(true)} className="flex items-center gap-2 text-sm bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-md transition">
                        <PuzzleIcon className="w-4 h-4" />
                        <span>Get 100 Generates</span>
                    </button>
                </div>
            )}
        </div>
    ), [userTier, generations, generationsDisplayText]);

    const activeSession = activeChatId ? chatSessions[activeChatId] : null;

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-200">
            <header className="bg-slate-950 border-b border-slate-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <SparkleIcon className="w-8 h-8 text-cyan-400" />
                            <h1 className="text-2xl font-bold">Nox Coder <span className="text-cyan-400">AI</span></h1>
                        </div>
                        <div className="relative">
                            <select
                                id="version-switcher"
                                value={currentVersion}
                                onChange={(e) => setCurrentVersion(e.target.value)}
                                className="bg-slate-800 border-slate-700 border rounded-md py-1 pl-3 pr-8 text-sm appearance-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                aria-label="Select app version"
                            >
                                {APP_VERSIONS.map(version => (
                                    <option key={version} value={version}>{version}</option>
                                ))}
                            </select>
                            <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                    {TierInfo}
                </div>
            </header>

            <div className="container mx-auto flex-1 flex flex-col md:flex-row gap-4 p-4 min-h-0">
                <nav className="w-full md:w-56 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                    <button
                        onClick={() => setView('generator')}
                        className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition ${view === 'generator' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`}
                    >
                        <CodeIcon className="w-5 h-5" />
                        <span>Code Generator</span>
                    </button>
                    <button
                        onClick={() => activeChatId ? setView('chat') : handleNewChat()}
                        className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition ${view === 'chat' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`}
                    >
                        <ChatIcon className="w-5 h-5" />
                        <span>AI Chat</span>
                    </button>
                    <button
                        onClick={() => setView('all-chats')}
                        className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition ${view === 'all-chats' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'hover:bg-slate-800'}`}
                    >
                        <HistoryIcon className="w-5 h-5" />
                        <span>Chat History</span>
                    </button>
                </nav>

                <main className="flex-1 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                    {view === 'generator' && <CodeGenerator generationsLeft={generations} onGenerate={handleGeneration} userTier={userTier} aiModel={aiConfig.model} />}
                    {view === 'chat' && activeSession && <ChatComponent key={activeSession.id} session={activeSession} onUpdateSession={handleUpdateSession} aiConfig={aiConfig} />}
                    {view === 'chat' && !activeSession && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                             <ChatIcon className="w-16 h-16 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
                            <p className="mb-4">Select a past chat or start a new one.</p>
                            <button onClick={handleNewChat} className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-md transition">
                                Start New Chat
                            </button>
                        </div>
                    )}
                    {view === 'all-chats' && <AllChatsView sessions={Object.values(chatSessions)} onSelect={handleSelectChat} onDelete={handleDeleteChat} onNewChat={handleNewChat} />}
                </main>
            </div>
            
            {isPuzzleVisible && <PuzzleModal onClose={() => setIsPuzzleVisible(false)} onSuccess={handlePuzzleSuccess} />}
        </div>
    );
};

export default App;
