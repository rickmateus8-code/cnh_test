/**
 * RSDocumentPage — Réplica pixel-perfect do Histórico Escolar RS
 * Baseado no PDF 566972392-historico-RS-1.pdf
 * Dimensões: A4 (210mm × 297mm)
 *
 * V7: Correções finais de fidelidade pixel-perfect:
 *   - Cabeçalho: "GOVERNO..." em bold SEM sublinhado (original não tem)
 *   - Secretaria e Diretoria sem negrito, tamanho correto
 *   - Escola em bold com sublinhado
 *   - Bordas do cabeçalho: apenas borda externa (sem bordas internas entre linhas de texto)
 *   - Título "HISTÓRICO ESCOLAR" com fundo cinza claro
 *   - Tabela de notas: colgroup com larguras exatas
 *   - Texto vertical via CSS writing-mode (melhor compatibilidade)
 *   - Estudos Realizados: cabeçalho sem sublinhado, dados sem bold
 *   - Certificado: texto correto com formatação exata
 *   - "2 VIA" centralizado simples
 *   - GT-HEMTI-V.1 no rodapé inferior esquerdo
 */
import { useEffect, useRef, useState } from "react";
import {
  BRASAO_RS_URL,
  RS_GRADES_DEFAULT,
  RS_GRADES_DIVERSIFICADA,
  type RSGradeRow,
} from "@/lib/historicoRSData";

interface Props {
  f: Record<string, string>;
  highlightModified?: boolean;
  grades?: RSGradeRow[];
  gradesDiversificada?: RSGradeRow[];
}

function V({ val, orig, hl }: { val: string; orig?: string; hl?: boolean }) {
  const mod = orig !== undefined && val !== orig;
  return (
    <span style={mod && hl ? { borderBottom: "2px solid #2d8c4e", backgroundColor: "rgba(45,140,78,0.08)", padding: "0 1px" } : {}}>
      {val}
    </span>
  );
}

