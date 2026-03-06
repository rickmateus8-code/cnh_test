// ============================================================
// Document Data Model — Histórico Escolar UNINTER
// Design: "Document Studio" — Swiss Design / Functional
// Supports multiple course profiles (História, Pedagogia, etc.)
// ============================================================

export const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663380726083/LSKlJlDWSFXTKSLM.png";
export const ASSINATURA_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663380914608/sWeWwfmzoBJtdiXv.png";
export const SELO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663380914608/NxEAVgNOkxUCbVre.png";

// Substitution field definition
export interface SubstitutionField {
  id: string;
  label: string;
  category: "pessoal" | "academico" | "institucional";
  originalValue: string;
  currentValue: string;
  pages: number[]; // pages where this field appears
}

// Profile definition — now includes course info
export type ProfileKey = "lindomar" | "thais_historia" | "thais_pedagogia";

export interface Profile {
  name: string;
  label: string; // display label for button
  curso: string; // course name
  cursoAbreviado: string; // short name for UI
  fields: Record<string, string>;
}

// Course-specific metadata for conditional rendering in DocumentPages
export interface CourseMetadata {
  cursoCompleto: string;
  reconhecimento: string;
  reconhecimentoInline: string;
  dateText: string;
  ingressoMesAno: string;
  ingressoAno: string;
  unidadeLabel: string;
  unidadeEndereco: string;
  codigoValidacao: string;
}

// ============================================================
// PROFILES
// ============================================================

export const LINDOMAR_PROFILE: Profile = {
  name: "LINDOMAR DE OLIVEIRA DUARTE",
  label: "LINDOMAR",
  curso: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
  cursoAbreviado: "História",
  fields: {
    nome: "LINDOMAR DE OLIVEIRA DUARTE",
    cpf: "247.920.528-23",
    rg: "27.204.902-5",
    rg_orgao: "SSP/SP",
    data_nascimento: "12/09/1976",
    uf_nascimento: "PR",
    nacionalidade: "BRASILEIRA",
    matricula: "1022071",
    situacao_matricula: "FORMADO",
    endereco: "Rua do Rosário, 147 | Centro - Curitiba/PR | CEP 80020-110",
    curso: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
    conclusao_curso: "08/07/2019",
    colacao_grau: "08/07/2019",
    expedicao_diploma: "08/07/2019",
    expedicao_historico: "08/07/2019",
    carga_horaria: "2870",
    titulacao: "Doutorado",
  },
};

export const THAIS_HISTORIA_PROFILE: Profile = {
  name: "THAIS MACHADO SEBASTIAO",
  label: "THAIS (História)",
  curso: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
  cursoAbreviado: "História",
  fields: {
    nome: "THAIS MACHADO SEBASTIAO",
    cpf: "294.159.728-07",
    rg: "32.383.130-8",
    rg_orgao: "SSP/SP",
    data_nascimento: "01/12/1982",
    uf_nascimento: "SP",
    nacionalidade: "BRASILEIRA",
    matricula: "1022071",
    situacao_matricula: "FORMADO",
    endereco: "Tv. Tobias de Macedo, 37 - Centro, Curitiba - PR, 80020-210",
    curso: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
    conclusao_curso: "20/06/2022",
    colacao_grau: "30/07/2022",
    expedicao_diploma: "15/08/2022",
    expedicao_historico: "15/08/2022",
    carga_horaria: "2870",
    titulacao: "Mestrado",
  },
};

export const THAIS_PEDAGOGIA_PROFILE: Profile = {
  name: "THAIS MACHADO SEBASTIAO",
  label: "THAIS (Pedagogia)",
  curso: "CURSO SUPERIOR DE LICENCIATURA EM PEDAGOGIA",
  cursoAbreviado: "Pedagogia",
  fields: {
    nome: "THAIS MACHADO SEBASTIAO",
    cpf: "294.159.728-07",
    rg: "32.383.130-8",
    rg_orgao: "SSP/SP",
    data_nascimento: "01/12/1982",
    uf_nascimento: "SP",
    nacionalidade: "BRASILEIRA",
    matricula: "1022071",
    situacao_matricula: "FORMADO",
    endereco: "Tv. Tobias de Macedo, 37 - Centro, Curitiba - PR, 80020-210",
    curso: "CURSO SUPERIOR DE LICENCIATURA EM PEDAGOGIA",
    conclusao_curso: "20/12/2018",
    colacao_grau: "15/02/2019",
    expedicao_diploma: "04/03/2019",
    expedicao_historico: "04/03/2019",
    carga_horaria: "3200",
    titulacao: "Mestrado",
  },
};

