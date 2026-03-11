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
    overflow: 'hidden',
  };

  const boxStyle: React.CSSProperties = {
    border: '1.2px solid black',
    padding: '15px 20px',
    marginBottom: '20px',
    position: 'relative',
    borderRadius: '4px',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-9px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 12px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  };

  // Posições diferentes para o carimbo conforme solicitado
  const carimboStyle: React.CSSProperties = via === 1 
    ? {
        textAlign: 'center',
        position: 'absolute',
        left: '22%',
        bottom: '28%',
        transform: 'rotate(-8deg)',
        fontFamily: "'Helvetica', 'Arial', sans-serif",
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
      }
    : {
        textAlign: 'center',
        position: 'absolute',
        right: '18%',
        bottom: '32%',
        transform: 'rotate(10deg)',
        fontFamily: "'Helvetica', 'Arial', sans-serif",
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
      };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título Principal - Mais cheio/grande */}
      <div style={{ textAlign: 'center', marginBottom: '35px', marginTop: '10px' }}>
        <h1 style={{ fontSize: '38px', margin: '0', fontWeight: 'bold', letterSpacing: '1px' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ ...boxStyle, width: '78%', marginBottom: '0', padding: '20px 25px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '10px 0' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '16px', marginBottom: '6px' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '16px' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '18%', fontSize: '13px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '15px', lineHeight: '1.4' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço - Mais denso */}
      <div style={{ ...boxStyle, padding: '15px 20px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', marginBottom: '10px', fontSize: '18px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '12px' }}>Paciente:</span>
          <span style={{ fontWeight: 'normal', borderBottom: '1px dotted #ccc', flex: 1 }}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex', fontSize: '18px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '12px' }}>Endereço:</span>
          <span style={{ fontWeight: 'normal', borderBottom: '1px dotted #ccc', flex: 1 }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição - Mais preenchida */}
      <div style={{ flex: 1, marginTop: '35px', padding: '0 10px', fontSize: '18px' }}>
        <div style={{ marginBottom: '18px' }}>1) Via: {data.prescricao.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontWeight: 'normal' }}>{data.prescricao.medicamento} .................................................... 1 cx.</div>
        </div>
        <div style={{ fontSize: '16px', fontStyle: 'italic', marginTop: '5px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo Médico */}
      <div style={carimboStyle}>
        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '20px', fontWeight: 'bold', fontSize: '22px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Boxes de Identificação */}
      <div style={{ display: 'flex', gap: '25px' }}>
        {/* Identificação do Comprador */}
        <div style={{ ...boxStyle, flex: 1.3, marginBottom: '0', padding: '15px 20px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '12px' }}>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '13px', marginRight: '10px', whiteSpace: 'nowrap' }}>Nome completo:</span>
              <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.nome}</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 1.5, paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '13px', marginRight: '10px' }}>Ident.:</span>
                <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.ident}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '13px', marginRight: '10px' }}>Org. Emissor:</span>
                <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.orgEmissor}</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '13px', marginRight: '10px', whiteSpace: 'nowrap' }}>End. completo:</span>
              <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.endereco}</span>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '3px', display: 'flex', alignItems: 'flex-end', width: '70%' }}>
              <span style={{ fontSize: '13px', marginRight: '10px' }}>Telefone:</span>
              <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.telefone}</span>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 2, paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '13px', marginRight: '10px' }}>Cidade:</span>
                <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.cidade}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '3px', display: 'flex', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '13px', marginRight: '10px' }}>UF:</span>
                <span style={{ fontSize: '14px', flex: 1 }}>{data.comprador.uf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificação do Fornecedor */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0', padding: '15px 20px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={{ height: '130px' }}></div>
          <div style={{ borderTop: '1px solid black', textAlign: 'center', fontSize: '12px', marginTop: '12px', paddingTop: '8px' }}>
            Assinatura do Farmacêutico
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', fontSize: '14px' }}>
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
