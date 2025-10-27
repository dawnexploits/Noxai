
import React, { useState } from 'react';

interface PuzzleModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const generatePuzzle = () => {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1, num2, question, answer;

    switch (operator) {
        case '+':
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            question = `What is ${num1} + ${num2}?`;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 20) + 5;
            num2 = Math.floor(Math.random() * num1) + 1; // Ensure result is positive
            question = `What is ${num1} - ${num2}?`;
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 10) + 2;
            num2 = Math.floor(Math.random() * 10) + 2;
            question = `What is ${num1} * ${num2}?`;
            answer = num1 * num2;
            break;
        default: // Should not happen
            return { question: 'What is 1 + 1?', answer: '2' };
    }
    
    return { question, answer: answer.toString() };
}


export const PuzzleModal: React.FC<PuzzleModalProps> = ({ onClose, onSuccess }) => {
  const [puzzle] = useState(generatePuzzle);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim().toLowerCase() === puzzle.answer) {
      onSuccess();
      onClose();
    } else {
      setError("Incorrect answer, please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 max-w-sm w-full border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-cyan-400">Complete a Puzzle!</h2>
        <p className="text-slate-300 mb-6">Solve this simple puzzle to earn 100 extra generations.</p>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="puzzle-answer" className="block mb-2 text-sm font-medium text-slate-400">
            {puzzle.question}
          </label>
          <input
            id="puzzle-answer"
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError('');
            }}
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          
          <div className="mt-6 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-300 hover:bg-slate-700 transition">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 rounded-md bg-cyan-500 text-slate-900 font-semibold hover:bg-cyan-400 transition">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
