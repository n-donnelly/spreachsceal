import { createScratchPad, Scratchpad } from "../types/scratchpad";
import { ScratchPadService } from "./ScratchPadService";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  runTransaction,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class FirebaseScratchPadService implements ScratchPadService {
    private readonly SCRATCHPAD_COLLECTION = 'scratchpads';

    async getScratchpad(userId: string): Promise<Scratchpad> {
        try {
            const scratchPadRef = collection(db, this.SCRATCHPAD_COLLECTION);
            const q = query(
                scratchPadRef, 
                where("userId", "==", userId)
            );

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return { 
                    fbid: querySnapshot.docs[0].id, 
                    ...querySnapshot.docs[0].data() 
                } as Scratchpad;
            }

            // If no scratchpad exists, create one atomically
            return await runTransaction(db, async (transaction) => {
                const newScratchpad = createScratchPad(userId);
                const newDocRef = doc(collection(db, this.SCRATCHPAD_COLLECTION));
                newScratchpad.fbid = newDocRef.id;
                newScratchpad.createdAt = Timestamp.now();
                newScratchpad.updatedAt = Timestamp.now();
                
                transaction.set(newDocRef, newScratchpad);
                return newScratchpad;
            });
        } catch (error) {
            console.error('Error in getScratchpad:', error);
            throw error;
        }
    }

    async saveScratchpad(scratchpad: Scratchpad): Promise<void> {
        try {
            const docRef = doc(db, this.SCRATCHPAD_COLLECTION, scratchpad.fbid);
            
            return await runTransaction(db, async (transaction) => {
                const currentDoc = await transaction.get(docRef);
                
                if (!currentDoc.exists()) {
                    throw new Error('Document does not exist!');
                }

                const updatedScratchpad = {
                    ...scratchpad,
                    updatedAt: Timestamp.now()
                };

                transaction.set(docRef, updatedScratchpad);
            });
        } catch (error) {
            console.error('Error in saveScratchpad:', error);
            throw error;
        }
    }

    async checkForUpdates(scratchpad: Scratchpad): Promise<Scratchpad | null> {
        try {
            const docRef = doc(db, this.SCRATCHPAD_COLLECTION, scratchpad.fbid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const cloudScratchpad = { 
                    fbid: docSnap.id, 
                    ...docSnap.data() 
                } as Scratchpad;
                
                if (cloudScratchpad.updatedAt.toMillis() > scratchpad.updatedAt.toMillis()) {
                    return cloudScratchpad;
                }
            }
            return null;
        } catch (error) {
            console.error('Error in checkForUpdates:', error);
            throw error;
        }
    }
}
