import React from 'react';

export interface RecipeData {
  emitente: {
    nome: string;
    cnpj: string;
    endereco: string;
    cidadeUfFone: string;
  };
  via: string;
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

interface RecipeDocumentProps {
  data: RecipeData;
}

const RecipeDocument: React.FC<RecipeDocumentProps> = ({ data }) => {
  const pageStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    backgroundColor: 'white',
    padding: '15mm',
    fontFamily: 'Arial, sans-serif',
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    margin: '0 auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  };

  const boxStyle: React.CSSProperties = {
    border: '1.5px solid black',
    padding: '10px',
    marginBottom: '15px',
    position: 'relative',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '4px',
  };

  const fieldLabelStyle: React.CSSProperties = {
    fontSize: '11px',
    marginRight: '5px',
  };

  const fieldValueStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 'normal',
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
  };

  return (
    <div id="recipe-document" style={pageStyle}>
      {/* Título Principal */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', margin: '0', fontWeight: 'bold' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ ...boxStyle, width: '70%', marginBottom: '0' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center', marginTop: '5px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '5px 0' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '12px' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '12px' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '25%', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '10px' }}>
          {data.via} Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço */}
      <div style={{ ...boxStyle, marginTop: '15px' }}>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <span style={fieldLabelStyle}>Paciente:</span>
          <span style={fieldValueStyle}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex' }}>
          <span style={fieldLabelStyle}>Endereço:</span>
          <span style={fieldValueStyle}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '20px', padding: '0 10px' }}>
        <div style={{ marginBottom: '15px' }}>1) Via: {data.prescricao.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <div style={{ fontWeight: 'bold' }}>{data.prescricao.medicamento}</div>
          <div>1 cx.</div>
        </div>
        <div style={{ fontSize: '12px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Assinatura Médica (Centralizada e Inclinada) */}
      <div style={{ 
        textAlign: 'center', 
        margin: '40px 0', 
        transform: 'rotate(-5deg)',
        fontFamily: 'cursive',
        opacity: 0.9
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Boxes de Identificação */}
      <div style={{ display: 'flex', gap: '15px' }}>
        {/* Identificação do Comprador */}
        <div style={{ ...boxStyle, flex: 1 }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex' }}>
              <span style={{ fontSize: '10px', marginRight: '5px' }}>Nome completo:</span>
              <span style={{ fontSize: '11px' }}>{data.comprador.nome}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 2, paddingBottom: '2px', display: 'flex' }}>
                <span style={{ fontSize: '10px', marginRight: '5px' }}>Ident.:</span>
                <span style={{ fontSize: '11px' }}>{data.comprador.ident}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '2px', display: 'flex' }}>
                <span style={{ fontSize: '10px', marginRight: '5px' }}>Org. Emissor:</span>
                <span style={{ fontSize: '11px' }}>{data.comprador.orgEmissor}</span>
              </div>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex' }}>
              <span style={{ fontSize: '10px', marginRight: '5px' }}>End. completo:</span>
              <span style={{ fontSize: '11px' }}>{data.comprador.endereco}</span>
            </div>
            <div style={{ borderBottom: '1px solid black', paddingBottom: '2px', display: 'flex' }}>
              <span style={{ fontSize: '10px', marginRight: '5px' }}>Telefone:</span>
              <span style={{ fontSize: '11px' }}>{data.comprador.telefone}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ borderBottom: '1px solid black', flex: 3, paddingBottom: '2px', display: 'flex' }}>
                <span style={{ fontSize: '10px', marginRight: '5px' }}>Cidade:</span>
                <span style={{ fontSize: '11px' }}>{data.comprador.cidade}</span>
              </div>
              <div style={{ borderBottom: '1px solid black', flex: 1, paddingBottom: '2px', display: 'flex' }}>
                <span style={{ fontSize: '10px', marginRight: '5px' }}>UF:</span>
                <span style={{ fontSize: '11px' }}>{data.comprador.uf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Identificação do Fornecedor */}
        <div style={{ ...boxStyle, flex: 1 }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={{ height: '80px' }}></div>
          <div style={{ borderTop: '1px solid black', textAlign: 'center', fontSize: '10px', marginTop: '10px', paddingTop: '5px' }}>
            Assinatura do Farmacêutico
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px', fontSize: '10px' }}>
            <span>Data</span>
            <span>____/____/_______</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDocument;
