import { createScratchPad, Scratchpad } from "../types/scratchpad";
import { ScratchPadService } from "./ScratchPadService";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class FirebaseScratchPadService implements ScratchPadService {
    private readonly SCRATCHPAD_COLLECTION = 'scratchpads';

    async getScratchpad(userId: string): Promise<Scratchpad> {
        const scratchPadRef = collection(db, this.SCRATCHPAD_COLLECTION);
        const q = query(
            scratchPadRef, 
            where("userId", "==", userId), 
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const queryResult = querySnapshot.docs.map(doc => ({ fbid: doc.id, ...doc.data() }));
        return queryResult.length > 0 
            ? queryResult[0] as Scratchpad 
            : createScratchPad(userId);
    }

    async saveScratchpad(scratchpad: Scratchpad): Promise<void> {
        await setDoc(
            doc(db, this.SCRATCHPAD_COLLECTION, scratchpad.fbid), 
            scratchpad
        );
    }

    async checkForUpdates(scratchpad: Scratchpad): Promise<Scratchpad | null> {
        const docRef = doc(db, this.SCRATCHPAD_COLLECTION, scratchpad.fbid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const cloudScratchpad = { fbid: docSnap.id, ...docSnap.data() } as Scratchpad;
            if (cloudScratchpad.updatedAt.toMillis() > scratchpad.updatedAt.toMillis()) {
                return cloudScratchpad;
            }
        }
        return null;
    }
}
