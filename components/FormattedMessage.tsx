
import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const code = part.replace(/```/g, '');
          const language = code.split('\n')[0].trim();
          const codeContent = code.substring(code.indexOf('\n') + 1);
          return (
            <div key={index} className="bg-slate-800 rounded-lg my-2">
              <div className="text-xs text-slate-400 px-4 py-2 border-b border-slate-700">{language || 'code'}</div>
              <pre className="p-4 text-sm overflow-x-auto">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        } else {
          return (
            <div key={index} className="prose prose-invert max-w-none">
              {part.split('\n').map((line, lineIndex) => {
                let processedLine: React.ReactNode = line;
                
                if (line.trim().startsWith('# ')) {
                    return <h2 key={lineIndex} className="text-2xl font-bold mt-2 mb-1">{line.substring(2)}</h2>
                }

                processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                return <p key={lineIndex} dangerouslySetInnerHTML={{ __html: processedLine }} className="my-1"/>
              })}
            </div>
          );
        }
      })}
    </div>
  );
};
