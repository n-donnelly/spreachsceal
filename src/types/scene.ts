import { NoteFile } from "./notes";

export interface Scene {
    id: number;
    number: number;
    overview: string;
    locationId: string;
    characters: string[];
    content: string;
    notes: NoteFile[];
}