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
    fontFamily: "'Courier New', 'Courier', monospace",
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    margin: '0 auto',
    overflow: 'hidden',
    fontSize: '11px',
    lineHeight: '1.3',
  };

  const boxStyle: React.CSSProperties = {
    border: '1px solid #000',
    padding: '8px 10px',
    marginBottom: '10px',
    position: 'relative',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-7px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 6px',
    fontSize: '9px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
  };

  const carimboStyle: React.CSSProperties = {
    textAlign: 'center',
    position: 'absolute',
    fontFamily: "'Courier New', 'Courier', monospace",
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 10,
    fontSize: '11px',
    fontWeight: 'bold',
    lineHeight: '1.2',
    ...(via === 1 
      ? {
          left: '20%',
          bottom: '32%',
          transform: 'rotate(-6deg)',
        }
      : {
          right: '16%',
          bottom: '32%',
          transform: 'rotate(6deg)',
        }
    )
  };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título */}
      <div style={{ textAlign: 'center', marginBottom: '16px', marginTop: '6px', fontSize: '20px', fontWeight: 'bold' }}>
        Receituário Controle Especial
      </div>

      {/* Emitente + Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
        <div style={{ ...boxStyle, width: '75%', marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center', paddingTop: '3px', fontSize: '11px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{data.emitente.nome}</div>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ marginBottom: '2px' }}>{data.emitente.endereco}</div>
            <div>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '20%', fontSize: '9px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '6px', lineHeight: '1.2' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente */}
      <div style={{ ...boxStyle, padding: '8px 10px', marginBottom: '12px', fontSize: '11px' }}>
        <div style={{ marginBottom: '2px' }}>
          <span style={{ fontWeight: 'bold' }}>Paciente:</span>
          <span style={{ marginLeft: '4px' }}>{data.paciente.nome}</span>
        </div>
        <div>
          <span style={{ fontWeight: 'bold' }}>Endereço:</span>
          <span style={{ marginLeft: '4px' }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '20px', padding: '0 8px', fontSize: '11px' }}>
        <div style={{ marginBottom: '6px' }}>1) Via: {data.prescricao.viaAdministracao}</div>
        <div style={{ marginBottom: '2px' }}>{data.prescricao.medicamento} ..................... 1 cx.</div>
        <div style={{ fontSize: '10px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo */}
      <div style={carimboStyle}>
        <div>{data.medico.nome}</div>
        <div>CRM {data.medico.crm}</div>
        <div>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '10px', fontWeight: 'bold', fontSize: '11px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé */}
      <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
        {/* Comprador */}
        <div style={{ ...boxStyle, flex: 1.15, marginBottom: '0', padding: '8px 10px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={{ marginTop: '6px' }}>
            <div style={{ marginBottom: '4px' }}>Nome completo:</div>
            <div style={{ borderBottom: '1px solid #000', marginBottom: '6px', minHeight: '14px', paddingBottom: '2px' }}>
              {data.comprador.nome}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '6px' }}>
              <div style={{ flex: 1.2 }}>
                <div style={{ marginBottom: '2px' }}>Ident.</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '14px', paddingBottom: '2px' }}>
                  {data.comprador.ident}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2px' }}>Org. Emissor</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '14px', paddingBottom: '2px' }}>
                  {data.comprador.orgEmissor}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '4px' }}>End. completo</div>
            <div style={{ borderBottom: '1px solid #000', marginBottom: '6px', minHeight: '14px', paddingBottom: '2px' }}>
              {data.comprador.endereco}
            </div>

            <div style={{ borderBottom: '1px solid #000', marginBottom: '6px', minHeight: '14px', paddingBottom: '2px' }}>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '2px' }}>Telefone</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '14px', paddingBottom: '2px' }}>
                  {data.comprador.telefone}
                </div>
              </div>
              <div style={{ flex: 1.3 }}>
                <div style={{ marginBottom: '2px' }}>Cidade</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '14px', paddingBottom: '2px' }}>
                  {data.comprador.cidade}
                </div>
              </div>
              <div style={{ flex: 0.5 }}>
                <div style={{ marginBottom: '2px', textAlign: 'center' }}>UF</div>
                <div style={{ borderBottom: '1px solid #000', minHeight: '14px', paddingBottom: '2px', textAlign: 'center' }}>
                  {data.comprador.uf}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fornecedor */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0', padding: '8px 10px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1 }}></div>
            <div style={{ borderTop: '1px solid #000', textAlign: 'center', fontSize: '10px', paddingTop: '4px', marginBottom: '6px' }}>
              Assinatura do Farmacêutico
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', alignItems: 'center' }}>
              <span>Data</span>
              <span style={{ borderBottom: '1px solid #000', width: '24px', height: '12px' }}></span>
              <span>/</span>
              <span style={{ borderBottom: '1px solid #000', width: '24px', height: '12px' }}></span>
              <span>/</span>
              <span style={{ borderBottom: '1px solid #000', width: '32px', height: '12px' }}></span>
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
