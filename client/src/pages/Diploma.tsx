import { useLocalAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Download, User, BookOpen, MapPin, Building2,
  FileCheck, PenTool, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

type SectionKey = "diplomado" | "curso" | "endereco" | "instituicao" | "registro" | "assinaturas";

const SECTIONS = [
  { key: "diplomado" as SectionKey, title: "Dados do Diplomado", icon: User },
  { key: "curso" as SectionKey, title: "Curso / Autorização / Reconhecimento", icon: BookOpen },
  { key: "endereco" as SectionKey, title: "Endereço de Oferta do Curso", icon: MapPin },
  { key: "instituicao" as SectionKey, title: "Instituição / Mantenedora", icon: Building2 },
  { key: "registro" as SectionKey, title: "Registro / Responsável", icon: FileCheck },
  { key: "assinaturas" as SectionKey, title: "Assinaturas / Signatários", icon: PenTool },
];

const DEFAULT_FORM = {
  // Dados do Diplomado
  nomeCompleto: "", nacionalidade: "Brasileira", naturalidade: "",
  dataNascimento: "", rg: "", orgaoExpedidor: "", cpf: "",
  // Curso
  nomeCurso: "Licenciatura em História", tituloConferido: "Licenciado",
  grauConferido: "Licenciatura", habilitacao: "", modalidade: "EAD",
  codEmec: "104110", tipoAutorizacao: "Resolução", numAtoAutorizacao: "01",
  dataAutorizacao: "15/12/2017", orgaoAutorizador: "CEPE do UNINTER",
  tipoReconhecimento: "Portaria", numAtoReconhecimento: "913",
  dataReconhecimento: "27/12/2018",
  publicacaoReconhecimento: "DOU 245, Seção 1, pág. 35-40",
  // Endereço de Oferta
  logradouro: "Tv. Tobias de Macedo", numero: "37", bairro: "Centro",
  municipio: "Curitiba", uf: "PR", cep: "80020-210", codIbge: "4106902",
  // Instituição / Mantenedora
  nomeInstituicao: "CENTRO UNIVERSITÁRIO INTERNACIONAL UNINTER",
  cnpjInstituicao: "", credenciamento: "Portaria n.º 688 de 25/05/2012",
  publicacaoCredenciamento: "D.O.U. n.º 102 de 28/05/2012, seção 1, p.23",
  recredenciamento: "Portaria n.º 1.219 de 28/11/2019",
  publicacaoRecredenciamento: "D.O.U. n.º 208, seção 1, p.24",
  nomeMantenedora: "", cnpjMantenedora: "",
  // Registro
  numRegistro: "", dataRegistro: "", dataExpedicao: "",
  responsavelRegistro: "", cargoResponsavel: "",
  livro: "", folha: "",
  dataConclusao: "20/06/2022", dataColacao: "30/07/2022",
  // Assinaturas
  assinatura1Nome: "SIMONE RAMOS DE OLIVEIRA",
  assinatura1Cargo: "Secretária Geral de Gestão Acadêmica",
  assinatura2Nome: "", assinatura2Cargo: "",
  assinatura3Nome: "", assinatura3Cargo: "",
  // Validação
  codigoValidacao: "37f77afd9f612cd417c034e324566ee1d85ba5123c14289ab1e9c6f46f664ecc",
  urlValidacao: "https://uninter-meudiploma.online",
};

export default function Diploma() {
  const { isAuthenticated, loading: authLoading } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(() => new Set<SectionKey>(["diplomado" as SectionKey]));

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [authLoading, isAuthenticated, setLocation]);

  const toggleSection = (key: SectionKey) => {
    setOpenSections(prev => {
      const next = new Set<SectionKey>(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    toast.success("Diploma salvo como rascunho");
  };

  const handleExport = () => {
    toast.info("Exportação de diploma em desenvolvimento");
  };

  const renderField = (key: string, label: string, opts?: { span2?: boolean; type?: string }) => (
    <div key={key} className={opts?.span2 ? "md:col-span-2" : ""}>
      <Label className="text-[#aaaacc] text-xs font-medium">{label}</Label>
      <Input
        value={(form as any)[key] || ""}
        onChange={(e) => updateField(key, e.target.value)}
        type={opts?.type || "text"}
        className="bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] mt-1 h-9 text-sm"
        placeholder={label}
      />
    </div>
  );

  const sectionFields: Record<SectionKey, { key: string; label: string; span2?: boolean }[]> = {
    diplomado: [
      { key: "nomeCompleto", label: "Nome Completo", span2: true },
      { key: "nacionalidade", label: "Nacionalidade" },
      { key: "naturalidade", label: "Naturalidade" },
      { key: "dataNascimento", label: "Data de Nascimento" },
      { key: "rg", label: "RG" },
      { key: "orgaoExpedidor", label: "Órgão Expedidor" },
      { key: "cpf", label: "CPF" },
    ],
    curso: [
      { key: "nomeCurso", label: "Nome do Curso", span2: true },
      { key: "tituloConferido", label: "Título Conferido" },
      { key: "grauConferido", label: "Grau Conferido" },
      { key: "habilitacao", label: "Habilitação" },
      { key: "modalidade", label: "Modalidade" },
      { key: "codEmec", label: "Cód. e-MEC" },
      { key: "tipoAutorizacao", label: "Tipo de Autorização" },
      { key: "numAtoAutorizacao", label: "Nº do Ato" },
      { key: "dataAutorizacao", label: "Data de Autorização" },
      { key: "orgaoAutorizador", label: "Órgão Autorizador" },
      { key: "tipoReconhecimento", label: "Tipo de Reconhecimento" },
      { key: "numAtoReconhecimento", label: "Nº do Ato" },
      { key: "dataReconhecimento", label: "Data de Reconhecimento" },
      { key: "publicacaoReconhecimento", label: "Publicação do Reconhecimento", span2: true },
    ],
    endereco: [
      { key: "logradouro", label: "Logradouro", span2: true },
      { key: "numero", label: "Número" },
      { key: "bairro", label: "Bairro" },
      { key: "municipio", label: "Município" },
      { key: "uf", label: "UF" },
      { key: "cep", label: "CEP" },
      { key: "codIbge", label: "Cód. IBGE" },
    ],
    instituicao: [
      { key: "nomeInstituicao", label: "Nome da Instituição", span2: true },
      { key: "cnpjInstituicao", label: "CNPJ da Instituição" },
      { key: "credenciamento", label: "Credenciamento", span2: true },
      { key: "publicacaoCredenciamento", label: "Publicação Credenciamento", span2: true },
      { key: "recredenciamento", label: "Recredenciamento", span2: true },
      { key: "publicacaoRecredenciamento", label: "Publicação Recredenciamento", span2: true },
      { key: "nomeMantenedora", label: "Nome da Mantenedora", span2: true },
      { key: "cnpjMantenedora", label: "CNPJ da Mantenedora" },
    ],
    registro: [
      { key: "numRegistro", label: "Nº de Registro" },
      { key: "dataRegistro", label: "Data de Registro" },
      { key: "dataExpedicao", label: "Data de Expedição" },
      { key: "responsavelRegistro", label: "Responsável pelo Registro", span2: true },
      { key: "cargoResponsavel", label: "Cargo do Responsável" },
      { key: "livro", label: "Livro" },
      { key: "folha", label: "Folha" },
      { key: "dataConclusao", label: "Data de Conclusão" },
      { key: "dataColacao", label: "Data de Colação" },
    ],
    assinaturas: [
      { key: "assinatura1Nome", label: "Signatário 1 - Nome", span2: true },
      { key: "assinatura1Cargo", label: "Signatário 1 - Cargo", span2: true },
      { key: "assinatura2Nome", label: "Signatário 2 - Nome", span2: true },
      { key: "assinatura2Cargo", label: "Signatário 2 - Cargo", span2: true },
      { key: "assinatura3Nome", label: "Signatário 3 - Nome", span2: true },
      { key: "assinatura3Cargo", label: "Signatário 3 - Cargo", span2: true },
      { key: "codigoValidacao", label: "Código de Validação", span2: true },
      { key: "urlValidacao", label: "URL de Validação", span2: true },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1a1a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <div>
              <h2 className="text-white text-lg font-semibold">Diploma UNINTER</h2>
              <p className="text-[#555566] text-sm">Formulário de emissão de diploma</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSave} className="border-[#2a2a3a] text-[#aaaacc] hover:text-white hover:bg-[#1a1a2a] h-9 gap-2">
              <Save className="w-4 h-4" /> Salvar Rascunho
            </Button>
            <Button onClick={handleExport} className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold h-9 gap-2">
              <Download className="w-4 h-4" /> Exportar PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.key} className="bg-[#141420] border border-[#1a1a2a] rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a2a]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8aa32]/20 to-[#a08828]/20 flex items-center justify-center">
                  <section.icon className="w-4 h-4 text-[#c8aa32]" />
                </div>
                <span className="text-white font-medium">{section.title}</span>
              </div>
              {openSections.has(section.key) ? (
                <ChevronUp className="w-4 h-4 text-[#666688]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#666688]" />
              )}
            </button>
            {openSections.has(section.key) && (
              <div className="px-5 pb-5 pt-2">
                <Separator className="bg-[#1a1a2a] mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sectionFields[section.key].map((field) =>
                    renderField(field.key, field.label, { span2: field.span2 })
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
