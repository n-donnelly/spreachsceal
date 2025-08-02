import { Scratchpad } from "../types/scratchpad";
import { ScratchPadService } from "./ScratchPadService";

export class LocalScratchPadService implements ScratchPadService {
  private readonly SCRATCHPAD_KEY = 'spreachsceal_scratchpad_';

  async getScratchpad(): Promise<Scratchpad> {
    const scratchpad = localStorage.getItem(this.SCRATCHPAD_KEY);
    return scratchpad ? JSON.parse(scratchpad) : { scratches: [], nextId: 1 };
  }

  async saveScratchpad(scratchpad: Scratchpad): Promise<void> {
    localStorage.setItem(this.SCRATCHPAD_KEY, JSON.stringify(scratchpad));
  }
}
