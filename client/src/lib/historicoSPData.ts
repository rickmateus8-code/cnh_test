// ============================================================
// Document Data Model — Histórico Escolar SP (São Paulo)
// Ensino Médio — Layout baseado no modelo oficial SEDUC/SP
// ============================================================

export const BRASAO_SP_URL = "/assets/brasao_sp.png";

// ============================================================
// INTERFACES
// ============================================================

export interface SPSubstitutionField {
  id: string;
  label: string;
  category: "instituicao" | "aluno" | "academico" | "certificado" | "assinaturas";
  originalValue: string;
  currentValue: string;
  type?: "text" | "upload";
}

export interface SPProfile {
  name: string;
  label: string;
  fields: Record<string, string>;
  grades: SPGradeRow[];
}

export interface SPGradeRow {
  disciplina: string;
  nota1: string;
  nota2: string;
  nota3: string;
  ch: string;
}

export interface SPEstudoRow {
  nivel: string;
  serie: string;
  ano: string;
  estabelecimento: string;
  municipio: string;
  uf: string;
}

// ============================================================
// DISCIPLINAS / NOTAS — BASE (usada em todos os perfis)
// ============================================================

export const SP_GRADES_DEFAULT: SPGradeRow[] = [
  { disciplina: "Língua Portuguesa e Literatura", nota1: "8,0", nota2: "6,9", nota3: "8,5", ch: "360" },
  { disciplina: "Arte", nota1: "", nota2: "", nota3: "", ch: "" },
  { disciplina: "Educação Física", nota1: "7,0", nota2: "7,2", nota3: "8,5", ch: "240" },
  { disciplina: "Matemática", nota1: "6,5", nota2: "6,8", nota3: "7,1", ch: "360" },
  { disciplina: "Biologia", nota1: "6,7", nota2: "6,0", nota3: "5,5", ch: "240" },
  { disciplina: "Física", nota1: "5,5", nota2: "6,0", nota3: "6,5", ch: "360" },
  { disciplina: "Química", nota1: "6,0", nota2: "6,9", nota3: "5,7", ch: "360" },
  { disciplina: "História", nota1: "7,5", nota2: "8,0", nota3: "7,0", ch: "240" },
  { disciplina: "Geografia", nota1: "8,0", nota2: "7,5", nota3: "8,5", ch: "240" },
  { disciplina: "Filosofia", nota1: "7,0", nota2: "8,9", nota3: "9,0", ch: "240" },
  { disciplina: "Sociologia", nota1: "9,0", nota2: "8,0", nota3: "7,0", ch: "240" },
];

// ============================================================
// PERFIL — Giovanne (dados do PDF original)
// ============================================================

export const GIOVANNE_PROFILE: SPProfile = {
  name: "GIOVANE SILVA DOS SANTOS",
  label: "GIOVANNE",
  grades: SP_GRADES_DEFAULT,
  fields: {
    nome_escola: "ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª",
    ato_legal: "906748",
    endereco_escola: "Av. Honorio Ferreira Pedrosa",
    numero_escola: "611",
    bairro: "Pq Nova Cacapava",
    municipio_escola: "Cacapava",
    cep_escola: "06411-160",
    telefone_escola: "(12) 36521267",
    email_escola: "E906748A@EDUCACAO.SP.GOV.BR",
    nome_aluno: "GIOVANE SILVA DOS SANTOS",
    rg: "555285753",
    ra: "26205579-0",
    municipio_nascimento: "Cacapava",
    estado_nascimento: "SP",
    pais: "BRASIL",
    data_nascimento: "01/12/1999",
    ano_1a_serie: "2017",
    ano_2a_serie: "2018",
    ano_3a_serie: "2019",
    ano_fund_serie: "8ª Série",
    ano_fund: "2016",
    escola_fund: "E. E. Mª Apda. França B. Araujo Profª",
    municipio_fund: "Cacapava",
    uf_fund: "SP",
    escola_1a: "E. E. Mª Apda. França B. Araujo Profª",
    municipio_1a: "Cacapava",
    uf_1a: "SP",
    escola_2a: "E. E. Mª Apda. França B. Araujo Profª",
    municipio_2a: "Cacapava",
    uf_2a: "SP",
    escola_3a: "E. E. Mª Apda. França B. Araujo Profª",
    municipio_3a: "Cacapava",
    uf_3a: "SP",
    codigo_seguranca: "SPS41214853-0SP",
    ano_conclusao: "2019",
    registro_gdae: "SPS41214853-0SP",
    gerente_nome: "MARISTELA GALVANI MACHADO",
    gerente_rg: "23.425.125-45",
    diretor_nome: "ANGELA PEREIRA DOS SANTOS",
    diretor_rg: "13.068.721-63",
    local_data: "Cacapava - SP, 04/12/2019",
    disciplina_apoio_1: "Língua Portuguesa e Literatura",
    disciplina_apoio_2: "",
    disciplina_apoio_3: "",
  },
};

