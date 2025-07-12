import { NoteFile } from "./notes";

export interface Location {
    id: number;
    name: string;
    description: string;
    notes: NoteFile[];
}