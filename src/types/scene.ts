import { NoteFile } from "./notes";

export interface Scene {
    id: number;
    number: number;
    overview: string;
    locationId: number;
    characters: number[];
    content: string;
    notes: NoteFile[];
}