// Backward compat alias
export const THAIS_PROFILE = THAIS_HISTORIA_PROFILE;

// Map of all profiles
export const PROFILES: Record<ProfileKey, Profile> = {
  lindomar: LINDOMAR_PROFILE,
  thais_historia: THAIS_HISTORIA_PROFILE,
  thais_pedagogia: THAIS_PEDAGOGIA_PROFILE,
};

// ============================================================
// COURSE METADATA — conditional rendering data per profile
// ============================================================

export const COURSE_METADATA: Record<ProfileKey, CourseMetadata> = {
  lindomar: {
    cursoCompleto: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
    reconhecimento: "Reconhecido pela Portaria nº 357, de 24/05/2018, DOU nº 100, Seção 1, pág. 16, de 25/05/2018",
    reconhecimentoInline: "Reconhecido pela Portaria nº 357, de 24/05/2018, DOU nº 100, Seção 1, pág. 16, de 25/05/2018 ,",
    dateText: "Curitiba/PR, 8 de julho de 2019.",
    ingressoMesAno: "Março / 2015",
    ingressoAno: "2015",
    unidadeLabel: "Unidade Campo Largo:",
    unidadeEndereco: "Rodovia BR-277 Curitiba Ponta Grossa - km 103,7, s/n | Vila Guarani - Campo Largo/PR | CEP 83608-900",
    codigoValidacao: "5088947",
  },
  thais_historia: {
    cursoCompleto: "CURSO SUPERIOR DE LICENCIATURA EM HISTÓRIA",
    reconhecimento: "Reconhecido pela Portaria nº 913, de 27/12/2018, DOU nº 245, Seção 1, pág. 35-40",
    reconhecimentoInline: "Reconhecido pela Portaria nº 913, de 27/12/2018, DOU nº 245, Seção 1, pág. 35-40,",
    dateText: "Curitiba/PR, 15 de agosto de 2022.",
    ingressoMesAno: "Março / 2018",
    ingressoAno: "2018",
    unidadeLabel: "Unidade Curitiba:",
    unidadeEndereco: "Tv. Tobias de Macedo, 37 - Centro, Curitiba - PR | CEP 80020-210",
    codigoValidacao: "5088947",
  },
  thais_pedagogia: {
    cursoCompleto: "CURSO SUPERIOR DE LICENCIATURA EM PEDAGOGIA",
    reconhecimento: "Reconhecido pela Portaria nº 913, DOU nº 245, Seção 1",
    reconhecimentoInline: "Reconhecido pela Portaria nº 913, DOU nº 245, Seção 1,",
    dateText: "Curitiba/PR, 04 de março de 2019.",
    ingressoMesAno: "Março / 2018",
    ingressoAno: "2018",
    unidadeLabel: "Unidade Curitiba:",
    unidadeEndereco: "Tv. Tobias de Macedo, 37 - Centro, Curitiba - PR | CEP 80020-210",
    codigoValidacao: "5088948",
  },
};

// ============================================================
// SUBSTITUTION FIELDS
// ============================================================

