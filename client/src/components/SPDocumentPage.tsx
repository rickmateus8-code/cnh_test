/**
 * SPDocumentPage — Réplica pixel-perfect do Histórico Escolar SP
 * Baseado em análise pdfplumber + OCR do PDF original (Giovanne)
 *
 * Fontes: Arial (Bold/Normal/Italic) — tamanhos extraídos do PDF
 * Página A4: 210mm × 297mm
 */
import { BRASAO_SP_URL, SP_GRADES_DEFAULT, type SPGradeRow } from "@/lib/historicoSPData";
import { BRASAO_SP_B64, SIG_GERENTE_B64, SIG_DIRETOR_B64 } from "@/lib/spAssets";

interface Props {
  f: Record<string, string>;
  highlightModified?: boolean;
  grades?: SPGradeRow[];
  brasaoUrl?: string;
  assinaturaGerenteUrl?: string;
  assinaturaDiretorUrl?: string;
}

function V({ val, orig, hl }: { val: string; orig?: string; hl?: boolean }) {
  const mod = orig !== undefined && val !== orig;
  return (
    <span style={mod && hl ? { borderBottom: "2px solid #2d8c4e", backgroundColor: "rgba(45,140,78,0.08)", padding: "0 1px" } : {}}>
      {val}
    </span>
  );
}

