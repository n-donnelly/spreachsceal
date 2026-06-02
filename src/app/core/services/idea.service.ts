import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from '@angular/fire/firestore';
import { Idea } from '../models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private firestore = inject(Firestore);
  private auth = inject(AuthService);

  async getIdeas(): Promise<Idea[]> {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Not authenticated');

    const ideasRef = collection(this.firestore, `users/${user.uid}/ideas`);
    const q = query(ideasRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea));
  }

  async addIdea(data: Omit<Idea, 'id' | 'userId' | 'createdAt'>) {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Not authenticated');

    const ideasRef = collection(this.firestore, `users/${user.uid}/ideas`);
    return addDoc(ideasRef, { 
      ...data, 
      userId: user.uid,
      createdAt: serverTimestamp() 
    });
  }

  async updateIdea(ideaId: string, data: Partial<Idea>) {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Not authenticated');

    const docRef = doc(this.firestore, `users/${user.uid}/ideas/${ideaId}`);
    return updateDoc(docRef, data);
  }

  async deleteIdea(ideaId: string) {
    const user = this.auth.currentUser();
    if (!user) throw new Error('Not authenticated');

    const docRef = doc(this.firestore, `users/${user.uid}/ideas/${ideaId}`);
    return deleteDoc(docRef);
  }
}
