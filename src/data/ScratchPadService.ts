import { Scratchpad } from "../types/scratchpad";

export interface ScratchPadService {
  getScratchpad(userId: string): Promise<Scratchpad>;
  saveScratchpad(scratchpad: Scratchpad): Promise<void>;
}