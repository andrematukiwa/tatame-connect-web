import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Navbar } from '../../../shared/navbar/navbar';
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
  ProfessorResponse,
  TIPO_COBRANCA_LABELS,
  TipoCobrancaEnum
} from '../../../core/models/professor.models';

@Component({
  selector: 'app-professor-profile-edit',
  imports: [ReactiveFormsModule, Navbar],
  templateUrl: './profile-edit.html',
  styleUrl: './profile-edit.scss'
})
export class ProfileEdit implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly professorService = inject(ProfessorService);

  readonly faixas = Object.entries(FAIXA_LABELS) as [FaixaEnum, string][];
  readonly especialidadesDisponiveis = Object.entries(ESPECIALIDADE_LABELS) as [EspecialidadeEnum, string][];
  readonly diasDisponiveisOpcoes = Object.entries(DIA_SEMANA_LABELS) as [DiaSemanaEnum, string][];
  readonly periodosDisponiveis = Object.entries(PERIODO_LABELS) as [PeriodoEnum, string][];
  readonly tiposCobranca = Object.entries(TIPO_COBRANCA_LABELS) as [TipoCobrancaEnum, string][];

  readonly especialidadesSelecionadas = signal<EspecialidadeEnum[]>([]);
  readonly diasSelecionados = signal<DiaSemanaEnum[]>([]);
  readonly periodosSelecionados = signal<PeriodoEnum[]>([]);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingFoto = signal(false);
  readonly uploadingCertificado = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly fotoUrl = signal<string | null>(null);
  readonly certificadoUrl = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    nomeCompleto: ['', [Validators.required]],
    telefoneWhatsapp: ['', [Validators.required]],
    cidade: ['', [Validators.required]],
    bairro: ['', [Validators.required]],
    faixa: ['' as FaixaEnum | '', [Validators.required]],
    equipeLinhagem: [''],
    tempoExperienciaAnos: [null as number | null, [Validators.required, Validators.min(0)]],
    tipoCobranca: ['' as TipoCobrancaEnum | '', [Validators.required]],
    valorPretendido: [null as number | null, [Validators.required, Validators.min(0.01)]],
    bio: ['']
  });

  ngOnInit(): void {
    this.professorService.getMyProfile().subscribe({
      next: (profile) => this.preencherFormulario(profile),
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    });
  }

  toggleEspecialidade(valor: EspecialidadeEnum): void {
    this.especialidadesSelecionadas.update((atual) => toggle(atual, valor));
  }

  toggleDia(valor: DiaSemanaEnum): void {
    this.diasSelecionados.update((atual) => toggle(atual, valor));
  }

  togglePeriodo(valor: PeriodoEnum): void {
    this.periodosSelecionados.update((atual) => toggle(atual, valor));
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadingFoto.set(true);
    this.errorMessage.set(null);

    this.professorService.uploadMyPhoto(file).subscribe({
      next: (profile) => {
        this.uploadingFoto.set(false);
        this.fotoUrl.set(profile.fotoUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.uploadingFoto.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    });
  }

  onCertificadoSelecionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    this.uploadingCertificado.set(true);
    this.errorMessage.set(null);

    this.professorService.uploadMyCertificado(file).subscribe({
      next: (profile) => {
        this.uploadingCertificado.set(false);
        this.certificadoUrl.set(profile.certificadoUrl);
      },
      error: (error: HttpErrorResponse) => {
        this.uploadingCertificado.set(false);
        this.errorMessage.set(extractErrorMessage(error));
      }
    });
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
    this.saving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.professorService
      .updateMyProfile({
        ...raw,
        faixa: raw.faixa as FaixaEnum,
        tipoCobranca: raw.tipoCobranca as TipoCobrancaEnum,
        especialidades: this.especialidadesSelecionadas(),
        diasDisponiveis: this.diasSelecionados(),
        periodosDisponiveis: this.periodosSelecionados()
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

  private preencherFormulario(profile: ProfessorResponse): void {
    this.loading.set(false);
    this.fotoUrl.set(profile.fotoUrl);
    this.certificadoUrl.set(profile.certificadoUrl);
    this.especialidadesSelecionadas.set(profile.especialidades);
    this.diasSelecionados.set(profile.diasDisponiveis);
    this.periodosSelecionados.set(profile.periodosDisponiveis);

    this.form.patchValue({
      nomeCompleto: profile.nomeCompleto,
      telefoneWhatsapp: profile.telefoneWhatsapp,
      cidade: profile.cidade,
      bairro: profile.bairro,
      faixa: profile.faixa,
      equipeLinhagem: profile.equipeLinhagem ?? '',
      tempoExperienciaAnos: profile.tempoExperienciaAnos,
      tipoCobranca: profile.tipoCobranca,
      valorPretendido: profile.valorPretendido,
      bio: profile.bio ?? ''
    });
  }
}

function toggle<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];
}
