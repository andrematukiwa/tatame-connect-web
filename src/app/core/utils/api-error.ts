import { HttpErrorResponse } from '@angular/common/http';

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fields?: Record<string, string>;
}

export function extractErrorMessage(error: HttpErrorResponse): string {
  const body = error.error as ApiErrorResponse | undefined;

  if (body?.fields && Object.keys(body.fields).length > 0) {
    return Object.values(body.fields).join(' ');
  }

  return body?.message ?? 'Ocorreu um erro inesperado. Tente novamente.';
}
