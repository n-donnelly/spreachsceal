import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { StoryService } from '../../../core/services/story.service';
import { WorldService } from '../../../core/services/world.service';
import { ToastService } from '../../../core/services/toast.service';
import { Story, Chapter, Scene, Character, Location as WorldLocation } from '../../../core/models';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import 'pdfmake/build/pdfmake';
import 'pdfmake/build/vfs_fonts';
// @ts-ignore
import htmlToPdfmake from 'html-to-pdfmake';

declare var pdfMake: any;

@Component({
  selector: 'app-story-planner',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DatePipe],
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
  revisions = signal<any[]>([]);
  viewingRevision = signal<any | null>(null);

  activeTab = signal<'outline' | 'chapters' | 'revisions'>('outline');
  isEditingOutline = signal(false);

  showExportModal = signal(false);
  exportFormat = signal<'pdf' | 'docx'>('pdf');
  selectedChaptersForExport = signal<Set<string>>(new Set());

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

    this.revisions.set(await this.storyService.getRevisions(wId, sId));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  setTab(tab: 'outline' | 'chapters' | 'revisions') {
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

  // --- REVISIONS ---
  viewRevision(revision: any) {
    this.viewingRevision.set({
      ...revision,
      parsedData: JSON.parse(revision.chaptersData)
    });
  }

  closeRevisionView() {
    this.viewingRevision.set(null);
  }

  async saveRevision() {
    const name = prompt('Enter a name for this revision (e.g. "Draft 1", "Before Rewrite"):');
    if (!name) return;

    try {
      const snapshot = this.chapters().map(c => ({
        ...c,
        scenes: this.scenesByChapter()[c.id!] || []
      }));
      
      await this.storyService.addRevision(this.worldId(), this.storyId(), {
        storyId: this.storyId(),
        name,
        chaptersData: JSON.stringify(snapshot),
        createdAt: new Date()
      });
      this.toastService.success('Revision saved!');
      this.revisions.set(await this.storyService.getRevisions(this.worldId(), this.storyId()));
    } catch (e: any) {
      this.toastService.error('Error saving revision: ' + e.message);
    }
  }

  async restoreRevision(revision: any) {
    if (!confirm(`WARNING: Restoring "${revision.name}" will overwrite your CURRENT active draft. Proceed?`)) return;
    
    try {
      // 1. Delete all current chapters and scenes
      for (const c of this.chapters()) {
        const scenes = this.scenesByChapter()[c.id!] || [];
        for (const s of scenes) {
          await this.storyService.deleteScene(this.worldId(), this.storyId(), c.id!, s.id!);
        }
        await this.storyService.deleteChapter(this.worldId(), this.storyId(), c.id!);
      }
      
      // 2. Recreate from snapshot
      const snapshot = JSON.parse(revision.chaptersData);
      for (const cData of snapshot) {
        const chapRef = await this.storyService.addChapter(this.worldId(), this.storyId(), {
          title: cData.title,
          order: cData.order,
          characters: cData.characters || [],
          locations: cData.locations || []
        });
        
        for (const sData of cData.scenes) {
          await this.storyService.addScene(this.worldId(), this.storyId(), chapRef.id, {
            order: sData.order,
            content: sData.content || ''
          });
        }
      }

      this.toastService.success('Revision restored successfully!');
      await this.loadData(this.worldId(), this.storyId());
    } catch (e: any) {
      this.toastService.error('Error restoring revision: ' + e.message);
    }
  }

  async deleteRevision(revisionId: string) {
    if (!confirm('Delete this revision permanently?')) return;
    try {
      await this.storyService.deleteRevision(this.worldId(), this.storyId(), revisionId);
      this.revisions.set(await this.storyService.getRevisions(this.worldId(), this.storyId()));
    } catch (e: any) {
      this.toastService.error('Error deleting revision: ' + e.message);
    }
  }

  // --- ARCHIVE ---
  async archiveStory() {
    if (confirm('Are you sure you want to archive this story? It will be moved to the Archive.')) {
      await this.storyService.updateStory(this.worldId(), this.storyId(), { isArchived: true });
      this.toastService.success('Story archived successfully.');
      // Optionally redirect to dashboard or world builder
    }
  }

  // --- EXPORT ---
  isExporting = signal(false);

  openExportModal() {
    this.selectedChaptersForExport.set(new Set(this.chapters().map(c => c.id!)));
    this.showExportModal.set(true);
  }

  closeExportModal() {
    this.showExportModal.set(false);
  }

  toggleChapterExport(chapterId: string) {
    const s = new Set(this.selectedChaptersForExport());
    if (s.has(chapterId)) s.delete(chapterId);
    else s.add(chapterId);
    this.selectedChaptersForExport.set(s);
  }

  async exportStory() {
    this.isExporting.set(true);
    const title = this.story()?.title || 'Story';
    
    let htmlContent = `
      <div style="text-align: center; margin-bottom: 50px;">
        <h1>${title}</h1>
      </div>
    `;

    try {
      for (const chap of this.chapters()) {
        if (!this.selectedChaptersForExport().has(chap.id!)) continue;
        
        htmlContent += `<h2 style="page-break-before: always; margin-top: 2rem;">Chapter ${chap.order}: ${chap.title}</h2>`;
        
        // Explicitly fetch scenes here so we wait for the latest prose from Firestore!
        const scenes = await this.storyService.getScenes(this.worldId(), this.storyId(), chap.id!);
        for (const scene of scenes) {
          if (scene.content) {
            htmlContent += `<div style="margin-bottom: 2rem;">${scene.content}</div>`;
          }
        }
      }
      // Clean up Quill's non-breaking spaces which cause word-break issues in PDF and show up as grey blocks in LibreOffice
      const cleanHtml = htmlContent.replace(/&nbsp;/g, ' ').replace(/\u200B/g, '');

      if (this.exportFormat() === 'pdf') {
        const val = htmlToPdfmake(cleanHtml, { window: window });
        const docDefinition = { 
          content: val,
          defaultStyle: {
            fontSize: 12
          }
        };
        pdfMake.createPdf(docDefinition).download(`${title}.pdf`);
      } else {
        const fullHtml = `
         <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
           <head>
             <meta charset="utf-8">
             <title>${title}</title>
           </head>
           <body>
             ${cleanHtml}
           </body>
         </html>
        `;
        const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
        saveAs(blob, `${title}.doc`);
      }
      this.closeExportModal();
      this.toastService.success('Story exported successfully!');
    } catch (e: any) {
      this.toastService.error('Export failed: ' + e.message);
    } finally {
      this.isExporting.set(false);
    }
  }

  async exportRevision(revision: any) {
    this.isExporting.set(true);
    const title = (this.story()?.title || 'Story') + ` - ${revision.name}`;
    
    let htmlContent = `
      <div style="text-align: center; margin-bottom: 50px;">
        <h1>${title}</h1>
      </div>
    `;

    try {
      for (const chap of revision.parsedData) {
        htmlContent += `<h2 style="page-break-before: always; margin-top: 2rem;">Chapter ${chap.order}: ${chap.title}</h2>`;
        
        for (const scene of chap.scenes) {
          if (scene.content) {
            htmlContent += `<div style="margin-bottom: 2rem;">${scene.content}</div>`;
          }
        }
      }

      const cleanHtml = htmlContent.replace(/&nbsp;/g, ' ').replace(/\u200B/g, '');

      if (this.exportFormat() === 'pdf') {
        const val = htmlToPdfmake(cleanHtml, { window: window });
        const docDefinition = { 
          content: val,
          defaultStyle: { fontSize: 12 }
        };
        pdfMake.createPdf(docDefinition).download(`${title}.pdf`);
      } else {
        const fullHtml = `
         <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
           <head><meta charset="utf-8"><title>${title}</title></head><body>${cleanHtml}</body>
         </html>
        `;
        const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
        saveAs(blob, `${title}.doc`);
      }
      this.toastService.success('Revision exported successfully!');
    } catch (e: any) {
      this.toastService.error('Export failed: ' + e.message);
    } finally {
      this.isExporting.set(false);
    }
  }
}
