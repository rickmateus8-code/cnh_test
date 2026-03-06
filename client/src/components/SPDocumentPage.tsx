/**
 * SPDocumentPage — Réplica pixel-perfect do Histórico Escolar SP
 * Baseado em análise avançada via pdfplumber do PDF original (Giovanne)
 *
 * Medidas extraídas:
 *   Página A4: 595.3 × 841.9 pts (210 × 297 mm)
 *   Margens: top 28pt, left 41pt, right 36pt, bottom 70pt
 *   Área útil: 519pt × 744pt
 *
 * Fontes: Arial-BoldMT (6/8/9/10/11/12/13pt), ArialMT (7/8/9/10pt), Arial-ItalicMT (8pt)
 */
import { BRASAO_SP_URL, SP_GRADES_DEFAULT, type SPGradeRow } from "@/lib/historicoSPData";

/* ---------- helpers ---------- */
interface Props {
  f: Record<string, string>;
  highlightModified?: boolean;
  grades?: SPGradeRow[];
  brasaoUrl?: string;
}

function V({ val, orig, hl }: { val: string; orig?: string; hl?: boolean }) {
  const mod = orig !== undefined && val !== orig;
  return (
    <span style={mod && hl ? { borderBottom: "2px solid #2d8c4e", backgroundColor: "rgba(45,140,78,0.08)", padding: "0 1px" } : {}}>
      {val}
    </span>
  );
}

