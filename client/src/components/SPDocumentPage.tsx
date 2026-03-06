/**
 * SPDocumentPage — Réplica pixel-perfect do Histórico Escolar SP
 * Medidas extraídas via pdfplumber do PDF original (Giovanne)
 * Página A4: 210mm × 297mm | Fontes: Arial
 *
 * v4 — Correções baseadas em capturas de alta resolução:
 * - Linhas em branco entre grupos de disciplinas (Linguagens→Ciências Nat, Ciências Nat→Humanas)
 * - Estudos Realizados: sub-tabela com colunas próprias (Série 7.9%, Ano 6.1%, Estab 44.4%, Munic 15.1%, UF 8.3%)
 * - Dados do aluno: células vazias na linha de Data (Estado/País)
 * - Assinaturas: maiores, sobrepostas ao texto Nome:, posição conforme PDF
 */
import { SP_GRADES_DEFAULT, type SPGradeRow } from "@/lib/historicoSPData";
import { BRASAO_SP_B64, SIG_GERENTE_B64, SIG_DIRETOR_B64 } from "@/lib/spAssets";

interface Props {
  f: Record<string, string>;
  highlightModified?: boolean;
  grades?: SPGradeRow[];
  brasaoUrl?: string;
  assinaturaGerenteUrl?: string;
  assinaturaDiretorUrl?: string;
}

