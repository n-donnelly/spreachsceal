import { Component, inject, OnInit, signal } from '@angular/core';
import { WorldService } from '../../core/services/world.service';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { World } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private worldService = inject(WorldService);
  
  worlds = signal<World[]>([]);

  async ngOnInit() {
    this.worlds.set(await this.worldService.getUserWorlds());
  }

  // Stories are still mocked for now until we build the StoryService
  stories = [
    { id: '1', title: 'The Crystal Shard', world: 'Aethelgard', status: 'Planning', progress: 25 },
    { id: '2', title: 'Neon Shadows', world: 'Cyber Neo-Tokyo', status: 'Writing', progress: 65 }
  ];
}
