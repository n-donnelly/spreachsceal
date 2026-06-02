import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { WorldCreateComponent } from './features/worlds/world-create/world-create.component';
import { WorldBuilderComponent } from './features/worlds/world-builder/world-builder.component';
import { StoryPlannerComponent } from './features/stories/story-planner/story-planner.component';
import { ProseEditorComponent } from './features/stories/prose-editor/prose-editor.component';
import { IdeasComponent } from './features/ideas/ideas.component';
import { MorningWordsComponent } from './features/morning-words/morning-words.component';
import { ArchiveComponent } from './features/archive/archive.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, pathMatch: 'full' },
      { path: 'worlds/new', component: WorldCreateComponent },
      { path: 'worlds/:id', component: WorldBuilderComponent },
      { path: 'worlds/:worldId/stories/:storyId', component: StoryPlannerComponent },
      { path: 'worlds/:worldId/stories/:storyId/chapters/:chapterId/scenes/:sceneId', component: ProseEditorComponent },
      { path: 'ideas', component: IdeasComponent },
      { path: 'the-ether', component: MorningWordsComponent },
      { path: 'archive', component: ArchiveComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
