import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { WorldService } from '../../../core/services/world.service';

@Component({
  selector: 'app-world-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './world-create.component.html',
  styleUrl: './world-create.component.scss'
})
export class WorldCreateComponent {
  private fb = inject(FormBuilder);
  private worldService = inject(WorldService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  worldForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.maxLength(500)]]
  });

  async onSubmit() {
    if (this.worldForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { name, description } = this.worldForm.getRawValue();
      const docRef = await this.worldService.createWorld({ name, description });
      // Navigate to the world builder for this new world
      this.router.navigate(['/worlds', docRef.id]);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to create world');
      this.isLoading.set(false);
    }
  }
}