export function SPPage1({ f, highlightModified, grades = SP_GRADES_DEFAULT, brasaoUrl, assinaturaGerenteUrl, assinaturaDiretorUrl }: Props) {
  const hl = highlightModified;
  const b = "1px solid #000";
  const bThin = "0.5px solid #000";
  const bThick = "1.5px solid #000";
  const logoSrc = brasaoUrl || BRASAO_SP_B64;
  const ff = "Arial, Helvetica, sans-serif";

  // Default signature images (extracted from original PDF, embedded as base64)
  const sigGerenteSrc = assinaturaGerenteUrl || SIG_GERENTE_B64;
  const sigDiretorSrc = assinaturaDiretorUrl || SIG_DIRETOR_B64;

  const totalBNC = grades.reduce((s, g) => s + parseInt(g.ch || "0"), 0);

  /* Cell style helper */
  const cs = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: b,
    padding: "1px 3px",
    fontSize: "10pt",
    fontFamily: ff,
    verticalAlign: "middle",
    ...extra,
  });

  /* Vertical text */
  const vtStyle = (fs = "6pt", bold = true): React.CSSProperties => ({
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    fontSize: fs,
    fontWeight: bold ? "bold" : "normal",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    lineHeight: 1.1,
    textAlign: "center",
    fontFamily: ff,
  });

  return (
    <div
      className="doc-page-sp"
      id="doc-page-sp-1"
      style={{
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        background: "white",
        fontFamily: ff,
        fontSize: "10pt",
        lineHeight: 1.25,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
        padding: "6mm 8mm 4mm 10mm",
      }}
    >
      {/* ========== CABEÇALHO INSTITUCIONAL ========== */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: bThick, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "17%" }} />
          <col style={{ width: "42%" }} />
          <col style={{ width: "23%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>
        <tbody>
          {/* Brasão (rowspan=7) + GOVERNO */}
          <tr>
            <td rowSpan={7} style={{ borderRight: b, padding: "4px", verticalAlign: "middle", textAlign: "center" }}>
              <img src={logoSrc} alt="" style={{ width: "72px", height: "auto", display: "block", margin: "0 auto" }} crossOrigin="anonymous" />
            </td>
            <td colSpan={3} style={{ padding: "3px 6px 1px 6px", fontSize: "13pt", fontWeight: "bold", fontFamily: ff }}>
              GOVERNO DO ESTADO DE SÃO PAULO
            </td>
          </tr>
          {/* SECRETARIA */}
          <tr>
            <td colSpan={3} style={{ padding: "0 6px", fontSize: "10pt", fontWeight: "bold", fontFamily: ff }}>
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </td>
          </tr>
          {/* ESCOLA */}
          <tr>
            <td colSpan={3} style={{ padding: "0 6px 1px 6px", fontSize: "10pt", fontWeight: "bold", fontFamily: ff }}>
              <V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} />
            </td>
          </tr>
          {/* Ato Legal */}
          <tr>
            <td colSpan={3} style={{ padding: "0 6px", fontSize: "9pt", borderTop: bThin, fontFamily: ff }}>
              Ato Legal de Criação: <V val={f.ato_legal} orig="906748" hl={hl} />
            </td>
          </tr>
          {/* Endereço | Nº */}
          <tr>
            <td colSpan={2} style={{ padding: "0 6px", fontSize: "9pt", borderTop: bThin, fontFamily: ff }}>
              Endereço: <V val={f.endereco_escola} orig="Av. Honorio Ferreira Pedrosa" hl={hl} />
            </td>
            <td style={{ padding: "0 4px", fontSize: "9pt", borderLeft: bThin, borderTop: bThin, fontFamily: ff }}>
              Nº <V val={f.numero_escola} orig="611" hl={hl} />
            </td>
          </tr>
          {/* Bairro | Município | CEP */}
          <tr>
            <td style={{ padding: "0 6px", fontSize: "9pt", borderTop: bThin, fontFamily: ff }}>
              Bairro: <V val={f.bairro} orig="Pq Nova Cacapava" hl={hl} />
            </td>
            <td style={{ padding: "0 4px", fontSize: "9pt", borderLeft: bThin, borderTop: bThin, fontFamily: ff }}>
              Município: <V val={f.municipio_escola} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ padding: "0 4px", fontSize: "9pt", borderLeft: bThin, borderTop: bThin, fontFamily: ff }}>
              CEP:<V val={f.cep_escola} orig="06411-160" hl={hl} />
            </td>
          </tr>
          {/* Tel | Email */}
          <tr>
            <td style={{ padding: "0 6px", fontSize: "9pt", borderTop: bThin, fontFamily: ff }}>
              Tel. <V val={f.telefone_escola} orig="(12) 36521267" hl={hl} />
            </td>
            <td colSpan={2} style={{ padding: "0 4px", fontSize: "8pt", borderLeft: bThin, borderTop: bThin, fontFamily: ff }}>
              Endereço eletrônico: &nbsp;<V val={f.email_escola} orig="E906748A@EDUCACAO.SP.GOV.BR" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ========== TÍTULO ========== */}
      <div style={{
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "12pt",
        fontFamily: ff,
        padding: "3px 0",
        background: "#d0d0d0",
        borderLeft: bThick,
        borderRight: bThick,
        borderBottom: bThick,
        letterSpacing: "0.5px",
      }}>
        HISTÓRICO ESCOLAR – ENSINO MÉDIO
      </div>

      {/* ========== DADOS DO ALUNO ========== */}
      <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: bThick, borderRight: bThick, borderBottom: bThick, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "55%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "23%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              <b>Nome do Aluno</b>: <V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              R.G.: <V val={f.rg} orig="555285753" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              RA: <V val={f.ra} orig="26205579-0" hl={hl} />
            </td>
          </tr>
          <tr>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              <b>Nascimento</b><br />
              <span style={{ marginLeft: "8px" }}>Município: <V val={f.municipio_nascimento} orig="Cacapava" hl={hl} /></span><br />
              <span style={{ marginLeft: "8px" }}>Data: <V val={f.data_nascimento} orig="01/12/1999" hl={hl} /></span>
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              Estado: <V val={f.estado_nascimento} orig="SP" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "10pt", fontFamily: ff }}>
              País: <V val={f.pais} orig="BRASIL" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ========== TABELA DE NOTAS PRINCIPAL ========== */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        borderLeft: bThick,
        borderRight: bThick,
        tableLayout: "fixed",
      }}>
        <colgroup>
          <col style={{ width: "3.2%" }} />  {/* Fundamento Legal */}
          <col style={{ width: "5.5%" }} />  {/* BASE NACIONAL COMUM */}
          <col style={{ width: "10.5%" }} /> {/* Áreas de Conhecimento */}
          <col style={{ width: "41.3%" }} /> {/* Componentes Curriculares */}
          <col style={{ width: "5.5%" }} />  {/* Ano/Série */}
          <col style={{ width: "6.5%" }} />  {/* Year 1 */}
          <col style={{ width: "6.5%" }} />  {/* Year 2 */}
          <col style={{ width: "6.5%" }} />  {/* Year 3 */}
          <col style={{ width: "8%" }} />    {/* Carga Horária */}
        </colgroup>
        <tbody>
          {/* Header row */}
          <tr>
            {/* Fundamento Legal - spans entire grade section (header + 11 grades + 2 totals + 5 diversificada + 3 totals + 1 blank + 1 total curso + 6 estudos = ~29 rows) */}
            <td
              rowSpan={30}
              style={{
                borderTop: b,
                borderBottom: b,
                borderRight: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vtStyle("6.5pt", false)}>Fundamento Legal: Lei Federal 9394/96</div>
              </div>
            </td>

            {/* BASE NACIONAL COMUM - spans 11 grade rows + 2 total rows = 13 */}
            <td
              rowSpan={14}
              style={{
                borderTop: b,
                borderBottom: b,
                borderRight: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#d9d9d9",
              }}
            >
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vtStyle("6.5pt", true)}>BASE NACIONAL COMUM</div>
              </div>
            </td>

            {/* ÁREAS DE CONHECIMENTO */}
            <td style={cs({ fontSize: "6pt", textAlign: "center", fontWeight: "bold", borderTop: b, lineHeight: 1.15, padding: "2px 1px" })}>
              ÁREAS DE<br />CONHECIMENTO
            </td>

            {/* COMPONENTES CURRICULARES */}
            <td style={cs({ fontSize: "10pt", textAlign: "center", fontWeight: "bold", borderTop: b })}>
              COMPONENTES CURRICULARES
            </td>

            {/* Ano/Série */}
            <td style={cs({ fontSize: "7pt", textAlign: "center", borderTop: b, lineHeight: 1.15, padding: "1px" })}>
              <div>Ano</div>
              <div>Série</div>
            </td>

            {/* Year headers */}
            <td style={cs({ fontSize: "8pt", textAlign: "center", borderTop: b, lineHeight: 1.15, padding: "1px" })}>
              <div style={{ fontWeight: "bold" }}>{f.ano_1a_serie || "2017"}</div>
              <div style={{ fontWeight: "bold" }}>1ª</div>
            </td>
            <td style={cs({ fontSize: "8pt", textAlign: "center", borderTop: b, lineHeight: 1.15, padding: "1px" })}>
              <div style={{ fontWeight: "bold" }}>{f.ano_2a_serie || "2018"}</div>
              <div style={{ fontWeight: "bold" }}>2ª</div>
            </td>
            <td style={cs({ fontSize: "8pt", textAlign: "center", borderTop: b, lineHeight: 1.15, padding: "1px" })}>
              <div style={{ fontWeight: "bold" }}>{f.ano_3a_serie || "2019"}</div>
              <div style={{ fontWeight: "bold" }}>3ª</div>
            </td>

            {/* CARGA HORÁRIA */}
            <td style={cs({ fontSize: "7pt", textAlign: "center", fontWeight: "bold", borderTop: b, lineHeight: 1.15, padding: "1px" })}>
              CARGA<br />HORÁRIA
            </td>
          </tr>

          {/* ---- Linguagens (3 rows, NO separator before) ---- */}
          {/* Língua Portuguesa e Literatura */}
          <tr>
            <td rowSpan={3} style={cs({ textAlign: "center", fontSize: "8pt", lineHeight: 1.15, padding: "2px 2px" })}>
              Linguagens<br />Códigos e<br />suas<br />Tecnologias
            </td>
            <td style={cs({ padding: "1px 4px" })}>{grades[0].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[0].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[0].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[0].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[0].ch}</td>
          </tr>
          {/* Arte */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[1].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[1].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[1].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[1].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[1].ch}</td>
          </tr>
          {/* Educação Física */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[2].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[2].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[2].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[2].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[2].ch}</td>
          </tr>

          {/* ---- Ciências da Natureza (4 rows, NO blank separator) ---- */}
          {/* Matemática */}
          <tr>
            <td rowSpan={4} style={cs({ textAlign: "center", fontSize: "8pt", lineHeight: 1.15, padding: "2px 2px" })}>
              Ciências da<br />Natureza,<br />Matemática e<br />suas<br />Tecnologias
            </td>
            <td style={cs({ padding: "1px 4px" })}>{grades[3].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[3].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[3].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[3].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[3].ch}</td>
          </tr>
          {/* Biologia */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[4].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[4].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[4].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[4].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[4].ch}</td>
          </tr>
          {/* Física */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[5].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[5].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[5].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[5].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[5].ch}</td>
          </tr>
          {/* Química */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[6].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[6].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[6].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[6].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[6].ch}</td>
          </tr>

          {/* ---- Ciências Humanas (4 rows, NO blank separator) ---- */}
          {/* História */}
          <tr>
            <td rowSpan={4} style={cs({ textAlign: "center", fontSize: "8pt", lineHeight: 1.15, padding: "2px 2px" })}>
              Ciências<br />Humanas e<br />suas<br />Tecnologias
            </td>
            <td style={cs({ padding: "1px 4px" })}>{grades[7].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[7].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[7].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[7].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[7].ch}</td>
          </tr>
          {/* Geografia */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[8].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[8].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[8].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[8].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[8].ch}</td>
          </tr>
          {/* Filosofia */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[9].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[9].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[9].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[9].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[9].ch}</td>
          </tr>
          {/* Sociologia */}
          <tr>
            <td style={cs({ padding: "1px 4px" })}>{grades[10].disciplina}</td>
            <td style={cs({ textAlign: "center" })}>{grades[10].nota1}</td>
            <td style={cs({ textAlign: "center" })}>{grades[10].nota2}</td>
            <td style={cs({ textAlign: "center" })}>{grades[10].nota3}</td>
            <td style={cs({ textAlign: "center" })}>{grades[10].ch}</td>
          </tr>

          {/* Total de aulas anuais da Base Nacional Comum */}
          <tr>
            <td colSpan={2} style={cs({ fontSize: "10pt", padding: "1px 3px", fontStyle: "italic" })}>
              Total de aulas anuais da Base Nacional Comum
            </td>
            <td style={cs({})}></td>
            <td style={cs({})}></td>
            <td style={cs({})}></td>
            <td style={cs({})}></td>
          </tr>

          {/* TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM */}
          <tr style={{ background: "#d9d9d9" }}>
            <td colSpan={2} style={cs({ fontWeight: "bold", fontSize: "8pt", padding: "1px 3px" })}>
              TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM
            </td>
            <td style={cs({ textAlign: "center", fontWeight: "bold" })}>960</td>
            <td style={cs({ textAlign: "center", fontWeight: "bold" })}>960</td>
            <td style={cs({ textAlign: "center", fontWeight: "bold" })}>960</td>
            <td style={cs({ textAlign: "center", fontWeight: "bold" })}>{totalBNC > 0 ? totalBNC : "2880"}</td>
          </tr>

          {/* ========== PARTE DIVERSIFICADA ========== */}
          <tr>
            <td
              rowSpan={5}
              style={{
                borderRight: b,
                borderBottom: b,
                borderTop: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#bfbfbf",
              }}
            >
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vtStyle("5.5pt", true)}>PARTE<br />DIVERSIFICADA</div>
              </div>
            </td>
            <td colSpan={2} style={cs({ padding: "1px 4px", fontSize: "9pt" })}>
              Língua Estrangeira Moderna
            </td>
            <td colSpan={4} style={cs({})}></td>
          </tr>
          <tr>
            <td colSpan={6} style={cs({ padding: "1px 4px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_1 || "Língua Portuguesa e Literatura"} orig="Língua Portuguesa e Literatura" hl={hl} />
            </td>
          </tr>
          <tr>
            <td colSpan={6} style={cs({ padding: "1px 4px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_2 || ""} orig="" hl={hl} />
            </td>
          </tr>
          <tr>
            <td colSpan={6} style={cs({ padding: "1px 4px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_3 || ""} orig="" hl={hl} />
            </td>
          </tr>
          {/* Empty row end of Parte Diversificada */}
          <tr>
            <td colSpan={6} style={{ borderBottom: b, borderRight: b, height: "2px", padding: 0 }}></td>
          </tr>

          {/* ---- TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA ---- */}
          <tr>
            <td colSpan={3} style={cs({ fontWeight: "bold", fontSize: "8pt", padding: "1px 4px", borderTop: bThick })}>
              TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={4} style={cs({ borderTop: bThick })}></td>
          </tr>

          {/* ---- TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA ---- */}
          <tr>
            <td colSpan={3} style={cs({ fontWeight: "bold", fontSize: "8pt", padding: "1px 4px" })}>
              TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={4} style={cs({})}></td>
          </tr>

          {/* ---- Blank row ---- */}
          <tr>
            <td colSpan={7} style={{ borderBottom: bThick, height: "4px", padding: 0 }}></td>
          </tr>

          {/* ---- TOTAL DE CARGA HORÁRIA ANUAL DO CURSO ---- */}
          <tr>
            <td colSpan={3} style={cs({ fontWeight: "bold", fontSize: "8pt", padding: "2px 4px", borderTop: bThick, borderBottom: bThick })}>
              TOTAL DE CARGA HORÁRIA ANUAL DO CURSO
            </td>
            <td colSpan={4} style={cs({ borderTop: bThick, borderBottom: bThick })}></td>
          </tr>

          {/* ========== ESTUDOS REALIZADOS ========== */}
          {/* Header */}
          <tr>
            <td
              rowSpan={6}
              style={{
                borderRight: b,
                borderBottom: b,
                borderTop: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#d9d9d9",
              }}
            >
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vtStyle("5.5pt", true)}>ESTUDOS<br />REALIZADOS</div>
              </div>
            </td>
            <td style={cs({ padding: "1px 2px", fontSize: "7pt" })}></td>
            <td style={cs({ fontWeight: "bold", textAlign: "center", fontSize: "9pt" })}>Série</td>
            <td style={cs({ fontWeight: "bold", textAlign: "center", fontSize: "9pt" })}>Ano</td>
            <td colSpan={3} style={cs({ fontWeight: "bold", textAlign: "center", fontSize: "9pt" })}>
              Estabelecimento de Ensino
            </td>
            <td style={cs({ fontWeight: "bold", textAlign: "center", fontSize: "9pt" })}>Município</td>
            <td style={cs({ fontWeight: "bold", textAlign: "center", fontSize: "9pt" })}>UF</td>
          </tr>

          {/* Ensino Fundamental */}
          <tr>
            <td style={cs({ fontSize: "8pt", verticalAlign: "middle", lineHeight: 1.15, padding: "2px 2px" })}>
              Ensino<br />Fundamental
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.ano_fund_serie} orig="8ª Série" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.ano_fund} orig="2016" hl={hl} />
            </td>
            <td colSpan={3} style={cs({ padding: "1px 4px", fontSize: "8pt", whiteSpace: "nowrap" })}>
              <V val={f.escola_fund} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.municipio_fund} orig="Cacapava" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.uf_fund || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 1ª Série */}
          <tr>
            <td rowSpan={3} style={cs({ fontSize: "8pt", verticalAlign: "middle", lineHeight: 1.15, padding: "2px 2px" })}>
              Ensino<br />Médio
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>1ª Série</td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.ano_1a_serie} orig="2017" hl={hl} />
            </td>
            <td colSpan={3} style={cs({ padding: "1px 4px", fontSize: "8pt", whiteSpace: "nowrap" })}>
              <V val={f.escola_1a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.municipio_1a} orig="Cacapava" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.uf_1a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* 2ª Série */}
          <tr>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>2ª Série</td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.ano_2a_serie} orig="2018" hl={hl} />
            </td>
            <td colSpan={3} style={cs({ padding: "1px 4px", fontSize: "8pt", whiteSpace: "nowrap" })}>
              <V val={f.escola_2a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.municipio_2a} orig="Cacapava" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.uf_2a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* 3ª Série */}
          <tr>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>3ª Série</td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.ano_3a_serie} orig="2019" hl={hl} />
            </td>
            <td colSpan={3} style={cs({ padding: "1px 4px", fontSize: "8pt", whiteSpace: "nowrap" })}>
              <V val={f.escola_3a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.municipio_3a} orig="Cacapava" hl={hl} />
            </td>
            <td style={cs({ textAlign: "center", fontSize: "8pt" })}>
              <V val={f.uf_3a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ========== ESCALA DE AVALIAÇÃO ========== */}
      <div style={{
        borderLeft: bThick,
        borderRight: bThick,
        borderBottom: b,
        padding: "2px 4px",
        fontSize: "8pt",
        fontFamily: ff,
        lineHeight: 1.3,
      }}>
        <span>Escala de Avaliação: &quot;</span>
        <i>A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar</i>
        <br />
        <span>satisfatório, a nota igual ou superior a 05 (cinco) </span>
        <i><u>nos termos da Resolução SE - 61, de 24/9/2007.</u>&quot;</i>
      </div>

      {/* ========== OBSERVAÇÕES ========== */}
      <div style={{
        borderLeft: bThick,
        borderRight: bThick,
        borderBottom: b,
        padding: "2px 4px",
        fontSize: "8pt",
        fontFamily: ff,
        lineHeight: 1.4,
      }}>
        <b>OBSERVAÇÕES:</b>
        <div style={{ marginLeft: "16px", marginTop: "3px" }}>
          <span style={{ marginRight: "6px" }}>&#8226;</span>
          <b>CÓDIGO DE SEGURANÇA: <V val={f.codigo_seguranca} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ========== CERTIFICADO ========== */}
      <div style={{
        borderLeft: bThick,
        borderRight: bThick,
        borderBottom: bThick,
      }}>
        {/* Title */}
        <div style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "11pt",
          fontFamily: ff,
          letterSpacing: "3px",
          padding: "5px 0 3px 0",
          borderBottom: b,
          borderTop: bThick,
        }}>
          CERTIFICADO
        </div>

        {/* Certificate text */}
        <div style={{ padding: "4px 6px", fontSize: "10pt", fontFamily: ff, lineHeight: 1.35, textAlign: "justify" }}>
          <p style={{ margin: "0 0 2px 0" }}>
            O Diretor(a) da <b><V val={f.nome_escola?.replace("ESCOLA ESTADUAL ", "") || "E. E. Mª APDA. FRANÇA B. ARAUJO PROFª"} orig="E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} /></b>, CERTIFICA, nos termos do Inciso VII, Artigo 24
            da Lei Federal 9394/96, que <b><V val={f.nome_aluno} orig="Giovane Silva dos Santos" hl={hl} /></b>, concluiu o Ensino Médio nesta instituição. no ano de{" "}
            <V val={f.ano_conclusao} orig="2019" hl={hl} />.
          </p>
        </div>

        {/* Registration */}
        <div style={{ padding: "1px 6px 4px 6px", fontSize: "8pt", fontFamily: ff }}>
          <b>Número de registro da publicação</b> no Sistema GDAE (Resolução SE108/02): <b><V val={f.registro_gdae} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ========== ASSINATURAS ========== */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        borderLeft: bThick,
        borderRight: bThick,
        borderBottom: bThick,
      }}>
        <colgroup>
          <col style={{ width: "35%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "35%" }} />
        </colgroup>
        <tbody>
          <tr>
            {/* Gerente */}
            <td style={{
              borderRight: b,
              borderTop: b,
              padding: "4px 6px 4px 6px",
              textAlign: "center",
              fontSize: "8pt",
              fontFamily: ff,
              verticalAlign: "bottom",
              position: "relative",
            }}>
              <div style={{ position: "relative", minHeight: "40px" }}>
                <img
                  src={sigGerenteSrc}
                  alt=""
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "100px",
                    maxHeight: "50px",
                    opacity: 0.85,
                  }}
                  crossOrigin="anonymous"
                />
              </div>
              <div>Nome: <V val={f.gerente_nome} orig="MARISTELA GALVANI MACHADO" hl={hl} /></div>
              <div>R.G.: <V val={f.gerente_rg} orig="23.425.125-45" hl={hl} /></div>
              <div style={{ fontWeight: "bold", marginTop: "2px" }}>Gerente de Organização Escolar</div>
            </td>

            {/* LOCAL/DATA */}
            <td style={{
              borderRight: b,
              borderTop: b,
              padding: "4px 6px 4px 6px",
              textAlign: "center",
              fontSize: "8pt",
              fontFamily: ff,
              verticalAlign: "bottom",
            }}>
              <div style={{ marginBottom: "16px" }}>&nbsp;</div>
              <div style={{ marginBottom: "8px" }}>
                <V val={f.local_data} orig="Cacapava - SP, 04/12/2019" hl={hl} />
              </div>
              <div style={{ fontWeight: "bold" }}>LOCAL/DATA</div>
            </td>

            {/* Diretor */}
            <td style={{
              borderTop: b,
              padding: "4px 6px 4px 6px",
              textAlign: "center",
              fontSize: "8pt",
              fontFamily: ff,
              verticalAlign: "bottom",
              position: "relative",
            }}>
              <div style={{ position: "relative", minHeight: "40px" }}>
                <img
                  src={sigDiretorSrc}
                  alt=""
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "100px",
                    maxHeight: "50px",
                    opacity: 0.85,
                  }}
                  crossOrigin="anonymous"
                />
              </div>
              <div>Nome: <V val={f.diretor_nome} orig="ANGELA PEREIRA DOS SANTOS" hl={hl} /></div>
              <div>R.G.: <V val={f.diretor_rg} orig="13.068.721-63" hl={hl} /></div>
              <div style={{ fontWeight: "bold", marginTop: "2px" }}>Diretor de Escola</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
