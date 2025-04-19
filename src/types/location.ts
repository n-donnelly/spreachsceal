import { NoteFile } from "./notes";

export interface Location {
    id: string;
    name: string;
    description: string;
    notes: NoteFile[];
}