import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoryService } from '../../../core/services/story.service';
import { WorldService } from '../../../core/services/world.service';
import { ToastService } from '../../../core/services/toast.service';
import { Story, Chapter, Scene, Character, Location as WorldLocation } from '../../../core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-story-planner',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './story-planner.component.html',
  styleUrl: './story-planner.component.scss'
})
export class StoryPlannerComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private storyService = inject(StoryService);
  private worldService = inject(WorldService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  worldId = signal<string>('');
  storyId = signal<string>('');
  story = signal<Story | undefined>(undefined);
  
  characters = signal<Character[]>([]);
  locations = signal<WorldLocation[]>([]);
  chapters = signal<Chapter[]>([]);
  scenesByChapter = signal<Record<string, Scene[]>>({});

  activeTab = signal<'outline' | 'chapters'>('outline');
  isEditingOutline = signal(false);

  outlineForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    outline: [''],
    notes: ['']
  });

  showChapterForm = signal(false);
  chapterForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    order: [0, Validators.required]
  });

  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(
      this.route.paramMap.subscribe(params => {
        const wId = params.get('worldId');
        const sId = params.get('storyId');
        if (wId && sId) {
          this.worldId.set(wId);
          this.storyId.set(sId);
          this.loadData(wId, sId);
        }
      })
    );
  }

  async loadData(wId: string, sId: string) {
    this.subs.add(this.storyService.getStory(wId, sId).subscribe(s => {
      this.story.set(s);
      if (s) {
        this.outlineForm.patchValue({
          title: s.title || '',
          description: s.description || '',
          outline: s.outline || '',
          notes: s.notes || ''
        });
      }
    }));
    
    const chaps = await this.storyService.getChapters(wId, sId);
    this.chapters.set(chaps);
    
    const scenesMap: Record<string, Scene[]> = {};
    for (const c of chaps) {
      scenesMap[c.id!] = await this.storyService.getScenes(wId, sId, c.id!);
    }
    this.scenesByChapter.set(scenesMap);

    this.characters.set(await this.worldService.getCharacters(wId));
    this.locations.set(await this.worldService.getLocations(wId));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  setTab(tab: 'outline' | 'chapters') {
    this.activeTab.set(tab);
  }

  async saveOutline() {
    if (this.outlineForm.invalid) return;
    try {
      await this.storyService.updateStory(this.worldId(), this.storyId(), this.outlineForm.getRawValue());
      this.isEditingOutline.set(false);
      this.toastService.success('Outline saved successfully');
    } catch (e: any) {
      this.toastService.error('Error saving outline: ' + e.message);
    }
  }

  async toggleCharacterAttachment(charId: string) {
    const s = this.story();
    if (!s) return;
    const current = s.characters || [];
    const updated = current.includes(charId) ? current.filter(id => id !== charId) : [...current, charId];
    try {
      await this.storyService.updateStory(this.worldId(), this.storyId(), { characters: updated });
    } catch (e: any) {
      this.toastService.error('Error attaching character: ' + e.message);
    }
  }

  async toggleLocationAttachment(locId: string) {
    const s = this.story();
    if (!s) return;
    const current = s.locations || [];
    const updated = current.includes(locId) ? current.filter(id => id !== locId) : [...current, locId];
    try {
      await this.storyService.updateStory(this.worldId(), this.storyId(), { locations: updated });
    } catch (e: any) {
      this.toastService.error('Error attaching location: ' + e.message);
    }
  }

  openChapterForm() { this.showChapterForm.set(true); }
  closeChapterForm() { this.showChapterForm.set(false); }

  async saveChapter() {
    if (this.chapterForm.invalid) return;
    try {
      await this.storyService.addChapter(this.worldId(), this.storyId(), {
          ...this.chapterForm.getRawValue(),
          characters: [],
          locations: []
      });
      this.chapterForm.reset();
      this.closeChapterForm();
      this.toastService.success('Chapter saved successfully');
      this.loadData(this.worldId(), this.storyId());
    } catch (e: any) {
      this.toastService.error('Error saving chapter: ' + e.message);
    }
  }

  async addScene(chapterId: string) {
    const title = prompt('Enter a title/summary for this new scene:');
    if (!title) return;
    
    try {
      await this.storyService.addScene(this.worldId(), this.storyId(), chapterId, {
        content: '',
        order: Date.now()
      });
      this.loadData(this.worldId(), this.storyId());
    } catch (e: any) {
      this.toastService.error('Error adding scene: ' + e.message);
    }
  }

  async deleteScene(chapterId: string, sceneId: string) {
    if (!confirm('Are you sure you want to delete this scene? All written prose will be lost forever!')) return;
    try {
      await this.storyService.deleteScene(this.worldId(), this.storyId(), chapterId, sceneId);
      this.loadData(this.worldId(), this.storyId());
    } catch (e: any) {
      this.toastService.error('Error deleting scene: ' + e.message);
    }
  }
}
