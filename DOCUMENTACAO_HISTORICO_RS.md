# DocMaster System — Documentação do Módulo "Histórico Rio Grande do Sul"

## Visão Geral

O módulo **Histórico Rio Grande do Sul** foi implementado no projeto DocMaster como uma réplica pixel-perfect do histórico escolar oficial do estado do Rio Grande do Sul, baseado no modelo da SEDUC/RS. O módulo permite a visualização, edição interativa e exportação em PDF de históricos escolares do Ensino Médio, mantendo total fidelidade ao layout original do documento oficial.

O módulo foi apelidado internamente como **"Histórico Rio Grande do Sul"** e segue exatamente o mesmo padrão arquitetural do módulo "Histórico UNINTER" já existente no projeto, garantindo consistência e manutenibilidade do código.

---

## Arquivos Criados

A tabela abaixo apresenta todos os arquivos criados ou modificados para a implementação do módulo.

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `client/src/lib/historicoRSData.ts` | Dados | Modelo de dados, perfis, notas, campos editáveis |
| `client/src/hooks/useRSSubstitution.ts` | Hook | Gerenciamento de estado dos campos de substituição |
| `client/src/components/RSSubstitutionPanel.tsx` | Componente | Painel lateral de edição com categorias colapsáveis |
| `client/src/components/RSDocumentPage.tsx` | Componente | Renderização pixel-perfect do documento A4 |
| `client/src/pages/HistoricoRS.tsx` | Página | Viewer interativo com zoom, destaques e export PDF |

### Arquivos Modificados

| Arquivo | Modificação |
|---------|-------------|
| `client/src/App.tsx` | Adicionada rota `/historico-rs` |
| `client/src/pages/Dashboard.tsx` | Adicionado link no sidebar e dropdown de novo documento |

---

## Dados Pré-Preenchidos — Aluna Rafaela Fagundes Dutra

O perfil padrão do módulo vem pré-configurado com os dados da aluna conforme solicitado.

### Dados Institucionais

| Campo | Valor |
|-------|-------|
| Governo | GOVERNO DO ESTADO DO RIO GRANDE DO SUL |
| Secretaria | SECRETARIA DE ESTADO DA EDUCAÇÃO |
| Escola | INSTITUTO EDUCACIONAL DIMENSÃO |
| Ato Legal | (conforme ato da escola) |
| Endereço | (rua da escola) |
| Bairro | Centro |
| Município | Camaquã |
| CEP | (da escola) |
| Telefone | (da escola) |
| E-mail | (e-mail institucional) |

### Identificação do Aluno

| Campo | Valor |
|-------|-------|
| Nome | RAFAELA FAGUNDES DUTRA |
| R.G. | 1110857073 |
| R.A. | (nº de matrícula do aluno) |
| Município de Nascimento | Camaquã |
| Estado | RS |
| País | BRASIL |
| Data de Nascimento | (data de nascimento da aluna) |

### Fundamento Legal

Lei Federal 9.394/96; legislação vigente do Sistema Estadual de Ensino do RS.

### Matriz Curricular — Ensino Médio

| Componente Curricular | 2012 (1ª) | 2013 (2ª) | 2014 (3ª) | CH |
|----------------------|-----------|-----------|-----------|-----|
| Língua Portuguesa | 5 | 6 | 7 | 640 |
| Educação Física | 5 | 7 | 6 | 240 |
| Arte | 8 | 8 | 6 | 240 |
| Matemática | 5 | 7 | 5 | 600 |
| Química | 5 | 6 | 5 | 240 |
| Física | 5 | 5 | 6 | 240 |
| Biologia | 5 | 7 | 7 | 240 |
| História | 7 | 6 | 5 | 240 |
| Geografia | 5 | 7 | 6 | 240 |
| Filosofia | 7 | 5 | 6 | 240 |
| Sociologia | 5 | 5 | 5 | 240 |
| **Total Base Nacional** | - | - | - | **3.400** |
| Língua Estrangeira Inglês | 5 | 6 | 6 | 240 |
| **Total Diversificada** | - | - | - | **240** |
| **Total Geral** | - | - | - | **4.600** |

### Estudos Realizados

| Série | Ano | Estabelecimento | Município | UF |
|-------|-----|----------------|-----------|-----|
| 1ª Série | 2012 | Instituto Educacional Dimensão | Camaquã | RS |
| 2ª Série | 2013 | Instituto Educacional Dimensão | Camaquã | RS |
| 3ª Série | 2014 | Instituto Educacional Dimensão | Camaquã | RS |

### Escala de Avaliação

Escala numérica de 0 a 10, sendo mínimo 5 para aprovação.

### Observações

A aluna concluiu o Ensino Médio no ano de 2014, estando apta ao prosseguimento de estudos em nível superior.

---

## Perfis Disponíveis

O módulo inclui dois perfis pré-configurados que podem ser alternados com um clique.

