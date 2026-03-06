import React from 'react';
import type { CNHData } from './CNHDocumentFront';

interface CNHDocumentBackProps {
  data: CNHData;
  signatureUrl: string | null;
}

const formatDate = (d: string) => {
  if (!d) return '';
  if (d.includes('/')) return d;
  const parts = d.split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return d;
};

const CNHDocumentBack: React.FC<CNHDocumentBackProps> = ({ data, signatureUrl }) => {
  const ufNames: Record<string, string> = {
    'AC': 'ACRE', 'AL': 'ALAGOAS', 'AP': 'AMAPÁ', 'AM': 'AMAZONAS',
    'BA': 'BAHIA', 'CE': 'CEARÁ', 'DF': 'DISTRITO FEDERAL', 'ES': 'ESPÍRITO SANTO',
    'GO': 'GOIÁS', 'MA': 'MARANHÃO', 'MT': 'MATO GROSSO', 'MS': 'MATO GROSSO DO SUL',
    'MG': 'MINAS GERAIS', 'PA': 'PARÁ', 'PB': 'PARAÍBA', 'PR': 'PARANÁ',
    'PE': 'PERNAMBUCO', 'PI': 'PIAUÍ', 'RJ': 'RIO DE JANEIRO', 'RN': 'RIO GRANDE DO NORTE',
    'RS': 'RIO GRANDE DO SUL', 'RO': 'RONDÔNIA', 'RR': 'RORAIMA', 'SC': 'SANTA CATARINA',
    'SP': 'SÃO PAULO', 'SE': 'SERGIPE', 'TO': 'TOCANTINS',
  };

  const estadoNome = ufNames[data.ufEmissao] || data.ufEmissao;

  return (
    <div
      id="cnh-back"
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
        padding: '12px 16px',
      }}
    >
      {/* Watermark */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'repeating-linear-gradient(45deg, #4a6a30 0px, #4a6a30 1px, transparent 1px, transparent 10px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ===== TABELA DE CATEGORIAS (TOPO) ===== */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Tabela esquerda */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', border: '1px solid #7a8a60' }}>
              <thead>
                <tr style={{ background: 'rgba(200,216,176,0.5)' }}>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px', width: '50px', textAlign: 'left' }}>9</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>10</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>11</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>12</th>
                </tr>
              </thead>
              <tbody>
                {['ACC', 'A', 'A1', 'B', 'B1', 'C', 'C1'].map(cat => {
                  const catLetter = cat.replace(/\d/g, '');
                  const isActive = data.categoria.includes(catLetter);
                  return (
                    <tr key={cat}>
                      <td style={{ border: '1px solid #aab890', padding: '2px 4px', fontWeight: 'bold' }}>
                        <span style={{ marginRight: '4px', fontSize: '10px' }}>
                          {cat === 'ACC' ? '🏍' : cat.startsWith('A') ? '🏍' : cat.startsWith('B') ? '🚗' : cat.startsWith('C') ? '🚛' : ''}
                        </span>
                        {cat}
                      </td>
                      <td style={{ border: '1px solid #aab890', padding: '2px 4px', textAlign: 'center', fontSize: '7px' }}>
                        {isActive && !cat.includes('1') && cat !== 'ACC' ? formatDate(data.primeiraHabilitacao) : ''}
                      </td>
                      <td style={{ border: '1px solid #aab890', padding: '2px 4px', textAlign: 'center', fontSize: '7px' }}>
                        {isActive && !cat.includes('1') && cat !== 'ACC' ? formatDate(data.validade) : ''}
                      </td>
                      <td style={{ border: '1px solid #aab890', padding: '2px 4px', textAlign: 'center', fontSize: '7px' }}>
                        {isActive && !cat.includes('1') && cat !== 'ACC' ? 'XXXX' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tabela direita */}
          <div style={{ flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8px', border: '1px solid #7a8a60' }}>
              <thead>
                <tr style={{ background: 'rgba(200,216,176,0.5)' }}>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px', width: '50px', textAlign: 'left' }}>9</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>10</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>11</th>
                  <th style={{ border: '1px solid #8a9a70', padding: '3px 4px' }}>12</th>
                </tr>
              </thead>
              <tbody>
                {['D', 'D1', 'BE', 'CE', 'C1E', 'DE', 'D1E'].map(cat => (
                  <tr key={cat}>
                    <td style={{ border: '1px solid #aab890', padding: '2px 4px', fontWeight: 'bold' }}>
                      <span style={{ marginRight: '4px', fontSize: '10px' }}>
                        {cat.startsWith('D') ? '🚌' : '🚛'}
                      </span>
                      {cat}
                    </td>
                    <td style={{ border: '1px solid #aab890', padding: '2px 4px' }}></td>
                    <td style={{ border: '1px solid #aab890', padding: '2px 4px' }}></td>
                    <td style={{ border: '1px solid #aab890', padding: '2px 4px' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== OBSERVAÇÕES ===== */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '12px' }}>
        <div style={{ fontSize: '7px', color: '#5a6a40', marginBottom: '2px' }}><strong>12</strong> OBSERVAÇÕES</div>
        <div style={{
          border: '1.5px solid #7a8a60',
          minHeight: '100px',
          padding: '8px',
          fontSize: '9px',
          fontWeight: 'bold',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '2px',
        }}>
          {data.observacoes}
        </div>
      </div>

      {/* ===== ASSINATURA DIGITAL ===== */}
      <div style={{
        position: 'relative', zIndex: 1, marginTop: '12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      }}>
        <div>
          {/* QR Code placeholder */}
          <div style={{
            width: '60px', height: '60px',
            border: '1px solid #8a9a70',
            background: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '6px', color: '#888',
          }}>
            QR CODE
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          {signatureUrl && (
            <img src={signatureUrl} alt="Assinatura Emissor" style={{ height: '30px', marginBottom: '4px' }} />
          )}
          <div style={{ fontSize: '7px', color: '#4a5a30', borderTop: '1px solid #7a8a60', paddingTop: '2px' }}>
            ASSINADO DIGITALMENTE
          </div>
          <div style={{ fontSize: '6.5px', color: '#4a5a30' }}>
            DEPARTAMENTO ESTADUAL DE TRÂNSITO
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '6px', color: '#5a6a40' }}>Nº ESPELHO</div>
          <div style={{ fontSize: '8px', fontWeight: 'bold' }}>{data.nCNH}</div>
          <div style={{ fontSize: '6px', color: '#5a6a40', marginTop: '4px' }}>ASS. DIGITAL</div>
          <div style={{ fontSize: '7px', fontWeight: 'bold' }}>{data.assDigital1}</div>
          <div style={{ fontSize: '7px', fontWeight: 'bold' }}>{data.assDigital2}</div>
        </div>
      </div>

      {/* ===== LOCAL ===== */}
      <div style={{ position: 'relative', zIndex: 1, marginTop: '8px' }}>
        <div style={{ fontSize: '6px', color: '#5a6a40' }}>LOCAL</div>
        <div style={{
          borderBottom: '1px solid #7a8a60', padding: '2px 4px',
          fontSize: '9px', fontWeight: 'bold',
          background: 'rgba(255,255,255,0.3)',
        }}>
          {data.localEmissao}, {data.ufEmissao}
        </div>
      </div>

      {/* ===== NOME DO ESTADO (GRANDE) ===== */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '0', right: '0',
        textAlign: 'center', zIndex: 1,
      }}>
        <div style={{
          fontSize: '24px', fontWeight: 'bold', color: '#2a4a18',
          letterSpacing: '3px',
        }}>
          {estadoNome}
        </div>
      </div>
    </div>
  );
};

export default CNHDocumentBack;
