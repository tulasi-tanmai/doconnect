import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AiChatRequest { prompt: string; model?: string; }
export interface AiChatResponse { answer: string; }

@Injectable({ providedIn: 'root' })
export class AiService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/ai/chat`; // => /api/ai/chat on your backend

  ask(prompt: string, model?: string): Observable<string> {
    const body: AiChatRequest = { prompt, model };
    return this.http.post<AiChatResponse>(this.api, body).pipe(map(r => r.answer));
  }
}
