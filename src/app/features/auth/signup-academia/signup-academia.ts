import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AcademiaService } from '../../../core/services/academia.service';
import { extractErrorMessage } from '../../../core/utils/api-error';
import { TIPO_ESPACO_LABELS, TipoEspacoEnum } from '../../../core/models/academia.models';

@Component({
  selector: 'app-signup-academia',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-academia.html',
  styleUrl: './signup-academia.scss'
})
export class SignupAcademia {
  private readonly fb = inject(FormBuilder);
  private readonly academiaService = inject(AcademiaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly tiposEspaco = Object.entries(TIPO_ESPACO_LABELS) as [TipoEspacoEnum, string][];

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    nomeAcademia: ['', [Validators.required]],
    responsavel: ['', [Validators.required]],
    telefoneWhatsapp: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    tipoEspaco: ['' as TipoEspacoEnum | ''],
    aceiteTermos: [false, [Validators.requiredTrue]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.academiaService
      .signup({
        ...raw,
        tipoEspaco: raw.tipoEspaco === '' ? null : (raw.tipoEspaco as TipoEspacoEnum)
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.authService.setSession(response);
          this.router.navigateByUrl('/academia/dashboard');
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        }
      });
  }
}
