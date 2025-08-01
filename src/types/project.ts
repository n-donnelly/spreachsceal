// src/types/project.ts
import { Revision } from './revision';
import { NoteFile } from './notes';
import { Chapter } from './chapter';
import { Character } from './character';
import { Location } from './location';
import { Outline } from './outline';
import { Encyclopedia } from './encyclopedia';
import { TodoItem } from './todo-items';

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
  todoItems: TodoItem[];
  outline: Outline;

  nextIds: {
    chapter: number;
    character: number;
    scene: number;
    note: number;
    location: number;
    encyclopediaEntry: number;
    todoItem: number;
    revision: number;
  }
}
