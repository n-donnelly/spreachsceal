import { Timestamp } from "firebase/firestore";

export interface Scratch {
    id: number;
    content: string;
    createdAt: Date;
}

export interface Scratchpad {
    fbid: string;
    scratches: Scratch[];
    nextId: number;
    userId: string;
    updatedAt: Timestamp;
    createdAt: Timestamp;
}

export function createScratchPad(userId: string): Scratchpad {
    return {
        fbid: '',
        scratches: [],
        nextId: 1,
        userId: userId,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now()
    };
}