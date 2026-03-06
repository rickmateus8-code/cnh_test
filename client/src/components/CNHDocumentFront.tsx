import React from 'react';

export interface CNHData {
  nome: string;
  cpf: string;
  sexo: string;
  rg: string;
  orgaoEmissor: string;
  ufRg: string;
  nacionalidade: string;
  dataNascimento: string;
  localNascimento: string;
  ufNasc: string;
  nomePai: string;
  nomeMae: string;
  nRegistro: string;
  nCNH: string;
  categoria: string;
  tipo: string;
  validade: string;
  emissao: string;
  primeiraHabilitacao: string;
  localEmissao: string;
  ufEmissao: string;
  senhaApp: string;
  observacoes: string;
  assDigital1: string;
  assDigital2: string;
}

interface CNHDocumentFrontProps {
  data: CNHData;
  photoUrl: string | null;
  signatureUrl: string | null;
}

const formatCPF = (cpf: string) => {
  const c = cpf.replace(/\D/g, '');
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (d: string) => {
  if (!d) return '';
  if (d.includes('/')) return d;
  const parts = d.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return d;
};

const CNHDocumentFront: React.FC<CNHDocumentFrontProps> = ({ data, photoUrl, signatureUrl }) => {
  return (
    <div
      id="cnh-front"
      style={{
        width: '856px',
        height: '540px',
        position: 'relative',
        fontFamily: "'Arial', 'Helvetica', sans-serif",
        background: 'linear-gradient(135deg, #d4e4c0 0%, #e8ecd8 20%, #c8d8b0 40%, #dde8cc 60%, #c0d4a8 80%, #e0ecd0 100%)',
        border: '2px solid #8a9a70',
        borderRadius: '8px',
        overflow: 'hidden',
        color: '#1a1a1a',
        boxSizing: 'border-box',
      }}
    >
      {/* Watermark pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(45deg, #4a6a30 0px, #4a6a30 1px, transparent 1px, transparent 10px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ===== CABEÇALHO ===== */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 16px 4px',
        background: 'linear-gradient(180deg, rgba(180,160,80,0.25) 0%, transparent 100%)',
      }}>
        {/* Brasão */}
        <div style={{ width: '52px', height: '52px', marginRight: '12px', flexShrink: 0 }}>
          <svg viewBox="0 0 60 60" width="52" height="52">
            <circle cx="30" cy="30" r="28" fill="#c8a832" stroke="#8a7020" strokeWidth="1.5"/>
            <text x="30" y="35" textAnchor="middle" fontSize="10" fill="#2a4a10" fontWeight="bold">BR</text>
          </svg>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#3a2a00', textTransform: 'uppercase' }}>
            REPÚBLICA FEDERATIVA DO BRASIL
          </div>
          <div style={{ fontSize: '7.5px', color: '#4a3a10', letterSpacing: '0.8px', marginTop: '1px' }}>
            MINISTÉRIO DA INFRAESTRUTURA
          </div>
          <div style={{ fontSize: '7.5px', color: '#4a3a10', letterSpacing: '0.8px' }}>
            SECRETARIA NACIONAL DE TRÂNSITO
          </div>
        </div>
        {/* BR oval */}
        <div style={{
          width: '48px', height: '36px', marginLeft: '12px', flexShrink: 0,
          background: 'linear-gradient(135deg, #c8a832, #e0c848)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid #8a7020',
        }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a5a10' }}>BR</span>
        </div>
      </div>

      {/* Subtítulo verde */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(90deg, #2a5a18, #3a7a28, #2a5a18)',
        padding: '3px 16px',
        textAlign: 'center',
        marginTop: '2px',
      }}>
        <span style={{ fontSize: '7px', color: '#f0e8c0', letterSpacing: '0.5px', fontWeight: 'bold' }}>
          CARTEIRA NACIONAL DE HABILITAÇÃO / DRIVER LICENSE / PERMISO DE CONDUCCIÓN
        </span>
      </div>

      {/* ===== CORPO PRINCIPAL ===== */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', padding: '6px 12px 0' }}>

        {/* COLUNA ESQUERDA: Mapa + Foto + Assinatura */}
        <div style={{ width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Mapa do Brasil */}
          <div style={{ width: '50px', height: '55px', margin: '4px 0 6px', opacity: 0.7 }}>
            <svg viewBox="0 0 100 120" width="50" height="55">
              <path d="M50,5 C30,5 15,20 10,40 C5,60 10,80 25,95 C35,105 45,115 55,115 C65,115 75,105 85,90 C95,75 95,55 90,40 C85,25 70,5 50,5Z" fill="#e07020" stroke="#c05010" strokeWidth="2"/>
            </svg>
          </div>

          {/* Foto */}
          <div style={{
            width: '120px', height: '155px',
            border: '1.5px solid #6a7a50',
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {photoUrl ? (
              <img src={photoUrl} alt="Foto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: '#aaa', fontSize: '10px', textAlign: 'center' }}>FOTO<br/>3x4</div>
            )}
          </div>

          {/* Assinatura do portador */}
          <div style={{
            width: '120px', height: '40px', marginTop: '6px',
            border: '1px solid #8a9a70',
            background: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {signatureUrl ? (
              <img src={signatureUrl} alt="Assinatura" style={{ maxWidth: '110px', maxHeight: '36px', objectFit: 'contain' }} />
            ) : (
              <div style={{ color: '#ccc', fontSize: '8px' }}>Assinatura</div>
            )}
          </div>
          <div style={{ fontSize: '5.5px', color: '#4a5a30', marginTop: '2px', textAlign: 'center' }}>
            <strong>7</strong> ASSINATURA DO PORTADOR
          </div>

          {/* Texto vertical */}
          <div style={{
            position: 'absolute', left: '2px', top: '90px',
            transform: 'rotate(-90deg)', transformOrigin: 'left top',
            fontSize: '6px', color: '#3a5a20', letterSpacing: '1px', fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}>
            VÁLIDA EM TODO O TERRITÓRIO NACIONAL
          </div>
        </div>

        {/* COLUNA DIREITA: Campos de dados */}
        <div style={{ flex: 1, paddingLeft: '10px', fontSize: '8px' }}>

          {/* Linha 1: Nome + 1ª Habilitação */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>2 e 1</strong> NOME E SOBRENOME</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '10px', fontWeight: 'bold', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)',
              }}>
                {data.nome}
              </div>
            </div>
            <div style={{ width: '100px' }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40', textAlign: 'right' }}>1ª HABILITAÇÃO</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '9px', fontWeight: 'bold', textAlign: 'center', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)',
              }}>
                {formatDate(data.primeiraHabilitacao)}
              </div>
            </div>
          </div>

          {/* Linha 2: Data, Local e UF de Nascimento */}
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>3</strong> DATA, LOCAL E UF DE NASCIMENTO</div>
            <div style={{
              borderBottom: '1px solid #7a8a60', padding: '2px 4px',
              fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
              background: 'rgba(255,255,255,0.3)',
            }}>
              {formatDate(data.dataNascimento)} {data.localNascimento}-{data.ufNasc}
            </div>
          </div>

          {/* Linha 3: Data Emissão + Validade + ACC + Tipo */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>4a</strong> DATA EMISSÃO</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)',
              }}>
                {formatDate(data.emissao)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>4b</strong> VALIDADE</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)',
              }}>
                {formatDate(data.validade)}
              </div>
            </div>
            <div style={{ width: '50px', textAlign: 'center' }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}>ACC</div>
              <div style={{
                background: '#444', height: '14px', borderRadius: '2px',
              }} />
            </div>
            <div style={{
              width: '40px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a',
              border: '1.5px solid #7a8a60', background: 'rgba(255,255,255,0.4)',
            }}>
              {data.tipo === 'DEFINITIVA' ? 'D' : 'P'}
            </div>
          </div>

          {/* Linha 4: Doc Identidade / Órgão Emissor / UF */}
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>4c</strong> DOC. IDENTIDADE / ÓRG EMISSOR / UF</div>
            <div style={{
              borderBottom: '1px solid #7a8a60', padding: '2px 4px',
              fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
              background: 'rgba(255,255,255,0.3)',
            }}>
              {data.rg} {data.orgaoEmissor}/{data.ufRg}
            </div>
          </div>

          {/* Linha 5: CPF + Nº Registro + Cat Hab */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>4d</strong> CPF</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)',
              }}>
                {formatCPF(data.cpf)}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>5</strong> Nº REGISTRO</div>
              <div style={{
                borderBottom: '1px solid #7a8a60', padding: '2px 4px',
                fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
                background: 'rgba(255,255,255,0.3)', color: '#cc0000',
              }}>
                {data.nRegistro}
              </div>
            </div>
            <div style={{ width: '55px' }}>
              <div style={{ fontSize: '5.5px', color: '#5a6a40' }}><strong>9</strong> CAT HAB</div>
              <div style={{
                padding: '2px 4px',
                fontSize: '16px', fontWeight: 'bold', textAlign: 'center',
                color: '#cc0000', minHeight: '16px',
                border: '1px solid #7a8a60', background: 'rgba(255,255,255,0.4)',
              }}>
                {data.categoria}
              </div>
            </div>
          </div>

          {/* Linha 6: Nacionalidade */}
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5.5px', color: '#5a6a40' }}>NACIONALIDADE</div>
            <div style={{
              borderBottom: '1px solid #7a8a60', padding: '2px 4px',
              fontSize: '9px', fontWeight: 'bold', minHeight: '16px',
              background: 'rgba(255,255,255,0.3)',
            }}>
              {data.nacionalidade}
            </div>
          </div>

          {/* Linha 7: Filiação */}
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '5.5px', color: '#5a6a40' }}>FILIAÇÃO</div>
            <div style={{
              border: '1px solid #7a8a60', padding: '3px 4px',
              fontSize: '8.5px', fontWeight: 'bold', minHeight: '28px',
              background: 'rgba(255,255,255,0.3)', lineHeight: '1.4',
            }}>
              <div>{data.nomePai}</div>
              <div>{data.nomeMae}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RODAPÉ: Tabela de categorias ===== */}
      <div style={{
        position: 'absolute', bottom: '0', left: '0', right: '0',
        zIndex: 1, padding: '0 12px 6px',
      }}>
        {/* Tabela de categorias compacta */}
        <div style={{
          display: 'flex', gap: '4px', fontSize: '5px',
          background: 'rgba(255,255,255,0.3)', padding: '3px',
          border: '1px solid #8a9a70', borderRadius: '2px',
        }}>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #8a9a70' }}>
                  <th style={{ padding: '1px 2px', textAlign: 'left', fontSize: '5px' }}>9</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>10</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>11</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>12</th>
                </tr>
              </thead>
              <tbody>
                {['ACC', 'A', 'A1', 'B', 'B1', 'C', 'C1'].map(cat => {
                  const isActive = data.categoria.includes(cat.replace('1',''));
                  return (
                    <tr key={cat} style={{ borderBottom: '0.5px solid #ccc' }}>
                      <td style={{ padding: '1px 2px', fontWeight: 'bold', fontSize: '5px' }}>{cat}</td>
                      <td style={{ padding: '1px 2px', fontSize: '5px', textAlign: 'center' }}>
                        {isActive && cat === 'B' ? formatDate(data.primeiraHabilitacao) : ''}
                      </td>
                      <td style={{ padding: '1px 2px', fontSize: '5px', textAlign: 'center' }}>
                        {isActive && cat === 'B' ? formatDate(data.validade) : ''}
                      </td>
                      <td style={{ padding: '1px 2px', fontSize: '5px' }}></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '0.5px solid #8a9a70' }}>
                  <th style={{ padding: '1px 2px', textAlign: 'left', fontSize: '5px' }}>9</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>10</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>11</th>
                  <th style={{ padding: '1px 2px', fontSize: '5px' }}>12</th>
                </tr>
              </thead>
              <tbody>
                {['D', 'D1', 'BE', 'CE', 'C1E', 'DE', 'D1E'].map(cat => (
                  <tr key={cat} style={{ borderBottom: '0.5px solid #ccc' }}>
                    <td style={{ padding: '1px 2px', fontWeight: 'bold', fontSize: '5px' }}>{cat}</td>
                    <td style={{ padding: '1px 2px', fontSize: '5px' }}></td>
                    <td style={{ padding: '1px 2px', fontSize: '5px' }}></td>
                    <td style={{ padding: '1px 2px', fontSize: '5px' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CNHDocumentFront;
