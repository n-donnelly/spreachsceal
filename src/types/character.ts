export interface Character {
    id: string;
    name: string;
    notes: string;
    description: string;
    relationships: Map<Character, string>;
}