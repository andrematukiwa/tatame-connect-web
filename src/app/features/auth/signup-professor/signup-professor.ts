import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { extractErrorMessage } from '../../../core/utils/api-error';
import {
  DIA_SEMANA_LABELS,
  DiaSemanaEnum,
  ESPECIALIDADE_LABELS,
  EspecialidadeEnum,
  FAIXA_LABELS,
  FaixaEnum,
  PERIODO_LABELS,
  PeriodoEnum,
  TIPO_COBRANCA_LABELS,
  TipoCobrancaEnum
} from '../../../core/models/professor.models';

@Component({
  selector: 'app-signup-professor',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup-professor.html',
  styleUrl: './signup-professor.scss'
})
export class SignupProfessor {
  private readonly fb = inject(FormBuilder);
  private readonly professorService = inject(ProfessorService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly faixas = Object.entries(FAIXA_LABELS) as [FaixaEnum, string][];
  readonly especialidadesDisponiveis = Object.entries(ESPECIALIDADE_LABELS) as [EspecialidadeEnum, string][];
  readonly diasDisponiveisOpcoes = Object.entries(DIA_SEMANA_LABELS) as [DiaSemanaEnum, string][];
  readonly periodosDisponiveis = Object.entries(PERIODO_LABELS) as [PeriodoEnum, string][];
  readonly tiposCobranca = Object.entries(TIPO_COBRANCA_LABELS) as [TipoCobrancaEnum, string][];

  readonly especialidadesSelecionadas = signal<EspecialidadeEnum[]>([]);
  readonly diasSelecionados = signal<DiaSemanaEnum[]>([]);
  readonly periodosSelecionados = signal<PeriodoEnum[]>([]);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    nomeCompleto: ['', [Validators.required]],
    telefoneWhatsapp: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    faixa: ['' as FaixaEnum | '', [Validators.required]],
    equipeLinhagem: [''],
    tempoExperienciaAnos: [null as number | null, [Validators.required, Validators.min(0)]],
    tipoCobranca: ['' as TipoCobrancaEnum | '', [Validators.required]],
    valorPretendido: [null as number | null, [Validators.required, Validators.min(0.01)]],
    bio: [''],
    aceiteTermos: [false, [Validators.requiredTrue]]
  });

  toggleEspecialidade(valor: EspecialidadeEnum): void {
    this.especialidadesSelecionadas.update((atual) => toggle(atual, valor));
  }

  toggleDia(valor: DiaSemanaEnum): void {
    this.diasSelecionados.update((atual) => toggle(atual, valor));
  }

  togglePeriodo(valor: PeriodoEnum): void {
    this.periodosSelecionados.update((atual) => toggle(atual, valor));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.especialidadesSelecionadas().length === 0) {
      this.errorMessage.set('Selecione ao menos uma especialidade.');
      return;
    }
    if (this.diasSelecionados().length === 0) {
      this.errorMessage.set('Selecione ao menos um dia disponível.');
      return;
    }
    if (this.periodosSelecionados().length === 0) {
      this.errorMessage.set('Selecione ao menos um período disponível.');
      return;
    }

    const raw = this.form.getRawValue();
    this.loading.set(true);
    this.errorMessage.set(null);

    this.professorService
      .signup({
        ...raw,
        faixa: raw.faixa as FaixaEnum,
        tipoCobranca: raw.tipoCobranca as TipoCobrancaEnum,
        especialidades: this.especialidadesSelecionadas(),
        diasDisponiveis: this.diasSelecionados(),
        periodosDisponiveis: this.periodosSelecionados()
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.authService.setSession(response);
          this.router.navigateByUrl('/professor/perfil');
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        }
      });
  }
}

function toggle<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
}
