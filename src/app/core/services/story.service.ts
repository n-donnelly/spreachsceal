import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Story, Chapter, Scene } from '../models';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private firestore = inject(Firestore);

  // --- Stories ---
  async getStories(worldId: string): Promise<Story[]> {
    const storiesRef = collection(this.firestore, `worlds/${worldId}/stories`);
    const snap = await getDocs(storiesRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
  }

  getStory(worldId: string, storyId: string): Observable<Story | undefined> {
    const storyRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}`);
    return from(getDoc(storyRef)).pipe(
      map(snapshot => snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as Story : undefined)
    );
  }

  async addStory(worldId: string, story: Omit<Story, 'id' | 'worldId'>) {
    const storiesRef = collection(this.firestore, `worlds/${worldId}/stories`);
    return addDoc(storiesRef, { ...story, worldId });
  }

  async updateStory(worldId: string, storyId: string, data: Partial<Story>) {
    const storyRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}`);
    return updateDoc(storyRef, data);
  }

  async deleteStory(worldId: string, storyId: string) {
    const storyRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}`);
    return deleteDoc(storyRef);
  }

  // --- Chapters ---
  async getChapters(worldId: string, storyId: string): Promise<Chapter[]> {
    const chaptersRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters`);
    const q = query(chaptersRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chapter));
  }

  async addChapter(worldId: string, storyId: string, chapter: Omit<Chapter, 'id' | 'storyId'>) {
    const chaptersRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters`);
    return addDoc(chaptersRef, { ...chapter, storyId });
  }

  async updateChapter(worldId: string, storyId: string, chapterId: string, data: Partial<Chapter>) {
    const chapterRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}`);
    return updateDoc(chapterRef, data);
  }

  async deleteChapter(worldId: string, storyId: string, chapterId: string) {
    const chapterRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}`);
    return deleteDoc(chapterRef);
  }

  // --- Scenes ---
  async getScenes(worldId: string, storyId: string, chapterId: string): Promise<Scene[]> {
    const scenesRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}/scenes`);
    const q = query(scenesRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scene));
  }

  async addScene(worldId: string, storyId: string, chapterId: string, scene: Omit<Scene, 'id' | 'chapterId'>) {
    const scenesRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}/scenes`);
    return addDoc(scenesRef, { ...scene, chapterId });
  }

  async updateScene(worldId: string, storyId: string, chapterId: string, sceneId: string, data: Partial<Scene>) {
    const sceneRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}/scenes/${sceneId}`);
    return updateDoc(sceneRef, data);
  }

  async deleteScene(worldId: string, storyId: string, chapterId: string, sceneId: string) {
    const sceneRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}/chapters/${chapterId}/scenes/${sceneId}`);
    return deleteDoc(sceneRef);
  }

  // --- Revisions ---
  async getRevisions(worldId: string, storyId: string): Promise<any[]> {
    const revsRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/revisions`);
    const q = query(revsRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addRevision(worldId: string, storyId: string, revisionData: any) {
    const revsRef = collection(this.firestore, `worlds/${worldId}/stories/${storyId}/revisions`);
    return addDoc(revsRef, revisionData);
  }

  async deleteRevision(worldId: string, storyId: string, revisionId: string) {
    const revRef = doc(this.firestore, `worlds/${worldId}/stories/${storyId}/revisions/${revisionId}`);
    return deleteDoc(revRef);
  }
}
