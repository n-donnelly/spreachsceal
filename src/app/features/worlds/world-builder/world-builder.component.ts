import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorldService } from '../../../core/services/world.service';
import { StoryService } from '../../../core/services/story.service';
import { ToastService } from '../../../core/services/toast.service';
import { World, Character, Location as WorldLocation, EncyclopediaEntry, Story } from '../../../core/models';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-world-builder',
  standalone: true,
  imports: [RouterLink, DatePipe, ReactiveFormsModule],
  templateUrl: './world-builder.component.html',
  styleUrl: './world-builder.component.scss'
})
export class WorldBuilderComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private worldService = inject(WorldService);
  private storyService = inject(StoryService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  worldId = signal<string>('');
  world = signal<World | undefined>(undefined);
  activeTab = signal<'overview' | 'characters' | 'locations' | 'encyclopedia' | 'stories'>('overview');

  characters = signal<Character[]>([]);
  locations = signal<WorldLocation[]>([]);
  encyclopedia = signal<EncyclopediaEntry[]>([]);
  stories = signal<Story[]>([]);

  showCharForm = signal(false);
  showLocForm = signal(false);
  showEncForm = signal(false);
  showStoryForm = signal(false);

  editingCharId = signal<string | null>(null);
  editingLocId = signal<string | null>(null);
  editingEncId = signal<string | null>(null);

  charForm = this.fb.group({
    name: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    role: this.fb.control('', { nonNullable: true }),
    description: this.fb.control('', { nonNullable: true }),
    aliases: this.fb.control<string[]>([], { nonNullable: true }),
    attributes: this.fb.control<Record<string, any>>({}, { nonNullable: true }),
    relationships: this.fb.control<Record<string, string>>({}, { nonNullable: true })
  });

  locForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  encForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    type: ['Culture'],
    content: ['']
  });

  storyForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: [''],
    outline: [''],
    notes: [''],
    characters: [[] as string[]],
    locations: [[] as string[]]
  });

  private subs = new Subscription();

  ngOnInit() {
    this.subs.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.worldId.set(id);
          this.loadWorldData(id);
        }
      })
    );
  }

  async loadWorldData(id: string) {
    this.subs.add(this.worldService.getWorld(id).subscribe(w => this.world.set(w)));
    this.characters.set(await this.worldService.getCharacters(id));
    this.locations.set(await this.worldService.getLocations(id));
    this.encyclopedia.set(await this.worldService.getEncyclopedia(id));
    this.stories.set(await this.storyService.getStories(id));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  setTab(tab: 'overview' | 'characters' | 'locations' | 'encyclopedia' | 'stories') {
    this.activeTab.set(tab);
  }

  openCharForm(char?: Character) {
    if (char) {
      this.editingCharId.set(char.id || null);
      this.charForm.patchValue({
        name: char.name,
        role: char.role || '',
        description: char.description || '',
        aliases: char.aliases || [],
        attributes: char.attributes || {},
        relationships: char.relationships || {}
      });
    } else {
      this.editingCharId.set(null);
      this.charForm.reset();
    }
    this.showCharForm.set(true);
  }
  closeCharForm() {
    this.showCharForm.set(false);
    this.editingCharId.set(null);
    this.charForm.reset();
  }

  openLocForm(loc?: WorldLocation) {
    if (loc) {
      this.editingLocId.set(loc.id || null);
      this.locForm.patchValue({
        name: loc.name,
        description: loc.description || ''
      });
    } else {
      this.editingLocId.set(null);
      this.locForm.reset();
    }
    this.showLocForm.set(true);
  }
  closeLocForm() {
    this.showLocForm.set(false);
    this.editingLocId.set(null);
    this.locForm.reset();
  }

  openEncForm(entry?: EncyclopediaEntry) {
    if (entry) {
      this.editingEncId.set(entry.id || null);
      this.encForm.patchValue({
        title: entry.title,
        type: entry.type || 'Culture',
        content: entry.content || ''
      });
    } else {
      this.editingEncId.set(null);
      this.encForm.reset();
    }
    this.showEncForm.set(true);
  }
  closeEncForm() {
    this.showEncForm.set(false);
    this.editingEncId.set(null);
    this.encForm.reset();
  }

  openStoryForm() { this.showStoryForm.set(true); }
  closeStoryForm() { this.showStoryForm.set(false); }

  async saveCharacter() {
    if (this.charForm.invalid) return;
    try {
      const id = this.editingCharId();
      if (id) {
        await this.worldService.updateCharacter(this.worldId(), id, this.charForm.getRawValue());
      } else {
        await this.worldService.addCharacter(this.worldId(), this.charForm.getRawValue());
      }
      this.toastService.success('Character saved successfully');
      this.closeCharForm();
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error saving character: ' + e.message);
    }
  }

  async deleteCharacter(charId: string) {
    if (!confirm('Are you sure you want to delete this character?')) return;
    try {
      await this.worldService.deleteCharacter(this.worldId(), charId);
      this.toastService.success('Character deleted');
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error deleting character: ' + e.message);
    }
  }

  async saveLocation() {
    if (this.locForm.invalid) return;
    try {
      const id = this.editingLocId();
      if (id) {
        await this.worldService.updateLocation(this.worldId(), id, this.locForm.getRawValue());
      } else {
        await this.worldService.addLocation(this.worldId(), this.locForm.getRawValue());
      }
      this.toastService.success('Location saved successfully');
      this.closeLocForm();
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error saving location: ' + e.message);
    }
  }

  async deleteLocation(locId: string) {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      await this.worldService.deleteLocation(this.worldId(), locId);
      this.toastService.success('Location deleted');
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error deleting location: ' + e.message);
    }
  }

  async saveEncyclopedia() {
    if (this.encForm.invalid) return;
    try {
      const id = this.editingEncId();
      if (id) {
        await this.worldService.updateEncyclopediaEntry(this.worldId(), id, this.encForm.getRawValue());
      } else {
        await this.worldService.addEncyclopediaEntry(this.worldId(), this.encForm.getRawValue());
      }
      this.toastService.success('Entry saved successfully');
      this.closeEncForm();
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error saving entry: ' + e.message);
    }
  }

  async deleteEncyclopedia(entryId: string) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await this.worldService.deleteEncyclopediaEntry(this.worldId(), entryId);
      this.toastService.success('Entry deleted');
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error deleting entry: ' + e.message);
    }
  }

  async saveStory() {
    if (this.storyForm.invalid) return;
    try {
      await this.storyService.addStory(this.worldId(), this.storyForm.getRawValue());
      this.storyForm.reset();
      this.closeStoryForm();
      this.toastService.success('Story created successfully');
      await this.loadWorldData(this.worldId());
    } catch (e: any) {
      this.toastService.error('Error creating story: ' + e.message);
    }
  }
}
