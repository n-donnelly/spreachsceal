import { NoteFile } from "./notes";

export interface Character {
    id: string;
    name: string;
    aliases: string[]; // Array of aliases or nicknames
    notes: NoteFile[];
    description: string;
    relationships: Map<string, string>; // Map of character ID to relationship description
}