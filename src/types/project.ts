// src/types/project.ts
import { Revision } from './revision';
import { NoteFile } from './notes';
import { Chapter } from './chapter';
import { Character } from './character';
import { Location } from './location';
import { Outline } from './outline';
import { Encyclopedia } from './encyclopedia';
import { TodoItem } from './todo-items';
import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  userId: string;
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
  updatedAt: Timestamp;
  createdAt: Timestamp;

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

export const createNewProject = (userId: string, title: string, genre: string = ''): Project => {
  return {
    id: crypto.randomUUID(),
    userId,
    title,
    genre,
    description: '',
    chapters: [],
    revisions: [],
    encyclopedia: { entries: [] },
    notes: [],
    characters: [],
    locations: [],
    todoItems: [],
    outline: { content: '', notes: [] },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    nextIds: {
      chapter: 1,
      character: 1,
      scene: 1,
      note: 1,
      location: 1,
      encyclopediaEntry: 1,
      todoItem: 1,
      revision: 1
    }
  };
};