export function createSubstitutionFields(profile: Profile): SubstitutionField[] {
  return [
    { id: "nome", label: "Nome Completo", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.nome, currentValue: profile.fields.nome, pages: [1, 2, 3, 5] },
    { id: "cpf", label: "CPF", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.cpf, currentValue: profile.fields.cpf, pages: [1, 2, 3, 5] },
    { id: "rg", label: "RG", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.rg, currentValue: profile.fields.rg, pages: [3, 5] },
    { id: "rg_orgao", label: "Órgão Emissor RG", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.rg_orgao, currentValue: profile.fields.rg_orgao, pages: [3, 5] },
    { id: "data_nascimento", label: "Data de Nascimento", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.data_nascimento, currentValue: profile.fields.data_nascimento, pages: [3, 5] },
    { id: "uf_nascimento", label: "UF Nascimento", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.uf_nascimento, currentValue: profile.fields.uf_nascimento, pages: [3, 5] },
    { id: "nacionalidade", label: "Nacionalidade", category: "pessoal", originalValue: LINDOMAR_PROFILE.fields.nacionalidade, currentValue: profile.fields.nacionalidade, pages: [3, 5] },
    { id: "matricula", label: "Matrícula", category: "academico", originalValue: LINDOMAR_PROFILE.fields.matricula, currentValue: profile.fields.matricula, pages: [1, 2, 3, 5] },
    { id: "situacao_matricula", label: "Situação de Matrícula", category: "academico", originalValue: LINDOMAR_PROFILE.fields.situacao_matricula, currentValue: profile.fields.situacao_matricula, pages: [3, 5] },
    { id: "endereco", label: "Endereço", category: "institucional", originalValue: LINDOMAR_PROFILE.fields.endereco, currentValue: profile.fields.endereco, pages: [3] },
    { id: "conclusao_curso", label: "Conclusão do Curso", category: "academico", originalValue: LINDOMAR_PROFILE.fields.conclusao_curso, currentValue: profile.fields.conclusao_curso, pages: [1, 2, 3] },
    { id: "colacao_grau", label: "Colação de Grau", category: "academico", originalValue: LINDOMAR_PROFILE.fields.colacao_grau, currentValue: profile.fields.colacao_grau, pages: [1, 2, 3] },
    { id: "expedicao_diploma", label: "Expedição do Diploma", category: "academico", originalValue: LINDOMAR_PROFILE.fields.expedicao_diploma, currentValue: profile.fields.expedicao_diploma, pages: [3] },
    { id: "expedicao_historico", label: "Expedição do Histórico", category: "academico", originalValue: LINDOMAR_PROFILE.fields.expedicao_historico, currentValue: profile.fields.expedicao_historico, pages: [3] },
    { id: "carga_horaria", label: "Carga Horária", category: "academico", originalValue: LINDOMAR_PROFILE.fields.carga_horaria, currentValue: profile.fields.carga_horaria, pages: [2, 6] },
    { id: "titulacao", label: "Titulação", category: "academico", originalValue: LINDOMAR_PROFILE.fields.titulacao, currentValue: profile.fields.titulacao, pages: [5, 6] },
  ];
}

// ============================================================
// GRADE DATA
// ============================================================

export interface GradeRow {
  anoMes: string;
  disciplina: string;
  ch: string;
  media: string;
  resultado: string;
  docente: string;
  titulacao: string;
}

