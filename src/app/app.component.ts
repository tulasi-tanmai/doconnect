import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { AuthService } from './core/auth.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { AiChatComponent } from './features/ai/ai-chat/ai-chat.component'; // standalone


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, NgIf, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {}
  //adding ai chat popup
  // openAiDialog() {
  //   this.dialog.open(AiChatComponent, { autoFocus: true, width: '720px' });
  // }
  logout() { this.auth.logout(); this.router.navigate(['/auth/login']); }
}
