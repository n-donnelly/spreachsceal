import { NoteFile } from "./notes";

export interface Scene {
    id: number;
    number: number;
    overview: string;
    locationId: string;
    characters: number[];
    content: string;
    notes: NoteFile[];
}