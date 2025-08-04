import { Timestamp } from "firebase/firestore";

export interface Scratch {
    id: number;
    content: string;
    createdAt: Date;
}

export interface Scratchpad {
    scratches: Scratch[];
    nextId: number;
    userId: string;
    updatedAt: Timestamp;
    createdAt: Timestamp;
}