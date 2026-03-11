import React from 'react';

export interface RecipeData {
  emitente: {
    nome: string;
    cnpj: string;
    endereco: string;
    cidadeUfFone: string;
  };
  paciente: {
    nome: string;
    endereco: string;
  };
  prescricao: {
    viaAdministracao: string;
    medicamento: string;
    orientacao: string;
  };
  medico: {
    nome: string;
    crm: string;
    cpf: string;
  };
  data: string;
  comprador: {
    nome: string;
    ident: string;
    orgEmissor: string;
    endereco: string;
    telefone: string;
    cidade: string;
    uf: string;
  };
}

interface SinglePageProps {
  data: RecipeData;
  via: number;
  id?: string;
}

const SinglePage: React.FC<SinglePageProps> = ({ data, via, id }) => {
  const pageStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    backgroundColor: 'white',
    padding: '15mm 18mm',
    fontFamily: "'Times New Roman', 'Helvetica', 'Arial', serif",
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    margin: '0 auto',
    overflow: 'hidden',
  };

  const boxStyle: React.CSSProperties = {
    border: '1px solid #000',
    padding: '10px 12px',
    marginBottom: '12px',
    position: 'relative',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 8px',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const carimboStyle: React.CSSProperties = {
    textAlign: 'center',
    position: 'absolute',
    fontFamily: "'Times New Roman', 'Helvetica', 'Arial', serif",
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 10,
    ...(via === 1 
      ? {
          left: '22%',
          bottom: '28%',
          transform: 'rotate(-8deg)',
        }
      : {
          right: '18%',
          bottom: '28%',
          transform: 'rotate(8deg)',
        }
    )
  };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título Principal */}
      <div style={{ textAlign: 'center', marginBottom: '18px', marginTop: '8px' }}>
        <h1 style={{ fontSize: '26px', margin: '0', fontWeight: 'bold', letterSpacing: '0px' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
        <div style={{ ...boxStyle, width: '76%', marginBottom: '0', padding: '12px 14px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center', paddingTop: '3px' }}>
            <div style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.2px', lineHeight: '1.2' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', margin: '4px 0', lineHeight: '1.2' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '11px', marginBottom: '2px', lineHeight: '1.3' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '11px', lineHeight: '1.3' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '20%', fontSize: '9px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px', lineHeight: '1.2' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço */}
      <div style={{ ...boxStyle, padding: '8px 12px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', marginBottom: '3px', fontSize: '12px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '6px', whiteSpace: 'nowrap' }}>Paciente:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex', fontSize: '12px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '6px', whiteSpace: 'nowrap' }}>Endereço:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '22px', padding: '0 8px', fontSize: '12px', lineHeight: '1.4' }}>
        <div style={{ marginBottom: '8px' }}>1) Via: {data.prescricao.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div style={{ fontWeight: 'normal' }}>{data.prescricao.medicamento} ............................ 1 cx.</div>
        </div>
        <div style={{ fontSize: '11px', marginTop: '2px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo Médico */}
      <div style={carimboStyle}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', lineHeight: '1.1' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1.1' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1.1' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '12px', fontWeight: 'bold', fontSize: '13px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Boxes de Identificação */}
      <div style={{ display: 'flex', gap: '12px' }}>
        {/* IDENTIFICAÇÃO DO COMPRADOR */}
        <div style={{ ...boxStyle, flex: 1.15, marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          
          <div style={{ marginTop: '8px', fontSize: '11px' }}>
            {/* Nome completo */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ marginBottom: '2px' }}>Nome completo:</div>
              <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                <span style={{ fontSize: '11px' }}>{data.comprador.nome}</span>
              </div>
            </div>

            {/* Ident + Org Emissor */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '6px' }}>
              <div style={{ flex: 1.2 }}>
                <div style={{ marginBottom: '2px' }}>Ident.</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                  <span style={{ fontSize: '11px' }}>{data.comprador.ident}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2px' }}>Org. Emissor</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                  <span style={{ fontSize: '11px' }}>{data.comprador.orgEmissor}</span>
                </div>
              </div>
            </div>

            {/* End. completo */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ marginBottom: '2px' }}>End. completo</div>
              <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                <span style={{ fontSize: '11px' }}>{data.comprador.endereco}</span>
              </div>
            </div>

            {/* Telefone + Cidade + UF */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 0.9 }}>
                <div style={{ marginBottom: '2px' }}>Telefone</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                  <span style={{ fontSize: '11px' }}>{data.comprador.telefone}</span>
                </div>
              </div>
              <div style={{ flex: 1.3 }}>
                <div style={{ marginBottom: '2px' }}>Cidade</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px' }}>
                  <span style={{ fontSize: '11px' }}>{data.comprador.cidade}</span>
                </div>
              </div>
              <div style={{ flex: 0.5 }}>
                <div style={{ marginBottom: '2px', textAlign: 'center' }}>UF</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '16px', paddingBottom: '2px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px' }}>{data.comprador.uf}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IDENTIFICAÇÃO DO FORNECEDOR */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          
          <div style={{ marginTop: '8px', fontSize: '11px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1 }}></div>
            
            <div style={{ borderTop: '1px solid #000', textAlign: 'center', fontSize: '10px', paddingTop: '4px', marginBottom: '8px' }}>
              Assinatura do Farmacêutico
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px' }}>Data</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ borderBottom: '1px solid #000', width: '30px', height: '14px' }}></div>
                <span>/</span>
                <div style={{ borderBottom: '1px solid #000', width: '30px', height: '14px' }}></div>
                <span>/</span>
                <div style={{ borderBottom: '1px solid #000', width: '40px', height: '14px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecipeDocumentProps {
  data: RecipeData;
}

const RecipeDocument: React.FC<RecipeDocumentProps> = ({ data }) => {
  return (
    <div id="recipe-full-container" className="recipe-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <SinglePage data={data} via={1} id="recipe-page-1" />
      <SinglePage data={data} via={2} id="recipe-page-2" />
    </div>
  );
};

export default RecipeDocument;
