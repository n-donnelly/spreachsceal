// src/types/project.ts
import { Revision } from './revision';
import { NoteFile } from './notes';

export interface Project {
  id: string;
  title: string;
  genre: string;
  description: string;
  revisions: Revision[];
  encyclopedia: Record<string, string>;
  notes: NoteFile[];
  characters: string[];
  locations: string[];
}