/* Highlight helper */
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
  const b = "0.7px solid #000";
  const bT = "1.2px solid #000";
  const ff = "Arial, Helvetica, sans-serif";
  const logoSrc = brasaoUrl || BRASAO_SP_B64;
  const sigGerente = assinaturaGerenteUrl || SIG_GERENTE_B64;
  const sigDiretor = assinaturaDiretorUrl || SIG_DIRETOR_B64;

  /* Vertical text style */
  const vt = (fs = "6pt", bold = true): React.CSSProperties => ({
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

  /* Grade row areas mapping — includes blank separator rows */
  /* Grades array: 0=LingPort, 1=Arte, 2=EdFisica, 3=Mat, 4=Bio, 5=Fis, 6=Quim, 7=Hist, 8=Geo, 9=Filo, 10=Socio */
  const areas = [
    { label: "Linguagens\nCódigos e\nsuas\nTecnologias", rows: [0, 1, 2] },
    { label: "Ciências da\nNatureza,\nMatemática e\nsuas\nTecnologias", rows: [3, 4, 5, 6] },
    { label: "Ciências\nHumanas e\nsuas\nTecnologias", rows: [7, 8, 9, 10] },
  ];

  /* Indices where a blank separator row should appear BEFORE the discipline */
  const blankRowBefore = new Set([3, 7]); /* Before Matemática (idx 3), Before História (idx 7) */

  /* Cell style helpers */
  const cellS = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    border: b, fontFamily: ff, padding: "0 2px", ...extra,
  });
  const centerS = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    ...cellS(extra), textAlign: "center",
  });

  /* Dynamic font size for school name */
  const escolaLen = (f.nome_escola || "").length;
  const escolaFontSize = escolaLen > 60 ? "8.5pt" : escolaLen > 50 ? "9pt" : "10pt";

  /* Build grade rows with blank separators */
  const gradeRows: React.ReactNode[] = [];
  grades.forEach((g, i) => {
    /* Insert blank row before groups 2 and 3 */
    if (blankRowBefore.has(i)) {
      gradeRows.push(
        <tr key={`blank-${i}`}>
          {/* No area cell — the area rowSpan from previous group ended, new area starts next */}
          <td colSpan={2} style={cellS({ padding: "0", height: "2px", borderLeft: b, borderRight: b })}></td>
          <td style={cellS({ padding: "0", height: "2px" })}></td>
          <td style={cellS({ padding: "0", height: "2px" })}></td>
          <td style={cellS({ padding: "0", height: "2px" })}></td>
          <td style={cellS({ padding: "0", height: "2px" })}></td>
          <td style={cellS({ padding: "0", height: "2px" })}></td>
        </tr>
      );
    }

    const area = areas.find((a) => a.rows.includes(i));
    const isFirstInArea = area && area.rows[0] === i;

    gradeRows.push(
      <tr key={i}>
        {isFirstInArea && (
          <td
            rowSpan={area!.rows.length}
            style={centerS({
              padding: "1px 1px", fontSize: "6pt",
              verticalAlign: "middle", lineHeight: 1.15,
            })}
          >
            {area!.label.split("\n").map((line, li) => (
              <span key={li}>{line}{li < area!.label.split("\n").length - 1 && <br />}</span>
            ))}
          </td>
        )}
        <td style={cellS({ padding: "0.5px 3px", fontSize: "10pt" })}>
          {g.disciplina}
        </td>
        <td style={centerS({ fontSize: "10pt", padding: "0.5px 0" })}></td>
        <td style={centerS({ fontSize: "10pt", padding: "0.5px 0" })}>{g.nota1}</td>
        <td style={centerS({ fontSize: "10pt", padding: "0.5px 0" })}>{g.nota2}</td>
        <td style={centerS({ fontSize: "10pt", padding: "0.5px 0" })}>{g.nota3}</td>
        <td style={centerS({ fontSize: "10pt", padding: "0.5px 0" })}>{g.ch}</td>
      </tr>
    );
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
        lineHeight: 1.2,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
        padding: "9.9mm 12.7mm 12mm 14.5mm",
      }}
    >
      {/* ═══════════════════ CABEÇALHO INSTITUCIONAL ═══════════════════ */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: bT, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "20.8%" }} />
          <col style={{ width: "79.2%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td rowSpan={7} style={{
              borderRight: b, padding: "4px", verticalAlign: "middle", textAlign: "center",
            }}>
              <img src={logoSrc} alt="" style={{ width: "68px", height: "auto", display: "block", margin: "0 auto" }} crossOrigin="anonymous" />
            </td>
            <td style={{ padding: "3px 6px 0 6px", fontSize: "14pt", fontWeight: "bold", fontFamily: ff, lineHeight: 1.15 }}>
              GOVERNO DO ESTADO DE SÃO PAULO
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0 6px", fontSize: "10pt", fontWeight: "bold", fontFamily: ff, lineHeight: 1.3 }}>
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </td>
          </tr>
          <tr>
            <td style={{
              padding: "0 6px 1px 6px", fontSize: escolaFontSize, fontWeight: "bold", fontFamily: ff,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3,
            }}>
              <V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} />
            </td>
          </tr>
          <tr>
            <td style={{ padding: "1px 6px", fontSize: "9pt", fontFamily: ff, borderTop: b }}>
              Ato Legal de Criação: <V val={f.ato_legal} orig="906748" hl={hl} />
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0, borderTop: b }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup><col style={{ width: "75%" }} /><col style={{ width: "25%" }} /></colgroup>
                <tbody><tr>
                  <td style={{ padding: "1px 6px", fontSize: "9pt", fontFamily: ff }}>
                    Endereço: <V val={f.endereco_escola} orig="Av. Honorio Ferreira Pedrosa" hl={hl} />
                  </td>
                  <td style={{ padding: "1px 6px", fontSize: "9pt", fontFamily: ff, borderLeft: b, textAlign: "right" }}>
                    Nº <V val={f.numero_escola} orig="611" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0, borderTop: b }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup><col style={{ width: "33%" }} /><col style={{ width: "40%" }} /><col style={{ width: "27%" }} /></colgroup>
                <tbody><tr>
                  <td style={{ padding: "1px 6px", fontSize: "9pt", fontFamily: ff }}>
                    Bairro: <V val={f.bairro} orig="Pq Nova Cacapava" hl={hl} />
                  </td>
                  <td style={{ padding: "1px 4px", fontSize: "9pt", fontFamily: ff, borderLeft: b }}>
                    Município: <V val={f.municipio_escola} orig="Cacapava" hl={hl} />
                  </td>
                  <td style={{ padding: "1px 4px", fontSize: "9pt", fontFamily: ff, borderLeft: b }}>
                    CEP:<V val={f.cep_escola} orig="06411-160" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0, borderTop: b }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup><col style={{ width: "33%" }} /><col style={{ width: "67%" }} /></colgroup>
                <tbody><tr>
                  <td style={{ padding: "1px 6px", fontSize: "9pt", fontFamily: ff }}>
                    Tel. <V val={f.telefone_escola} orig="(12) 36521267" hl={hl} />
                  </td>
                  <td style={{ padding: "1px 4px", fontSize: "9pt", fontFamily: ff, borderLeft: b }}>
                    <span style={{ fontSize: "8pt" }}>Endereço eletrônico</span>:&nbsp;&nbsp;<V val={f.email_escola} orig="E906748A@EDUCACAO.SP.GOV.BR" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══════════════════ TÍTULO ═══════════════════ */}
      <div style={{
        textAlign: "center", fontWeight: "bold", fontSize: "12pt", fontFamily: ff,
        padding: "4px 0", background: "#c8c8c8",
        borderLeft: bT, borderRight: bT, borderBottom: bT, letterSpacing: "0.5px",
      }}>
        HISTÓRICO ESCOLAR – ENSINO MÉDIO
      </div>

      {/* ═══════════════════ DADOS DO ALUNO ═══════════════════ */}
      <table style={{ width: "100%", borderCollapse: "collapse", borderLeft: bT, borderRight: bT, borderBottom: b, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "15%" }} />
          <col style={{ width: "44.4%" }} />
          <col style={{ width: "21.8%" }} />
          <col style={{ width: "18.8%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td colSpan={2} style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              <b>Nome do Aluno</b>: <V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} />
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              R.G.: <V val={f.rg} orig="555285753" hl={hl} />
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              RA: <V val={f.ra} orig="26205579-0" hl={hl} />
            </td>
          </tr>
          <tr>
            <td rowSpan={2} style={cellS({
              padding: "2px 4px", fontSize: "10pt", fontWeight: "bold",
              verticalAlign: "middle", textAlign: "center",
            })}>
              Nascimento
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              Município: <V val={f.municipio_nascimento} orig="Cacapava" hl={hl} />
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              Estado: <V val={f.estado_nascimento} orig="SP" hl={hl} />
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt", verticalAlign: "middle", textAlign: "center" })}>
              País: <V val={f.pais} orig="BRASIL" hl={hl} />
            </td>
          </tr>
          <tr>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}>
              Data: <V val={f.data_nascimento} orig="01/12/1999" hl={hl} />
            </td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}></td>
            <td style={cellS({ padding: "2px 4px", fontSize: "10pt" })}></td>
          </tr>
        </tbody>
      </table>

      {/* Spacer */}
      <div style={{ height: "2mm" }} />

      {/* ═══════════════════ TABELA DE NOTAS ═══════════════════ */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: bT, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "4.3%" }} />
          <col style={{ width: "5.0%" }} />
          <col style={{ width: "10.9%" }} />
          <col style={{ width: "43.0%" }} />
          <col style={{ width: "7.2%" }} />
          <col style={{ width: "7.2%" }} />
          <col style={{ width: "7.2%" }} />
          <col style={{ width: "7.3%" }} />
          <col style={{ width: "7.9%" }} />
        </colgroup>
        <tbody>
          {/* ── Header row ── */}
          <tr>
            <td rowSpan={100} style={{
              borderRight: b, verticalAlign: "middle", textAlign: "center",
              padding: 0, position: "relative",
            }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vt("6pt", false)}>Fundamento Legal: Lei Federal 9394/96</div>
              </div>
            </td>

            <td rowSpan={16} style={{
              borderRight: b, borderBottom: b,
              verticalAlign: "middle", textAlign: "center",
              padding: 0, position: "relative",
            }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vt("6pt", true)}>BASE NACIONAL COMUM</div>
              </div>
            </td>

            <td style={centerS({ padding: "2px 1px", fontSize: "6pt", fontWeight: "bold", lineHeight: 1.2 })}>
              ÁREAS DE<br />CONHECIMENTO
            </td>
            <td style={centerS({ padding: "2px 2px", fontSize: "10pt", fontWeight: "bold" })}>
              COMPONENTES CURRICULARES
            </td>
            <td style={centerS({ padding: "2px 0", fontSize: "10pt", lineHeight: 1.2 })}>
              Ano<br />Série
            </td>
            <td style={centerS({ padding: "1px 0", fontSize: "8pt", lineHeight: 1.3 })}>
              <V val={f.ano_1a_serie} orig="2017" hl={hl} /><br />
              <span style={{ fontWeight: "bold", fontSize: "9pt" }}>1ª</span>
            </td>
            <td style={centerS({ padding: "1px 0", fontSize: "8pt", lineHeight: 1.3 })}>
              <V val={f.ano_2a_serie} orig="2018" hl={hl} /><br />
              <span style={{ fontWeight: "bold", fontSize: "9pt" }}>2ª</span>
            </td>
            <td style={centerS({ padding: "1px 0", fontSize: "8pt", lineHeight: 1.3 })}>
              <V val={f.ano_3a_serie} orig="2019" hl={hl} /><br />
              <span style={{ fontWeight: "bold", fontSize: "9pt" }}>3ª</span>
            </td>
            <td style={centerS({ padding: "1px 0", fontSize: "6pt", fontWeight: "bold", lineHeight: 1.2 })}>
              CARGA<br />HORÁRIA
            </td>
          </tr>

          {/* ── Grade rows with blank separators ── */}
          {gradeRows}

          {/* ── Total de aulas anuais ── */}
          <tr>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "8pt" })}>
              Total de aulas anuais da Base Nacional Comum
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
          </tr>

          {/* ── TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM ── */}
          <tr>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "8pt", fontWeight: "bold" })}>
              TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={centerS({ fontSize: "10pt", fontWeight: "bold", padding: "0.5px 0" })}>960</td>
            <td style={centerS({ fontSize: "10pt", fontWeight: "bold", padding: "0.5px 0" })}>960</td>
            <td style={centerS({ fontSize: "10pt", fontWeight: "bold", padding: "0.5px 0" })}>960</td>
            <td style={centerS({ fontSize: "10pt", fontWeight: "bold", padding: "0.5px 0" })}>2880</td>
          </tr>

          {/* ═══ PARTE DIVERSIFICADA ═══ */}
          <tr>
            <td rowSpan={5} style={{
              borderRight: b, borderBottom: b,
              verticalAlign: "middle", textAlign: "center",
              padding: 0, position: "relative",
            }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vt("5.5pt", true)}>
                  <span>PARTE</span><br /><span>DIVERSIFICADA</span>
                </div>
              </div>
            </td>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "9pt" })}>
              Língua Estrangeira Moderna
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
          </tr>
          <tr>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_1} orig="Língua Portuguesa e Literatura" hl={hl} />
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
          </tr>
          <tr>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_2 || ""} orig="" hl={hl} />
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
          </tr>
          <tr>
            <td colSpan={2} style={cellS({ padding: "0.5px 3px", fontSize: "9pt" })}>
              Disciplina de Apoio Curricular:
            </td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
            <td style={cellS({ padding: "0.5px 0" })}></td>
          </tr>
          <tr>
            <td colSpan={7} style={cellS({ padding: "1px 3px", fontSize: "8pt", fontWeight: "bold", lineHeight: 1.4 })}>
              <div>TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA</div>
              <div>TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA</div>
            </td>
          </tr>

          {/* ── TOTAL DE CARGA HORÁRIA ANUAL DO CURSO ── */}
          <tr>
            <td colSpan={7} style={cellS({
              padding: "2px 3px", fontSize: "8pt", fontWeight: "bold", borderBottom: bT,
            })}>
              TOTAL DE CARGA HORÁRIA ANUAL DO CURSO
            </td>
          </tr>

          {/* ═══ ESTUDOS REALIZADOS ═══ */}
          {/* Uses sub-table inside colspan=7 to get correct column proportions */}
          {/* PDF measurements: Ensino 13%, Série 7.9%, Ano 6.1%, Estab 44.4%, Munic 15.1%, UF 8.3% */}
          <tr>
            <td rowSpan={6} style={{
              borderRight: b, borderBottom: bT,
              verticalAlign: "middle", textAlign: "center",
              padding: 0, position: "relative",
            }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <div style={vt("5.5pt", true)}>
                  <span>ESTUDOS</span><br /><span>REALIZADOS</span>
                </div>
              </div>
            </td>
            {/* Sub-table header row */}
            <td colSpan={7} style={{ border: b, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13.8%" }} />
                  <col style={{ width: "8.4%" }} />
                  <col style={{ width: "6.4%" }} />
                  <col style={{ width: "46.8%" }} />
                  <col style={{ width: "15.9%" }} />
                  <col style={{ width: "8.7%" }} />
                </colgroup>
                <tbody><tr>
                  <td style={cellS({ padding: "1px 2px", fontSize: "7pt", borderLeft: "none", borderTop: "none", borderBottom: "none" })}></td>
                  <td style={centerS({ fontWeight: "bold", fontSize: "8pt", padding: "1px 1px", borderTop: "none", borderBottom: "none" })}>Série</td>
                  <td style={centerS({ fontWeight: "bold", fontSize: "8pt", padding: "1px 1px", borderTop: "none", borderBottom: "none" })}>Ano</td>
                  <td style={centerS({ fontWeight: "bold", fontSize: "8pt", padding: "1px 1px", borderTop: "none", borderBottom: "none" })}>Estabelecimento de Ensino</td>
                  <td style={centerS({ fontWeight: "bold", fontSize: "8pt", padding: "1px 1px", borderTop: "none", borderBottom: "none" })}>Município</td>
                  <td style={centerS({ fontWeight: "bold", fontSize: "8pt", padding: "1px 1px", borderTop: "none", borderRight: "none", borderBottom: "none" })}>UF</td>
                </tr></tbody>
              </table>
            </td>
          </tr>

          {/* Ensino Fundamental */}
          <tr>
            <td colSpan={7} style={{ border: b, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13.8%" }} />
                  <col style={{ width: "8.4%" }} />
                  <col style={{ width: "6.4%" }} />
                  <col style={{ width: "46.8%" }} />
                  <col style={{ width: "15.9%" }} />
                  <col style={{ width: "8.7%" }} />
                </colgroup>
                <tbody><tr>
                  <td style={cellS({ fontSize: "7pt", verticalAlign: "middle", lineHeight: 1.15, padding: "1px 2px", borderLeft: "none", borderTop: "none", borderBottom: "none" })}>
                    Ensino<br />Fundamental
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.ano_fund_serie} orig="8ª Série" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.ano_fund} orig="2016" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 3px", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.escola_fund} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.municipio_fund} orig="Cacapava" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderRight: "none", borderBottom: "none" })}>
                    <V val={f.uf_fund || "SP"} orig="SP" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>

          {/* Ensino Médio — 1ª Série */}
          <tr>
            <td colSpan={7} style={{ border: b, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13.8%" }} />
                  <col style={{ width: "8.4%" }} />
                  <col style={{ width: "6.4%" }} />
                  <col style={{ width: "46.8%" }} />
                  <col style={{ width: "15.9%" }} />
                  <col style={{ width: "8.7%" }} />
                </colgroup>
                <tbody><tr>
                  <td rowSpan={1} style={cellS({ fontSize: "7pt", verticalAlign: "middle", lineHeight: 1.15, padding: "1px 2px", borderLeft: "none", borderTop: "none", borderBottom: "none" })}>
                    Ensino<br />Médio
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>1ª Série</td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.ano_1a_serie} orig="2017" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 3px", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.escola_1a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.municipio_1a} orig="Cacapava" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderRight: "none", borderBottom: "none" })}>
                    <V val={f.uf_1a || "SP"} orig="SP" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>

          {/* 2ª Série */}
          <tr>
            <td colSpan={7} style={{ border: b, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13.8%" }} />
                  <col style={{ width: "8.4%" }} />
                  <col style={{ width: "6.4%" }} />
                  <col style={{ width: "46.8%" }} />
                  <col style={{ width: "15.9%" }} />
                  <col style={{ width: "8.7%" }} />
                </colgroup>
                <tbody><tr>
                  <td style={cellS({ fontSize: "7pt", padding: "1px 2px", borderLeft: "none", borderTop: "none", borderBottom: "none" })}></td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>2ª Série</td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.ano_2a_serie} orig="2018" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 3px", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.escola_2a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.municipio_2a} orig="Cacapava" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderRight: "none", borderBottom: "none" })}>
                    <V val={f.uf_2a || "SP"} orig="SP" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>

          {/* 3ª Série */}
          <tr>
            <td colSpan={7} style={{ border: b, borderBottom: bT, padding: 0 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "13.8%" }} />
                  <col style={{ width: "8.4%" }} />
                  <col style={{ width: "6.4%" }} />
                  <col style={{ width: "46.8%" }} />
                  <col style={{ width: "15.9%" }} />
                  <col style={{ width: "8.7%" }} />
                </colgroup>
                <tbody><tr>
                  <td style={cellS({ fontSize: "7pt", padding: "1px 2px", borderLeft: "none", borderTop: "none", borderBottom: "none" })}></td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>3ª Série</td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.ano_3a_serie} orig="2019" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 3px", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.escola_3a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderBottom: "none" })}>
                    <V val={f.municipio_3a} orig="Cacapava" hl={hl} />
                  </td>
                  <td style={centerS({ fontSize: "8pt", padding: "1px 0", borderTop: "none", borderRight: "none", borderBottom: "none" })}>
                    <V val={f.uf_3a || "SP"} orig="SP" hl={hl} />
                  </td>
                </tr></tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══════════════════ ESCALA DE AVALIAÇÃO ═══════════════════ */}
      <div style={{
        borderLeft: bT, borderRight: bT, borderBottom: b,
        padding: "1px 4px", fontSize: "8pt", fontFamily: ff, lineHeight: 1.25,
      }}>
        <span>Escala de Avaliação: &quot;</span>
        <i>A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar</i>
        <br />
        <span>satisfatório, a nota igual ou superior a 05 (cinco) </span>
        <i><u>nos termos da Resolução SE - 61, de 24/9/2007.</u>&quot;</i>
      </div>

      {/* ═══════════════════ OBSERVAÇÕES ═══════════════════ */}
      <div style={{
        borderLeft: bT, borderRight: bT, borderBottom: b,
        padding: "2px 4px", fontSize: "8pt", fontFamily: ff, lineHeight: 1.3,
      }}>
        <b>OBSERVAÇÕES:</b>
        <div style={{ marginLeft: "20px", marginTop: "2px" }}>
          <span style={{ marginRight: "6px" }}>&#8226;</span>
          <b>CÓDIGO DE SEGURANÇA: <V val={f.codigo_seguranca} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ═══════════════════ CERTIFICADO ═══════════════════ */}
      <div style={{ borderLeft: bT, borderRight: bT, borderBottom: bT }}>
        <div style={{
          textAlign: "center", fontWeight: "bold", fontSize: "11pt",
          fontFamily: ff, letterSpacing: "3px", padding: "4px 0 3px 0",
          borderBottom: b, borderTop: bT,
        }}>
          CERTIFICADO
        </div>
        <div style={{ padding: "3px 6px", fontSize: "8pt", fontFamily: ff, lineHeight: 1.35, textAlign: "left" }}>
          <p style={{ margin: "0 0 2px 0" }}>
            O Diretor(a) da <b><V val={f.nome_escola?.replace("ESCOLA ESTADUAL ", "") || "E. E. Mª APDA. FRANÇA B. ARAUJO PROFª"} orig="E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} /></b>, CERTIFICA, nos termos do Inciso VII, Artigo 24
            da Lei Federal 9394/96, que <b><V val={f.nome_aluno} orig="Giovane Silva dos Santos" hl={hl} /></b>, concluiu o Ensino Médio nesta instituição. no ano de{" "}
            <V val={f.ano_conclusao} orig="2019" hl={hl} />.
          </p>
        </div>
        <div style={{ padding: "0 6px 3px 6px", fontSize: "8pt", fontFamily: ff }}>
          <b>Número de registro da publicação</b> no Sistema GDAE (Resolução SE108/02): <b><V val={f.registro_gdae} orig="SPS41214853-0SP" hl={hl} /></b>
        </div>
      </div>

      {/* ═══════════════════ ASSINATURAS ═══════════════════ */}
      {/* Conforme captura: assinaturas grandes, sobrepostas ao texto Nome: */}
      <table style={{
        width: "100%", borderCollapse: "collapse", tableLayout: "fixed",
        borderLeft: bT, borderRight: bT, borderBottom: bT,
      }}>
        <colgroup>
          <col style={{ width: "34.5%" }} />
          <col style={{ width: "31.3%" }} />
          <col style={{ width: "34.2%" }} />
        </colgroup>
        <tbody>
          <tr>
            {/* Gerente de Organização Escolar */}
            <td style={{
              borderRight: b, borderTop: b,
              padding: "2px 4px 3px 4px", textAlign: "center",
              fontSize: "7pt", fontFamily: ff, verticalAlign: "bottom",
              position: "relative", height: "68px",
            }}>
              {/* Assinatura sobreposta - posicionada sobre o texto Nome: */}
              <div style={{
                position: "absolute", top: "-2px", left: "10%", width: "80%", height: "50px",
                zIndex: 1,
              }}>
                <img
                  src={sigGerente}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.85 }}
                  crossOrigin="anonymous"
                />
              </div>
              <div style={{ position: "absolute", bottom: "3px", left: 0, right: 0, textAlign: "center", lineHeight: 1.25, zIndex: 2 }}>
                <div>Nome: <V val={f.gerente_nome} orig="MARISTELA GALVANI MACHADO" hl={hl} /></div>
                <div>R.G.: <V val={f.gerente_rg} orig="23.425.125-45" hl={hl} /></div>
                <div style={{ fontWeight: "bold", marginTop: "1px" }}>Gerente de Organização Escolar</div>
              </div>
            </td>

            {/* LOCAL/DATA */}
            <td style={{
              borderRight: b, borderTop: b,
              padding: "2px 4px 3px 4px", textAlign: "center",
              fontSize: "7pt", fontFamily: ff, verticalAlign: "bottom",
              position: "relative", height: "68px",
            }}>
              <div style={{ position: "absolute", bottom: "3px", left: 0, right: 0, textAlign: "center", lineHeight: 1.25 }}>
                <div style={{ marginBottom: "6px", textDecoration: "underline" }}>
                  <V val={f.local_data} orig="Cacapava - SP, 04/12/2019" hl={hl} />
                </div>
                <div style={{ fontWeight: "bold" }}>LOCAL/DATA</div>
              </div>
            </td>

            {/* Diretor de Escola */}
            <td style={{
              borderTop: b,
              padding: "2px 4px 3px 4px", textAlign: "center",
              fontSize: "7pt", fontFamily: ff, verticalAlign: "bottom",
              position: "relative", height: "68px",
            }}>
              {/* Assinatura sobreposta */}
              <div style={{
                position: "absolute", top: "-2px", left: "10%", width: "80%", height: "50px",
                zIndex: 1,
              }}>
                <img
                  src={sigDiretor}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.85 }}
                  crossOrigin="anonymous"
                />
              </div>
              <div style={{ position: "absolute", bottom: "3px", left: 0, right: 0, textAlign: "center", lineHeight: 1.25, zIndex: 2 }}>
                <div>Nome: <V val={f.diretor_nome} orig="ANGELA PEREIRA DOS SANTOS" hl={hl} /></div>
                <div>R.G.: <V val={f.diretor_rg} orig="13.068.721-63" hl={hl} /></div>
                <div style={{ fontWeight: "bold", marginTop: "1px" }}>Diretor de Escola</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