// ============================================================
// PERFIL — Kassia
// ============================================================

export const KASSIA_PROFILE: SPProfile = {
  name: "KASSIA ALEXANDRA ALVES DA SILVA",
  label: "KASSIA",
  grades: SP_GRADES_DEFAULT,
  fields: {
    nome_escola: "ESCOLA ESTADUAL E. E. PEI ALDEIA DE BARUERI",
    ato_legal: "1036",
    endereco_escola: "R. Rio Paraná",
    numero_escola: "206",
    bairro: "Nova Aldeinha",
    municipio_escola: "Barueri",
    cep_escola: "06411-160",
    telefone_escola: "(11) 2658-8076",
    email_escola: "E009912A@EDUCACAO.SP.GOV.BR",
    nome_aluno: "KASSIA ALEXANDRA ALVES DA SILVA",
    rg: "8186010",
    ra: "26205579-0",
    municipio_nascimento: "Barueri",
    estado_nascimento: "SP",
    pais: "BRASIL",
    data_nascimento: "07/02/2007",
    ano_1a_serie: "2022",
    ano_2a_serie: "2023",
    ano_3a_serie: "2024",
    ano_fund_serie: "8ª Série",
    ano_fund: "2021",
    escola_fund: "E.E. PEI Aldeia de Barueri",
    municipio_fund: "Barueri",
    uf_fund: "SP",
    escola_1a: "E.E. PEI Aldeia de Barueri",
    municipio_1a: "Barueri",
    uf_1a: "SP",
    escola_2a: "E.E. PEI Aldeia de Barueri",
    municipio_2a: "Barueri",
    uf_2a: "SP",
    escola_3a: "E.E. PEI Aldeia de Barueri",
    municipio_3a: "Barueri",
    uf_3a: "SP",
    codigo_seguranca: "SPS41097203-0SP",
    ano_conclusao: "2024",
    registro_gdae: "SPS41097203-0SP",
    gerente_nome: "PRISCILA LOPES DE LIMA CARVALHO",
    gerente_rg: "23.425.125-45",
    diretor_nome: "RAQUEL VENANCIO DE AQUINO",
    diretor_rg: "13.068.721-63",
    local_data: "BARUERI - SP, 04/12/2024",
    disciplina_apoio_1: "Língua Portuguesa e Literatura",
    disciplina_apoio_2: "",
    disciplina_apoio_3: "",
  },
};

// ============================================================
// PERFIL — Jessica
// ============================================================

export const JESSICA_PROFILE: SPProfile = {
  name: "JESSICA FRANCISCA SOARES",
  label: "JESSICA",
  grades: SP_GRADES_DEFAULT,
  fields: {
    nome_escola: "ESCOLA ESTADUAL PROFº SEBASTIÃO DE SOUZA BUENO",
    ato_legal: "1036",
    endereco_escola: "R. Francisco de Medeiros Jordao",
    numero_escola: "579",
    bairro: "Vila Medeiros",
    municipio_escola: "Sao Paulo",
    cep_escola: "02214-030",
    telefone_escola: "(11) 2201-8592",
    email_escola: "",
    nome_aluno: "JESSICA FRANCISCA SOARES",
    rg: "494.213.64-4",
    ra: "26205579-0",
    municipio_nascimento: "Sao Paulo",
    estado_nascimento: "SP",
    pais: "BRASIL",
    data_nascimento: "02/09/1993",
    ano_1a_serie: "2009",
    ano_2a_serie: "2010",
    ano_3a_serie: "2011",
    ano_fund_serie: "8ª Série",
    ano_fund: "2008",
    escola_fund: "E.E. PROFº Sebastião De Souza Bueno",
    municipio_fund: "São Paulo",
    uf_fund: "SP",
    escola_1a: "E.E. PROFº Sebastião De Souza Bueno",
    municipio_1a: "São Paulo",
    uf_1a: "SP",
    escola_2a: "E.E. PROFº Sebastião De Souza Bueno",
    municipio_2a: "São Paulo",
    uf_2a: "SP",
    escola_3a: "E.E. PROFº Sebastião De Souza Bueno",
    municipio_3a: "São Paulo",
    uf_3a: "SP",
    codigo_seguranca: "SPS31698001-0SP",
    ano_conclusao: "2011",
    registro_gdae: "SPS31698001-0SP",
    gerente_nome: "CRISTINA MASSAMI KATO",
    gerente_rg: "23.425.125-45",
    diretor_nome: "FABIANA VEQUETINI DE LUCENA",
    diretor_rg: "13.068.721-63",
    local_data: "SAO PAULO - SP, 04/12/2011",
    disciplina_apoio_1: "Língua Portuguesa e Literatura",
    disciplina_apoio_2: "",
    disciplina_apoio_3: "",
  },
};