// --- LINDOMAR (História) ---
export const GRADES_PAGE5: GradeRow[] = [
  { anoMes: "2017/09", disciplina: "Estágio Supervisionado - Ensino Fundamental: Pesquisa do Contexto Escolar e Observação", ch: "100h", media: "9.1", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2018/09", disciplina: "Estágio Supervisionado - Ensino Fundamental: Planejamento e Docência", ch: "100h", media: "7.9", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2017/02", disciplina: "Estágio Supervisionado - Ensino Médio: Pesquisa do Contexto Escolar e Observação", ch: "100h", media: "9.8", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2017/05", disciplina: "Estágio Supervisionado - Ensino Médio: Planejamento e Docência", ch: "100h", media: "9.9", resultado: "APR.MÉDIA", docente: "Elaine Ferreira da Silva", titulacao: "Especialização" },
  { anoMes: "2016/10", disciplina: "TCC Projeto", ch: "20h", media: "9.8", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2017/07", disciplina: "TCC Texto Final", ch: "20h", media: "10.0", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2018/02", disciplina: "TCC Apresentação", ch: "10h", media: "10.0", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2017/02", disciplina: "Atividades Complementares", ch: "200h", media: "-", resultado: "CONCLUIDA", docente: "Deisily de Quadros", titulacao: "Doutorado" },
  { anoMes: "2015/03", disciplina: "Orientação para a Educação a Distância", ch: "20h", media: "-", resultado: "CONCLUIDA", docente: "Antonio Siemsen Munhoz", titulacao: "Doutorado" },
  { anoMes: "2015/08", disciplina: "Fundamentos Psicológicos da Educação", ch: "80h", media: "8.0", resultado: "APR.RECUP", docente: "Luis Fernando Lopes", titulacao: "Mestrado" },
  { anoMes: "2015/08", disciplina: "Fundamentos Socioantropológicos da Educação", ch: "80h", media: "7.2", resultado: "APR.MÉDIA", docente: "Valéria Pilão", titulacao: "Mestrado" },
  { anoMes: "2018/11", disciplina: "Ética e Educação", ch: "40h", media: "7.7", resultado: "APR.MÉDIA", docente: "Alvino Moser", titulacao: "Doutorado" },
  { anoMes: "2018/09", disciplina: "Fundamentos Filosóficos da Educação", ch: "80h", media: "8.3", resultado: "APR.MÉDIA", docente: "Genoveva Ribas Claro", titulacao: "Mestrado" },
  { anoMes: "2018/10", disciplina: "Currículo Escolar", ch: "40h", media: "10.0", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2018/10", disciplina: "Didática", ch: "80h", media: "9.0", resultado: "APR.MÉDIA", docente: "Viviane Schueda Stacheski", titulacao: "Mestrado" },
  { anoMes: "2015/04", disciplina: "Libras", ch: "80h", media: "7.4", resultado: "APR.MÉDIA", docente: "Rafaela Piekarski Hoebel Lopes dos Santos", titulacao: "Especialização" },
  { anoMes: "2015/04", disciplina: "Prática Profissional: A Escola", ch: "40h", media: "7.4", resultado: "APR.MÉDIA", docente: "Gisele do Rocio Cordeiro", titulacao: "Mestrado" },
  { anoMes: "2015/05", disciplina: "Metodologia Científica", ch: "40h", media: "9.5", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2015/05", disciplina: "Sistema de Ensino e Políticas Educacionais", ch: "40h", media: "8.0", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2015/07", disciplina: "Estudos das Relações Étnico-Raciais para o Ensino de História e Cultura Afro-Brasileira e Africana", ch: "80h", media: "8.7", resultado: "APR.MÉDIA", docente: "Germano Bruno Afonso", titulacao: "Doutorado" },
  { anoMes: "2015/07", disciplina: "Fundamentos Históricos da Educação Brasileira", ch: "80h", media: "8.1", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2017/09", disciplina: "Prática Profissional: Ciência, Educação e Tecnologia", ch: "80h", media: "9.5", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2017/10", disciplina: "Antiguidade Oriental", ch: "80h", media: "7.1", resultado: "APR.MÉDIA", docente: "Maria Thereza David Joao", titulacao: "Doutorado" },
  { anoMes: "2017/10", disciplina: "Metodologia do Ensino de História", ch: "80h", media: "8.9", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2017/10", disciplina: "Fundamentos da Pesquisa Histórica", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Renan da Cruz Padilha Soares", titulacao: "Especialização" },
  { anoMes: "2018/02", disciplina: "História do Brasil I: Sociedade e Cultura", ch: "80h", media: "9.6", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2018/02", disciplina: "Prática Profissional: Língua Portuguesa e Produção de Texto", ch: "40h", media: "9.1", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
];

export const GRADES_PAGE6: GradeRow[] = [
  { anoMes: "2021/07", disciplina: "História do Brasil II: Política e Economia", ch: "80h", media: "10.0", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2021/07", disciplina: "Sociedade Brasileira Contemporânea", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2022/02", disciplina: "Arqueologia", ch: "80h", media: "9.4", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2022/02", disciplina: "História da Arte", ch: "40h", media: "8.1", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2021/11", disciplina: "Prática Profissional: Laboratório de Ensino Aprendizagem de História", ch: "80h", media: "9.7", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2021/06", disciplina: "História Antiga", ch: "80h", media: "7.8", resultado: "APR.MÉDIA", docente: "Maria Thereza David Joao", titulacao: "Doutorado" },
  { anoMes: "2021/06", disciplina: "História Medieval", ch: "80h", media: "9.8", resultado: "APR.MÉDIA", docente: "Mariana Bonat Trevisan", titulacao: "Doutorado" },
  { anoMes: "2019/10", disciplina: "História Moderna", ch: "80h", media: "8.0", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2020/07", disciplina: "Prática Profissional: Leitura e Interpretação de Textos Historiográficos", ch: "80h", media: "8.8", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2020/02", disciplina: "História da América", ch: "80h", media: "9.6", resultado: "APR.MÉDIA", docente: "Rui Valese", titulacao: "Doutorado" },
  { anoMes: "2020/04", disciplina: "Educação Patrimonial", ch: "40h", media: "8.2", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2020/07", disciplina: "Prática Profissional: Ensino de História Linguagem e Fontes", ch: "80h", media: "8.8", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2019/10", disciplina: "História Contemporânea", ch: "80h", media: "8.9", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2020/04", disciplina: "Historiografia Contemporânea", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2020/05", disciplina: "Teoria da História", ch: "80h", media: "9.2", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
];

// --- THAIS (História) — cronologia ajustada ---
export const GRADES_PAGE5_THAIS: GradeRow[] = [
  { anoMes: "2020/09", disciplina: "Estágio Supervisionado - Ensino Fundamental: Pesquisa do Contexto Escolar e Observação", ch: "100h", media: "9.1", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2021/09", disciplina: "Estágio Supervisionado - Ensino Fundamental: Planejamento e Docência", ch: "100h", media: "7.9", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2020/02", disciplina: "Estágio Supervisionado - Ensino Médio: Pesquisa do Contexto Escolar e Observação", ch: "100h", media: "9.8", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2020/05", disciplina: "Estágio Supervisionado - Ensino Médio: Planejamento e Docência", ch: "100h", media: "9.9", resultado: "APR.MÉDIA", docente: "Elaine Ferreira da Silva", titulacao: "Especialização" },
  { anoMes: "2019/10", disciplina: "TCC Projeto", ch: "20h", media: "9.8", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2020/07", disciplina: "TCC Texto Final", ch: "20h", media: "10.0", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2021/02", disciplina: "TCC Apresentação", ch: "10h", media: "10.0", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2020/02", disciplina: "Atividades Complementares", ch: "200h", media: "-", resultado: "CONCLUIDA", docente: "Deisily de Quadros", titulacao: "Doutorado" },
  { anoMes: "2018/03", disciplina: "Orientação para a Educação a Distância", ch: "20h", media: "-", resultado: "CONCLUIDA", docente: "Antonio Siemsen Munhoz", titulacao: "Doutorado" },
  { anoMes: "2018/08", disciplina: "Fundamentos Psicológicos da Educação", ch: "80h", media: "8.0", resultado: "APR.RECUP", docente: "Luis Fernando Lopes", titulacao: "Mestrado" },
  { anoMes: "2018/08", disciplina: "Fundamentos Socioantropológicos da Educação", ch: "80h", media: "7.2", resultado: "APR.MÉDIA", docente: "Valéria Pilão", titulacao: "Mestrado" },
  { anoMes: "2021/11", disciplina: "Ética e Educação", ch: "40h", media: "7.7", resultado: "APR.MÉDIA", docente: "Alvino Moser", titulacao: "Doutorado" },
  { anoMes: "2021/09", disciplina: "Fundamentos Filosóficos da Educação", ch: "80h", media: "8.3", resultado: "APR.MÉDIA", docente: "Genoveva Ribas Claro", titulacao: "Mestrado" },
  { anoMes: "2021/10", disciplina: "Currículo Escolar", ch: "40h", media: "10.0", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2021/10", disciplina: "Didática", ch: "80h", media: "9.0", resultado: "APR.MÉDIA", docente: "Viviane Schueda Stacheski", titulacao: "Mestrado" },
  { anoMes: "2018/04", disciplina: "Libras", ch: "80h", media: "7.4", resultado: "APR.MÉDIA", docente: "Rafaela Piekarski Hoebel Lopes dos Santos", titulacao: "Especialização" },
  { anoMes: "2018/04", disciplina: "Prática Profissional: A Escola", ch: "40h", media: "7.4", resultado: "APR.MÉDIA", docente: "Gisele do Rocio Cordeiro", titulacao: "Mestrado" },
  { anoMes: "2018/05", disciplina: "Metodologia Científica", ch: "40h", media: "9.5", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2018/05", disciplina: "Sistema de Ensino e Políticas Educacionais", ch: "40h", media: "8.0", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2018/07", disciplina: "Estudos das Relações Étnico-Raciais para o Ensino de História e Cultura Afro-Brasileira e Africana", ch: "80h", media: "8.7", resultado: "APR.MÉDIA", docente: "Germano Bruno Afonso", titulacao: "Doutorado" },
  { anoMes: "2018/07", disciplina: "Fundamentos Históricos da Educação Brasileira", ch: "80h", media: "8.1", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2020/09", disciplina: "Prática Profissional: Ciência, Educação e Tecnologia", ch: "80h", media: "9.5", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2020/10", disciplina: "Antiguidade Oriental", ch: "80h", media: "7.1", resultado: "APR.MÉDIA", docente: "Maria Thereza David Joao", titulacao: "Doutorado" },
  { anoMes: "2020/10", disciplina: "Metodologia do Ensino de História", ch: "80h", media: "8.9", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2020/10", disciplina: "Fundamentos da Pesquisa Histórica", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Renan da Cruz Padilha Soares", titulacao: "Especialização" },
  { anoMes: "2021/02", disciplina: "História do Brasil I: Sociedade e Cultura", ch: "80h", media: "9.6", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2021/02", disciplina: "Prática Profissional: Língua Portuguesa e Produção de Texto", ch: "40h", media: "9.1", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
];

export const GRADES_PAGE6_THAIS: GradeRow[] = [
  { anoMes: "2021/07", disciplina: "História do Brasil II: Política e Economia", ch: "80h", media: "10.0", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2021/07", disciplina: "Sociedade Brasileira Contemporânea", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2022/02", disciplina: "Arqueologia", ch: "80h", media: "9.4", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2022/02", disciplina: "História da Arte", ch: "40h", media: "8.1", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2021/11", disciplina: "Prática Profissional: Laboratório de Ensino Aprendizagem de História", ch: "80h", media: "9.7", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2021/06", disciplina: "História Antiga", ch: "80h", media: "7.8", resultado: "APR.MÉDIA", docente: "Maria Thereza David Joao", titulacao: "Doutorado" },
  { anoMes: "2021/06", disciplina: "História Medieval", ch: "80h", media: "9.8", resultado: "APR.MÉDIA", docente: "Mariana Bonat Trevisan", titulacao: "Doutorado" },
  { anoMes: "2019/10", disciplina: "História Moderna", ch: "80h", media: "8.0", resultado: "APR.MÉDIA", docente: "Andre Luiz Moscaleski Cavazzani", titulacao: "Doutorado" },
  { anoMes: "2020/07", disciplina: "Prática Profissional: Leitura e Interpretação de Textos Historiográficos", ch: "80h", media: "8.8", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2020/02", disciplina: "História da América", ch: "80h", media: "9.6", resultado: "APR.MÉDIA", docente: "Rui Valese", titulacao: "Doutorado" },
  { anoMes: "2020/04", disciplina: "Educação Patrimonial", ch: "40h", media: "8.2", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2020/07", disciplina: "Prática Profissional: Ensino de História Linguagem e Fontes", ch: "80h", media: "8.8", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2019/10", disciplina: "História Contemporânea", ch: "80h", media: "8.9", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2020/04", disciplina: "Historiografia Contemporânea", ch: "40h", media: "9.3", resultado: "APR.MÉDIA", docente: "Fernanda Ribeiro Haag", titulacao: "Mestrado" },
  { anoMes: "2020/05", disciplina: "Teoria da História", ch: "80h", media: "9.2", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
];

// --- THAIS (Pedagogia) — disciplinas específicas ---
export const GRADES_PEDAGOGIA_PAGE5: GradeRow[] = [
  { anoMes: "2018/03", disciplina: "Fundamentos Históricos da Educação", ch: "80h", media: "8.5", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2018/03", disciplina: "Fundamentos Filosóficos da Educação", ch: "80h", media: "8.0", resultado: "APR.MÉDIA", docente: "Genoveva Ribas Claro", titulacao: "Mestrado" },
  { anoMes: "2018/04", disciplina: "Psicologia da Educação", ch: "80h", media: "7.8", resultado: "APR.MÉDIA", docente: "Luis Fernando Lopes", titulacao: "Mestrado" },
  { anoMes: "2018/04", disciplina: "Sociologia da Educação", ch: "80h", media: "8.2", resultado: "APR.MÉDIA", docente: "Valéria Pilão", titulacao: "Mestrado" },
  { anoMes: "2018/05", disciplina: "Didática", ch: "80h", media: "9.0", resultado: "APR.MÉDIA", docente: "Viviane Schueda Stacheski", titulacao: "Mestrado" },
  { anoMes: "2018/05", disciplina: "Currículo Escolar", ch: "80h", media: "8.7", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2018/06", disciplina: "Políticas e Organização da Educação Básica", ch: "80h", media: "8.4", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2018/06", disciplina: "Educação Inclusiva", ch: "80h", media: "9.1", resultado: "APR.MÉDIA", docente: "Gisele do Rocio Cordeiro", titulacao: "Mestrado" },
  { anoMes: "2018/07", disciplina: "Alfabetização e Letramento", ch: "80h", media: "8.9", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2018/07", disciplina: "Educação Infantil: Teorias e Práticas", ch: "80h", media: "9.2", resultado: "APR.MÉDIA", docente: "Gisele do Rocio Cordeiro", titulacao: "Mestrado" },
  { anoMes: "2018/08", disciplina: "Metodologia do Ensino da Língua Portuguesa", ch: "80h", media: "8.6", resultado: "APR.MÉDIA", docente: "Edna Marta Oliveira da Silva", titulacao: "Mestrado" },
  { anoMes: "2018/08", disciplina: "Metodologia do Ensino da Matemática", ch: "80h", media: "8.3", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
  { anoMes: "2018/09", disciplina: "Metodologia do Ensino de Ciências", ch: "80h", media: "8.7", resultado: "APR.MÉDIA", docente: "Germano Bruno Afonso", titulacao: "Doutorado" },
  { anoMes: "2018/09", disciplina: "Metodologia do Ensino de História e Geografia", ch: "80h", media: "8.5", resultado: "APR.MÉDIA", docente: "Alana Milcheski", titulacao: "Mestrado" },
  { anoMes: "2018/10", disciplina: "Avaliação da Aprendizagem", ch: "80h", media: "9.0", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2018/10", disciplina: "Gestão Escolar", ch: "80h", media: "8.8", resultado: "APR.MÉDIA", docente: "Dinamara Pereira Machado", titulacao: "Doutorado" },
];

export const GRADES_PEDAGOGIA_PAGE6: GradeRow[] = [
  { anoMes: "2018/11", disciplina: "LIBRAS", ch: "80h", media: "7.9", resultado: "APR.MÉDIA", docente: "Rafaela Piekarski Hoebel Lopes dos Santos", titulacao: "Especialização" },
  { anoMes: "2018/11", disciplina: "Tecnologias da Informação e Comunicação na Educação", ch: "80h", media: "9.3", resultado: "APR.MÉDIA", docente: "Antonio Siemsen Munhoz", titulacao: "Doutorado" },
  { anoMes: "2018/12", disciplina: "Pesquisa em Educação", ch: "80h", media: "8.6", resultado: "APR.MÉDIA", docente: "Desire Luciane Dominschek Lima", titulacao: "Doutorado" },
  { anoMes: "2018/12", disciplina: "TCC", ch: "100h", media: "9.5", resultado: "APR.MÉDIA", docente: "Neliva Terezinha Tessaro", titulacao: "Mestrado" },
  { anoMes: "2018/10", disciplina: "Estágio Supervisionado - Educação Infantil", ch: "100h", media: "9.0", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2018/11", disciplina: "Estágio Supervisionado - Anos Iniciais do Ensino Fundamental", ch: "100h", media: "9.2", resultado: "APR.MÉDIA", docente: "Katia Cristina Dambiski Soares", titulacao: "Doutorado" },
  { anoMes: "2018/12", disciplina: "Estágio Supervisionado - Gestão Escolar", ch: "100h", media: "8.9", resultado: "APR.MÉDIA", docente: "Elaine Ferreira da Silva", titulacao: "Especialização" },
  { anoMes: "2018/06", disciplina: "Atividades Complementares", ch: "200h", media: "-", resultado: "CONCLUÍDA", docente: "Deisily de Quadros", titulacao: "Doutorado" },
];

// ============================================================
// GRADES LOOKUP BY PROFILE
// ============================================================

export function getGradesForProfile(profileKey: ProfileKey): { page5: GradeRow[]; page6: GradeRow[] } {
  switch (profileKey) {
    case "thais_pedagogia":
      return { page5: GRADES_PEDAGOGIA_PAGE5, page6: GRADES_PEDAGOGIA_PAGE6 };
    case "thais_historia":
      return { page5: GRADES_PAGE5_THAIS, page6: GRADES_PAGE6_THAIS };
    case "lindomar":
    default:
      return { page5: GRADES_PAGE5, page6: GRADES_PAGE6 };
  }
}
