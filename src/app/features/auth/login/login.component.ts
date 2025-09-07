// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule
  ],
  // template: //`
  // <div class="center">
  //   <mat-card class="auth-card">
  //     <h2>Login</h2>
  //     <form [formGroup]="f" (ngSubmit)="submit()">
  //       <mat-form-field appearance="outline" class="full">
  //         <mat-label>Username or Email</mat-label>
  //         <input matInput formControlName="usernameOrEmail" />
  //       </mat-form-field>

  //       <mat-form-field appearance="outline" class="full">
  //         <mat-label>Password</mat-label>
  //         <input matInput type="password" formControlName="password" />
  //       </mat-form-field>

  //       <button mat-flat-button color="primary" [disabled]="f.invalid">Login</button>
  //       <button mat-button routerLink="/auth/register" type="button">Register</button>
  //     </form>
  //   </mat-card>
  // </div>
  // `,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
  // styles: [`
  //   .center { display:flex; height:100vh; align-items:center; justify-content:center }
  //   .auth-card { width: 380px; padding: 20px }
  //   .full { width:100% }
  // `]
  // styles: [`
  //   .center {
  //     display: flex;
  //     height: 100vh;
  //     align-items: center;
  //     justify-content: center;
  //     background: linear-gradient(135deg, #12f02cff 0%, #2245d1ff 100%);
  //     padding: 1rem;
  //   }
  //   .auth-card {
  //     width: 100%;
  //     max-width: 400px;
  //     padding: 2rem 1.8rem;
  //     border-radius: 16px;
  //     background: #ffffff;
  //     box-shadow: 0 8px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1);
  //     text-align: center;
  //     animation: fadeInUp 0.4s ease-out;
  //   }
  //   .auth-card h2 {
  //     margin-bottom: 1.2rem;
  //     font-weight: 700;
  //     font-size: 1.5rem;
  //     color: #1e293b;
  //   }
  //   .full {
  //     width: 100%;
  //     margin-bottom: 1.2rem;
  //   }
  //   ::ng-deep .mat-mdc-form-field {
  //     width: 100%;
  //   }
  //   button[mat-flat-button] {
  //     width: 100%;
  //     margin-top: 0.4rem;
  //     padding: 0.65rem 0;
  //     border-radius: 10px;
  //     font-weight: 600;
  //     font-size: 0.95rem;
  //     letter-spacing: 0.3px;
  //   }
  //   button[mat-button] {
  //     margin-top: 0.6rem;
  //     font-weight: 500;
  //     color: #2563eb;
  //   }
  //   button[mat-flat-button]:hover {
  //     transform: translateY(-1px);
  //     box-shadow: 0 4px 12px rgba(37,99,235,0.25);
  //   }
  //   button[mat-button]:hover {
  //     text-decoration: underline;
  //   }
  //   @keyframes fadeInUp {
  //     from { opacity: 0; transform: translateY(15px); }
  //     to   { opacity: 1; transform: translateY(0); }
  //   }
  //   @media (max-width: 480px) {
  //     .auth-card { padding: 1.5rem 1.2rem; border-radius: 12px; }
  //     .auth-card h2 { font-size: 1.3rem; }
  //   }
  // `]
})
export class LoginComponent {
  f: ReturnType<FormBuilder['group']>;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private snack: MatSnackBar) {
    this.f = this.fb.group({ usernameOrEmail: ['', Validators.required], password: ['', Validators.required] });
  }
  submit() {
    if (this.f.invalid) return;
    this.auth.login(this.f.value).subscribe({
      next: () => { this.snack.open('Logged in', 'ok', { duration: 1200 }); this.router.navigate(['/questions']); },
      error: (e) => { console.error(e); this.snack.open(e?.error?.message || 'Login failed', 'ok'); }
    });
  }
}
