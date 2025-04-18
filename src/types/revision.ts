// src/types/revision.ts
import { Chapter } from './chapter';

export interface Revision {
  id: string;
  versionName: string;
  chapters: Chapter[];
  date: string; // ISO date string
}
