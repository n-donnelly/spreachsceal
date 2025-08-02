import { Scratchpad } from "../types/scratchpad";
import { ScratchPadService } from "./ScratchPadService";

export class FirebaseScratchPadService implements ScratchPadService {
    private readonly SCRATCHPAD_COLLECTION = 'scratchpads';

    async getScratchpad(): Promise<Scratchpad> {
    // Implement Firebase logic to get the scratchpad
    throw new Error('Firebase service not implemented yet');
    }

    async saveScratchpad(scratchpad: Scratchpad): Promise<void> {
    // Implement Firebase logic to save the scratchpad
    throw new Error('Firebase service not implemented yet');
    }
}
