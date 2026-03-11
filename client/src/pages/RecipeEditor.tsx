import { useState } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import RecipeDocument, { RecipeData } from '@/components/RecipeDocument';

export default function RecipeEditor() {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<RecipeData>({
    emitente: {
      nome: 'ITAL SAÚDE SERVIÇOS MÉDICOS ESPECIALIZADOS LTDA.',
      cnpj: '04.169.684/0001-00',
      endereco: 'Rua Joaquim Marra, 138 - Vila Matilde - CEP 03514-000',
      cidadeUfFone: 'São Paulo - SP - Fone: (11) 2652-2210'
    },
    paciente: {
      nome: 'Reginaldo marques pereira trindade',
      endereco: 'Rua Antônio fonoff, 11 bairro : Nova espírito santo - Valinhos SP'
    },
    prescricao: {
      viaAdministracao: 'Subcutânea',
      medicamento: 'MOUNJARO 5mg/0,5ml',
      orientacao: 'Aplicar 1x por semana por 4 semanas'
    },
    medico: {
      nome: 'Dra. Debora D. de Mello',
      crm: '127520',
      cpf: '292.507.188-02'
    },
    data: '05/11/2025',
    comprador: {
      nome: '',
      ident: '',
      orgEmissor: '',
      endereco: '',
      telefone: '',
      cidade: '',
      uf: ''
    }
  });

  const updateField = (section: keyof RecipeData, field: string, value: string) => {
    setData(prev => {
      if (typeof prev[section] === 'string') {
        return { ...prev, [section]: value };
      }
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      };
    });
  };

  const handleSavePDF = async () => {
    setSaving(true);
    try {
      // Pequeno delay para garantir que o DOM está pronto
      await new Promise(r => setTimeout(r, 800));
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = ['recipe-page-1', 'recipe-page-2'];

      for (let i = 0; i < pages.length; i++) {
        const el = document.getElementById(pages[i]);
        if (el) {
          // Aumentar pixelRatio para alta qualidade
          const png = await toPng(el, { 
            quality: 1, 
            pixelRatio: 4,
            backgroundColor: 'white'
          });

          if (i > 0) pdf.addPage();
          pdf.addImage(png, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
        }
      }
      
      const fileName = `RECEITA_ITAL_${data.paciente.nome.toUpperCase().replace(/\s/g, '_')}.pdf`;
      pdf.save(fileName);
      
      alert('PDF gerado com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full bg-[#1a1a2e] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none";
  const labelStyle = "text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block";
  const sectionStyle = "bg-[#12121f] border border-gray-700 rounded-lg p-4 mb-4";

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Header */}
      <div className="bg-[#12121f] border-b border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-white text-sm">← Voltar</a>
          <h1 className="text-xl font-bold text-blue-400">Editor de Receita (Layout Fiel)</h1>
        </div>
        <button
          onClick={handleSavePDF}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {saving ? 'Gerando PDF...' : '📄 EXPORTAR PDF'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
          {/* Emitente */}
          <div className={sectionStyle}>
            <h2 className="text-sm font-bold text-gray-300 mb-3">🏥 IDENTIFICAÇÃO DO EMITENTE</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelStyle}>Nome da Clínica/Médico</label>
                <input className={inputStyle} value={data.emitente.nome} onChange={e => updateField('emitente', 'nome', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>CNPJ</label>
                <input className={inputStyle} value={data.emitente.cnpj} onChange={e => updateField('emitente', 'cnpj', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Endereço</label>
                <input className={inputStyle} value={data.emitente.endereco} onChange={e => updateField('emitente', 'endereco', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Cidade, UF e Telefone</label>
                <input className={inputStyle} value={data.emitente.cidadeUfFone} onChange={e => updateField('emitente', 'cidadeUfFone', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Paciente */}
          <div className={sectionStyle}>
            <h2 className="text-sm font-bold text-gray-300 mb-3">👤 DADOS DO PACIENTE</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelStyle}>Nome Completo</label>
                <input className={inputStyle} value={data.paciente.nome} onChange={e => updateField('paciente', 'nome', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Endereço Completo</label>
                <input className={inputStyle} value={data.paciente.endereco} onChange={e => updateField('paciente', 'endereco', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Prescrição */}
          <div className={sectionStyle}>
            <h2 className="text-sm font-bold text-gray-300 mb-3">💊 PRESCRIÇÃO</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelStyle}>Via de Administração</label>
                <input className={inputStyle} value={data.prescricao.viaAdministracao} onChange={e => updateField('prescricao', 'viaAdministracao', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Medicamento e Quantidade</label>
                <input className={inputStyle} value={data.prescricao.medicamento} onChange={e => updateField('prescricao', 'medicamento', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>Orientação de Uso</label>
                <textarea className={inputStyle + " h-20"} value={data.prescricao.orientacao} onChange={e => updateField('prescricao', 'orientacao', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Médico */}
          <div className={sectionStyle}>
            <h2 className="text-sm font-bold text-gray-300 mb-3">👨‍⚕️ DADOS DO MÉDICO</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className={labelStyle}>Nome</label>
                <input className={inputStyle} value={data.medico.nome} onChange={e => updateField('medico', 'nome', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>CRM</label>
                <input className={inputStyle} value={data.medico.crm} onChange={e => updateField('medico', 'crm', e.target.value)} />
              </div>
              <div>
                <label className={labelStyle}>CPF</label>
                <input className={inputStyle} value={data.medico.cpf} onChange={e => updateField('medico', 'cpf', e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className={labelStyle}>Data da Receita</label>
              <input className={inputStyle} value={data.data} onChange={e => updateField('data', '', e.target.value)} />
            </div>
          </div>

          {/* Comprador */}
          <div className={sectionStyle}>
            <h2 className="text-sm font-bold text-gray-300 mb-3">🛒 IDENTIFICAÇÃO DO COMPRADOR</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelStyle}>Nome Completo</label>
                <input className={inputStyle} value={data.comprador.nome} onChange={e => updateField('comprador', 'nome', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Identidade (RG)</label>
                  <input className={inputStyle} value={data.comprador.ident} onChange={e => updateField('comprador', 'ident', e.target.value)} />
                </div>
                <div>
                  <label className={labelStyle}>Org. Emissor</label>
                  <input className={inputStyle} value={data.comprador.orgEmissor} onChange={e => updateField('comprador', 'orgEmissor', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Endereço</label>
                <input className={inputStyle} value={data.comprador.endereco} onChange={e => updateField('comprador', 'endereco', e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className={labelStyle}>Telefone</label>
                  <input className={inputStyle} value={data.comprador.telefone} onChange={e => updateField('comprador', 'telefone', e.target.value)} />
                </div>
                <div>
                  <label className={labelStyle}>Cidade</label>
                  <input className={inputStyle} value={data.comprador.cidade} onChange={e => updateField('comprador', 'cidade', e.target.value)} />
                </div>
                <div>
                  <label className={labelStyle}>UF</label>
                  <input className={inputStyle} value={data.comprador.uf} onChange={e => updateField('comprador', 'uf', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="sticky top-24 bg-gray-900 p-4 rounded-lg overflow-auto max-h-[calc(100vh-140px)] flex flex-col items-center gap-8 border border-gray-700 shadow-2xl">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Visualização (Layout Final - 2 Vias)</div>
          <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
            <RecipeDocument data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
