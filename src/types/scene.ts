import { NoteFile } from "./notes";

export interface Scene {
    id: string;
    number: number;
    overview: string;
    locationId: string;
    characters: string[];
    content: string;
    notes: NoteFile[];
}