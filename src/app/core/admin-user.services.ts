import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type RoleType = 'User' | 'Admin';
type RoleWire = 0 | 1 | 'User' | 'Admin';   // server may send 0/1; we accept both

export interface UserSummaryWire {
  id: string;
  username: string;
  email: string;
  role: RoleWire;          // what comes from the server
  createdAt?: string;
}

export interface UserSummary {
  id: string;
  username: string;
  email: string;
  role: RoleType;          // what the UI uses
  createdAt?: string;
}

export interface CreateUserPayloadUi {
  username: string;
  email: string;
  password: string;
  role: RoleType;          // UI type
}

export interface UpdateUserPayloadUi {
  username: string;
  email: string;
  role: RoleType;          // UI type
  newPassword?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/admin/users`;

  // --- helpers to map role <-> wire ---
  private fromWireRole(r: RoleWire): RoleType {
    return (r === 1 || r === 'Admin') ? 'Admin' : 'User';
  }
  private toWireRole(r: RoleType): 0 | 1 {
    return r === 'Admin' ? 1 : 0;
  }

  list(search?: string): Observable<UserSummary[]> {
    const params: any = {};
    if (search) params.search = search;
    return this.http.get<UserSummaryWire[]>(this.base, { params }).pipe(
      map(rows => rows.map(u => ({ ...u, role: this.fromWireRole(u.role) })))
    );
  }

  get(id: string): Observable<UserSummary> {
    return this.http.get<UserSummaryWire>(`${this.base}/${id}`).pipe(
      map(u => ({ ...u, role: this.fromWireRole(u.role) }))
    );
  }

  create(payload: CreateUserPayloadUi): Observable<UserSummary> {
    const body = { ...payload, role: this.toWireRole(payload.role) }; // 0/1 for API
    return this.http.post<UserSummaryWire>(this.base, body).pipe(
      map(u => ({ ...u, role: this.fromWireRole(u.role) }))
    );
  }

  update(id: string, payload: UpdateUserPayloadUi) {
    const body: any = { ...payload, role: this.toWireRole(payload.role) };
    if (!body.newPassword) body.newPassword = null;
    return this.http.put<void>(`${this.base}/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
