// ============================================================
// Document Data Model — Histórico Escolar RS (Rio Grande do Sul)
// Ensino Médio — Layout baseado no modelo oficial SEDUC/RS
// ============================================================

export const BRASAO_RS_URL = "/assets/brasao_rs.png";

// ============================================================
// INTERFACES
// ============================================================

export interface RSSubstitutionField {
  id: string;
  label: string;
  category: "instituicao" | "aluno" | "academico" | "certificado";
  originalValue: string;
  currentValue: string;
}

export interface RSProfile {
  name: string;
  label: string;
  fields: Record<string, string>;
  grades: RSGradeRow[];
  gradesDiversificada: RSGradeRow[];
}

export interface RSGradeRow {
  disciplina: string;
  nota1: string;
  nota2: string;
  nota3: string;
  ch: string;
}

export interface RSEstudoRow {
  nivel: string;
  serie: string;
  ano: string;
  estabelecimento: string;
  municipio: string;
  uf: string;
}

// ============================================================
// DISCIPLINAS / NOTAS — RAFAELA
// ============================================================

export const RS_GRADES_RAFAELA: RSGradeRow[] = [
  { disciplina: "Língua Portuguesa", nota1: "6", nota2: "7", nota3: "7", ch: "640" },
  { disciplina: "Educação Física", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
  { disciplina: "Arte", nota1: "7", nota2: "7", nota3: "6", ch: "240" },
  { disciplina: "Matemática", nota1: "6", nota2: "7", nota3: "6", ch: "600" },
  { disciplina: "Química", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
  { disciplina: "Física", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
  { disciplina: "Biologia", nota1: "7", nota2: "7", nota3: "7", ch: "240" },
  { disciplina: "História", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
  { disciplina: "Geografia", nota1: "6", nota2: "7", nota3: "6", ch: "240" },
  { disciplina: "Filosofia", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
  { disciplina: "Sociologia", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
];

export const RS_GRADES_DIVERSIFICADA_RAFAELA: RSGradeRow[] = [
  { disciplina: "Língua Estrangeira – Inglês", nota1: "6", nota2: "6", nota3: "6", ch: "240" },
];

// ============================================================
// DISCIPLINAS / NOTAS — RENATA (dados do PDF original)
// ============================================================

export const RS_GRADES_RENATA: RSGradeRow[] = [
  { disciplina: "Língua Portuguesa", nota1: "5", nota2: "6", nota3: "7", ch: "640" },
  { disciplina: "Educação Física", nota1: "5", nota2: "7", nota3: "6", ch: "240" },
  { disciplina: "Arte", nota1: "8", nota2: "8", nota3: "6", ch: "240" },
  { disciplina: "Matemática", nota1: "5", nota2: "7", nota3: "5", ch: "600" },
  { disciplina: "Química", nota1: "5", nota2: "6", nota3: "5", ch: "240" },
  { disciplina: "Física", nota1: "5", nota2: "5", nota3: "6", ch: "240" },
  { disciplina: "Biologia", nota1: "5", nota2: "7", nota3: "7", ch: "240" },
  { disciplina: "História", nota1: "7", nota2: "6", nota3: "5", ch: "240" },
  { disciplina: "Geografia", nota1: "5", nota2: "7", nota3: "6", ch: "240" },
  { disciplina: "Filosofia", nota1: "7", nota2: "5", nota3: "6", ch: "240" },
  { disciplina: "Sociologia", nota1: "5", nota2: "5", nota3: "5", ch: "240" },
];

export const RS_GRADES_DIVERSIFICADA_RENATA: RSGradeRow[] = [
  { disciplina: "Língua Estrangeira Inglês", nota1: "5", nota2: "6", nota3: "6", ch: "240" },
];

// Exports de compatibilidade
export const RS_GRADES_DEFAULT = RS_GRADES_RAFAELA;
export const RS_GRADES_DIVERSIFICADA = RS_GRADES_DIVERSIFICADA_RAFAELA;

// ============================================================
// PERFIL — Rafaela Fagundes Dutra (dados completos)
// ============================================================

export const RAFAELA_PROFILE: RSProfile = {
  name: "RAFAELA FAGUNDES DUTRA",
  label: "RAFAELA",
  grades: RS_GRADES_RAFAELA,
  gradesDiversificada: RS_GRADES_DIVERSIFICADA_RAFAELA,
  fields: {
    governo: "GOVERNO DO ESTADO DO RIO GRANDE DO SUL",
    secretaria: "SECRETARIA DE ESTADO DA EDUCAÇÃO",
    coordenadoria: "COORDENADORIA REGIONAL DE EDUCAÇÃO",
    escola: "INSTITUTO EDUCACIONAL DIMENSÃO",
    ato_legal: "Portaria CEEd nº 512, de 20/12/2001",
    endereco_escola: "Rua Álvaro Macedo",
    numero_escola: "Nº 125",
    bairro: "Centro",
    municipio_escola: "Camaquã",
    cep_escola: "96780-052",
    telefone_escola: "(51) 3671-2321",
    email_escola: "secretariacamaqua@institutodimensao.com.br",
    nome_aluno: "RAFAELA FAGUNDES DUTRA",
    rg: "1110857073",
    ra: "4829175036",
    municipio_nascimento: "Camaquã",
    estado_nascimento: "RS",
    pais: "BRASIL",
    data_nascimento: "23/09/1995",
    ano_1a_serie: "2012",
    ano_2a_serie: "2013",
    ano_3a_serie: "2014",
    escola_1a: "Instituto Educacional Dimensão",
    escola_2a: "Instituto Educacional Dimensão",
    escola_3a: "Instituto Educacional Dimensão",
    municipio_1a: "Camaquã",
    municipio_2a: "Camaquã",
    municipio_3a: "Camaquã",
    uf_1a: "RS",
    uf_2a: "RS",
    uf_3a: "RS",
    carga_horaria_total: "4.600",
    ano_conclusao: "2014",
    fundamento_legal: "Lei Federal 9394/96; Lei Complementar 1.164, de 4-1-2012; Res. SE 12, de 31-1-2012",
    escala_avaliacao: "A partir de 2007 – Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar satisfatório, a nota igual ou superior a 05 (cinco) nos termos da Resolução SE-61, de 24/9/2007.",
    observacao: "Aluna concluiu o ensino médio no ano de 2014, podendo dar prosseguimento no ensino superior.",
  },
};

// Perfil original do PDF — RENATA
export const RENATA_PROFILE: RSProfile = {
  name: "RENATA PEREIRA DE ALMEIDA",
  label: "RENATA (Original)",
  grades: RS_GRADES_RENATA,
  gradesDiversificada: RS_GRADES_DIVERSIFICADA_RENATA,
  fields: {
    governo: "GOVERNO DO ESTADO DO RIO GRANDE DO SUL",
    secretaria: "SECRETARIA DE ESTADO DA EDUCAÇÃO",
    coordenadoria: "DIRETORIA DE ENSINO DE PALMEIRA DAS MISSÕES",
    escola: "ESCOLA ESTADUAL TRÊS MÁRTIRES",
    ato_legal: "DECRETO 52.597 DE 30/12/1970",
    endereco_escola: "Av Independência",
    numero_escola: "Nº 677",
    bairro: "Centro",
    municipio_escola: "Palmeiras das Missões",
    cep_escola: "98300-000",
    telefone_escola: "(51) 3742-1105",
    email_escola: "e923060a@educacao.rs.gov.br",
    nome_aluno: "RENATA PEREIRA DE ALMEIDA",
    rg: "2101661169",
    ra: "451097624",
    municipio_nascimento: "Palmeira das Missões",
    estado_nascimento: "RS",
    pais: "BRASIL",
    data_nascimento: "15/05/1990",
    ano_1a_serie: "2007",
    ano_2a_serie: "2008",
    ano_3a_serie: "2009",
    escola_1a: "Escola Estadual Três Mártires",
    escola_2a: "Escola Estadual Três Mártires",
    escola_3a: "Escola Estadual Três Mártires",
    municipio_1a: "Palmeira das Missões",
    municipio_2a: "Palmeira das Missões",
    municipio_3a: "Palmeira das Missões",
    uf_1a: "RS",
    uf_2a: "RS",
    uf_3a: "RS",
    carga_horaria_total: "4.600",
    ano_conclusao: "2009",
    fundamento_legal: "Lei Federal 9394/96; Lei Complementar 1.164, de 4 – 1 - 2012; Res. SE 12, de 31-1-",
    escala_avaliacao: "A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar satisfatório, a nota igual ou superior a 05 (cinco) nos termos da Resolução SE - 61, de 24/9/2007.",
    observacao: "Aluno Concluiu o ensino médio no ano de 2009, podendo dar prosseguimento no ensino superior.",
  },
};

export type RSProfileKey = "rafaela" | "renata";

export const RS_PROFILES: Record<RSProfileKey, RSProfile> = {
  rafaela: RAFAELA_PROFILE,
  renata: RENATA_PROFILE,
};

// ============================================================
// SUBSTITUTION FIELDS
// ============================================================

export function createRSSubstitutionFields(profile: RSProfile): RSSubstitutionField[] {
  return [
    // Instituição
    { id: "coordenadoria", label: "Coordenadoria/Diretoria", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.coordenadoria, currentValue: profile.fields.coordenadoria },
    { id: "escola", label: "Nome da Escola", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.escola, currentValue: profile.fields.escola },
    { id: "ato_legal", label: "Ato Legal de Criação", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.ato_legal, currentValue: profile.fields.ato_legal },
    { id: "endereco_escola", label: "Endereço da Escola", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.endereco_escola, currentValue: profile.fields.endereco_escola },
    { id: "numero_escola", label: "Número", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.numero_escola, currentValue: profile.fields.numero_escola },
    { id: "bairro", label: "Bairro", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.bairro, currentValue: profile.fields.bairro },
    { id: "municipio_escola", label: "Município da Escola", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.municipio_escola, currentValue: profile.fields.municipio_escola },
    { id: "cep_escola", label: "CEP", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.cep_escola, currentValue: profile.fields.cep_escola },
    { id: "telefone_escola", label: "Telefone", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.telefone_escola, currentValue: profile.fields.telefone_escola },
    { id: "email_escola", label: "E-mail", category: "instituicao", originalValue: RAFAELA_PROFILE.fields.email_escola, currentValue: profile.fields.email_escola },
    // Aluno
    { id: "nome_aluno", label: "Nome do Aluno", category: "aluno", originalValue: RAFAELA_PROFILE.fields.nome_aluno, currentValue: profile.fields.nome_aluno },
    { id: "rg", label: "R.G.", category: "aluno", originalValue: RAFAELA_PROFILE.fields.rg, currentValue: profile.fields.rg },
    { id: "ra", label: "R.A.", category: "aluno", originalValue: RAFAELA_PROFILE.fields.ra, currentValue: profile.fields.ra },
    { id: "municipio_nascimento", label: "Município de Nascimento", category: "aluno", originalValue: RAFAELA_PROFILE.fields.municipio_nascimento, currentValue: profile.fields.municipio_nascimento },
    { id: "estado_nascimento", label: "Estado", category: "aluno", originalValue: RAFAELA_PROFILE.fields.estado_nascimento, currentValue: profile.fields.estado_nascimento },
    { id: "pais", label: "País", category: "aluno", originalValue: RAFAELA_PROFILE.fields.pais, currentValue: profile.fields.pais },
    { id: "data_nascimento", label: "Data de Nascimento", category: "aluno", originalValue: RAFAELA_PROFILE.fields.data_nascimento, currentValue: profile.fields.data_nascimento },
    // Acadêmico
    { id: "ano_1a_serie", label: "Ano 1ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.ano_1a_serie, currentValue: profile.fields.ano_1a_serie },
    { id: "ano_2a_serie", label: "Ano 2ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.ano_2a_serie, currentValue: profile.fields.ano_2a_serie },
    { id: "ano_3a_serie", label: "Ano 3ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.ano_3a_serie, currentValue: profile.fields.ano_3a_serie },
    { id: "escola_1a", label: "Escola 1ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.escola_1a, currentValue: profile.fields.escola_1a },
    { id: "escola_2a", label: "Escola 2ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.escola_2a, currentValue: profile.fields.escola_2a },
    { id: "escola_3a", label: "Escola 3ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.escola_3a, currentValue: profile.fields.escola_3a },
    { id: "municipio_1a", label: "Município 1ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.municipio_1a, currentValue: profile.fields.municipio_1a },
    { id: "municipio_2a", label: "Município 2ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.municipio_2a, currentValue: profile.fields.municipio_2a },
    { id: "municipio_3a", label: "Município 3ª Série", category: "academico", originalValue: RAFAELA_PROFILE.fields.municipio_3a, currentValue: profile.fields.municipio_3a },
    { id: "carga_horaria_total", label: "Carga Horária Total", category: "academico", originalValue: RAFAELA_PROFILE.fields.carga_horaria_total, currentValue: profile.fields.carga_horaria_total },
    // Certificado
    { id: "ano_conclusao", label: "Ano de Conclusão", category: "certificado", originalValue: RAFAELA_PROFILE.fields.ano_conclusao, currentValue: profile.fields.ano_conclusao },
    { id: "fundamento_legal", label: "Fundamento Legal", category: "certificado", originalValue: RAFAELA_PROFILE.fields.fundamento_legal, currentValue: profile.fields.fundamento_legal },
    { id: "escala_avaliacao", label: "Escala de Avaliação", category: "certificado", originalValue: RAFAELA_PROFILE.fields.escala_avaliacao, currentValue: profile.fields.escala_avaliacao },
    { id: "observacao", label: "Observação", category: "certificado", originalValue: RAFAELA_PROFILE.fields.observacao, currentValue: profile.fields.observacao },
  ];
}
