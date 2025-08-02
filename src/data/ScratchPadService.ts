import { Scratchpad } from "../types/scratchpad";

export interface ScratchPadService {
  getScratchpad(): Promise<Scratchpad>;
  saveScratchpad(scratchpad: Scratchpad): Promise<void>;
}