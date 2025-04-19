// src/types/project.ts
import { Revision } from './revision';
import { NoteFile } from './notes';
import { Chapter } from './chapter';
import { Character } from './character';

export interface Project {
  id: string;
  title: string;
  genre: string;
  description: string;
  chapters: Chapter[];
  revisions: Revision[];
  encyclopedia: Record<string, string>;
  notes: NoteFile[];
  characters: Character[];
  locations: Location[];
}
