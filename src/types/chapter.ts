import { Character } from "./character";
import { Location } from "./location";
import { Scene } from "./scene";

export interface Chapter {
    id: string;
    title: string;
    index: number;
    scenes: Scene[];
    locations: Location[];
    characters: Character[];
    notes: string[];
}