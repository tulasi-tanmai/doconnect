
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { AdminUsersService, UserSummary, RoleType } from '../../core/admin-user.services';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-users',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  constructor(private router: Router) {}
  private svc = inject(AdminUsersService);
  private fb = inject(FormBuilder);

  users = signal<UserSummary[]>([]);
  loading = signal<boolean>(true);
  search = signal<string>('');
  editingId = signal<string | null>(null);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  addForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['User' as RoleType, [Validators.required]]
  });

  editForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['User' as RoleType, [Validators.required]],
    newPassword: ['']
  });

  ngOnInit() { this.load(); }

  private firstError(e: any): string {
    if (e?.error?.errors) {
      const k = Object.keys(e.error.errors)[0];
      if (k && e.error.errors[k]?.length) return e.error.errors[k][0];
    }
    return e?.error?.message || e?.error?.detail || e?.error?.title || 'Request failed';
  }

  load() {
    this.loading.set(true);
    this.svc.list(this.search()).subscribe({
      next: (u) => { this.users.set(u); this.loading.set(false); },
      error: (e) => { this.error.set(this.firstError(e)); this.loading.set(false); }
    });
  }

  startEdit(u: UserSummary) {
    this.editingId.set(u.id);
    this.editForm.patchValue({ username: u.username, email: u.email, role: u.role, newPassword: '' });
  }
  cancelEdit() { this.editingId.set(null); }

  create() {
    if (this.addForm.invalid) { this.addForm.markAllAsTouched(); return; }
    const v = this.addForm.getRawValue();
    const payload = {
      username: v.username.trim(),
      email: v.email.trim(),
      password: v.password,
      role: v.role as RoleType
    };
    this.svc.create(payload).subscribe({
      next: () => { this.success.set('User created'); this.addForm.reset({ role: 'User' }); this.load(); },
      error: (e) => this.error.set(this.firstError(e))
    });
  }

  save() {
    const id = this.editingId();
    if (!id || this.editForm.invalid) { this.editForm.markAllAsTouched(); return; }
    const v = this.editForm.getRawValue();
    const payload = {
      username: v.username.trim(),
      email: v.email.trim(),
      role: v.role as RoleType,
      newPassword: v.newPassword?.trim() ? v.newPassword : null
    };
    this.svc.update(id, payload).subscribe({
      next: () => { this.success.set('User updated'); this.editingId.set(null); this.load(); },
      error: (e) => this.error.set(this.firstError(e))
    });
  }

  remove(id: string) {
    if (!confirm('Delete this user?')) return;
    this.svc.delete(id).subscribe({
      next: () => { this.success.set('User deleted'); this.load(); },
      error: (e) => this.error.set(this.firstError(e))
    });
  }

  goBack() { this.router.navigate(['/admin/pending']); }
}
