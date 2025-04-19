export interface Character {
    id: string;
    name: string;
    notes: string;
    description: string;
    relationships: Map<string, string>; // Map of character ID to relationship description
}