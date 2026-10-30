import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.models';
import { AcademiaResponse, AcademiaSignupRequest, AcademiaUpdateRequest } from '../models/academia.models';

@Injectable({ providedIn: 'root' })
export class AcademiaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/academias`;

  signup(request: AcademiaSignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, request);
  }

  getMyProfile(): Observable<AcademiaResponse> {
    return this.http.get<AcademiaResponse>(`${this.baseUrl}/me`);
  }

  updateMyProfile(request: AcademiaUpdateRequest): Observable<AcademiaResponse> {
    return this.http.put<AcademiaResponse>(`${this.baseUrl}/me`, request);
  }

  uploadMyPhoto(file: File): Observable<AcademiaResponse> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<AcademiaResponse>(`${this.baseUrl}/me/foto`, formData);
  }
}
