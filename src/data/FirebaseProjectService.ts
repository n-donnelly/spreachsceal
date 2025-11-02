import { Project } from '../types/project';
import { ProjectService } from './ProjectService';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class FirebaseProjectService implements ProjectService {
  private readonly PROJECTS_COLLECTION = 'projects';

  async getProject(projectId: string): Promise<Project> {
    const docRef = doc(db, this.PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    return { id: docSnap.id, ...docSnap.data() } as Project;
  }

  async saveProject(project: Project): Promise<void> {
    await setDoc(doc(db, this.PROJECTS_COLLECTION, project.id), project);
  }

  async getUserProjects(userId: string): Promise<Project[]> {
    const projectsRef = collection(db, this.PROJECTS_COLLECTION);
    const q = query(
      projectsRef,
      where('userId', '==', userId),
      orderBy('title')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  }

  async createProject(project: Project): Promise<void> {
    await this.saveProject(project);
  }

  async deleteProject(): Promise<void> {
    // TODO: Implement when Firebase is added
    throw new Error('Firebase service not implemented yet');
  }

  async getCloudVersion(projectId: string): Promise<Project | null> {
    const docRef = doc(db, this.PROJECTS_COLLECTION, projectId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as Project) : null;
  }

  async syncWithCloud(project: Project): Promise<void> {
    await setDoc(doc(db, this.PROJECTS_COLLECTION, project.id), {
      ...project,
      lastSyncedAt: new Date(),
    });
  }

  async checkForUpdates(projectId: string): Promise<boolean> {
    const localProject = await this.getProject(projectId);
    const cloudProject = await this.getCloudVersion(projectId);

    if (!cloudProject) return false;

    return cloudProject.updatedAt > localProject.updatedAt;
  }
}
