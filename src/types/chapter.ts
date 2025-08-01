import { NoteFile } from "./notes";
import { Scene } from "./scene";

export interface Chapter {
    id: number;
    title: string;
    index: number;
    scenes: Scene[];
    locations: number[];
    characters: number[];
    notes: NoteFile[];
}