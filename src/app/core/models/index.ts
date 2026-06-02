export interface UserProfile {
  id?: string;
  email: string;
  displayName: string;
}

export interface World {
  id?: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: any; // Firestore Timestamp
  isArchived?: boolean;
}

export interface Character {
  id?: string;
  worldId: string;
  name: string;
  aliases: string[];
  role: string;
  description: string;
  attributes: Record<string, any>;
  relationships: Record<string, string>; // e.g., { "characterId_2": "brother" }
}

export interface Location {
  id?: string;
  worldId: string;
  name: string;
  description: string;
}

export interface EncyclopediaEntry {
  id?: string;
  worldId: string;
  title: string;
  type: string; // e.g., "Culture", "Rule", "Magic System"
  content: string;
}

export interface Story {
  id?: string;
  worldId: string;
  title: string;
  description: string; // Elevator pitch
  outline: string;
  notes: string;
  characters: string[]; // Array of characterIds
  locations: string[]; // Array of locationIds
  isArchived?: boolean;
}

export interface Chapter {
  id?: string;
  storyId: string;
  title: string;
  order: number;
  characters?: string[];
  locations?: string[];
}

export interface Scene {
  id?: string;
  chapterId?: string;
  order: number;
  content: string; // The rich text prose
}

export interface StoryRevision {
  id?: string;
  storyId: string;
  name: string;
  createdAt: any; // Firestore Timestamp
  chaptersData: string; // JSON representation of chapters and scenes
}

export interface Idea {
  id?: string;
  userId: string;
  title: string;
  content: string;
  createdAt: any; // Firestore Timestamp
}

export interface Todo {
  id?: string;
  storyId?: string;
  worldId?: string;
  task: string;
  isCompleted: boolean;
}
