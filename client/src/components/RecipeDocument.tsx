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
    border: '1.2px solid #000',
    padding: '12px 15px',
    marginBottom: '15px',
    position: 'relative',
    borderRadius: '4px',
  };

  const boxTitleStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-9px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '0 10px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

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

  const footerLineStyle: React.CSSProperties = {
    borderTop: '2.5px solid black',
    marginTop: '5px',
    marginBottom: '8px'
  };

  return (
    <div id={id} style={pageStyle} className="recipe-page">
      {/* Título Principal */}
      <div style={{ textAlign: 'center', marginBottom: '25px', marginTop: '5px' }}>
        <h1 style={{ fontSize: '32px', margin: '0', fontWeight: 'bold', letterSpacing: '0.5px' }}>Receituário Controle Especial</h1>
      </div>

      {/* Identificação do Emitente e Via */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', gap: '10px' }}>
        <div style={{ ...boxStyle, width: '75%', marginBottom: '0', padding: '15px 20px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO EMITENTE</div>
          <div style={{ textAlign: 'center', paddingTop: '4px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.3px' }}>{data.emitente.nome}</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', margin: '6px 0' }}>CNPJ: {data.emitente.cnpj}</div>
            <div style={{ fontSize: '13px', marginBottom: '2px', lineHeight: '1.2' }}>{data.emitente.endereco}</div>
            <div style={{ fontSize: '13px', lineHeight: '1.2' }}>{data.emitente.cidadeUfFone}</div>
          </div>
        </div>
        <div style={{ width: '22%', fontSize: '11px', fontWeight: 'bold', textAlign: 'left', paddingLeft: '10px', lineHeight: '1.3' }}>
          {via}ª Via<br />
          Retenção na<br />
          Farmácia ou<br />
          Drogaria
        </div>
      </div>

      {/* Paciente e Endereço */}
      <div style={{ ...boxStyle, padding: '10px 15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', marginBottom: '6px', fontSize: '14px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '10px', whiteSpace: 'nowrap' }}>Paciente:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.nome}</span>
        </div>
        <div style={{ display: 'flex', fontSize: '14px' }}>
          <span style={{ fontWeight: 'normal', marginRight: '10px', whiteSpace: 'nowrap' }}>Endereço:</span>
          <span style={{ fontWeight: 'normal' }}>{data.paciente.endereco}</span>
        </div>
      </div>

      {/* Prescrição */}
      <div style={{ flex: 1, marginTop: '25px', padding: '0 10px', fontSize: '14px', lineHeight: '1.4' }}>
        <div style={{ marginBottom: '10px' }}>1) Via: {data.viaAdministracao}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontWeight: 'normal' }}>{data.prescricao.medicamento} ................................... 1 cx.</div>
        </div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>({data.prescricao.orientacao})</div>
      </div>

      {/* Carimbo Médico */}
      <div style={carimboStyle}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2' }}>{data.medico.nome}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>CRM {data.medico.crm}</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2' }}>CPF {data.medico.cpf}</div>
      </div>

      {/* Data */}
      <div style={{ textAlign: 'right', marginBottom: '15px', fontWeight: 'bold', fontSize: '16px' }}>
        DATA: {data.data}
      </div>

      {/* Rodapé - Fidelidade Visual Total */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* IDENTIFICAÇÃO DO COMPRADOR */}
        <div style={{ ...boxStyle, flex: 1.2, marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO COMPRADOR</div>
          <div style={footerLineStyle}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px' }}>Nome completo:</div>
            <div style={{ borderBottom: '1.2px solid black', marginLeft: '80px', height: '14px', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.nome}</span>
            </div>
            <div style={{ borderBottom: '1.2px solid black', height: '14px', marginBottom: '2px' }}></div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px' }}>Ident.</div>
                <div style={{ borderBottom: '1.2px solid black', height: '14px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.ident}</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', textAlign: 'center' }}>Org. Emissor</div>
                <div style={{ borderBottom: '1.2px solid black', height: '14px', display: 'flex', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.orgEmissor}</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '12px' }}>End. completo</div>
            <div style={{ borderBottom: '1.2px solid black', marginLeft: '60px', height: '14px', marginBottom: '2px' }}>
               <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.endereco}</span>
            </div>
            <div style={{ borderBottom: '1.2px solid black', height: '14px', marginBottom: '2px' }}></div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px' }}>Telefone</div>
                <div style={{ borderBottom: '1.2px solid black', height: '14px', display: 'flex', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.telefone}</span>
                </div>
              </div>
              <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px' }}>Cidade</div>
                <div style={{ borderBottom: '1.2px solid black', height: '14px', display: 'flex', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', paddingLeft: '5px' }}>{data.comprador.cidade}</span>
                </div>
              </div>
              <div style={{ flex: 0.3, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '12px', textAlign: 'center' }}>UF</div>
                <div style={{ borderBottom: '1.2px solid black', height: '14px', display: 'flex', alignItems: 'center' }}>
                   <span style={{ fontSize: '12px', textAlign: 'center', width: '100%' }}>{data.comprador.uf}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IDENTIFICAÇÃO DO FORNECEDOR */}
        <div style={{ ...boxStyle, flex: 1, marginBottom: '0', padding: '10px 12px' }}>
          <div style={boxTitleStyle}>IDENTIFICAÇÃO DO FORNECEDOR</div>
          <div style={footerLineStyle}></div>
          
          <div style={{ height: '110px' }}></div>
          
          <div style={{ borderTop: '2px solid black', marginTop: '10px' }}></div>
          <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '4px', fontWeight: 'bold' }}>
            Assinatura do Farmacêutico
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Data</span>
            <div style={{ borderBottom: '1px solid black', width: '100px', textAlign: 'center', fontSize: '12px' }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
