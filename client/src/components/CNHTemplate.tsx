import React from 'react';

interface CNHData {
  nome: string;
  cpf: string;
  // ... all other fields
}

interface CNHTemplateProps {
  data: CNHData;
  photo: string | null;
  signature: string | null;
}

const CNHTemplate: React.FC<CNHTemplateProps> = ({ data, photo, signature }) => {
  return (
    <div className="w-[1024px] h-[724px] bg-white text-black p-8 font-sans relative overflow-hidden">
      {/* Background watermark, etc. */}
      <div className="absolute inset-0 bg-center bg-no-repeat bg-contain" style={{ backgroundImage: 'url(/assets/cnh-bg.png)', opacity: 0.05 }}></div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">CARTEIRA NACIONAL DE HABILITAÇÃO</h1>
          <p className="text-sm">REPÚBLICA FEDERATIVA DO BRASIL</p>
        </div>
        <div className="text-right">
          <p className="text-xs">MINISTÉRIO DA INFRAESTRUTURA</p>
          <p className="text-xs">DEPARTAMENTO NACIONAL DE TRÂNSITO</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex mt-8">
        {/* Left Column: Photo and Signature */}
        <div className="w-1/4 flex flex-col items-center">
          {photo && <img src={photo} alt="Foto" className="w-40 h-52 border-2 border-gray-300" />}
          <div className="mt-4 w-40 h-16 border-2 border-gray-300 flex items-center justify-center">
            {signature && <img src={signature} alt="Assinatura" className="h-12" />}
          </div>
          <p className="text-xs mt-1">ASSINATURA DO PORTADOR</p>
        </div>

        {/* Right Column: Data Fields */}
        <div className="w-3/4 pl-8">
          <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-xs">
            <div className="col-span-3">
              <p className="text-gray-500">NOME</p>
              <p className="font-bold text-sm">{data.nome}</p>
            </div>
            {/* ... render all other data fields ... */}
            <div>
              <p className="text-gray-500">CPF</p>
              <p className="font-mono">{data.cpf}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with QR Code etc. */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        <div>
          {/* QR Code would go here */}
        </div>
        <div className="text-right text-xs">
          <p>VÁLIDA EM TODO O TERRITÓRIO NACIONAL</p>
        </div>
      </div>
    </div>
  );
};

export default CNHTemplate;
