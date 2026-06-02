import { Component, inject, OnInit, signal } from '@angular/core';
import { WorldService } from '../../core/services/world.service';
import { StoryService } from '../../core/services/story.service';
import { DatePipe } from '@angular/common';
import { World, Story } from '../../core/models';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss',
})
export class ArchiveComponent implements OnInit {
  private worldService = inject(WorldService);
  private storyService = inject(StoryService);

  archivedWorlds = signal<World[]>([]);
  archivedStories = signal<(Story & { worldName?: string })[]>([]);

  async ngOnInit() {
    await this.loadArchives();
  }

  async loadArchives() {
    const allWorlds = await this.worldService.getUserWorlds();
    this.archivedWorlds.set(allWorlds.filter(w => w.isArchived));

    let archivedStrs: (Story & { worldName?: string })[] = [];
    for (const w of allWorlds) {
      const wStories = await this.storyService.getStories(w.id!);
      archivedStrs.push(...wStories.filter(s => s.isArchived).map(s => ({...s, worldName: w.name})));
    }
    this.archivedStories.set(archivedStrs);
  }

  async restoreWorld(worldId: string) {
    await this.worldService.updateWorld(worldId, { isArchived: false });
    await this.loadArchives();
  }

  async restoreStory(worldId: string, storyId: string) {
    await this.storyService.updateStory(worldId, storyId, { isArchived: false });
    await this.loadArchives();
  }
}
