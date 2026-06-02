import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-morning-words',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './morning-words.component.html',
  styleUrl: './morning-words.component.scss'
})
export class MorningWordsComponent implements AfterViewInit {
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;
  
  content = signal<string>('');
  isFading = signal<boolean>(false);

  ngAfterViewInit() {
    this.editor.nativeElement.focus();
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent actual newline
      this.clearText();
    }
  }

  clearText() {
    if (!this.content().trim()) return;

    this.isFading.set(true);
    
    // Wait for fade out animation
    setTimeout(() => {
      this.content.set('');
      this.isFading.set(false);
      setTimeout(() => this.editor.nativeElement.focus(), 0);
    }, 3000); // 3 seconds to match CSS transition
  }
}
