import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IdeaService } from '../../core/services/idea.service';
import { ToastService } from '../../core/services/toast.service';
import { Idea } from '../../core/models';

@Component({
  selector: 'app-ideas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ideas.component.html',
  styleUrl: './ideas.component.scss'
})
export class IdeasComponent implements OnInit {
  private ideaService = inject(IdeaService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  ideas = signal<Idea[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  ideaForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  async ngOnInit() {
    await this.loadIdeas();
  }

  async loadIdeas() {
    try {
      this.ideas.set(await this.ideaService.getIdeas());
    } catch (e) {
      console.error('Error loading ideas:', e);
    }
  }

  openForm(idea?: Idea) {
    if (idea) {
      this.editingId.set(idea.id || null);
      this.ideaForm.patchValue({
        title: idea.title,
        content: idea.content
      });
    } else {
      this.editingId.set(null);
      this.ideaForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingId.set(null);
    this.ideaForm.reset();
  }

  async saveIdea() {
    if (this.ideaForm.invalid) return;
    try {
      const id = this.editingId();
      if (id) {
        await this.ideaService.updateIdea(id, this.ideaForm.getRawValue());
      } else {
        await this.ideaService.addIdea(this.ideaForm.getRawValue());
      }
      this.toastService.success('Idea saved successfully');
      this.closeForm();
      await this.loadIdeas();
    } catch (e: any) {
      this.toastService.error('Error saving idea: ' + e.message);
    }
  }

  async deleteIdea(id: string) {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    try {
      await this.ideaService.deleteIdea(id);
      this.toastService.success('Idea deleted');
      await this.loadIdeas();
    } catch (e: any) {
      this.toastService.error('Error deleting idea: ' + e.message);
    }
  }
}
