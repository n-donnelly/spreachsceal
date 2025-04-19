import { NoteFile } from "./notes";

export interface Outline {
    content: string;
    notes: NoteFile[];
}