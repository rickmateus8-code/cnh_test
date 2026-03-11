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
    fontFamily: "'Helvetica', 'Arial', sans-serif",
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    margin: '0 auto',
  };

  const boxStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '12px 15px',
    marginBottom: '15px',
    position: 'relative',
    borderRadius: '4px',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 10px',
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  const carimboStyle: React.CSSProperties = {
    textAlign: 'center',
    position: 'absolute',
    left: '20%',
    bottom: '25%',
    transform: 'rotate(-12deg)',
    fontFamily: "'Helvetica', 'Arial', sans-serif",
    pointerEvents: 'none',
    userSelect: 'none',
  };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título Principal */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '32px', margin: '0', fontWeight: 'bold' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
        <div style={{ ...boxStyle, width: '75%', marginBottom: '0', padding: '15px 20px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', margin: '6px 0' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '14px' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '20%', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '15px', lineHeight: '1.3' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço */}
      <div style={{ ...boxStyle, padding: '10px 15px' }}>
        <div style={{ display: 'flex', marginBottom: '6px', fontSize: '15px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '10px' }}>Paciente:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex', fontSize: '15px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '10px' }}>Endereço:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '25px', padding: '0 5px', fontSize: '15px' }}>
        <div style={{ marginBottom: '12px' }}>1) Via: {data.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontWeight: 'normal' }}>{data.prescricao.medicamento} ........................... 1 cx.</div>
        </div>
        <div style={{ fontSize: '14px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo Médico (Posicionado conforme original) */}
      <div style={carimboStyle}>
        <div style={{ fontSize: '19px', fontWeight: 'bold' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '17px', fontWeight: 'bold' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '17px', fontWeight: 'bold' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '15px', fontWeight: 'bold', fontSize: '18px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Boxes de Identificação */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Identificação do Comprador */}
        <div style={{ ...boxStyle, flex: 1.2, marginBottom: '0' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', marginRight: '8px', whiteSpace: 'nowrap' }}>Nome completo:</span>
              <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.nome}</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 1.5, paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', marginRight: '8px' }}>Ident.:</span>
                <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.ident}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', marginRight: '8px' }}>Org. Emissor:</span>
                <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.orgEmissor}</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', marginRight: '8px', whiteSpace: 'nowrap' }}>End. completo:</span>
              <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.endereco}</span>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex', alignItems: 'flex-end', width: '60%' }}>
              <span style={{ fontSize: '12px', marginRight: '8px' }}>Telefone:</span>
              <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.telefone}</span>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 2, paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', marginRight: '8px' }}>Cidade:</span>
                <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.cidade}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '2px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '12px', marginRight: '8px' }}>UF:</span>
                <span style={{ fontSize: '13px', flex: 1 }}>{data.comprador.uf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificação do Fornecedor */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={{ height: '100px' }}></div>
          <div style={{ borderTop: '1px solid black', textAlign: 'center', fontSize: '11px', marginTop: '10px', paddingTop: '6px' }}>
            Assinatura do Farmacêutico
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '15px', fontSize: '12px' }}>
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
    <div className="recipe-container" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <SinglePage data={data} via={1} id="recipe-page-1" />
      <SinglePage data={data} via={2} id="recipe-page-2" />
    </div>
  );
};

export default RecipeDocument;
