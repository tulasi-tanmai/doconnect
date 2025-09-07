// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-ai-chat',
//   imports: [],
//   templateUrl: './ai-chat.component.html',
//   styleUrl: './ai-chat.component.scss'
// })
// export class AiChatComponent {

// }
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { AiService } from '../../../core/ai.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-ai-chat',
  imports: [CommonModule,RouterModule, MatDialogModule, MatButtonModule, MatInputModule, ReactiveFormsModule,MatCardModule,MatIconModule,MatFormFieldModule, MatProgressSpinnerModule],
  
  templateUrl: './ai-chat.component.html',
 
  styleUrl: './ai-chat.component.scss'
})
export class AiChatComponent {
  private ai = inject(AiService);
  private ref = inject(MatDialogRef<AiChatComponent>);
  constructor(private location: Location, private router: Router) {}

  prompt = new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] });
  answer = '';
  loading = false;
  // refs + state
@ViewChild('answerBox') answerBox?: ElementRef<HTMLDivElement>;
isOverflowing = false;
showScrollDown = false;
private updateScrollFlags() {
  const el = this.answerBox?.nativeElement;
  if (!el) return;
  this.isOverflowing = el.scrollHeight > el.clientHeight + 1;
  this.showScrollDown = this.isOverflowing &&
                        el.scrollTop + el.clientHeight < el.scrollHeight - 4;
}

onAnswerScroll() { this.updateScrollFlags(); }

scrollToBottom() {
  const el = this.answerBox?.nativeElement; if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  // delay to let scroll settle
  setTimeout(() => this.updateScrollFlags(), 200);
}

scrollToTop() {
  const el = this.answerBox?.nativeElement; if (!el) return;
  el.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => this.updateScrollFlags(), 200);
}

  ask() {
    if (this.prompt.invalid || this.loading) return;
    this.loading = true; this.answer = '';
    this.ai.ask(this.prompt.value).subscribe({
      next: txt => { this.answer = txt; this.loading = false;setTimeout(() => this.updateScrollFlags(), 0);},
      error: () => { this.answer = 'AI service unavailable. Try again.'; this.loading = false; }
    });
  }
 
  clear(){ this.prompt.setValue(''); this.answer=''; }
  // close(){ this.ref.close(); }
  // 
  goBack() {
  if (window.history.length > 1) {
    this.location.back();            // go to previous page
  } else {
    this.router.navigateByUrl('/questions'); // fallback
  }
}
}