/* ================================================================ */
export function SPPage1({ f, highlightModified, grades = SP_GRADES_DEFAULT, brasaoUrl }: Props) {
  const hl = highlightModified;
  const b = "0.7px solid #000";
  const logoSrc = brasaoUrl || BRASAO_SP_URL;

  const totalBNC = grades.reduce((s, g) => s + parseInt(g.ch || "0"), 0);

  /* Grade areas */
  const areaLinguagens = [0, 1, 2];   // Língua Port., Arte, Ed. Física
  const areaCiencias   = [3, 4, 5, 6]; // Mat, Bio, Fís, Quí
  const areaHumanas    = [7, 8, 9, 10]; // Hist, Geo, Fil, Soc

  /* Vertical text style */
  const vt = (fs = "6pt", bold = true, extra: React.CSSProperties = {}): React.CSSProperties => ({
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    fontSize: fs,
    fontWeight: bold ? "bold" : "normal",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    lineHeight: 1.1,
    textAlign: "center",
    fontFamily: "Arial, Helvetica, sans-serif",
    ...extra,
  });

  /* Render a grade row */
  const gradeRow = (idx: number, showArea: boolean, areaLabel: string, areaRowSpan: number) => {
    const g = grades[idx];
    return (
      <tr key={idx}>
        {showArea && (
          <td
            rowSpan={areaRowSpan}
            style={{
              border: b,
              padding: "1px 2px",
              fontSize: "6pt",
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: 1.15,
              fontFamily: "Arial, Helvetica, sans-serif",
            }}
          >
            {areaLabel.split("\n").map((l, i) => (
              <span key={i}>{l}{i < areaLabel.split("\n").length - 1 && <br />}</span>
            ))}
          </td>
        )}
        <td style={{ border: b, padding: "1px 4px", fontSize: "8pt", fontFamily: "Arial, Helvetica, sans-serif" }}>
          {g.disciplina}
        </td>
        <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif" }}>
          {g.nota1}
        </td>
        <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif" }}>
          {g.nota2}
        </td>
        <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif" }}>
          {g.nota3}
        </td>
        <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif" }}>
          {g.ch}
        </td>
      </tr>
    );
  };

  /* ================================================================
     RENDER
     ================================================================ */
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
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "9pt",
        lineHeight: 1.2,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
        padding: "7mm 11mm 6mm 13mm",
      }}
    >
      {/* ================================================================
          CABEÇALHO INSTITUCIONAL
          Outer border: (41,28)-(560,111) then continues
          ================================================================ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderTop: b,
          borderLeft: b,
          borderRight: b,
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "18.5%" }} /> {/* Brasão ~107pt/519pt */}
          <col />                            {/* Main text col A */}
          <col style={{ width: "25%" }} />   {/* Main text col B (Município/Email) */}
          <col style={{ width: "15%" }} />   {/* Nº / CEP / etc */}
        </colgroup>
        <tbody>
          {/* Row 1: Brasão (rowspan=7) + GOVERNO DO ESTADO */}
          <tr>
            <td
              rowSpan={7}
              style={{
                borderRight: b,
                borderBottom: b,
                padding: "4px",
                verticalAlign: "middle",
                textAlign: "center",
              }}
            >
              <img
                src={logoSrc}
                alt="Brasão SP"
                style={{ width: "72px", height: "auto", display: "block", margin: "0 auto" }}
                crossOrigin="anonymous"
              />
            </td>
            <td
              colSpan={3}
              style={{
                padding: "3px 6px 0 6px",
                fontSize: "13pt",
                fontWeight: "bold",
                borderBottom: b,
              }}
            >
              GOVERNO DO ESTADO DE SÃO PAULO
            </td>
          </tr>

          {/* Row 2: SECRETARIA */}
          <tr>
            <td
              colSpan={3}
              style={{
                padding: "1px 6px",
                fontSize: "10pt",
                fontWeight: "bold",
                borderBottom: b,
              }}
            >
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </td>
          </tr>

          {/* Row 3: ESCOLA */}
          <tr>
            <td
              colSpan={3}
              style={{
                padding: "1px 6px",
                fontSize: "10pt",
                fontWeight: "bold",
                borderBottom: b,
              }}
            >
              <V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} />
            </td>
          </tr>

          {/* Row 4: Ato Legal */}
          <tr>
            <td
              colSpan={3}
              style={{
                padding: "1px 6px",
                fontSize: "9pt",
                borderBottom: b,
              }}
            >
              Ato Legal de Criação: <V val={f.ato_legal} orig="906748" hl={hl} />
            </td>
          </tr>

          {/* Row 5: Endereço | Nº */}
          <tr>
            <td
              colSpan={2}
              style={{
                padding: "1px 6px",
                fontSize: "9pt",
                borderBottom: b,
              }}
            >
              Endereço: <V val={f.endereco_escola} orig="Av. Honorio Ferreira Pedrosa" hl={hl} />
            </td>
            <td
              style={{
                padding: "1px 4px",
                fontSize: "9pt",
                borderLeft: b,
                borderBottom: b,
              }}
            >
              Nº <V val={f.numero_escola} orig="611" hl={hl} />
            </td>
          </tr>

          {/* Row 6: Bairro | Município | CEP */}
          <tr>
            <td
              style={{
                padding: "1px 6px",
                fontSize: "9pt",
                borderBottom: b,
              }}
            >
              Bairro: <V val={f.bairro} orig="Pq Nova Cacapava" hl={hl} />
            </td>
            <td
              style={{
                padding: "1px 4px",
                fontSize: "9pt",
                borderLeft: b,
                borderBottom: b,
              }}
            >
              Município: <V val={f.municipio_escola} orig="Cacapava" hl={hl} />
            </td>
            <td
              style={{
                padding: "1px 4px",
                fontSize: "9pt",
                borderLeft: b,
                borderBottom: b,
              }}
            >
              CEP:<V val={f.cep_escola} orig="06411-160" hl={hl} />
            </td>
          </tr>

          {/* Row 7: Tel | Email */}
          <tr>
            <td
              style={{
                padding: "1px 6px",
                fontSize: "9pt",
                borderBottom: b,
              }}
            >
              Tel. <V val={f.telefone_escola} orig="(12) 36521267" hl={hl} />
            </td>
            <td
              colSpan={2}
              style={{
                padding: "1px 4px",
                fontSize: "8pt",
                borderLeft: b,
                borderBottom: b,
              }}
            >
              Endereço eletrônico: <V val={f.email_escola} orig="E906748A@EDUCACAO.SP.GOV.BR" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          TÍTULO — HISTÓRICO ESCOLAR – ENSINO MÉDIO
          Gray band: fill 0.898 = #E5E5E5
          ================================================================ */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12pt",
          padding: "5px 0",
          background: "#d0d0d0",
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
        }}
      >
        HISTÓRICO ESCOLAR – ENSINO MÉDIO
      </div>

      {/* ================================================================
          DADOS DO ALUNO
          ================================================================ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          borderLeft: b,
          borderRight: b,
        }}
      >
        <colgroup>
          <col style={{ width: "50%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "28%" }} />
        </colgroup>
        <tbody>
          {/* Nome | RG | RA */}
          <tr>
            <td style={{ borderBottom: b, borderRight: b, padding: "2px 6px", fontSize: "10pt" }}>
              <b>Nome do Aluno</b>: <V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} />
            </td>
            <td style={{ borderBottom: b, borderRight: b, padding: "2px 6px", fontSize: "10pt" }}>
              R.G.: <V val={f.rg} orig="555285753" hl={hl} />
            </td>
            <td style={{ borderBottom: b, padding: "2px 6px", fontSize: "10pt" }}>
              RA: <V val={f.ra} orig="26205579-0" hl={hl} />
            </td>
          </tr>
          {/* Nascimento | Estado | País */}
          <tr>
            <td style={{ borderBottom: b, borderRight: b, padding: "2px 6px", fontSize: "10pt", verticalAlign: "top" }}>
              <div><b>Nascimento</b></div>
              <div style={{ paddingLeft: "16px" }}>Município: <V val={f.municipio_nascimento} orig="Cacapava" hl={hl} /></div>
              <div style={{ paddingLeft: "16px" }}>Data: <V val={f.data_nascimento} orig="01/12/1999" hl={hl} /></div>
            </td>
            <td style={{ borderBottom: b, borderRight: b, padding: "2px 6px", fontSize: "10pt", verticalAlign: "top" }}>
              Estado: <V val={f.estado_nascimento} orig="SP" hl={hl} />
            </td>
            <td style={{ borderBottom: b, padding: "2px 6px", fontSize: "10pt", verticalAlign: "top" }}>
              País: <V val={f.pais} orig="BRASIL" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          TABELA PRINCIPAL DE NOTAS
          Proportions from PDF (pts): FundLegal=22, BNC=26, Areas=57, Disc=260, AnoSerie=38, Y1=18, Y2=26, Y3=30, CH=42
          Total inner = 519 - 22 = 497 (excl. Fundamento Legal)
          ================================================================ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
        }}
      >
        <colgroup>
          <col style={{ width: "3.8%" }} />   {/* Fundamento Legal */}
          <col style={{ width: "5.0%" }} />   {/* BNC/PD/ER vertical */}
          <col style={{ width: "11.0%" }} />  {/* Áreas de Conhecimento */}
          <col style={{ width: "48.0%" }} />  {/* Componentes Curriculares */}
          <col style={{ width: "7.5%" }} />   {/* Ano/Série */}
          <col style={{ width: "6.0%" }} />   {/* Ano 1 */}
          <col style={{ width: "6.0%" }} />   {/* Ano 2 */}
          <col style={{ width: "6.0%" }} />   {/* Ano 3 */}
          <col style={{ width: "6.7%" }} />   {/* Carga Horária */}
        </colgroup>

        <tbody>
          {/* ---- HEADER ROW: Áreas | Componentes | Ano/Série | Years | CH ---- */}
          <tr>
            {/* Fundamento Legal — spans ALL rows */}
            <td
              rowSpan={100}
              style={{
                borderRight: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={vt("6pt", false)}>
                  Fundamento Legal: Lei Federal 9394/96
                </div>
              </div>
            </td>

            {/* BASE NACIONAL COMUM — spans grade rows (header + 11 grades + total row + total BNC = ~15 rows) */}
            <td
              rowSpan={15}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#E6E6E6",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={vt("6pt", true)}>
                  BASE NACIONAL COMUM
                </div>
              </div>
            </td>

            {/* ÁREAS DE CONHECIMENTO header */}
            <td
              style={{
                border: b,
                padding: "2px 2px",
                fontSize: "6pt",
                fontWeight: "bold",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              ÁREAS DE<br />CONHECIMENTO
            </td>

            {/* COMPONENTES CURRICULARES header */}
            <td
              style={{
                border: b,
                padding: "2px 4px",
                fontSize: "10pt",
                fontWeight: "bold",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              COMPONENTES CURRICULARES
            </td>

            {/* Ano/Série header */}
            <td
              style={{
                border: b,
                padding: "1px",
                fontSize: "7pt",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              Ano<br />Série
            </td>

            {/* Year 1 header */}
            <td
              style={{
                border: b,
                padding: "1px",
                fontSize: "8pt",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              <div style={{ fontWeight: "bold" }}>{f.ano_1a_serie || "2017"}</div>
              <div style={{ fontWeight: "bold", fontSize: "9pt" }}>1ª</div>
            </td>

            {/* Year 2 header */}
            <td
              style={{
                border: b,
                padding: "1px",
                fontSize: "8pt",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              <div style={{ fontWeight: "bold" }}>{f.ano_2a_serie || "2018"}</div>
              <div style={{ fontWeight: "bold", fontSize: "9pt" }}>2ª</div>
            </td>

            {/* Year 3 header */}
            <td
              style={{
                border: b,
                padding: "1px",
                fontSize: "8pt",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              <div style={{ fontWeight: "bold" }}>{f.ano_3a_serie || "2019"}</div>
              <div style={{ fontWeight: "bold", fontSize: "9pt" }}>3ª</div>
            </td>

            {/* CARGA HORÁRIA header */}
            <td
              style={{
                border: b,
                padding: "1px",
                fontSize: "7pt",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: 1.15,
              }}
            >
              CARGA<br />HORÁRIA
            </td>
          </tr>

          {/* ---- GRADE ROWS: Linguagens ---- */}
          {areaLinguagens.map((idx, i) =>
            gradeRow(idx, i === 0, "Linguagens\nCódigos e\nsuas\nTecnologias", areaLinguagens.length)
          )}

          {/* ---- Blank separator row ---- */}
          <tr>
            <td colSpan={7} style={{ borderLeft: b, borderRight: b, height: "3px", padding: 0 }}></td>
          </tr>

          {/* ---- GRADE ROWS: Ciências da Natureza ---- */}
          {areaCiencias.map((idx, i) =>
            gradeRow(idx, i === 0, "Ciências da\nNatureza,\nMatemática e\nsuas\nTecnologias", areaCiencias.length)
          )}

          {/* ---- Blank separator row ---- */}
          <tr>
            <td colSpan={7} style={{ borderLeft: b, borderRight: b, height: "3px", padding: 0 }}></td>
          </tr>

          {/* ---- GRADE ROWS: Ciências Humanas ---- */}
          {areaHumanas.map((idx, i) =>
            gradeRow(idx, i === 0, "Ciências\nHumanas e\nsuas\nTecnologias", areaHumanas.length)
          )}

          {/* ---- Total de aulas anuais da Base Nacional Comum ---- */}
          <tr>
            <td
              colSpan={2}
              style={{
                borderTop: b,
                borderBottom: b,
                borderRight: b,
                padding: "1px 4px",
                fontSize: "8pt",
              }}
            >
              Total de aulas anuais da Base Nacional Comum
            </td>
            <td colSpan={5} style={{ borderTop: b, borderBottom: b }}></td>
          </tr>

          {/* ---- TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM ---- */}
          <tr style={{ background: "#E5E5E5" }}>
            <td
              colSpan={2}
              style={{
                border: b,
                padding: "1px 4px",
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM
            </td>
            <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontWeight: "bold" }}>960</td>
            <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontWeight: "bold" }}>960</td>
            <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontWeight: "bold" }}>960</td>
            <td style={{ border: b, padding: "1px", fontSize: "8pt", textAlign: "center", fontWeight: "bold" }}>
              {totalBNC > 0 ? totalBNC.toLocaleString("pt-BR") : "2.880"}
            </td>
          </tr>

          {/* ================================================================
              PARTE DIVERSIFICADA
              Background: fill 0.749 = #BFBFBF (darker gray)
              ================================================================ */}
          <tr>
            <td
              rowSpan={5}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#BFBFBF",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={vt("5pt", true)}>
                  PARTE<br />DIVERSIFICADA
                </div>
              </div>
            </td>
            <td colSpan={2} style={{ border: b, padding: "1px 4px", fontSize: "8pt" }}>
              Língua Estrangeira Moderna
            </td>
            <td colSpan={4} style={{ border: b }}></td>
          </tr>
          <tr>
            <td colSpan={6} style={{ borderBottom: b, borderRight: b, padding: "1px 4px", fontSize: "8pt" }}>
              Disciplina de Apoio Curricular: Língua Portuguesa e Literatura
            </td>
          </tr>
          <tr>
            <td colSpan={6} style={{ borderBottom: b, borderRight: b, padding: "1px 4px", fontSize: "8pt" }}>
              Disciplina de Apoio Curricular:
            </td>
          </tr>
          <tr>
            <td colSpan={6} style={{ borderBottom: b, borderRight: b, padding: "1px 4px", fontSize: "8pt" }}>
              Disciplina de Apoio Curricular:
            </td>
          </tr>
          {/* Empty row for spacing */}
          <tr>
            <td colSpan={6} style={{ borderBottom: b, borderRight: b, height: "2px", padding: 0 }}></td>
          </tr>

          {/* ---- TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA ---- */}
          <tr>
            <td
              colSpan={3}
              style={{
                borderBottom: b,
                borderRight: b,
                padding: "1px 4px",
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={4} style={{ borderBottom: b, borderRight: b }}></td>
          </tr>

          {/* ---- TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA ---- */}
          <tr>
            <td
              colSpan={3}
              style={{
                borderBottom: b,
                borderRight: b,
                padding: "1px 4px",
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={4} style={{ borderBottom: b, borderRight: b }}></td>
          </tr>

          {/* ---- Blank row ---- */}
          <tr>
            <td colSpan={7} style={{ borderBottom: b, borderRight: b, height: "3px", padding: 0 }}></td>
          </tr>

          {/* ---- TOTAL DE CARGA HORÁRIA ANUAL DO CURSO ---- */}
          <tr>
            <td
              colSpan={3}
              style={{
                borderBottom: b,
                borderRight: b,
                padding: "1px 4px",
                fontSize: "8pt",
                fontWeight: "bold",
              }}
            >
              TOTAL DE CARGA HORÁRIA ANUAL DO CURSO
            </td>
            <td colSpan={4} style={{ borderBottom: b, borderRight: b }}></td>
          </tr>

          {/* ================================================================
              ESTUDOS REALIZADOS
              Background: fill 0.878 = #E0E0E0
              ================================================================ */}
          {/* Header row */}
          <tr>
            <td
              rowSpan={6}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                position: "relative",
                background: "#E0E0E0",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={vt("5.5pt", true)}>
                  ESTUDOS<br />REALIZADOS
                </div>
              </div>
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "7pt" }}></td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", fontWeight: "bold", textAlign: "center" }}>Série</td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", fontWeight: "bold", textAlign: "center" }}>Ano</td>
            <td colSpan={3} style={{ border: b, padding: "1px 2px", fontSize: "8pt", fontWeight: "bold", textAlign: "center" }}>
              Estabelecimento de Ensino
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", fontWeight: "bold", textAlign: "center" }}>Município</td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", fontWeight: "bold", textAlign: "center" }}>UF</td>
          </tr>

          {/* Ensino Fundamental */}
          <tr>
            <td style={{ border: b, padding: "2px 2px", fontSize: "7pt", verticalAlign: "middle", lineHeight: 1.15 }}>
              Ensino<br />Fundamental
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.ano_fund_serie} orig="8ª Série" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.ano_fund} orig="2016" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "1px 4px", fontSize: "8pt" }}>
              <V val={f.escola_fund} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.municipio_fund} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.uf_fund || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Separator band between Fundamental and Médio */}
          <tr style={{ background: "#E0E0E0" }}>
            <td colSpan={7} style={{ borderBottom: b, borderRight: b, height: "3px", padding: 0 }}></td>
          </tr>

          {/* Ensino Médio — 1ª Série */}
          <tr>
            <td rowSpan={3} style={{ border: b, padding: "2px 2px", fontSize: "7pt", verticalAlign: "middle", lineHeight: 1.15 }}>
              Ensino<br />Médio
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>1ª Série</td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.ano_1a_serie} orig="2017" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "1px 4px", fontSize: "8pt" }}>
              <V val={f.escola_1a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.municipio_1a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.uf_1a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 2ª Série */}
          <tr>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>2ª Série</td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.ano_2a_serie} orig="2018" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "1px 4px", fontSize: "8pt" }}>
              <V val={f.escola_2a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.municipio_2a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.uf_2a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 3ª Série */}
          <tr>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>3ª Série</td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.ano_3a_serie} orig="2019" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "1px 4px", fontSize: "8pt" }}>
              <V val={f.escola_3a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.municipio_3a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "1px 2px", fontSize: "8pt", textAlign: "center" }}>
              <V val={f.uf_3a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          ESCALA DE AVALIAÇÃO + OBSERVAÇÕES
          ================================================================ */}
      <div
        style={{
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
          padding: "3px 6px",
          fontSize: "8pt",
          lineHeight: 1.3,
        }}
      >
        <div>
          Escala de Avaliação: &quot;<i>A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar</i>
        </div>
        <div>
          satisfatório, a nota igual ou superior a 05 (cinco) <i><u>nos termos da Resolução SE - 61, de 24/9/2007.</u>&quot;</i>
        </div>
      </div>

      <div
        style={{
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
          padding: "3px 6px",
          fontSize: "8pt",
          lineHeight: 1.3,
        }}
      >
        <b>OBSERVAÇÕES:</b>
        <div style={{ marginLeft: "16px", marginTop: "2px" }}>
          <span style={{ marginRight: "6px" }}>&#8226;</span>
          <b>CÓDIGO DE SEGURANÇA: <V val={f.codigo_seguranca} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ================================================================
          CERTIFICADO
          Gray band at top: fill 0.902 = #E6E6E6
          ================================================================ */}
      <div
        style={{
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
        }}
      >
        {/* Gray separator band */}
        <div style={{ background: "#E6E6E6", height: "4px", borderBottom: b }}></div>

        {/* CERTIFICADO title */}
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "11pt",
            letterSpacing: "3px",
            padding: "4px 0",
            borderBottom: b,
          }}
        >
          CERTIFICADO
        </div>

        {/* Certificate text */}
        <div style={{ padding: "4px 6px", fontSize: "10pt", lineHeight: 1.35, textAlign: "justify" }}>
          <p style={{ margin: "0 0 2px 0" }}>
            O Diretor(a) da <b>ESCOLA ESTADUAL <V val={f.nome_escola?.replace("ESCOLA ESTADUAL ", "") || "E. E. Mª APDA. FRANÇA B. ARAUJO PROFª"} orig="E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} /></b>, CERTIFICA, nos termos do Inciso VII, Artigo 24
            da Lei Federal 9394/96, que <b><V val={f.nome_aluno} orig="Giovane Silva dos Santos" hl={hl} /></b>, concluiu o Ensino Médio nesta instituição. no ano de{" "}
            <V val={f.ano_conclusao} orig="2019" hl={hl} />.
          </p>
        </div>

        {/* Registration */}
        <div style={{ padding: "2px 6px 4px 6px", fontSize: "8pt" }}>
          <b>Número de registro da publicação</b> no Sistema GDAE (Resolução SE108/02): <b><V val={f.registro_gdae} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ================================================================
          ASSINATURAS — 3 colunas com bordas
          ================================================================ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          borderLeft: b,
          borderRight: b,
          borderBottom: b,
        }}
      >
        <colgroup>
          <col style={{ width: "35%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "35%" }} />
        </colgroup>
        <tbody>
          <tr>
            {/* Gerente de Organização Escolar */}
            <td
              style={{
                borderRight: b,
                borderTop: b,
                padding: "8px 6px 4px 6px",
                textAlign: "center",
                fontSize: "8pt",
                verticalAlign: "bottom",
              }}
            >
              <div>Nome: <V val={f.gerente_nome} orig="MARISTELA GALVANI MACHADO" hl={hl} /></div>
              <div>R.G.: <V val={f.gerente_rg} orig="23.425.125-45" hl={hl} /></div>
              <div style={{ fontWeight: "bold", marginTop: "2px" }}>Gerente de Organização Escolar</div>
            </td>

            {/* LOCAL/DATA */}
            <td
              style={{
                borderRight: b,
                borderTop: b,
                padding: "8px 6px 4px 6px",
                textAlign: "center",
                fontSize: "8pt",
                verticalAlign: "bottom",
              }}
            >
              <div style={{ textDecoration: "underline", marginBottom: "8px" }}>
                <V val={f.local_data} orig="Cacapava - SP, 04/12/2019" hl={hl} />
              </div>
              <div style={{ fontWeight: "bold" }}>LOCAL/DATA</div>
            </td>

            {/* Diretor de Escola */}
            <td
              style={{
                borderTop: b,
                padding: "8px 6px 4px 6px",
                textAlign: "center",
                fontSize: "8pt",
                verticalAlign: "bottom",
              }}
            >
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
