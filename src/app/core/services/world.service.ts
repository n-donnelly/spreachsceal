import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from '@angular/fire/firestore';
import { World, Character, Location as WorldLocation, EncyclopediaEntry } from '../models';
import { AuthService } from './auth.service';
import { Observable, switchMap, of, from, map } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class WorldService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);
  private user$ = toObservable(this.auth.currentUser);

  async getUserWorlds(): Promise<World[]> {
    const user = this.auth.currentUser();
    if (!user) return [];
    const worldsRef = collection(this.firestore, 'worlds');
    const q = query(worldsRef, where('ownerId', '==', user.uid));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as World));
  }

  async createWorld(world: Omit<World, 'id' | 'ownerId' | 'createdAt'>) {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Must be logged in to create a world');

    const worldsRef = collection(this.firestore, 'worlds');
    return addDoc(worldsRef, {
      ...world,
      ownerId: user.uid,
      createdAt: serverTimestamp()
    });
  }

  getWorld(id: string): Observable<World | undefined> {
    const worldRef = doc(this.firestore, `worlds/${id}`);
    return from(getDoc(worldRef)).pipe(
      map(snapshot => {
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() } as World;
        }
        return undefined;
      })
    );
  }

  async updateWorld(id: string, data: Partial<World>) {
    const worldRef = doc(this.firestore, `worlds/${id}`);
    return updateDoc(worldRef, data);
  }

  async deleteWorld(id: string) {
    const worldRef = doc(this.firestore, `worlds/${id}`);
    return deleteDoc(worldRef);
  }

  // --- Subcollections ---

  async getCharacters(worldId: string): Promise<Character[]> {
    const charsRef = collection(this.firestore, `worlds/${worldId}/characters`);
    const snap = await getDocs(charsRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Character));
  }

  async addCharacter(worldId: string, data: any) {
    const charsRef = collection(this.firestore, `worlds/${worldId}/characters`);
    return addDoc(charsRef, { ...data, worldId });
  }

  async updateCharacter(worldId: string, charId: string, data: Partial<Character>) {
    const docRef = doc(this.firestore, `worlds/${worldId}/characters/${charId}`);
    return updateDoc(docRef, data);
  }

  async deleteCharacter(worldId: string, charId: string) {
    const docRef = doc(this.firestore, `worlds/${worldId}/characters/${charId}`);
    return deleteDoc(docRef);
  }

  async getLocations(worldId: string): Promise<WorldLocation[]> {
    const locsRef = collection(this.firestore, `worlds/${worldId}/locations`);
    const snap = await getDocs(locsRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WorldLocation));
  }

  async addLocation(worldId: string, data: any) {
    const locsRef = collection(this.firestore, `worlds/${worldId}/locations`);
    return addDoc(locsRef, { ...data, worldId });
  }

  async updateLocation(worldId: string, locId: string, data: Partial<WorldLocation>) {
    const docRef = doc(this.firestore, `worlds/${worldId}/locations/${locId}`);
    return updateDoc(docRef, data);
  }

  async deleteLocation(worldId: string, locId: string) {
    const docRef = doc(this.firestore, `worlds/${worldId}/locations/${locId}`);
    return deleteDoc(docRef);
  }

  async getEncyclopedia(worldId: string): Promise<EncyclopediaEntry[]> {
    const encRef = collection(this.firestore, `worlds/${worldId}/encyclopedia`);
    const snap = await getDocs(encRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as EncyclopediaEntry));
  }

  async addEncyclopediaEntry(worldId: string, data: any) {
    const encRef = collection(this.firestore, `worlds/${worldId}/encyclopedia`);
    return addDoc(encRef, { ...data, worldId });
  }

  async updateEncyclopediaEntry(worldId: string, entryId: string, data: Partial<EncyclopediaEntry>) {
    const docRef = doc(this.firestore, `worlds/${worldId}/encyclopedia/${entryId}`);
    return updateDoc(docRef, data);
  }

  async deleteEncyclopediaEntry(worldId: string, entryId: string) {
    const docRef = doc(this.firestore, `worlds/${worldId}/encyclopedia/${entryId}`);
    return deleteDoc(docRef);
  }
}
