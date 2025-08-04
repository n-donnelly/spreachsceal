// src/types/firebase/FirebaseProject.ts
import { Project } from '../project';

export interface FirebaseProject extends Project {
    userId: string;  // Add this to associate projects with users
    createdAt: Date;
    updatedAt: Date;
}