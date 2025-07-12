import { Project } from '../types/project';
import { ProjectService } from './ProjectService';

// This will be implemented when you add Firebase
export class FirebaseProjectService implements ProjectService {
  private readonly COLLECTION_NAME = 'projects';

  async getProject(projectId: string): Promise<Project> {
    // TODO: Implement when Firebase is added
    /*
    const doc = await firebase.firestore()
      .collection(this.COLLECTION_NAME)
      .doc(projectId)
      .get();
    
    if (!doc.exists) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    return { id: doc.id, ...doc.data() } as Project;
    */
    throw new Error('Firebase service not implemented yet');
  }

  async saveProject(project: Project): Promise<void> {
    // TODO: Implement when Firebase is added
    /*
    await firebase.firestore()
      .collection(this.COLLECTION_NAME)
      .doc(project.id)
      .set(project);
    */
    throw new Error('Firebase service not implemented yet');
  }

  async getUserProjects(): Promise<Project[]> {
    // TODO: Implement when Firebase is added
    /*
    const userId = getCurrentUserId(); // You'll need to implement this
    const snapshot = await firebase.firestore()
      .collection(this.COLLECTION_NAME)
      .where('userId', '==', userId)
      .orderBy('title')
      .get();
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    */
    throw new Error('Firebase service not implemented yet');
  }

  async createProject(project: Project): Promise<void> {
    await this.saveProject(project);
  }

  async deleteProject(projectId: string): Promise<void> {
    // TODO: Implement when Firebase is added
    /*
    await firebase.firestore()
      .collection(this.COLLECTION_NAME)
      .doc(projectId)
      .delete();
    */
    throw new Error('Firebase service not implemented yet');
  }
}
