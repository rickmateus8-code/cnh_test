/**
 * SPDocumentPage — Réplica pixel-perfect do Histórico Escolar SP
 * Baseado nos 4 PDFs de Histórico Escolar SP (Giovanne, Kassia, Jessica, Júlia)
 * Dimensões: A4 (210mm × 297mm)
 *
 * Layout fiel ao original:
 *   - Cabeçalho com brasão SP (via upload PNG sem fundo) + dados institucionais
 *   - Título "HISTÓRICO ESCOLAR – ENSINO MÉDIO" com fundo cinza
 *   - Dados do aluno em tabela
 *   - Tabela de notas com áreas de conhecimento e texto vertical
 *   - Parte diversificada
 *   - Estudos realizados
 *   - Escala de avaliação, observações, certificado
 *   - Assinaturas no rodapé
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

  const totalBNC = grades.reduce((s, g) => s + parseInt(g.ch || "0"), 0);

  /* Cell styles */
  const cell: React.CSSProperties = { border: b, padding: "1px 4px", verticalAlign: "middle", fontSize: "7.5pt", lineHeight: 1.15 };
  const cellC: React.CSSProperties = { ...cell, textAlign: "center" };
  const cellCB: React.CSSProperties = { ...cellC, fontWeight: "bold" };

  const areas = [
    { name: "Linguagens\nCódigos e\nsuas\nTecnologias", rows: [0, 1, 2] },
    { name: "Ciências da\nNatureza,\nMatemática e\nsuas\nTecnologias", rows: [3, 4, 5, 6] },
    { name: "Ciências\nHumanas e\nsuas\nTecnologias", rows: [7, 8, 9, 10] },
  ];

  const logoSrc = brasaoUrl || BRASAO_SP_URL;

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
        padding: "6mm 8mm 5mm 8mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "8pt",
        lineHeight: 1.15,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ===== CABEÇALHO INSTITUCIONAL ===== */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: b }}>
        <colgroup>
          <col style={{ width: "85px" }} />
          <col />
          <col style={{ width: "130px" }} />
          <col style={{ width: "100px" }} />
        </colgroup>
        <tbody>
          {/* Brasão (rowspan) + GOVERNO */}
          <tr>
            <td rowSpan={7} style={{ borderRight: b, padding: "4px", verticalAlign: "middle", textAlign: "center" }}>
              <img src={logoSrc} alt="Brasão SP" style={{ width: 70, height: "auto", display: "block", margin: "0 auto" }} crossOrigin="anonymous" />
            </td>
            <td colSpan={3} style={{ padding: "2px 6px", fontWeight: "bold", fontSize: "11pt" }}>
              GOVERNO DO ESTADO DE SÃO PAULO
            </td>
          </tr>
          {/* SECRETARIA */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontWeight: "bold", fontSize: "8.5pt" }}>
              SECRETARIA DE ESTADO DA EDUCAÇÃO
            </td>
          </tr>
          {/* ESCOLA */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontWeight: "bold", fontSize: "8.5pt" }}>
              <V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} />
            </td>
          </tr>
          {/* Ato Legal */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Ato Legal de Criação: <V val={f.ato_legal} orig="906748" hl={hl} />
            </td>
          </tr>
          {/* Endereço + Número */}
          <tr>
            <td colSpan={2} style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Endereço: <V val={f.endereco_escola} orig="Av. Honorio Ferreira Pedrosa" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              Nº <V val={f.numero_escola} orig="611" hl={hl} />
            </td>
          </tr>
          {/* Bairro + Município + CEP */}
          <tr>
            <td style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Bairro: <V val={f.bairro} orig="Pq Nova Cacapava" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              Município: <V val={f.municipio_escola} orig="Cacapava" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              CEP:<V val={f.cep_escola} orig="06411-160" hl={hl} />
            </td>
          </tr>
          {/* Tel + Email */}
          <tr>
            <td style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Tel. <V val={f.telefone_escola} orig="(12) 36521267" hl={hl} />
            </td>
            <td colSpan={2} style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              Endereço eletrônico: <V val={f.email_escola} orig="E906748A@EDUCACAO.SP.GOV.BR" hl={hl} />
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== TÍTULO ===== */}
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "12pt", padding: "3px 0", background: "#e0e0e0", border: b, borderTop: "none", marginTop: -1 }}>
        HISTÓRICO ESCOLAR – ENSINO MÉDIO
      </div>

      {/* ===== DADOS DO ALUNO ===== */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "8pt", tableLayout: "fixed", marginTop: -1 }}>
        <colgroup>
          <col style={{ width: "48%" }} />
          <col style={{ width: "22%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <tbody>
          <tr>
            <td style={{ border: b, padding: "2px 4px" }}>
              <b>Nome do Aluno</b>: <V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px" }}>
              R.G.: <V val={f.rg} orig="555285753" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px" }}>
              RA: <V val={f.ra} orig="26205579-0" hl={hl} />
            </td>
          </tr>
          <tr>
            <td rowSpan={2} style={{ border: b, padding: "2px 4px", verticalAlign: "top" }}>
              <b>Nascimento</b>
              <div style={{ marginTop: 1 }}>Município: <V val={f.municipio_nascimento} orig="Cacapava" hl={hl} /></div>
              <div>Data: <V val={f.data_nascimento} orig="01/12/1999" hl={hl} /></div>
            </td>
            <td style={{ border: b, padding: "2px 4px" }}>Estado: <V val={f.estado_nascimento} orig="SP" hl={hl} /></td>
            <td style={{ border: b, padding: "2px 4px" }}>País: <V val={f.pais} orig="BRASIL" hl={hl} /></td>
          </tr>
          <tr>
            <td style={{ border: b, padding: "2px 4px" }}></td>
            <td style={{ border: b, padding: "2px 4px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* ===== FUNDAMENTO LEGAL (vertical) + TABELA DE NOTAS ===== */}
      <div style={{ display: "flex", marginTop: -1 }}>
        {/* Fundamento Legal — coluna vertical */}
        <div
          style={{
            width: 16,
            minWidth: 16,
            border: b,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "6pt",
              whiteSpace: "nowrap",
              letterSpacing: "0.2px",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            Fundamento Legal: Lei Federal 9394/96
          </div>
        </div>

        {/* Conteúdo principal */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ===== TABELA DE NOTAS ===== */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "20px" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "5.5%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "8%" }} />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={2} style={{ ...cellCB, fontSize: "6pt", padding: "1px", borderLeft: "none" }}></th>
                <th style={{ ...cellCB, fontSize: "6.5pt" }}>ÁREAS DE<br />CONHECIMENTO</th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>COMPONENTES CURRICULARES</th>
                <th style={{ ...cellCB, fontSize: "6.5pt" }}>Ano<br />Série</th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>
                  <b><V val={f.ano_1a_serie} orig="2017" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>1ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>
                  <b><V val={f.ano_2a_serie} orig="2018" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>2ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>
                  <b><V val={f.ano_3a_serie} orig="2019" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>3ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "6.5pt" }}>CARGA<br />HORÁRIA</th>
              </tr>
            </thead>
            <tbody>
              {/* BASE NACIONAL COMUM */}
              {areas.map((area, areaIdx) => {
                return area.rows.map((gradeIdx, rowIdx) => {
                  const grade = grades[gradeIdx];
                  if (!grade) return null;
                  return (
                    <tr key={`grade-${gradeIdx}`}>
                      {areaIdx === 0 && rowIdx === 0 && (
                        <td rowSpan={11} style={{
                          ...cellCB,
                          fontSize: "6.5pt",
                          padding: "0",
                          verticalAlign: "middle",
                          textAlign: "center",
                          width: 20,
                          borderLeft: "none",
                          position: "relative",
                        }}>
                          <div style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                            fontSize: "7pt",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.5px",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transformOrigin: "center center",
                          }}>
                            <div style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(180deg) translateX(50%) translateY(-50%)",
                            }}>
                              BASE NACIONAL COMUM
                            </div>
                          </div>
                        </td>
                      )}
                      {rowIdx === 0 && (
                        <td rowSpan={area.rows.length} style={{ ...cellCB, fontSize: "6.5pt", verticalAlign: "middle", padding: "1px 3px", lineHeight: 1.15, textAlign: "center" }}>
                          {area.name.split("\n").map((line, i) => (
                            <span key={i}>{line}{i < area.name.split("\n").length - 1 && <br />}</span>
                          ))}
                        </td>
                      )}
                      <td style={{ ...cell, padding: "1px 4px" }}>{grade.disciplina}</td>
                      <td style={cellC}></td>
                      <td style={cellC}>{grade.nota1}</td>
                      <td style={cellC}>{grade.nota2}</td>
                      <td style={cellC}>{grade.nota3}</td>
                      <td style={cellC}>{grade.ch}</td>
                    </tr>
                  );
                });
              })}

              {/* Linhas vazias entre Ciências da Natureza e Ciências Humanas (como no original) */}

              {/* Total aulas anuais BNC */}
              <tr>
                <td colSpan={3} style={{ ...cell, padding: "1px 4px", borderLeft: "none", fontSize: "7pt" }}>Total de aulas anuais da Base Nacional Comum</td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>

              {/* TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM */}
              <tr>
                <td colSpan={3} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none", fontSize: "7pt" }}>TOTAL DA CARGA HORÁRIA DA BASE NACIONAL COMUM</td>
                <td style={cellC}></td>
                <td style={cellCB}>960</td>
                <td style={cellCB}>960</td>
                <td style={cellCB}>960</td>
                <td style={cellCB}>{totalBNC.toLocaleString("pt-BR")}</td>
              </tr>

              {/* PARTE DIVERSIFICADA */}
              <tr>
                <td rowSpan={4} style={{
                  ...cellCB,
                  fontSize: "6.5pt",
                  padding: "0",
                  verticalAlign: "middle",
                  textAlign: "center",
                  width: 20,
                  borderLeft: "none",
                  position: "relative",
                }}>
                  <div style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: "6.5pt",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transformOrigin: "center center",
                  }}>
                    <div style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg) translateX(50%) translateY(-50%)",
                    }}>
                      PARTE DIVERSIFICADA
                    </div>
                  </div>
                </td>
                <td colSpan={2} style={{ ...cell, padding: "1px 4px" }}>Língua Estrangeira Moderna</td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ ...cell, padding: "1px 4px", fontSize: "7pt" }}>
                  Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_1} orig="Língua Portuguesa e Literatura" hl={hl} />
                </td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ ...cell, padding: "1px 4px", fontSize: "7pt" }}>
                  Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_2 || ""} orig="" hl={hl} />
                </td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>
              <tr>
                <td colSpan={2} style={{ ...cell, padding: "1px 4px", fontSize: "7pt" }}>
                  Disciplina de Apoio Curricular: <V val={f.disciplina_apoio_3 || ""} orig="" hl={hl} />
                </td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>

              {/* TOTAIS PARTE DIVERSIFICADA */}
              <tr>
                <td colSpan={3} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none", fontSize: "7pt" }}>TOTAL DE AULAS ANUAIS DA PARTE DIVERSIFICADA</td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>
              <tr>
                <td colSpan={3} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none", fontSize: "7pt" }}>TOTAL DA CARGA HORÁRIA DA PARTE DIVERSIFICADA</td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>

              {/* Linha vazia */}
              <tr>
                <td colSpan={3} style={{ ...cell, padding: "1px 4px", borderLeft: "none" }}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>

              {/* TOTAL DE CARGA HORÁRIA ANUAL DO CURSO */}
              <tr>
                <td colSpan={3} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none", fontSize: "7pt" }}>TOTAL DE CARGA HORÁRIA ANUAL DO CURSO</td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
                <td style={cellC}></td>
              </tr>

              {/* ===== ESTUDOS REALIZADOS ===== */}
              <tr>
                <td rowSpan={5} style={{
                  ...cellCB,
                  fontSize: "6.5pt",
                  padding: "0",
                  verticalAlign: "middle",
                  textAlign: "center",
                  width: 20,
                  borderLeft: "none",
                  position: "relative",
                }}>
                  <div style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: "6.5pt",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transformOrigin: "center center",
                  }}>
                    <div style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg) translateX(50%) translateY(-50%)",
                    }}>
                      ESTUDOS REALIZADOS
                    </div>
                  </div>
                </td>
                <td style={{ ...cell, padding: "1px 4px" }}></td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Série</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Ano</td>
                <td colSpan={2} style={{ ...cellCB, fontSize: "7pt" }}>Estabelecimento de Ensino</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Município</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>UF</td>
              </tr>
              {/* Ensino Fundamental */}
              <tr>
                <td rowSpan={1} style={{ ...cell, padding: "2px 4px", fontSize: "7pt" }}>Ensino<br />Fundamental</td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.ano_fund_serie} orig="8ª Série" hl={hl} /></td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.ano_fund} orig="2016" hl={hl} /></td>
                <td colSpan={2} style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.escola_fund} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} /></td>
                <td style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.municipio_fund} orig="Cacapava" hl={hl} /></td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.uf_fund || "SP"} orig="SP" hl={hl} /></td>
              </tr>
              {/* 1ª Série */}
              <tr>
                <td rowSpan={3} style={{ ...cell, padding: "2px 4px", fontSize: "7pt" }}>Ensino<br />Médio</td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}>1ª Série</td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.ano_1a_serie} orig="2017" hl={hl} /></td>
                <td colSpan={2} style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.escola_1a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} /></td>
                <td style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.municipio_1a} orig="Cacapava" hl={hl} /></td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.uf_1a || "SP"} orig="SP" hl={hl} /></td>
              </tr>
              {/* 2ª Série */}
              <tr>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}>2ª Série</td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.ano_2a_serie} orig="2018" hl={hl} /></td>
                <td colSpan={2} style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.escola_2a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} /></td>
                <td style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.municipio_2a} orig="Cacapava" hl={hl} /></td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.uf_2a || "SP"} orig="SP" hl={hl} /></td>
              </tr>
              {/* 3ª Série */}
              <tr>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}>3ª Série</td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.ano_3a_serie} orig="2019" hl={hl} /></td>
                <td colSpan={2} style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.escola_3a} orig="E. E. Mª Apda. França B. Araujo Profª" hl={hl} /></td>
                <td style={{ ...cell, padding: "2px 3px", fontSize: "7pt" }}><V val={f.municipio_3a} orig="Cacapava" hl={hl} /></td>
                <td style={{ ...cellC, padding: "2px 3px", fontSize: "7pt" }}><V val={f.uf_3a || "SP"} orig="SP" hl={hl} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ESCALA DE AVALIAÇÃO ===== */}
      <div style={{ marginTop: 2, fontSize: "7pt", lineHeight: 1.2 }}>
        Escala de Avaliação: "<i>A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar satisfatório, a nota igual ou superior a 05 (cinco) <u>nos termos da Resolução SE - 61, de 24/9/2007.</u>"</i>
      </div>

      {/* ===== OBSERVAÇÕES ===== */}
      <div style={{ marginTop: 1, fontSize: "7.5pt", lineHeight: 1.2 }}>
        <b>OBSERVAÇÕES:</b>
        <ul style={{ margin: "1px 0 0 20px", padding: 0 }}>
          <li><b>CÓDIGO DE SEGURANÇA: <V val={f.codigo_seguranca} orig="SPS41214853-0SP" hl={hl} /></b></li>
        </ul>
      </div>

      {/* ===== CERTIFICADO ===== */}
      <div style={{ marginTop: 4 }}>
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "11pt", letterSpacing: "3px", marginBottom: 2 }}>
          CERTIFICADO
        </div>
        <p style={{ textAlign: "justify", fontSize: "8pt", lineHeight: 1.3, margin: "0 0 2px 0" }}>
          O Diretor(a) da <b><V val={f.nome_escola} orig="ESCOLA ESTADUAL E. E. Mª APDA. FRANÇA B. ARAUJO PROFª" hl={hl} /></b>, CERTIFICA, nos termos do Inciso VII, Artigo 24
          da Lei Federal 9394/96, que <b><V val={f.nome_aluno} orig="GIOVANE SILVA DOS SANTOS" hl={hl} /></b>, concluiu o Ensino Médio nesta instituição. no ano de{" "}
          <V val={f.ano_conclusao} orig="2019" hl={hl} />.
        </p>
      </div>

      {/* ===== REGISTRO ===== */}
      <div style={{ marginTop: 1, fontSize: "7.5pt" }}>
        <b>Número de registro da publicação</b> no Sistema GDAE (Resolução SE108/02): <b><V val={f.registro_gdae} orig="SPS41214853-0SP" hl={hl} /></b>
      </div>

      {/* ===== ASSINATURAS ===== */}
      <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "7pt" }}>
        {/* Gerente */}
        <div style={{ textAlign: "center", width: "32%", borderTop: b, paddingTop: 2 }}>
          <div>Nome: <V val={f.gerente_nome} orig="MARISTELA GALVANI MACHADO" hl={hl} /></div>
          <div>R.G.: <V val={f.gerente_rg} orig="23.425.125-45" hl={hl} /></div>
          <div style={{ fontWeight: "bold" }}>Gerente de Organização Escolar</div>
        </div>

        {/* Local/Data */}
        <div style={{ textAlign: "center", width: "30%" }}>
          <div style={{ borderBottom: b, paddingBottom: 2, marginBottom: 2 }}>
            <V val={f.local_data} orig="Cacapava - SP, 04/12/2019" hl={hl} />
          </div>
          <div>LOCAL/DATA</div>
        </div>

        {/* Diretor */}
        <div style={{ textAlign: "center", width: "32%", borderTop: b, paddingTop: 2 }}>
          <div>Nome: <V val={f.diretor_nome} orig="ANGELA PEREIRA DOS SANTOS" hl={hl} /></div>
          <div>R.G.: <V val={f.diretor_rg} orig="13.068.721-63" hl={hl} /></div>
          <div style={{ fontWeight: "bold" }}>Diretor de Escola</div>
        </div>
      </div>
    </div>
  );
}
