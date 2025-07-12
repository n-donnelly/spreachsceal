import { NoteFile } from "./notes";

export interface Character {
    id: number;
    name: string;
    aliases: string[]; // Array of aliases or nicknames
    notes: NoteFile[];
    description: string;
    relationships: Map<number, string>; // Map of character ID to relationship description
}