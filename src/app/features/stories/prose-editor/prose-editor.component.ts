import { Component, inject, signal, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { StoryService } from '../../../core/services/story.service';
import { Scene, Story, Chapter } from '../../../core/models';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-prose-editor',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, QuillModule],
  templateUrl: './prose-editor.component.html',
  styleUrl: './prose-editor.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ProseEditorComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private storyService = inject(StoryService);

  worldId = signal<string>('');
  storyId = signal<string>('');
  chapterId = signal<string>('');
  sceneId = signal<string>('');

  story = signal<Story | undefined>(undefined);
  chapter = signal<Chapter | undefined>(undefined);
  scene = signal<Scene | undefined>(undefined);

  contentControl = new FormControl<string>('');
  saveStatus = signal<'Saved' | 'Saving...' | 'Unsaved' | 'Error'>('Saved');

  private subs = new Subscription();

  isLoaded = false;

  ngOnInit() {
    this.subs.add(
      this.route.paramMap.subscribe(params => {
        const wId = params.get('worldId');
        const sId = params.get('storyId');
        const cId = params.get('chapterId');
        const scId = params.get('sceneId');
        if (wId && sId && cId && scId) {
          this.worldId.set(wId);
          this.storyId.set(sId);
          this.chapterId.set(cId);
          this.sceneId.set(scId);
          this.loadData(wId, sId, cId, scId);
        }
      })
    );

    this.subs.add(
      this.contentControl.valueChanges.subscribe(() => {
        if (this.isLoaded && this.saveStatus() === 'Saved') {
          this.saveStatus.set('Unsaved');
        }
      })
    );

    this.subs.add(
      this.contentControl.valueChanges.pipe(
        debounceTime(1500),
        distinctUntilChanged()
      ).subscribe(val => {
        if (this.isLoaded) {
          this.saveScene(val || '');
        }
      })
    );
  }

  async loadData(wId: string, sId: string, cId: string, scId: string) {
    this.subs.add(this.storyService.getStory(wId, sId).subscribe(s => this.story.set(s)));
    
    const chapters = await this.storyService.getChapters(wId, sId);
    this.chapter.set(chapters.find(c => c.id === cId));

    const scenes = await this.storyService.getScenes(wId, sId, cId);
    const scene = scenes.find(s => s.id === scId);
    
    if (scene) {
      this.contentControl.setValue(scene.content || '', { emitEvent: false });
    }

    this.scene.set(scene);

    // Allow Quill time to bind to the control before enabling saves
    setTimeout(() => {
      this.isLoaded = true;
    }, 500);
  }

  async saveScene(content: string) {
    this.saveStatus.set('Saving...');
    try {
      await this.storyService.updateScene(this.worldId(), this.storyId(), this.chapterId(), this.sceneId(), { content });
      this.saveStatus.set('Saved');
    } catch (e) {
      this.saveStatus.set('Error');
      console.error(e);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
