import { TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { ProfessorService } from '../../../core/services/professor.service';
import { extractErrorMessage } from '../../../core/utils/api-error';
import {
  ESPECIALIDADE_LABELS,
  EspecialidadeEnum,
  FAIXA_LABELS,
  FaixaEnum,
  ProfessorResponse
} from '../../../core/models/professor.models';

@Component({
  selector: 'app-academia-dashboard',
  imports: [ReactiveFormsModule, RouterLink, Navbar, TitleCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class AcademiaDashboard implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly professorService = inject(ProfessorService);

  readonly faixas = Object.entries(FAIXA_LABELS) as [FaixaEnum, string][];
  readonly especialidades = Object.entries(ESPECIALIDADE_LABELS) as [EspecialidadeEnum, string][];

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly resultados = signal<ProfessorResponse[]>([]);
  readonly totalElements = signal(0);
  readonly page = signal(0);
  readonly pageSize = 10;

  readonly filterForm = this.fb.nonNullable.group({
    cidade: [''],
    faixa: ['' as FaixaEnum | ''],
    especialidade: ['' as EspecialidadeEnum | ''],
    valorMin: [null as number | null],
    valorMax: [null as number | null]
  });

  ngOnInit(): void {
    this.buscar(0);
  }

  buscar(page = 0): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const raw = this.filterForm.getRawValue();

    this.professorService
      .search(
        {
          cidade: raw.cidade || undefined,
          faixa: raw.faixa || undefined,
          especialidade: raw.especialidade || undefined,
          valorMin: raw.valorMin ?? undefined,
          valorMax: raw.valorMax ?? undefined
        },
        page,
        this.pageSize
      )
      .subscribe({
        next: (result) => {
          this.loading.set(false);
          this.resultados.set(result.content);
          this.totalElements.set(result.page.totalElements);
          this.page.set(result.page.number);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.errorMessage.set(extractErrorMessage(error));
        }
      });
  }

  proximaPagina(): void {
    if ((this.page() + 1) * this.pageSize < this.totalElements()) {
      this.buscar(this.page() + 1);
    }
  }

  paginaAnterior(): void {
    if (this.page() > 0) {
      this.buscar(this.page() - 1);
    }
  }
}
