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
    padding: '12mm 15mm',
    fontFamily: "'Helvetica', 'Arial', sans-serif",
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
    padding: '8px 12px',
    marginBottom: '12px',
    position: 'relative',
    borderRadius: '2px',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-7px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 8px',
    fontSize: '9px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  // Posições diferentes para o carimbo conforme original
  const carimboStyle: React.CSSProperties = {
    textAlign: 'center',
    position: 'absolute',
    fontFamily: "'Helvetica', 'Arial', sans-serif",
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 10,
    ...(via === 1 
      ? {
          left: '25%',
          bottom: '30%',
          transform: 'rotate(-6deg)',
        }
      : {
          right: '20%',
          bottom: '30%',
          transform: 'rotate(8deg)',
        }
    )
  };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título Principal - Proporção original */}
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '5px' }}>
        <h1 style={{ fontSize: '28px', margin: '0', fontWeight: 'bold', letterSpacing: '0.5px' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' }}>
        <div style={{ ...boxStyle, width: '75%', marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center', paddingTop: '4px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.3px' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '12px', marginBottom: '2px', lineHeight: '1.2' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '12px', lineHeight: '1.2' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '22%', fontSize: '10px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '8px', lineHeight: '1.3' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço */}
      <div style={{ ...boxStyle, padding: '8px 12px', marginBottom: '15px' }}>
        <div style={{ display: 'flex', marginBottom: '4px', fontSize: '13px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '8px', whiteSpace: 'nowrap' }}>Paciente:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex', fontSize: '13px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '8px', whiteSpace: 'nowrap' }}>Endereço:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '20px', padding: '0 8px', fontSize: '13px', lineHeight: '1.4' }}>
        <div style={{ marginBottom: '8px' }}>1) Via: {data.prescricao.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <div style={{ fontWeight: 'normal' }}>{data.prescricao.medicamento} ......................... 1 cx.</div>
        </div>
        <div style={{ fontSize: '12px', marginTop: '2px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo Médico - Tamanho padronizado */}
      <div style={carimboStyle}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: '1.2' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '12px', fontWeight: 'bold', fontSize: '14px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Boxes de Identificação */}
      <div style={{ display: 'flex', gap: '15px' }}>
        {/* Identificação do Comprador */}
        <div style={{ ...boxStyle, flex: 1.2, marginBottom: '0', padding: '8px 10px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', marginRight: '6px', whiteSpace: 'nowrap' }}>Nome completo:</span>
              <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.nome}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 1.2, paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', marginRight: '6px' }}>Ident.:</span>
                <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.ident}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', marginRight: '6px' }}>Org. Emissor:</span>
                <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.orgEmissor}</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', marginRight: '6px', whiteSpace: 'nowrap' }}>End. completo:</span>
              <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.endereco}</span>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '1px', display: 'flex', alignItems: 'flex-end', width: '65%' }}>
              <span style={{ fontSize: '11px', marginRight: '6px' }}>Telefone:</span>
              <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.telefone}</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 2, paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', marginRight: '6px' }}>Cidade:</span>
                <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.cidade}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '1px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '11px', marginRight: '6px' }}>UF:</span>
                <span style={{ fontSize: '11px', flex: 1 }}>{data.comprador.uf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificação do Fornecedor */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0', padding: '8px 10px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={{ height: '110px' }}></div>
          <div style={{ borderTop: '1px solid black', textAlign: 'center', fontSize: '10px', marginTop: '8px', paddingTop: '4px' }}>
            Assinatura do Farmacêutico
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', fontSize: '11px' }}>
            <span>Data</span>
            <span>____/____/_______</span>
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
