/**
 * SPDocumentPage — Réplica pixel-perfect do Histórico Escolar SP
 * Baseado nos 4 PDFs de Histórico Escolar SP (Giovanne, Kassia, Jessica, Júlia)
 * Dimensões: A4 (210mm × 297mm)
 *
 * TODAS as bordas, linhas e contornos replicam fielmente o documento original.
 */
import { BRASAO_SP_URL, SP_GRADES_DEFAULT, type SPGradeRow } from "@/lib/historicoSPData";

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

export function SPPage1({
  f,
  highlightModified,
  grades = SP_GRADES_DEFAULT,
  brasaoUrl,
}: Props) {
  const hl = highlightModified;
  const b = "1px solid #000";
  const bT = "1px solid transparent";

  const totalBNC = grades.reduce((s, g) => s + parseInt(g.ch || "0"), 0);

  const logoSrc = brasaoUrl || BRASAO_SP_URL;

  /* ---- Áreas de conhecimento agrupadas ---- */
  const areas = [
    { name: "Linguagens\nCódigos e\nsuas\nTecnologias", rows: [0, 1, 2] },
    { name: "Ciências da\nNatureza,\nMatemática e\nsuas\nTecnologias", rows: [3, 4, 5, 6] },
    { name: "Ciências\nHumanas e\nsuas\nTecnologias", rows: [7, 8, 9, 10] },
  ];

  /* ---- Vertical text helper ---- */
  const verticalText = (text: string, fontSize = "6.5pt", bold = true): React.CSSProperties => ({
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    fontSize,
    fontWeight: bold ? "bold" : "normal",
    whiteSpace: "nowrap",
    letterSpacing: "0.3px",
    lineHeight: 1,
    textAlign: "center",
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
        padding: "8mm 10mm 6mm 10mm",
        fontFamily: "'Times New Roman', Times, serif",
        fontSize: "9pt",
        lineHeight: 1.2,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ================================================================
          CABEÇALHO INSTITUCIONAL — Borda externa completa
          ================================================================ */}
      <table style={{ width: "100%", borderCollapse: "collapse", border: b }}>
        <tbody>
          {/* Row 1: Brasão (rowspan=6) + GOVERNO DO ESTADO */}
          <tr>
            <td
              rowSpan={6}
              style={{
                borderRight: b,
                padding: "6px 8px",
                verticalAlign: "middle",
                textAlign: "center",
                width: "110px",
              }}
            >
              <img
                src={logoSrc}
                alt="Brasão SP"
                style={{ width: 80, height: "auto", display: "block", margin: "0 auto" }}
                crossOrigin="anonymous"
              />

            </td>
            <td
              colSpan={3}
              style={{ padding: "3px 8px", fontSize: "13pt", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              GOVERNO DO ESTADO DE SÃO PAULO
            </td>
          </tr>
          {/* Row 2: SECRETARIA */}
          <tr>
            <td
              colSpan={3}
              style={{ padding: "1px 8px", fontSize: "9.5pt", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </td>
          </tr>
          {/* Row 3: ESCOLA */}
          <tr>
            <td
              colSpan={3}
              style={{ padding: "1px 8px", fontSize: "9.5pt", fontWeight: "bold", fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} />
            </td>
          </tr>
          {/* Row 4: Ato Legal + Endereço + Nº */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 8px", fontSize: "8pt" }}>
              <div>Ato Legal de Criação: <V val={f.ato_legal} orig="906748" hl={hl} /></div>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1px" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: 0, fontSize: "8pt", borderBottom: b }}>
                      Endereço: <V val={f.endereco_escola} orig="Av. Honorio Ferreira Pedrosa" hl={hl} />
                    </td>
                    <td style={{ padding: 0, fontSize: "8pt", borderBottom: b, borderLeft: b, paddingLeft: "4px", width: "80px" }}>
                      Nº <V val={f.numero_escola} orig="611" hl={hl} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* Row 5: Bairro | Município | CEP */}
          <tr>
            <td style={{ padding: "1px 8px", fontSize: "8pt", borderBottom: b }}>
              Bairro: <V val={f.bairro} orig="Pq Nova Cacapava" hl={hl} />
            </td>
            <td style={{ padding: "1px 4px", fontSize: "8pt", borderLeft: b, borderBottom: b }}>
              Município: <V val={f.municipio_escola} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ padding: "1px 4px", fontSize: "8pt", borderLeft: b, borderBottom: b, width: "120px" }}>
              CEP:<V val={f.cep_escola} orig="06411-160" hl={hl} />
            </td>
          </tr>
          {/* Row 6: Tel | Email */}
          <tr>
            <td style={{ padding: "1px 8px", fontSize: "8pt" }}>
              Tel. <V val={f.telefone_escola} orig="(12) 36521267" hl={hl} />
            </td>
            <td colSpan={2} style={{ padding: "1px 4px", fontSize: "8pt", borderLeft: b }}>
              Endereço eletrônico: <V val={f.email_escola} orig="E906748A@EDUCACAO.SP.GOV.BR" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          TÍTULO — HISTÓRICO ESCOLAR – ENSINO MÉDIO
          ================================================================ */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "13pt",
          padding: "4px 0",
          background: "#c0c0c0",
          border: b,
          borderTop: "none",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        HISTÓRICO ESCOLAR – ENSINO MÉDIO
      </div>

      {/* ================================================================
          DADOS DO ALUNO
          ================================================================ */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9pt", borderLeft: b, borderRight: b }}>
        <tbody>
          {/* Nome | RG | RA */}
          <tr>
            <td style={{ border: b, borderTop: "none", padding: "2px 6px", width: "50%" }}>
              <b>Nome do Aluno</b>: <V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} />
            </td>
            <td style={{ border: b, borderTop: "none", padding: "2px 6px", width: "22%" }}>
              R.G.: <V val={f.rg} orig="555285753" hl={hl} />
            </td>
            <td style={{ border: b, borderTop: "none", padding: "2px 6px", width: "28%" }}>
              RA: <V val={f.ra} orig="26205579-0" hl={hl} />
            </td>
          </tr>
          {/* Nascimento | Estado | País */}
          <tr>
            <td style={{ border: b, padding: "2px 6px", verticalAlign: "top" }}>
              <div><b>Nascimento</b></div>
              <div style={{ paddingLeft: "20px" }}>Município: <V val={f.municipio_nascimento} orig="Cacapava" hl={hl} /></div>
              <div style={{ paddingLeft: "20px" }}>Data: <V val={f.data_nascimento} orig="01/12/1999" hl={hl} /></div>
            </td>
            <td style={{ border: b, padding: "2px 6px", verticalAlign: "top" }}>
              Estado: <V val={f.estado_nascimento} orig="SP" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 6px", verticalAlign: "top" }}>
              País: <V val={f.pais} orig="BRASIL" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          TABELA PRINCIPAL: Fundamento Legal + BASE NACIONAL COMUM + Notas
          ================================================================ */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", border: b, borderTop: "none" }}>
        <colgroup>
          <col style={{ width: "18px" }} />  {/* Fundamento Legal vertical */}
          <col style={{ width: "20px" }} />  {/* BASE NACIONAL COMUM / PARTE DIVERSIFICADA / ESTUDOS vertical */}
          <col style={{ width: "90px" }} />  {/* Áreas de conhecimento */}
          <col />                            {/* Componentes Curriculares */}
          <col style={{ width: "38px" }} />  {/* Ano/Série */}
          <col style={{ width: "42px" }} />  {/* Ano 1 */}
          <col style={{ width: "42px" }} />  {/* Ano 2 */}
          <col style={{ width: "42px" }} />  {/* Ano 3 */}
          <col style={{ width: "52px" }} />  {/* Carga Horária */}
        </colgroup>

        <tbody>
          {/* ---- Cabeçalho da tabela de notas ---- */}
          <tr>
            {/* Fundamento Legal: rowspan para TODA a tabela */}
            <td
              rowSpan={100}
              style={{
                borderRight: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                width: "18px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={verticalText("6pt", false)}>
                  Fundamento Legal: Lei Federal 9394/96
                </div>
              </div>
            </td>

            {/* BASE NACIONAL COMUM: rowspan para as 11 disciplinas + 2 totais */}
            <td
              rowSpan={13}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                width: "20px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={verticalText("7pt", true)}>
                  BASE NACIONAL COMUM
                </div>
              </div>
            </td>

            {/* ÁREAS DE CONHECIMENTO */}
            <td style={{ border: b, borderLeft: "none", padding: "2px 3px", textAlign: "center", fontWeight: "bold", fontSize: "7pt" }}>
              ÁREAS DE<br />CONHECIMENTO
            </td>

            {/* COMPONENTES CURRICULARES */}
            <td style={{ border: b, padding: "2px 3px", textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>
              COMPONENTES CURRICULARES
            </td>

            {/* Ano/Série */}
            <td style={{ border: b, padding: "2px 2px", textAlign: "center", fontWeight: "bold", fontSize: "7pt" }}>
              Ano<br />Série
            </td>

            {/* Ano 1 */}
            <td style={{ border: b, padding: "2px 2px", textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>
              <V val={f.ano_1a_serie} orig="2017" hl={hl} /><br />
              <span style={{ fontWeight: "normal", fontSize: "7pt" }}>1ª</span>
            </td>

            {/* Ano 2 */}
            <td style={{ border: b, padding: "2px 2px", textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>
              <V val={f.ano_2a_serie} orig="2018" hl={hl} /><br />
              <span style={{ fontWeight: "normal", fontSize: "7pt" }}>2ª</span>
            </td>

            {/* Ano 3 */}
            <td style={{ border: b, padding: "2px 2px", textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>
              <V val={f.ano_3a_serie} orig="2019" hl={hl} /><br />
              <span style={{ fontWeight: "normal", fontSize: "7pt" }}>3ª</span>
            </td>

            {/* CARGA HORÁRIA */}
            <td style={{ border: b, padding: "2px 2px", textAlign: "center", fontWeight: "bold", fontSize: "7pt" }}>
              CARGA<br />HORÁRIA
            </td>
          </tr>

          {/* ---- DISCIPLINAS DA BASE NACIONAL COMUM ---- */}
          {areas.map((area, areaIdx) =>
            area.rows.map((gradeIdx, rowIdx) => {
              const grade = grades[gradeIdx];
              if (!grade) return null;
              return (
                <tr key={`grade-${gradeIdx}`}>
                  {/* Área de conhecimento (rowspan) */}
                  {rowIdx === 0 && (
                    <td
                      rowSpan={area.rows.length}
                      style={{
                        border: b,
                        borderLeft: "none",
                        padding: "2px 3px",
                        textAlign: "center",
                        fontSize: "7pt",
                        verticalAlign: "middle",
                        lineHeight: 1.15,
                      }}
                    >
                      {area.name.split("\n").map((line, i) => (
                        <span key={i}>{line}{i < area.name.split("\n").length - 1 && <br />}</span>
                      ))}
                    </td>
                  )}
                  {/* Disciplina */}
                  <td style={{ border: b, padding: "1px 6px", fontSize: "8pt" }}>
                    {grade.disciplina}
                  </td>
                  {/* Ano/Série vazio */}
                  <td style={{ border: b, textAlign: "center", fontSize: "8pt" }}></td>
                  {/* Notas */}
                  <td style={{ border: b, textAlign: "center", fontSize: "8pt", padding: "1px 2px" }}>
                    {grade.nota1}
                  </td>
                  <td style={{ border: b, textAlign: "center", fontSize: "8pt", padding: "1px 2px" }}>
                    {grade.nota2}
                  </td>
                  <td style={{ border: b, textAlign: "center", fontSize: "8pt", padding: "1px 2px" }}>
                    {grade.nota3}
                  </td>
                  {/* Carga horária */}
                  <td style={{ border: b, textAlign: "center", fontSize: "8pt", padding: "1px 2px" }}>
                    {grade.ch}
                  </td>
                </tr>
              );
            })
          )}

          {/* ---- Total de aulas anuais da Base Nacional Comum ---- */}
          <tr>
            <td
              colSpan={2}
              style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt" }}
            >
              Total de aulas anuais da Base Nacional Comum
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
          </tr>

          {/* ---- TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM ---- */}
          <tr>
            <td
              colSpan={2}
              style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt", fontWeight: "bold" }}
            >
              TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>960</td>
            <td style={{ border: b, textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>960</td>
            <td style={{ border: b, textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>960</td>
            <td style={{ border: b, textAlign: "center", fontWeight: "bold", fontSize: "8pt" }}>
              {totalBNC > 0 ? totalBNC.toLocaleString("pt-BR") : "2.880"}
            </td>
          </tr>

          {/* ================================================================
              PARTE DIVERSIFICADA
              ================================================================ */}
          {/* Língua Estrangeira Moderna */}
          <tr>
            <td
              rowSpan={4}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                width: "20px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={verticalText("5.5pt", true)}>
                  PARTE<br />DIVERSIFICADA
                </div>
              </div>
            </td>
            <td colSpan={2} style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "8pt" }}>
              Língua Estrangeira Moderna
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
          </tr>
          {/* Disciplina de Apoio Curricular 1 */}
          <tr>
            <td colSpan={2} style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt" }}>
              Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_1} orig="Língua Portuguesa e Literatura" hl={hl} />
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
          </tr>
          {/* Disciplina de Apoio Curricular 2 */}
          <tr>
            <td colSpan={2} style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt" }}>
              Disciplina de Apoio Curricular:
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
          </tr>
          {/* Disciplina de Apoio Curricular 3 */}
          <tr>
            <td colSpan={2} style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt" }}>
              Disciplina de Apoio Curricular:
            </td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
            <td style={{ border: b, textAlign: "center" }}></td>
          </tr>

          {/* ---- TOTAIS PARTE DIVERSIFICADA ---- */}
          <tr>
            <td colSpan={3} style={{ border: b, borderLeft: "none", padding: "2px 6px", fontSize: "7.5pt", fontWeight: "bold" }}>
              TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={5} style={{ border: b }}></td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: b, borderLeft: "none", padding: "1px 6px", fontSize: "7.5pt", fontWeight: "bold" }}>
              TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA
            </td>
            <td colSpan={5} style={{ border: b }}></td>
          </tr>

          {/* ---- Linha vazia ---- */}
          <tr>
            <td colSpan={3} style={{ border: b, borderLeft: "none", padding: "3px 6px" }}></td>
            <td colSpan={5} style={{ border: b }}></td>
          </tr>

          {/* ---- TOTAL DE CARGA HORÁRIA ANUAL DO CURSO ---- */}
          <tr>
            <td colSpan={3} style={{ border: b, borderLeft: "none", padding: "2px 6px", fontSize: "7.5pt", fontWeight: "bold" }}>
              TOTAL DE CARGA HORÁRIA ANUAL DO CURSO
            </td>
            <td colSpan={5} style={{ border: b }}></td>
          </tr>

          {/* ================================================================
              ESTUDOS REALIZADOS
              ================================================================ */}
          {/* Cabeçalho Estudos Realizados */}
          <tr>
            <td
              rowSpan={5}
              style={{
                borderRight: b,
                borderBottom: b,
                verticalAlign: "middle",
                textAlign: "center",
                padding: 0,
                width: "20px",
                position: "relative",
              }}
            >
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}>
                <div style={verticalText("5.5pt", true)}>
                  ESTUDOS<br />REALIZADOS
                </div>
              </div>
            </td>
            <td style={{ border: b, borderLeft: "none", padding: "1px 4px", fontSize: "7.5pt" }}></td>
            <td style={{ border: b, padding: "1px 4px", fontSize: "7.5pt", fontWeight: "bold", textAlign: "center" }}>Série</td>
            <td style={{ border: b, padding: "1px 4px", fontSize: "7.5pt", fontWeight: "bold", textAlign: "center" }}>Ano</td>
            <td colSpan={3} style={{ border: b, padding: "1px 4px", fontSize: "7.5pt", fontWeight: "bold", textAlign: "center" }}>Estabelecimento de Ensino</td>
            <td style={{ border: b, padding: "1px 4px", fontSize: "7.5pt", fontWeight: "bold", textAlign: "center" }}>Município</td>
            <td style={{ border: b, padding: "1px 4px", fontSize: "7.5pt", fontWeight: "bold", textAlign: "center" }}>UF</td>
          </tr>

          {/* Ensino Fundamental */}
          <tr>
            <td style={{ border: b, borderLeft: "none", padding: "2px 4px", fontSize: "7.5pt", verticalAlign: "middle" }}>
              Ensino<br />Fundamental
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.ano_fund_serie} orig="8ª Série" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.ano_fund} orig="2016" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "2px 4px", fontSize: "7.5pt" }}>
              <V val={f.escola_fund} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.municipio_fund} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.uf_fund || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 1ª Série */}
          <tr>
            <td rowSpan={3} style={{ border: b, borderLeft: "none", padding: "2px 4px", fontSize: "7.5pt", verticalAlign: "middle" }}>
              Ensino<br />Médio
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>1ª Série</td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.ano_1a_serie} orig="2017" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "2px 4px", fontSize: "7.5pt" }}>
              <V val={f.escola_1a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.municipio_1a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.uf_1a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 2ª Série */}
          <tr>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>2ª Série</td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.ano_2a_serie} orig="2018" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "2px 4px", fontSize: "7.5pt" }}>
              <V val={f.escola_2a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.municipio_2a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.uf_2a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>

          {/* Ensino Médio — 3ª Série */}
          <tr>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>3ª Série</td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.ano_3a_serie} orig="2019" hl={hl} />
            </td>
            <td colSpan={3} style={{ border: b, padding: "2px 4px", fontSize: "7.5pt" }}>
              <V val={f.escola_3a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.municipio_3a} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px", fontSize: "7.5pt", textAlign: "center" }}>
              <V val={f.uf_3a || "SP"} orig="SP" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ================================================================
          ESCALA DE AVALIAÇÃO
          ================================================================ */}
      <div style={{ marginTop: "2px", fontSize: "7pt", lineHeight: 1.25 }}>
        Escala de Avaliação: "<i>A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar satisfatório, a nota igual ou superior a 05 (cinco) <u>nos termos da Resolução SE - 61, de 24/9/2007.</u>"</i>
      </div>

      {/* ================================================================
          OBSERVAÇÕES
          ================================================================ */}
      <div style={{ marginTop: "2px", fontSize: "8pt", lineHeight: 1.3 }}>
        <b>OBSERVAÇÕES:</b>
        <ul style={{ margin: "1px 0 0 20px", padding: 0, listStyleType: "disc" }}>
          <li style={{ fontSize: "8pt" }}>
            <b>CÓDIGO DE SEGURANÇA: <V val={f.codigo_seguranca} orig="SPS41214853-0SP" hl={hl} /></b>
          </li>
        </ul>
      </div>

      {/* ================================================================
          CERTIFICADO
          ================================================================ */}
      <div style={{ marginTop: "6px" }}>
        <div style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "12pt",
          letterSpacing: "4px",
          marginBottom: "3px",
          fontFamily: "Arial, Helvetica, sans-serif",
          borderTop: b,
          paddingTop: "4px",
        }}>
          CERTIFICADO
        </div>
        <p style={{ textAlign: "justify", fontSize: "8.5pt", lineHeight: 1.35, margin: "0 0 2px 0" }}>
          O Diretor(a) da <b><V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} /></b>, CERTIFICA, nos termos do Inciso VII, Artigo 24
          da Lei Federal 9394/96, que <b><V val={f.nome_aluno} orig="Giovane Silva dos Santos" hl={hl} /></b>, concluiu o Ensino Médio nesta instituição. no ano de{" "}
          <V val={f.ano_conclusao} orig="2019" hl={hl} />.
        </p>
      </div>

      {/* ================================================================
          REGISTRO GDAE
          ================================================================ */}
      <div style={{ marginTop: "2px", fontSize: "8pt" }}>
        <b>Número de registro da publicação</b> no Sistema GDAE (Resolução SE108/02): <b><V val={f.registro_gdae} orig="SPS41214853-0SP" hl={hl} /></b>
      </div>

      {/* ================================================================
          ASSINATURAS
          ================================================================ */}
      <div style={{
        marginTop: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        fontSize: "7.5pt",
        lineHeight: 1.3,
      }}>
        {/* Gerente de Organização Escolar */}
        <div style={{ textAlign: "center", width: "33%" }}>
          <div style={{ borderTop: b, paddingTop: "3px" }}>
            <div>Nome: <V val={f.gerente_nome} orig="MARISTELA GALVANI MACHADO" hl={hl} /></div>
            <div>R.G.: <V val={f.gerente_rg} orig="23.425.125-45" hl={hl} /></div>
            <div style={{ fontWeight: "bold" }}>Gerente de Organização Escolar</div>
          </div>
        </div>

        {/* LOCAL/DATA */}
        <div style={{ textAlign: "center", width: "28%" }}>
          <div style={{ marginBottom: "3px" }}>
            <V val={f.local_data} orig="Cacapava - SP, 04/12/2019" hl={hl} />
          </div>
          <div style={{ borderTop: b, paddingTop: "3px", fontWeight: "bold" }}>LOCAL/DATA</div>
        </div>

        {/* Diretor de Escola */}
        <div style={{ textAlign: "center", width: "33%" }}>
          <div style={{ borderTop: b, paddingTop: "3px" }}>
            <div>Nome: <V val={f.diretor_nome} orig="ANGELA PEREIRA DOS SANTOS" hl={hl} /></div>
            <div>R.G.: <V val={f.diretor_rg} orig="13.068.721-63" hl={hl} /></div>
            <div style={{ fontWeight: "bold" }}>Diretor de Escola</div>
          </div>
        </div>
      </div>
    </div>
  );
}
