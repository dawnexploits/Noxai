import React, { useState, useCallback } from 'react';
import { LANGUAGES } from '../constants';
import { generateCode } from '../services/geminiService';
// Fix: Import UserTier as a value for enum access, and LanguageOption as a type.
import { UserTier, type LanguageOption } from '../types';
import { FormattedMessage } from './FormattedMessage';

interface CodeGeneratorProps {
    generationsLeft: number;
    onGenerate: () => void;
    userTier: UserTier;
    aiModel: string;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ generationsLeft, onGenerate, userTier, aiModel }) => {
    const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
    const [prompt, setPrompt] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const canGenerate = userTier === UserTier.PRO || generationsLeft > 0;

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || !canGenerate || isLoading) return;

        setIsLoading(true);
        setError('');
        setGeneratedCode('');
        
        try {
            const result = await generateCode(selectedLanguage.name, prompt, aiModel);
            setGeneratedCode(result);
            onGenerate();
        } catch (err)
 {
            setError('An unexpected error occurred. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, canGenerate, isLoading, selectedLanguage.name, onGenerate, aiModel]);

    const buttonText = isLoading
        ? 'Generating...'
        : userTier === UserTier.PRO
            ? 'Generate Code (Unlimited)'
            : `Generate Code (${generationsLeft} left)`;

    return (
        <div className="p-4 md:p-6 h-full flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label htmlFor="language-select" className="block text-sm font-medium text-slate-400 mb-2">Language</label>
                    <select
                        id="language-select"
                        value={selectedLanguage.id}
                        onChange={(e) => setSelectedLanguage(LANGUAGES.find(l => l.id === e.target.value) || LANGUAGES[0])}
                        className="w-full bg-slate-800 border-slate-700 border rounded-md p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                        ))}
                    </select>
                     <p className="text-xs text-slate-500 mt-2">{selectedLanguage.note}</p>
                </div>
                <div className="flex-grow-[3]">
                    <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-400 mb-2">What do you want to build?</label>
                    <textarea
                        id="prompt-input"
                        rows={3}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., a function that sorts a list of numbers"
                        className="w-full bg-slate-800 border-slate-700 border rounded-md p-3 resize-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
            </div>
            
            <button
                onClick={handleGenerate}
                disabled={!canGenerate || isLoading || !prompt.trim()}
                className="w-full py-3 px-4 rounded-md font-semibold transition flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
            >
                {buttonText}
            </button>
            
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 p-4 overflow-auto min-h-[300px]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating code... please wait.</span>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {!isLoading && !generatedCode && (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Your generated code will appear here.
                    </div>
                )}
                {generatedCode && <FormattedMessage content={generatedCode} />}
            </div>
        </div>
    );
};