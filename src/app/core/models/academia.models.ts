export type TipoEspacoEnum =
  | 'ACADEMIA'
  | 'CENTRO_TREINAMENTO'
  | 'ESCOLA'
  | 'CONDOMINIO'
  | 'CLUBE'
  | 'EMPRESA';

export const TIPO_ESPACO_LABELS: Record<TipoEspacoEnum, string> = {
  ACADEMIA: 'Academia',
  CENTRO_TREINAMENTO: 'Centro de treinamento',
  ESCOLA: 'Escola',
  CONDOMINIO: 'Condomínio',
  CLUBE: 'Clube',
  EMPRESA: 'Empresa'
};

export interface AcademiaSignupRequest {
  email: string;
  senha: string;
  nomeAcademia: string;
  responsavel: string;
  telefoneWhatsapp: string;
  cidade: string;
  bairro: string;
  tipoEspaco: TipoEspacoEnum | null;
  aceiteTermos: boolean;
}

export type AcademiaUpdateRequest = Omit<AcademiaSignupRequest, 'email' | 'senha' | 'aceiteTermos'>;

export interface AcademiaResponse {
  id: string;
  nomeAcademia: string;
  responsavel: string;
  telefoneWhatsapp: string;
  cidade: string;
  bairro: string;
  tipoEspaco: TipoEspacoEnum | null;
  fotoCapaUrl: string | null;
  criadoEm: string;
}
