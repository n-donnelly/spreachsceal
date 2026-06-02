import { Component, inject, OnInit, signal } from '@angular/core';
import { WorldService } from '../../core/services/world.service';
import { StoryService } from '../../core/services/story.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { World, Story } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private worldService = inject(WorldService);
  private storyService = inject(StoryService);
  
  worlds = signal<World[]>([]);
  stories = signal<(Story & { worldName?: string })[]>([]);

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    const allWorlds = await this.worldService.getUserWorlds();
    const activeWorlds = allWorlds.filter(w => !w.isArchived);
    this.worlds.set(activeWorlds);

    let activeStories: (Story & { worldId?: string, worldName?: string })[] = [];
    for (const w of activeWorlds) {
      const wStories = await this.storyService.getStories(w.id!);
      activeStories.push(...wStories.filter(s => !s.isArchived).map(s => ({...s, worldId: w.id!, worldName: w.name})));
    }
    this.stories.set(activeStories);
  }

  async archiveWorld(event: Event, worldId: string) {
    event.stopPropagation();
    if (confirm('Are you sure you want to archive this world? You can restore it from the Archive later.')) {
      await this.worldService.updateWorld(worldId, { isArchived: true });
      await this.loadData();
    }
  }

  async archiveStory(event: Event, worldId: string, storyId: string) {
    event.stopPropagation();
    if (confirm('Are you sure you want to archive this story? You can restore it from the Archive later.')) {
      await this.storyService.updateStory(worldId, storyId, { isArchived: true });
      await this.loadData();
    }
  }
}
