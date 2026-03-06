import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import CNHDocumentFront from '@/components/CNHDocumentFront';
import CNHDocumentBack from '@/components/CNHDocumentBack';
import type { CNHData } from '@/components/CNHDocumentFront';

function generateRandom(len: number) {
  let r = '';
  for (let i = 0; i < len; i++) r += Math.floor(Math.random() * 10);
  return r;
}

function formatCPFInput(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export default function CNHCreator() {
  const [importText, setImportText] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [photoZoom, setPhotoZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<CNHData>({
    nome: '', cpf: '', sexo: 'F', rg: '', orgaoEmissor: '', ufRg: '',
    nacionalidade: 'BRASILEIRA', dataNascimento: '', localNascimento: '', ufNasc: '',
    nomePai: '', nomeMae: '', nRegistro: '', nCNH: '', categoria: 'AB',
    tipo: 'DEFINITIVA', validade: '', emissao: '', primeiraHabilitacao: '',
    localEmissao: '', ufEmissao: '', senhaApp: '', observacoes: '',
    assDigital1: '', assDigital2: '',
  });

  const updateField = (field: keyof CNHData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const processImport = () => {
    if (!importText.trim()) return;
    const lines = importText.split('\n');
    const map: Record<string, string> = {};
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx > 0) {
        const key = line.slice(0, idx).trim().toLowerCase();
        const val = line.slice(idx + 1).trim();
        map[key] = val;
      }
    });

    const findVal = (...keys: string[]) => {
      for (const k of keys) {
        for (const mk of Object.keys(map)) {
          if (mk.includes(k)) return map[mk];
        }
      }
      return '';
    };

    const sexoRaw = findVal('sexo');
    const sexo = sexoRaw.toUpperCase().startsWith('M') ? 'M' : sexoRaw.toUpperCase().startsWith('F') ? 'F' : sexoRaw;
    const tipoRaw = findVal('tipo');
    const tipo = tipoRaw.toUpperCase().includes('PERM') ? 'PERMISSÃO' : 'DEFINITIVA';

    const convertDate = (d: string) => {
      if (!d) return '';
      if (d.includes('-')) return d;
      const p = d.split('/');
      if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
      return d;
    };

    setData({
      nome: findVal('nome completo', 'nome'),
      cpf: findVal('cpf').replace(/\D/g, ''),
      sexo,
      rg: findVal('rg'),
      orgaoEmissor: findVal('orgão emissor', 'orgao emissor', 'org'),
      ufRg: findVal('uf rg'),
      nacionalidade: findVal('nacionalidade') || 'BRASILEIRA',
      dataNascimento: convertDate(findVal('data nascimento', 'nascimento')),
      localNascimento: findVal('local nascimento'),
      ufNasc: findVal('uf nasc'),
      nomePai: findVal('nome do pai', 'pai'),
      nomeMae: findVal('nome da mãe', 'nome da mae', 'mãe', 'mae'),
      nRegistro: generateRandom(11),
      nCNH: generateRandom(10),
      categoria: findVal('categoria', 'cat') || 'AB',
      tipo,
      validade: convertDate(findVal('validade')),
      emissao: convertDate(findVal('emissão', 'emissao')),
      primeiraHabilitacao: convertDate(findVal('1ª habilitação', 'habilitação', 'habilitacao', '1a hab')),
      localEmissao: findVal('local emissão', 'local emissao'),
      ufEmissao: findVal('uf emissão', 'uf emissao'),
      senhaApp: findVal('senha app', 'senha'),
      observacoes: findVal('observações', 'observacoes', 'obs'),
      assDigital1: generateRandom(10),
      assDigital2: (findVal('uf emissão', 'uf emissao') || 'RS') + generateRandom(8),
    });

    alert('Dados processados com sucesso!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSignatureUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const autoGenRegistro = () => updateField('nRegistro', generateRandom(11));
  const autoGenCNH = () => updateField('nCNH', generateRandom(10));
  const autoGenAss1 = () => updateField('assDigital1', generateRandom(10));
  const autoGenAss2 = () => updateField('assDigital2', (data.ufEmissao || 'RS') + generateRandom(8));

  const handleSaveDocument = async () => {
    setSaving(true);
    setShowPreview(true);
    try {
      // Wait for preview to render
      await new Promise(r => setTimeout(r, 500));

      const frontEl = document.getElementById('cnh-front');
      const backEl = document.getElementById('cnh-back');

      if (frontEl) {
        const frontPng = await toPng(frontEl, { quality: 0.95, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `CNH_FRENTE_${data.nome.replace(/\s/g, '_')}.png`;
        link.href = frontPng;
        link.click();
      }

      if (backEl) {
        const backPng = await toPng(backEl, { quality: 0.95, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `CNH_VERSO_${data.nome.replace(/\s/g, '_')}.png`;
        link.href = backPng;
        link.click();
      }

      alert('Documento salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Erro ao gerar documento. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = "w-full bg-[#1a1a2e] border border-gray-600 rounded px-3 py-2 text-white text-sm focus:border-yellow-500 focus:outline-none";
  const labelStyle = "text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1 block";
  const sectionStyle = "bg-[#12121f] border border-gray-700 rounded-lg p-4 mb-4";

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white">
      {/* Header */}
      <div className="bg-[#12121f] border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-gray-400 hover:text-white text-sm">← Voltar</a>
          <h1 className="text-xl font-bold text-yellow-400">(Criação de CNH) DOCMASTER</h1>
        </div>
        <button
          onClick={handleSaveDocument}
          disabled={saving}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded disabled:opacity-50"
        >
          {saving ? 'Gerando Documento...' : '💾 SALVAR DOCUMENTO'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* IMPORTAÇÃO E MODELO */}
        <div className={sectionStyle}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">✏️ IMPORTAÇÃO E MODELO</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>1. Envie para o Cliente</label>
              <textarea
                readOnly
                className="w-full bg-[#1a1a2e] border border-gray-600 rounded p-3 text-gray-400 text-xs h-40 font-mono"
                value={`Nome Completo: \nCPF: \nSexo: \nRG: \nOrgão Emissor: \nUF RG: \nNacionalidade: BRASILEIRA\nData Nascimento: \nLocal Nascimento: \nUF Nasc: \nNome do Pai: \nNome da Mãe: \nCategoria: \nTipo: \nValidade: \nEmissão: \n1ª Habilitação: \nLocal Emissão: \nUF Emissão: \nSenha App: \nObservações: `}
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded mt-2 text-sm">
                📋 COPIAR MODELO
              </button>
            </div>
            <div>
              <label className={labelStyle}>2. Cole o texto preenchido</label>
              <textarea
                className="w-full bg-[#1a1a2e] border border-orange-500 rounded p-3 text-white text-xs h-40 font-mono"
                placeholder="Cole aqui o texto enviado pelo cliente..."
                value={importText}
                onChange={e => setImportText(e.target.value)}
              />
              <button
                onClick={processImport}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-2 text-sm"
              >
                ⚡ PROCESSAR DADOS
              </button>
            </div>
          </div>
        </div>

        {/* 1. DADOS PESSOAIS */}
        <div className={sectionStyle}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">👤 1. DADOS PESSOAIS</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className={labelStyle}>Nome Completo</label>
              <input className={inputStyle} value={data.nome} onChange={e => updateField('nome', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>CPF</label>
              <input className={inputStyle} placeholder="000.000.000-00" value={formatCPFInput(data.cpf)} onChange={e => updateField('cpf', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <label className={labelStyle}>Sexo</label>
              <select className={inputStyle} value={data.sexo} onChange={e => updateField('sexo', e.target.value)}>
                <option value="">ESCOLHA</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <label className={labelStyle}>RG</label>
              <input className={inputStyle} value={data.rg} onChange={e => updateField('rg', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Orgão Emissor</label>
              <input className={inputStyle} value={data.orgaoEmissor} onChange={e => updateField('orgaoEmissor', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>UF RG</label>
              <input className={inputStyle} value={data.ufRg} onChange={e => updateField('ufRg', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <label className={labelStyle}>Nacionalidade</label>
              <input className={inputStyle} value={data.nacionalidade} onChange={e => updateField('nacionalidade', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Data Nascimento</label>
              <input type="date" className={inputStyle} value={data.dataNascimento} onChange={e => updateField('dataNascimento', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Local Nascimento</label>
              <input className={inputStyle} value={data.localNascimento} onChange={e => updateField('localNascimento', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>UF Nasc.</label>
              <input className={inputStyle} value={data.ufNasc} onChange={e => updateField('ufNasc', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label className={labelStyle}>Nome do Pai</label>
              <input className={inputStyle} value={data.nomePai} onChange={e => updateField('nomePai', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Nome da Mãe</label>
              <input className={inputStyle} value={data.nomeMae} onChange={e => updateField('nomeMae', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 2. DADOS DA CNH */}
        <div className={sectionStyle}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">🪪 2. DADOS DA CNH</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelStyle}>Nº Registro</label>
              <div className="flex gap-1">
                <input className={inputStyle} value={data.nRegistro} onChange={e => updateField('nRegistro', e.target.value)} />
                <button onClick={autoGenRegistro} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 rounded whitespace-nowrap">AUTO</button>
              </div>
            </div>
            <div>
              <label className={labelStyle}>Nº CNH (Espelho)</label>
              <div className="flex gap-1">
                <input className={inputStyle} value={data.nCNH} onChange={e => updateField('nCNH', e.target.value)} />
                <button onClick={autoGenCNH} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 rounded whitespace-nowrap">AUTO</button>
              </div>
            </div>
            <div>
              <label className={labelStyle}>Categoria</label>
              <input className={inputStyle} placeholder="Ex: AB" value={data.categoria} onChange={e => updateField('categoria', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Tipo</label>
              <select className={inputStyle} value={data.tipo} onChange={e => updateField('tipo', e.target.value)}>
                <option value="DEFINITIVA">Definitiva</option>
                <option value="PERMISSÃO">Permissão</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <label className={labelStyle}>Validade</label>
              <input type="date" className={inputStyle} value={data.validade} onChange={e => updateField('validade', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Emissão</label>
              <input type="date" className={inputStyle} value={data.emissao} onChange={e => updateField('emissao', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>1ª Habilitação</label>
              <input type="date" className={inputStyle} value={data.primeiraHabilitacao} onChange={e => updateField('primeiraHabilitacao', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Local Emissão</label>
              <input className={inputStyle} value={data.localEmissao} onChange={e => updateField('localEmissao', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-3">
            <div>
              <label className={labelStyle}>UF Emissão</label>
              <input className={inputStyle} placeholder="UF" value={data.ufEmissao} onChange={e => updateField('ufEmissao', e.target.value)} />
            </div>
          </div>
        </div>

        {/* 3. CÓDIGO DE SEGURANÇA */}
        <div className={sectionStyle}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">🔒 3. CÓDIGO DE SEGURANÇA</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Ass. Digital 1</label>
              <div className="flex gap-1">
                <input className={inputStyle} value={data.assDigital1} onChange={e => updateField('assDigital1', e.target.value)} />
                <button onClick={autoGenAss1} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 rounded whitespace-nowrap">AUTO</button>
              </div>
            </div>
            <div>
              <label className={labelStyle}>Ass. Digital 2</label>
              <div className="flex gap-1">
                <input className={inputStyle} value={data.assDigital2} onChange={e => updateField('assDigital2', e.target.value)} />
                <button onClick={autoGenAss2} className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 rounded whitespace-nowrap">AUTO</button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FOTOS E ACESSO */}
        <div className={sectionStyle}>
          <h2 className="text-sm font-bold text-gray-300 mb-3">📷 4. FOTOS E ACESSO</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelStyle}>Foto do Rosto</label>
              <p className="text-xs text-gray-500 mb-2">Para melhor qualidade, <a href="https://www.remove.bg/pt-br" target="_blank" className="text-blue-400 underline">remova o fundo AQUI</a></p>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="text-sm text-gray-400" />
              {photoUrl && (
                <div className="mt-3">
                  <img src={photoUrl} alt="Preview" style={{ width: `${120 * photoZoom / 100}px`, height: `${155 * photoZoom / 100}px`, objectFit: 'cover', border: '2px solid #444' }} />
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setPhotoZoom(z => Math.max(50, z - 10))} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">−</button>
                    <span className="text-xs text-gray-400">{photoZoom}%</span>
                    <button onClick={() => setPhotoZoom(z => Math.min(200, z + 10))} className="bg-gray-600 text-white px-2 py-1 rounded text-xs">+</button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className={labelStyle}>Assinatura (Foto)</label>
              <p className="text-xs text-gray-500 mb-2">Use uma imagem com fundo transparente ou branco.</p>
              <input type="file" accept="image/*" onChange={handleSignatureUpload} className="text-sm text-gray-400" />
              {signatureUrl && (
                <div className="mt-3 p-3 bg-white rounded inline-block">
                  <img src={signatureUrl} alt="Assinatura" style={{ height: '50px' }} />
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelStyle}>Senha App Cliente</label>
              <input className={inputStyle} value={data.senhaApp} onChange={e => updateField('senhaApp', e.target.value)} />
            </div>
            <div>
              <label className={labelStyle}>Observações (EAR)</label>
              <textarea className={inputStyle + " h-16"} value={data.observacoes} onChange={e => updateField('observacoes', e.target.value)} />
            </div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className={sectionStyle}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-300">👁️ PREVIEW DO DOCUMENTO</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded"
            >
              {showPreview ? 'Ocultar Preview' : 'Mostrar Preview'}
            </button>
          </div>
          {showPreview && (
            <div className="space-y-6 overflow-x-auto">
              <div>
                <h3 className="text-xs text-gray-400 mb-2">FRENTE</h3>
                <div ref={frontRef} style={{ display: 'inline-block' }}>
                  <CNHDocumentFront data={data} photoUrl={photoUrl} signatureUrl={signatureUrl} />
                </div>
              </div>
              <div>
                <h3 className="text-xs text-gray-400 mb-2">VERSO</h3>
                <div ref={backRef} style={{ display: 'inline-block' }}>
                  <CNHDocumentBack data={data} signatureUrl={signatureUrl} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTÃO SALVAR */}
        <div className="text-center py-6">
          <button
            onClick={handleSaveDocument}
            disabled={saving}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-3 rounded-lg text-lg disabled:opacity-50"
          >
            {saving ? 'Gerando Documento...' : '💾 SALVAR DOCUMENTO'}
          </button>
        </div>
      </div>
    </div>
  );
}
