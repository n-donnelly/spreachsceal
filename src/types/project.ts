// src/types/project.ts
import { Revision } from './revision';
import { NoteFile } from './notes';
import { Chapter } from './chapter';
import { Character } from './character';
import { Location } from './location';
import { Outline } from './outline';
import { Encyclopedia } from './encyclopedia';

export interface Project {
  id: string;
  title: string;
  genre: string;
  description: string;
  chapters: Chapter[];
  revisions: Revision[];
  encyclopedia: Encyclopedia;
  notes: NoteFile[];
  characters: Character[];
  locations: Location[];
  outline: Outline;
}