export function RSPage1({
  f,
  highlightModified,
  grades = RS_GRADES_DEFAULT,
  gradesDiversificada = RS_GRADES_DIVERSIFICADA,
}: Props) {
  const hl = highlightModified;
  const b = "1px solid #000";
  const bn = "none"; // no border

  const totalBNC = grades.reduce((s, g) => s + parseInt(g.ch || "0"), 0);
  const totalDiv = gradesDiversificada.reduce((s, g) => s + parseInt(g.ch || "0"), 0);

  const areas = [
    { name: "LINGUAGENS", rows: 3 },
    { name: "MATEMATICA", rows: 1 },
    { name: "CIÊNCIAS DA\nNATUREZA", rows: 3 },
    { name: "CIÊNCIAS\nHUMANAS", rows: 4 },
  ];

  /* ---- Cell styles ---- */
  const cell: React.CSSProperties = { border: b, padding: "1px 4px", verticalAlign: "middle", fontSize: "7.5pt", lineHeight: 1.15 };
  const cellC: React.CSSProperties = { ...cell, textAlign: "center" };
  const cellCB: React.CSSProperties = { ...cellC, fontWeight: "bold" };

  return (
    <div
      className="doc-page-rs"
      id="doc-page-rs-1"
      style={{
        width: "210mm",
        height: "297mm",
        minHeight: "297mm",
        maxHeight: "297mm",
        overflow: "hidden",
        background: "white",
        padding: "6mm 10mm 5mm 10mm",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "8pt",
        lineHeight: 1.15,
        color: "#000",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ===== CABEÇALHO INSTITUCIONAL ===== */}
      {/* O original tem uma tabela com borda externa e o brasão à esquerda */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: b }}>
        <colgroup>
          <col style={{ width: "90px" }} />
          <col />
          <col style={{ width: "130px" }} />
          <col style={{ width: "110px" }} />
        </colgroup>
        <tbody>
          {/* Brasão (rowspan) + GOVERNO (bold, SEM sublinhado no original) */}
          <tr>
            <td rowSpan={8} style={{ borderRight: b, padding: "4px", verticalAlign: "middle", textAlign: "center" }}>
              <img src={BRASAO_RS_URL} alt="Brasão RS" style={{ width: 75, height: "auto", display: "block", margin: "0 auto" }} />
            </td>
            <td colSpan={3} style={{ padding: "2px 6px", fontWeight: "bold", fontSize: "10.5pt" }}>
              <V val={f.governo || "GOVERNO DO ESTADO DO RIO GRANDE DO SUL"} orig="GOVERNO DO ESTADO DO RIO GRANDE DO SUL" hl={hl} />
            </td>
          </tr>
          {/* SECRETARIA (normal, sem negrito) */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontSize: "8.5pt" }}>
              <V val={f.secretaria || "SECRETARIA DE ESTADO DA EDUCAÇÃO"} orig="SECRETARIA DE ESTADO DA EDUCAÇÃO" hl={hl} />
            </td>
          </tr>
          {/* DIRETORIA (normal, sem negrito) */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontSize: "8.5pt" }}>
              <V val={f.coordenadoria || "DIRETORIA DE ENSINO DE PALMEIRA DAS MISSÕES"} orig="DIRETORIA DE ENSINO DE PALMEIRA DAS MISSÕES" hl={hl} />
            </td>
          </tr>
          {/* ESCOLA (bold + underline) */}
          <tr>
            <td colSpan={3} style={{ padding: "1px 6px", fontWeight: "bold", fontSize: "9.5pt", textDecoration: "underline" }}>
              <V val={f.escola} orig="ESCOLA ESTADUAL TRÊS MÁRTIRES" hl={hl} />
            </td>
          </tr>
          {/* Ato Legal */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Ato Legal de Criação: <V val={f.ato_legal} orig="DECRETO 52.597 DE 30/12/1970" hl={hl} />
            </td>
          </tr>
          {/* Endereço + Número */}
          <tr>
            <td colSpan={2} style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Endereço: <V val={f.endereco_escola} orig="Av Independência" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              <V val={f.numero_escola || "Nº 677"} orig="Nº 677" hl={hl} />
            </td>
          </tr>
          {/* Bairro + Município + CEP */}
          <tr>
            <td style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Bairro: <V val={f.bairro} orig="Centro" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              Município: <V val={f.municipio_escola} orig="Palmeiras das Missões" hl={hl} />
            </td>
            <td style={{ borderLeft: b, padding: "0px 4px", fontSize: "7.5pt" }}>
              CEP: <V val={f.cep_escola} orig="98300-000" hl={hl} />
            </td>
          </tr>
          {/* Tel + Email */}
          <tr>
            <td colSpan={3} style={{ padding: "0px 6px", fontSize: "7.5pt" }}>
              Tel. <V val={f.telefone_escola} orig="(51) 3742-1105" hl={hl} />
              <span style={{ marginLeft: 40 }}>
                Endereço eletrônico: <V val={f.email_escola} orig="e923060a@educacao.rs.gov.br" hl={hl} />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ===== TÍTULO — fundo cinza claro como no original ===== */}
      <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "11pt", padding: "3px 0", background: "#e8e8e8", border: b, borderTop: "none", marginTop: -1 }}>
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
              <b>Nome do Aluno: </b><V val={f.nome_aluno} orig="RENATA PEREIRA DE ALMEIDA" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px" }}>
              <b>R.G: </b><V val={f.rg} orig="2101661169" hl={hl} />
            </td>
            <td style={{ border: b, padding: "2px 4px" }}>
              <b>RA: </b><V val={f.ra} orig="451097624" hl={hl} />
            </td>
          </tr>
          <tr>
            <td rowSpan={2} style={{ border: b, padding: "2px 4px", verticalAlign: "top" }}>
              <b>Nascimento</b>
              <div style={{ marginTop: 1 }}>Município: <V val={f.municipio_nascimento} orig="Palmeira das Missões" hl={hl} /></div>
              <div>Data: <V val={f.data_nascimento} orig="15/05/1990" hl={hl} /></div>
            </td>
            <td style={{ border: b, padding: "2px 4px" }}><b>Estado: </b><V val={f.estado_nascimento} orig="RS" hl={hl} /></td>
            <td style={{ border: b, padding: "2px 4px" }}><b>País: </b><V val={f.pais} orig="BRASIL" hl={hl} /></td>
          </tr>
          <tr>
            <td style={{ border: b, padding: "2px 4px", textAlign: "center" }}>-</td>
            <td style={{ border: b, padding: "2px 4px", textAlign: "center" }}>-</td>
          </tr>
        </tbody>
      </table>

      {/* ===== FUNDAMENTO LEGAL (vertical) + MATRIZ + ESTUDOS ===== */}
      <div style={{ display: "flex", marginTop: -1 }}>
        {/* Fundamento Legal — coluna vertical estreita com CSS writing-mode */}
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
            Fundamento Legal: {f.fundamento_legal}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Título da Matriz */}
          <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "8.5pt", padding: "2px 0", border: b, borderLeft: "none" }}>
            MATRIZ CURRICULAR – ESCOLA ESTADUAL DE ENSINO MÉDIO
          </div>

          {/* ===== TABELA DE NOTAS ===== */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt", tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "18px" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "6%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "9%" }} />
            </colgroup>
            <thead>
              <tr>
                <th rowSpan={2} style={{ ...cellCB, fontSize: "6pt", padding: "1px", borderLeft: "none" }}></th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>ÁREAS DE<br />CONHECIMENTO</th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>COMPONENTES<br />CURRICULARES</th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>Ano<br />Série</th>
                <th style={{ ...cellCB, fontSize: "7.5pt" }}>
                  <b><V val={f.ano_1a_serie} orig="2007" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>1ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "7.5pt" }}>
                  <b><V val={f.ano_2a_serie} orig="2008" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>2ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "7.5pt" }}>
                  <b><V val={f.ano_3a_serie} orig="2009" hl={hl} /></b><br />
                  <span style={{ fontWeight: "normal", fontSize: "6.5pt" }}>3ª</span>
                </th>
                <th style={{ ...cellCB, fontSize: "7pt" }}>Carga<br />horária</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let gradeIdx = 0;
                return areas.map((area, areaIdx) => {
                  const rows: React.ReactNode[] = [];
                  for (let r = 0; r < area.rows; r++) {
                    const grade = grades[gradeIdx];
                    if (!grade) { gradeIdx++; continue; }
                    rows.push(
                      <tr key={`grade-${gradeIdx}`}>
                        {areaIdx === 0 && r === 0 && (
                          <td rowSpan={11} style={{
                            ...cellCB,
                            fontSize: "6.5pt",
                            padding: "0",
                            verticalAlign: "middle",
                            textAlign: "center",
                            width: 18,
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
                        {r === 0 && (
                          <td rowSpan={area.rows} style={{ ...cellCB, fontSize: "7pt", verticalAlign: "middle", padding: "1px 3px", lineHeight: 1.15 }}>
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
                    gradeIdx++;
                  }
                  return rows;
                });
              })()}

              {/* TOTAL DA BASE NACIONAL COMUM */}
              <tr>
                <td colSpan={4} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none" }}>TOTAL DA BASE NACIONAL COMUM</td>
                <td style={cellC}>-</td>
                <td style={cellC}>-</td>
                <td style={cellC}>-</td>
                <td style={cellCB}>{totalBNC.toLocaleString("pt-BR")}</td>
              </tr>

              {/* PARTE DIVERSIFICADA */}
              <tr>
                <td colSpan={2} style={{ ...cellCB, fontSize: "7pt", padding: "2px 4px", lineHeight: 1.15, borderLeft: "none" }}>
                  PARTE<br />DIVERSIFICADA
                </td>
                <td style={{ ...cell, padding: "1px 4px" }}>{gradesDiversificada[0]?.disciplina}</td>
                <td style={cellC}></td>
                <td style={cellC}>{gradesDiversificada[0]?.nota1}</td>
                <td style={cellC}>{gradesDiversificada[0]?.nota2}</td>
                <td style={cellC}>{gradesDiversificada[0]?.nota3}</td>
                <td style={cellC}>{gradesDiversificada[0]?.ch}</td>
              </tr>

              {/* TOTAL DA PARTE DIVERSIFICADA */}
              <tr>
                <td colSpan={4} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none" }}>TOTAL DA PARTE DIVERSIFICADA</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}>{totalDiv}</td>
              </tr>

              {/* TOTAL GERAL DA CARGA HORÁRIA */}
              <tr>
                <td colSpan={4} style={{ ...cellCB, padding: "1.5px 4px", borderLeft: "none" }}>TOTAL GERAL DA CARGA HORÁRIA</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}>-</td>
                <td style={cellCB}><V val={f.carga_horaria_total} orig="4.600" hl={hl} /></td>
              </tr>
            </tbody>
          </table>

          {/* ===== ESTUDOS REALIZADOS ===== */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "7.5pt", tableLayout: "fixed", marginTop: -1 }}>
            <colgroup>
              <col style={{ width: "18px" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "28%" }} />
              <col style={{ width: "17%" }} />
              <col style={{ width: "5%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td rowSpan={4} style={{
                  ...cellCB,
                  fontSize: "6.5pt",
                  padding: "0",
                  verticalAlign: "middle",
                  textAlign: "center",
                  width: 18,
                  borderLeft: "none",
                  position: "relative",
                }}>
                  <div style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: "7pt",
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
                <td style={{ ...cellC, fontSize: "7pt" }}>---------------------</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Série</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Ano</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Estabelecimento de Ensino</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>Município</td>
                <td style={{ ...cellCB, fontSize: "7pt" }}>UF</td>
              </tr>
              {/* 1ª Série */}
              <tr>
                <td rowSpan={3} style={{ ...cellCB, padding: "6px 3px", fontSize: "7.5pt", verticalAlign: "middle" }}>Ensino Médio</td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}>1ª Série</td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt", fontWeight: "bold" }}><V val={f.ano_1a_serie} orig="2007" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.escola_1a} orig="Escola Estadual Três Mártires" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.municipio_1a} orig="Palmeira das Missões" hl={hl} /></td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.uf_1a || "RS"} orig="RS" hl={hl} /></td>
              </tr>
              {/* 2ª Série */}
              <tr>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}>2ª Série</td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt", fontWeight: "bold" }}><V val={f.ano_2a_serie} orig="2008" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.escola_2a} orig="Escola Estadual Três Mártires" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.municipio_2a} orig="Palmeira das Missões" hl={hl} /></td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.uf_2a || "RS"} orig="RS" hl={hl} /></td>
              </tr>
              {/* 3ª Série */}
              <tr>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}>3ª Série</td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt", fontWeight: "bold" }}><V val={f.ano_3a_serie} orig="2009" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.escola_3a} orig="Escola Estadual Três Mártires" hl={hl} /></td>
                <td style={{ ...cell, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.municipio_3a} orig="Palmeira das Missões" hl={hl} /></td>
                <td style={{ ...cellC, padding: "8px 3px", fontSize: "7.5pt" }}><V val={f.uf_3a || "RS"} orig="RS" hl={hl} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ESCALA DE AVALIAÇÃO ===== */}
      <div style={{ marginTop: 3, fontSize: "7pt", lineHeight: 1.25 }}>
        <b>Escala de Avaliação: </b>
        "<i><V val={f.escala_avaliacao} orig="A partir de 2007 - Escala numérica de notas de 0 (zero) a 10 (dez) com patamar indicativo de desempenho escolar satisfatório, a nota igual ou superior a 05 (cinco) nos termos da Resolução SE - 61, de 24/9/2007." hl={hl} /></i>"
      </div>

      {/* ===== OBSERVAÇÕES ===== */}
      <div style={{ marginTop: 2, fontSize: "7.5pt", lineHeight: 1.25 }}>
        <b>OBSERVAÇÕES:</b>
        <ul style={{ margin: "1px 0 0 20px", padding: 0 }}>
          <li><V val={f.observacao} orig="Aluno Concluiu o ensino médio no ano de 2009, podendo dar prosseguimento no ensino superior." hl={hl} /></li>
        </ul>
      </div>

      {/* ===== SEPARADOR + CERTIFICADO ===== */}
      <div style={{ marginTop: 6 }}>
        {/* Linha separadora como no original */}
        <div style={{ borderTop: "1.5px solid #000", width: "55%", margin: "0 auto 3px auto" }} />
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "10pt", textDecoration: "underline", letterSpacing: "3px", marginBottom: 3 }}>
          C E R T I F I C A D O
        </div>
        <p style={{ textAlign: "justify", fontSize: "8pt", lineHeight: 1.35, margin: "0 0 2px 0" }}>
          <b>
            A Direção da{" "}
            <V val={f.escola} orig="Escola Estadual Três Mártires" hl={hl} />, CERTIFICA, nos termos do Inciso VII, Artigo 24 da Lei Federal 9394/96, que{" "}
            <V val={f.nome_aluno} orig="RENATA PEREIRA DE ALMEIDA" hl={hl} />, R.G{" "}
            <V val={f.rg} orig="2101661169" hl={hl} />{" "}concluiu o Ensino Médio no ano de{" "}
            <V val={f.ano_conclusao} orig="2009" hl={hl} />.
          </b>
        </p>
      </div>

      {/* ===== REGISTRO ===== */}
      <div style={{ marginTop: 2, fontSize: "7.5pt" }}>
        <b>Número de registro da publicação</b> no Sistema SEDUC (Resolução SE108/05):  Em Geração
      </div>

      {/* ===== 2 VIA ===== */}
      <div style={{ marginTop: 14, textAlign: "center" }}>
        <b style={{ fontSize: "9pt" }}>2 VIA</b>
      </div>

      {/* ===== RODAPÉ ===== */}
      <div style={{ position: "absolute", bottom: "6mm", left: "10mm", fontSize: "6.5pt", color: "#000" }}>
        GT-HEMTI-V.1
      </div>
    </div>
  );
}
