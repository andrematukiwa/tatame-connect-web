import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.models';
import {
  Page,
  ProfessorResponse,
  ProfessorSearchFilter,
  ProfessorSignupRequest,
  ProfessorUpdateRequest
} from '../models/professor.models';

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/professores`;

  signup(request: ProfessorSignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, request);
  }

  getMyProfile(): Observable<ProfessorResponse> {
    return this.http.get<ProfessorResponse>(`${this.baseUrl}/me`);
  }

  updateMyProfile(request: ProfessorUpdateRequest): Observable<ProfessorResponse> {
    return this.http.put<ProfessorResponse>(`${this.baseUrl}/me`, request);
  }

  uploadMyPhoto(file: File): Observable<ProfessorResponse> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<ProfessorResponse>(`${this.baseUrl}/me/foto`, formData);
  }

  uploadMyCertificado(file: File): Observable<ProfessorResponse> {
    const formData = new FormData();
    formData.append('certificado', file);
    return this.http.post<ProfessorResponse>(`${this.baseUrl}/me/certificado`, formData);
  }

  search(filter: ProfessorSearchFilter, page = 0, size = 20): Observable<Page<ProfessorResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<Page<ProfessorResponse>>(this.baseUrl, { params });
  }

  getById(id: string): Observable<ProfessorResponse> {
    return this.http.get<ProfessorResponse>(`${this.baseUrl}/${id}`);
  }
}
