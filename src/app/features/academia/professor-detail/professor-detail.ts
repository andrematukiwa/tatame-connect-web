import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/navbar/navbar';
import { ProfessorService } from '../../../core/services/professor.service';
import {
  DIA_SEMANA_LABELS,
  ESPECIALIDADE_LABELS,
  PERIODO_LABELS,
  ProfessorResponse,
  TIPO_COBRANCA_LABELS
} from '../../../core/models/professor.models';

@Component({
  selector: 'app-professor-detail',
  imports: [RouterLink, Navbar, TitleCasePipe],
  templateUrl: './professor-detail.html',
  styleUrl: './professor-detail.scss'
})
export class ProfessorDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly professorService = inject(ProfessorService);

  readonly especialidadeLabels = ESPECIALIDADE_LABELS;
  readonly diaSemanaLabels = DIA_SEMANA_LABELS;
  readonly periodoLabels = PERIODO_LABELS;
  readonly tipoCobrancaLabels = TIPO_COBRANCA_LABELS;

  readonly loading = signal(true);
  readonly professor = signal<ProfessorResponse | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly linkWhatsapp = computed(() => {
    const atual = this.professor();
    if (!atual) {
      return '';
    }
    const numero = atual.telefoneWhatsapp.replace(/\D/g, '');
    const mensagem = encodeURIComponent(
      `Olá, ${atual.nomeCompleto}! Vi seu perfil no Tatame Connect e temos interesse no seu trabalho.`
    );
    return `https://wa.me/55${numero}?text=${mensagem}`;
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      this.errorMessage.set('Professor não encontrado.');
      return;
    }

    this.professorService.getById(id).subscribe({
      next: (professor) => {
        this.loading.set(false);
        this.professor.set(professor);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Não foi possível carregar este perfil.');
      }
    });
  }
}
