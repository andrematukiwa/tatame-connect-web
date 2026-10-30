export type FaixaEnum = 'BRANCA' | 'AZUL' | 'ROXA' | 'MARROM' | 'PRETA' | 'CORAL';

export type EspecialidadeEnum =
  | 'INFANTIL'
  | 'ADULTO'
  | 'FEMININO'
  | 'COMPETICAO'
  | 'DEFESA_PESSOAL'
  | 'NO_GI'
  | 'AULAS_PARTICULARES';

export type DiaSemanaEnum = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SABADO' | 'DOMINGO';

export type PeriodoEnum = 'MANHA' | 'TARDE' | 'NOITE';

export type TipoCobrancaEnum = 'POR_AULA' | 'MENSAL' | 'A_COMBINAR';

export const FAIXA_LABELS: Record<FaixaEnum, string> = {
  BRANCA: 'Branca',
  AZUL: 'Azul',
  ROXA: 'Roxa',
  MARROM: 'Marrom',
  PRETA: 'Preta',
  CORAL: 'Coral'
};

export const ESPECIALIDADE_LABELS: Record<EspecialidadeEnum, string> = {
  INFANTIL: 'Infantil',
  ADULTO: 'Adulto',
  FEMININO: 'Feminino',
  COMPETICAO: 'Competição',
  DEFESA_PESSOAL: 'Defesa pessoal',
  NO_GI: 'No-Gi',
  AULAS_PARTICULARES: 'Aulas particulares'
};

export const DIA_SEMANA_LABELS: Record<DiaSemanaEnum, string> = {
  SEGUNDA: 'Seg',
  TERCA: 'Ter',
  QUARTA: 'Qua',
  QUINTA: 'Qui',
  SEXTA: 'Sex',
  SABADO: 'Sáb',
  DOMINGO: 'Dom'
};

export const PERIODO_LABELS: Record<PeriodoEnum, string> = {
  MANHA: 'Manhã',
  TARDE: 'Tarde',
  NOITE: 'Noite'
};

export const TIPO_COBRANCA_LABELS: Record<TipoCobrancaEnum, string> = {
  POR_AULA: 'Por aula',
  MENSAL: 'Mensal',
  A_COMBINAR: 'A combinar'
};

export interface ProfessorSignupRequest {
  email: string;
  senha: string;
  nomeCompleto: string;
  telefoneWhatsapp: string;
  cidade: string;
  bairro: string;
  faixa: FaixaEnum | null;
  equipeLinhagem?: string;
  tempoExperienciaAnos: number | null;
  especialidades: EspecialidadeEnum[];
  diasDisponiveis: DiaSemanaEnum[];
  periodosDisponiveis: PeriodoEnum[];
  tipoCobranca: TipoCobrancaEnum | null;
  valorPretendido: number | null;
  bio?: string;
  aceiteTermos: boolean;
}

export type ProfessorUpdateRequest = Omit<ProfessorSignupRequest, 'email' | 'senha' | 'aceiteTermos'>;

export interface ProfessorResponse {
  id: string;
  nomeCompleto: string;
  telefoneWhatsapp: string;
  cidade: string;
  bairro: string;
  fotoUrl: string | null;
  certificadoUrl: string | null;
  faixa: FaixaEnum;
  equipeLinhagem: string | null;
  tempoExperienciaAnos: number;
  valorPretendido: number;
  tipoCobranca: TipoCobrancaEnum;
  bio: string | null;
  especialidades: EspecialidadeEnum[];
  diasDisponiveis: DiaSemanaEnum[];
  periodosDisponiveis: PeriodoEnum[];
  criadoEm: string;
}

export interface ProfessorSearchFilter {
  cidade?: string;
  faixa?: FaixaEnum;
  especialidade?: EspecialidadeEnum;
  diaSemana?: DiaSemanaEnum;
  periodo?: PeriodoEnum;
  valorMin?: number;
  valorMax?: number;
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
