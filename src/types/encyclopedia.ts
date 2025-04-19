import { NoteFile } from "./notes";

export interface Encyclopedia {
    entries: EncyclopediaEntry[];
}

export interface EncyclopediaEntry {
    id: string;
    key: string;
    content: string;
    notes: NoteFile[];
}