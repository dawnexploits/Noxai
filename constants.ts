
import type { LanguageOption } from './types';
import { UserTier } from './types';

export const LANGUAGES: LanguageOption[] = [
  { id: 'lua', name: 'Lua', note: 'Game that uses this code language: Roblox' },
  { id: 'javascript', name: 'JavaScript', note: 'Used in: Web Development' },
  { id: 'python', name: 'Python', note: 'Used in: AI, Data Science' },
  { id: 'typescript', name: 'TypeScript', note: 'Used in: Modern Web Apps' },
  { id: 'go', name: 'Go', note: 'Used in: Backend Systems' },
  { id: 'rust', name: 'Rust', note: 'Used in: Systems Programming' },
  { id: 'java', name: 'Java', note: 'Used in: Enterprise Applications'},
  { id: 'csharp', name: 'C#', note: 'Used in: Game Dev (Unity), .NET'}
];

export const TIER_LIMITS: Record<UserTier, number> = {
  [UserTier.STANDARD]: 20,
  [UserTier.PRO]: Infinity,
};

export const PUZZLE_REWARD = 100;

export const APP_VERSIONS: string[] = [
    'Nox 1.00.0', 'Nox 1.01.0', 'Nox 1.02.0', 'Nox 1.03.0', 'Nox 1.04.0', 'Nox 1.05.0', 'Nox 1.06.0', 'Nox 1.07.0', 'Nox 1.08.0', 'Nox 1.09.0',
    'Nox 2.00.0', 'Nox 2.01.0', 'Nox 2.02.0', 'Nox 2.03.0', 'Nox 2.04.0', 'Nox 2.05.0', 'Nox 2.06.0', 'Nox 2.07.0', 'Nox 2.08.0', 'Nox 2.09.0',
    'Nox 3.00.0', 'Nox 3.01.0', 'Nox 3.02.0', 'Nox 3.03.0', 'Nox 3.04.0', 'Nox 3.05.0', 'Nox 3.06.0', 'Nox 3.07.0', 'Nox 3.08.0', 'Nox 3.09.0',
    'Nox 4.00.0', 'Nox 4.01.0', 'Nox 4.02.0', 'Nox 4.03.0', 'Nox 4.04.0', 'Nox 4.05.0', 'Nox 4.06.0', 'Nox 4.07.0', 'Nox 4.08.0', 'Nox 4.09.0',
    'Nox 5.00.0', 'Nox 5.01.0', 'Nox 5.02.0', 'Nox 5.03.0', 'Nox 5.04.0', 'Nox 5.05.0', 'Nox 5.06.0', 'Nox 5.07.0', 'Nox 5.08.0', 'Nox 5.09.0',
    'Nox 6.00.0', 'Nox 6.01.0', 'Nox 6.02.0', 'Nox 6.03.0', 'Nox 6.04.0', 'Nox 6.05.0', 'Nox 6.06.0', 'Nox 6.07.0', 'Nox 6.08.0', 'Nox 6.09.0',
    'Nox 7.00.0', 'Nox 7.01.0', 'Nox 7.02.0', 'Nox 7.03.0', 'Nox 7.04.0', 'Nox 7.05.0', 'Nox 7.06.0', 'Nox 7.07.0', 'Nox 7.08.0', 'Nox 7.09.0',
    'Nox 8.00.0', 'Nox 8.01.0', 'Nox 8.02.0', 'Nox 8.03.0', 'Nox 8.04.0', 'Nox 8.05.0', 'Nox 8.06.0', 'Nox 8.07.0', 'Nox 8.08.0', 'Nox 8.09.0',
    'Nox 9.00.0', 'Nox Pro'
];