| Perfil | Nome | Descrição |
|--------|------|-----------|
| RAFAELA | Rafaela Fagundes Dutra | Perfil principal com dados da aluna solicitada |
| RENATA (Original) | Renata Pereira de Almeida | Perfil de referência baseado no PDF original |

---

## Funcionalidades do Módulo

O módulo "Histórico Rio Grande do Sul" oferece as seguintes funcionalidades, todas replicadas do módulo "Histórico UNINTER" existente.

**Visualização Interativa:** O documento é renderizado em formato A4 com zoom ajustável (40% a 150%), permitindo visualização detalhada de todos os elementos do histórico escolar.

**Edição de Campos:** O painel lateral organiza os campos editáveis em quatro categorias colapsáveis — Instituição (8 campos), Dados do Aluno (7 campos), Dados Acadêmicos (10 campos) e Certificado (4 campos). Cada campo pode ser editado individualmente com atualização em tempo real no documento.

**Sistema de Destaques:** Campos modificados são destacados visualmente com sublinhado verde e fundo translúcido, facilitando a identificação de alterações. O sistema pode ser ligado ou desligado pelo botão "Destaques ON/OFF".

**Troca de Perfis:** Os perfis RAFAELA e RENATA podem ser alternados instantaneamente, carregando todos os dados correspondentes no documento e no painel de edição.

**Exportação PDF:** O documento pode ser exportado em formato PDF de alta qualidade utilizando jsPDF e html2canvas, com suporte a imagens (brasão) e layout fiel ao original.

**Contador de Alterações:** O cabeçalho exibe em tempo real o número de campos modificados em relação ao perfil base.

---

## Estrutura Técnica

### Modelo de Dados (`historicoRSData.ts`)

O arquivo define as interfaces TypeScript para campos de substituição (`RSSubstitutionField`), perfis (`RSProfile`), notas (`RSGradeRow`) e estudos realizados (`RSEstudoRow`). Os dados são organizados em constantes exportadas que alimentam tanto o componente de renderização quanto o painel de edição.

### Hook de Substituição (`useRSSubstitution.ts`)

O hook `useRSSubstitution` gerencia o estado reativo dos campos editáveis, incluindo a aplicação de perfis, atualização individual de campos, reset para valores originais e cálculo do número de modificações. O estado é derivado do perfil ativo e mantido em memória durante a sessão.

### Componente de Renderização (`RSDocumentPage.tsx`)

O componente `RSPage1` renderiza o documento completo em formato A4 utilizando tabelas HTML com estilos inline para garantir fidelidade ao layout original do PDF. O componente recebe os campos como props e aplica destaques visuais nos campos modificados quando habilitado.

### Painel de Edição (`RSSubstitutionPanel.tsx`)

O componente `RSSubstitutionPanel` organiza os campos editáveis em seções colapsáveis com contadores de modificações por categoria. Cada campo é renderizado como um input de texto com label descritivo.

### Página Principal (`HistoricoRS.tsx`)

A página `HistoricoRS` integra todos os componentes em um layout responsivo com barra superior (navegação, destaques, export), painel lateral (edição) e área principal (documento com zoom). A exportação PDF utiliza um iframe isolado para garantir renderização limpa.

---

## Como Executar o Projeto

Para executar o projeto DocMaster com o módulo Histórico RS, siga os passos abaixo.

```bash
# 1. Instalar dependências
cd docmaster-system
pnpm install

# 2. Configurar variáveis de ambiente
# Certifique-se de que o arquivo .env.local contém:
# DATABASE_URL=mysql://docmaster:docmaster123@localhost:3306/docmaster
# COOKIE_SECRET=docmaster-secret-key-2024

# 3. Iniciar MySQL e criar banco de dados
sudo service mysql start
sudo mysql -e "CREATE DATABASE IF NOT EXISTS docmaster"
sudo mysql -e "CREATE USER IF NOT EXISTS 'docmaster'@'localhost' IDENTIFIED BY 'docmaster123'"
sudo mysql -e "GRANT ALL PRIVILEGES ON docmaster.* TO 'docmaster'@'localhost'"

# 4. Iniciar o servidor de desenvolvimento
DATABASE_URL="mysql://docmaster:docmaster123@localhost:3306/docmaster" \
COOKIE_SECRET="docmaster-secret-key-2024" \
NODE_ENV=development \
npx tsx server/_core/index.ts

# 5. Acessar no navegador
# http://localhost:3000

# 6. Login
# Usuário: cyberpiolho
# Senha: @Durafa10
```

---

## Credenciais de Acesso

| Tipo | Usuário | Senha | Papel |
|------|---------|-------|-------|
| Admin Master | cyberpiolho | @Durafa10 | admin |

---

## Versão

**DocMaster System — Versão Atualizada com Módulo Histórico RS**
Data de implementação: 25 de fevereiro de 2026
Código do modelo: GT-HEMTI-V.1