// ============================================================
// PERFIL — Júlia (JOÃO RODOLFO BLANCO CHATO)
// ============================================================

export const JULIA_PROFILE: SPProfile = {
  name: "JOÃO RODOLFO BLANCO CHATO",
  label: "JÚLIA",
  grades: SP_GRADES_DEFAULT,
  fields: {
    nome_escola: "ESCOLA ESTADUAL PROF.ª MARIA ANGÉLICA SOAVE",
    ato_legal: "14915",
    endereco_escola: "R. Cel. Pachêco",
    numero_escola: "109",
    bairro: "Jd Nova Taboao",
    municipio_escola: "Guarulhos",
    cep_escola: "07141-100",
    telefone_escola: "(11) 2402-3533",
    email_escola: "",
    nome_aluno: "JOÃO RODOLFO BLANCO CHATO",
    rg: "35.171.758-4",
    ra: "35255678-0",
    municipio_nascimento: "Tatuapé",
    estado_nascimento: "SP",
    pais: "BRASIL",
    data_nascimento: "21/11/1991",
    ano_1a_serie: "2009",
    ano_2a_serie: "2010",
    ano_3a_serie: "2011",
    ano_fund_serie: "8ª Série",
    ano_fund: "2008",
    escola_fund: "E.E. Professora Maria Angélica Soave",
    municipio_fund: "Guarulhos",
    uf_fund: "SP",
    escola_1a: "E.E. Professora Maria Angélica Soave",
    municipio_1a: "Guarulhos",
    uf_1a: "SP",
    escola_2a: "E.E. Professora Maria Angélica Soave",
    municipio_2a: "Guarulhos",
    uf_2a: "SP",
    escola_3a: "E.E. Professora Maria Angélica Soave",
    municipio_3a: "Guarulhos",
    uf_3a: "SP",
    codigo_seguranca: "SPS72698201-0SP",
    ano_conclusao: "2011",
    registro_gdae: "SPS72698201-0SP",
    gerente_nome: "ELOÁ CARDOSO DIAS",
    gerente_rg: "23.425.125-45",
    diretor_nome: "VALDENICE CERQUEIRA ESTRELA DE SOUSA",
    diretor_rg: "13.068.721-63",
    local_data: "Guarulhos - SP, 04/12/2011",
    disciplina_apoio_1: "Língua Portuguesa e Literatura",
    disciplina_apoio_2: "",
    disciplina_apoio_3: "",
  },
};

export type SPProfileKey = "giovanne" | "kassia" | "jessica" | "julia";

export const SP_PROFILES: Record<SPProfileKey, SPProfile> = {
  giovanne: GIOVANNE_PROFILE,
  kassia: KASSIA_PROFILE,
  jessica: JESSICA_PROFILE,
  julia: JULIA_PROFILE,
};

// ============================================================
// SUBSTITUTION FIELDS — Campos editáveis via formulário
// ============================================================

