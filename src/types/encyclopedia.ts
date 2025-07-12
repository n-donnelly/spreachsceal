import { NoteFile } from "./notes";

export interface Encyclopedia {
    entries: EncyclopediaEntry[];
}

export interface EncyclopediaEntry {
    id: number;
    key: string;
    content: string;
    notes: NoteFile[];
}