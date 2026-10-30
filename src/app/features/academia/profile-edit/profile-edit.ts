import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../../shared/navbar/navbar';
import { AcademiaService } from '../../../core/services/academia.service';
import { extractErrorMessage } from '../../../core/utils/api-error';
import { AcademiaResponse, TIPO_ESPACO_LABELS, TipoEspacoEnum } from '../../../core/models/academia.models';

@Component({
  selector: 'app-academia-profile-edit',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss'
})
export class AcademiaProfileEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly academiaService = inject(AcademiaService);

  readonly tiposEspaco = Object.entries(TIPO_ESPACO_LABELS) as [TipoEspacoEnum, string][];

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingFoto = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly fotoCapaUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nomeAcademia: ['', [Validators.required]],
    responsavel: ['', [Validators.required]],
    telefoneWhatsapp: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    tipoEspaco: ['' as TipoEspacoEnum | '']
  });

  ngOnInit(): void {
    this.academiaService.getMyProfile().subscribe({
      next: (profile) => this.preencherFormulario(profile),
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    });
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadingFoto.set(true);
    this.errorMessage.set(null);

    this.academiaService.uploadMyPhoto(file).subscribe({
      next: (profile) => {
        this.uploadingFoto.set(false);
        this.fotoCapaUrl.set(profile.fotoCapaUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.uploadingFoto.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.academiaService
      .updateMyProfile({
        ...raw,
        tipoEspaco: raw.tipoEspaco === '' ? null : (raw.tipoEspaco as TipoEspacoEnum)
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.successMessage.set('Perfil atualizado com sucesso.');
        },
        error: (error: HttpErrorResponse) => {
          this.saving.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        }
      });
  }

  private preencherFormulario(profile: AcademiaResponse): void {
    this.loading.set(false);
    this.fotoCapaUrl.set(profile.fotoCapaUrl);

    this.form.patchValue({
      nomeAcademia: profile.nomeAcademia,
      responsavel: profile.responsavel,
      telefoneWhatsapp: profile.telefoneWhatsapp,
      cidade: profile.cidade,
      bairro: profile.bairro,
      tipoEspaco: profile.tipoEspaco ?? ''
    });
  }
}