export function createSPSubstitutionFields(profile: SPProfile): SPSubstitutionField[] {
  return [
    // Instituição
    { id: "nome_escola", label: "Nome da Escola", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.nome_escola, currentValue: profile.fields.nome_escola },
    { id: "ato_legal", label: "Ato Legal de Criação", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.ato_legal, currentValue: profile.fields.ato_legal },
    { id: "endereco_escola", label: "Endereço", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.endereco_escola, currentValue: profile.fields.endereco_escola },
    { id: "numero_escola", label: "Número", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.numero_escola, currentValue: profile.fields.numero_escola },
    { id: "bairro", label: "Bairro", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.bairro, currentValue: profile.fields.bairro },
    { id: "municipio_escola", label: "Município", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.municipio_escola, currentValue: profile.fields.municipio_escola },
    { id: "cep_escola", label: "CEP", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.cep_escola, currentValue: profile.fields.cep_escola },
    { id: "telefone_escola", label: "Telefone", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.telefone_escola, currentValue: profile.fields.telefone_escola },
    { id: "email_escola", label: "E-mail", category: "instituicao", originalValue: GIOVANNE_PROFILE.fields.email_escola, currentValue: profile.fields.email_escola },
    // Aluno
    { id: "nome_aluno", label: "Nome do Aluno", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.nome_aluno, currentValue: profile.fields.nome_aluno },
    { id: "rg", label: "R.G.", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.rg, currentValue: profile.fields.rg },
    { id: "ra", label: "R.A.", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.ra, currentValue: profile.fields.ra },
    { id: "municipio_nascimento", label: "Município de Nascimento", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.municipio_nascimento, currentValue: profile.fields.municipio_nascimento },
    { id: "estado_nascimento", label: "Estado", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.estado_nascimento, currentValue: profile.fields.estado_nascimento },
    { id: "pais", label: "País", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.pais, currentValue: profile.fields.pais },
    { id: "data_nascimento", label: "Data de Nascimento", category: "aluno", originalValue: GIOVANNE_PROFILE.fields.data_nascimento, currentValue: profile.fields.data_nascimento },
    // Acadêmico
    { id: "ano_1a_serie", label: "Ano 1ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.ano_1a_serie, currentValue: profile.fields.ano_1a_serie },
    { id: "ano_2a_serie", label: "Ano 2ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.ano_2a_serie, currentValue: profile.fields.ano_2a_serie },
    { id: "ano_3a_serie", label: "Ano 3ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.ano_3a_serie, currentValue: profile.fields.ano_3a_serie },
    { id: "ano_fund_serie", label: "Série Ens. Fundamental", category: "academico", originalValue: GIOVANNE_PROFILE.fields.ano_fund_serie, currentValue: profile.fields.ano_fund_serie },
    { id: "ano_fund", label: "Ano Ens. Fundamental", category: "academico", originalValue: GIOVANNE_PROFILE.fields.ano_fund, currentValue: profile.fields.ano_fund },
    { id: "escola_fund", label: "Escola Ens. Fundamental", category: "academico", originalValue: GIOVANNE_PROFILE.fields.escola_fund, currentValue: profile.fields.escola_fund },
    { id: "municipio_fund", label: "Município Ens. Fundamental", category: "academico", originalValue: GIOVANNE_PROFILE.fields.municipio_fund, currentValue: profile.fields.municipio_fund },
    { id: "escola_1a", label: "Escola 1ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.escola_1a, currentValue: profile.fields.escola_1a },
    { id: "municipio_1a", label: "Município 1ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.municipio_1a, currentValue: profile.fields.municipio_1a },
    { id: "escola_2a", label: "Escola 2ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.escola_2a, currentValue: profile.fields.escola_2a },
    { id: "municipio_2a", label: "Município 2ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.municipio_2a, currentValue: profile.fields.municipio_2a },
    { id: "escola_3a", label: "Escola 3ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.escola_3a, currentValue: profile.fields.escola_3a },
    { id: "municipio_3a", label: "Município 3ª Série", category: "academico", originalValue: GIOVANNE_PROFILE.fields.municipio_3a, currentValue: profile.fields.municipio_3a },
    { id: "disciplina_apoio_1", label: "Disc. Apoio Curricular 1", category: "academico", originalValue: GIOVANNE_PROFILE.fields.disciplina_apoio_1, currentValue: profile.fields.disciplina_apoio_1 },
    { id: "disciplina_apoio_2", label: "Disc. Apoio Curricular 2", category: "academico", originalValue: GIOVANNE_PROFILE.fields.disciplina_apoio_2, currentValue: profile.fields.disciplina_apoio_2 },
    { id: "disciplina_apoio_3", label: "Disc. Apoio Curricular 3", category: "academico", originalValue: GIOVANNE_PROFILE.fields.disciplina_apoio_3, currentValue: profile.fields.disciplina_apoio_3 },
    // Certificado
    { id: "codigo_seguranca", label: "Código de Segurança", category: "certificado", originalValue: GIOVANNE_PROFILE.fields.codigo_seguranca, currentValue: profile.fields.codigo_seguranca },
    { id: "ano_conclusao", label: "Ano de Conclusão", category: "certificado", originalValue: GIOVANNE_PROFILE.fields.ano_conclusao, currentValue: profile.fields.ano_conclusao },
    { id: "registro_gdae", label: "Registro GDAE", category: "certificado", originalValue: GIOVANNE_PROFILE.fields.registro_gdae, currentValue: profile.fields.registro_gdae },
    // Assinaturas
    { id: "gerente_nome", label: "Nome Gerente Org. Escolar", category: "assinaturas", originalValue: GIOVANNE_PROFILE.fields.gerente_nome, currentValue: profile.fields.gerente_nome },
    { id: "gerente_rg", label: "RG Gerente", category: "assinaturas", originalValue: GIOVANNE_PROFILE.fields.gerente_rg, currentValue: profile.fields.gerente_rg },
    { id: "diretor_nome", label: "Nome Diretor de Escola", category: "assinaturas", originalValue: GIOVANNE_PROFILE.fields.diretor_nome, currentValue: profile.fields.diretor_nome },
    { id: "diretor_rg", label: "RG Diretor", category: "assinaturas", originalValue: GIOVANNE_PROFILE.fields.diretor_rg, currentValue: profile.fields.diretor_rg },
    { id: "local_data", label: "Local e Data", category: "assinaturas", originalValue: GIOVANNE_PROFILE.fields.local_data, currentValue: profile.fields.local_data },
  ];
}
