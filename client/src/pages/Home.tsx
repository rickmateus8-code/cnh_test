import { useLocalAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText, Shield, Download, Users, ChevronRight,
  GraduationCap, Award, Sparkles, Lock
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useLocalAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) setLocation("/dashboard");
  }, [loading, isAuthenticated, setLocation]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#c8aa32]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#c8aa32]/3 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-[#1a1a2a]/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8aa32] to-[#a08828] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#0a0a0f]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">DocMaster</h1>
              <p className="text-[10px] text-[#555566] uppercase tracking-[0.2em]">Sistema de Documentos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setLocation("/login")}
              className="text-[#888899] hover:text-white"
            >
              Entrar
            </Button>
            <Button
              onClick={() => setLocation("/register")}
              className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#c8aa32]/10 border border-[#c8aa32]/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#c8aa32]" />
            <span className="text-[#c8aa32] text-xs font-medium">Sistema Profissional de Documentos Acadêmicos</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Geração de Documentos
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c8aa32] to-[#e8d060]">
              Acadêmicos
            </span>
          </h2>
          <p className="text-lg text-[#777799] mb-10 max-w-xl mx-auto leading-relaxed">
            Crie, gerencie e exporte documentos acadêmicos com fidelidade total ao layout original. 
            Históricos escolares, diplomas e certificados em um só lugar.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setLocation("/login")}
              className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-bold text-base h-12 px-8 gap-2"
            >
              Acessar Sistema <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setLocation("/register")}
              className="border-[#2a2a3a] text-[#888899] hover:text-white hover:border-[#c8aa32]/50 h-12 px-8"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-3">Tipos de Documentos</h3>
          <p className="text-[#666688]">Selecione o tipo de documento que deseja gerar</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: GraduationCap,
              title: "Histórico Escolar",
              desc: "Histórico escolar completo com 6 páginas, componentes curriculares, notas e carga horária.",
              status: "Disponível",
              color: "from-emerald-500/20 to-emerald-500/5",
              borderColor: "border-emerald-500/20",
              statusColor: "text-emerald-400 bg-emerald-500/10",
            },
            {
              icon: Award,
              title: "Diploma",
              desc: "Diploma de graduação com dados completos do diplomado, curso, instituição e assinaturas.",
              status: "Disponível",
              color: "from-blue-500/20 to-blue-500/5",
              borderColor: "border-blue-500/20",
              statusColor: "text-blue-400 bg-blue-500/10",
            },
            {
              icon: FileText,
              title: "Certificado",
              desc: "Certificados de conclusão de cursos, extensão e pós-graduação.",
              status: "Em breve",
              color: "from-purple-500/20 to-purple-500/5",
              borderColor: "border-purple-500/20",
              statusColor: "text-purple-400 bg-purple-500/10",
            },
          ].map((doc, i) => (
            <div
              key={i}
              className={`group relative bg-gradient-to-b ${doc.color} rounded-2xl border ${doc.borderColor} p-6 hover:border-[#c8aa32]/30 transition-all duration-300 cursor-pointer`}
              onClick={() => setLocation("/login")}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#141420] flex items-center justify-center">
                  <doc.icon className="w-6 h-6 text-[#c8aa32]" />
                </div>
                <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${doc.statusColor}`}>
                  {doc.status}
                </span>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-white group-hover:text-[#c8aa32] transition-colors">
                {doc.title}
              </h4>
              <p className="text-sm text-[#666688] leading-relaxed">{doc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: "Seguro", desc: "Dados criptografados e protegidos" },
            { icon: Download, title: "Exportação PDF", desc: "PDFs de alta qualidade com base64" },
            { icon: Users, title: "Multi-perfis", desc: "Gerencie múltiplos perfis de alunos" },
            { icon: Lock, title: "Validação", desc: "Código de validação e QR Code" },
          ].map((feat, i) => (
            <div key={i} className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-[#c8aa32]/10 flex items-center justify-center mx-auto mb-4">
                <feat.icon className="w-5 h-5 text-[#c8aa32]" />
              </div>
              <h4 className="font-semibold mb-1 text-white">{feat.title}</h4>
              <p className="text-sm text-[#666688]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1a1a2a]/50 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#c8aa32]" />
            <span className="text-sm text-[#555566]">DocMaster &copy; 2025</span>
          </div>
          <p className="text-xs text-[#333344]">Sistema de Geração de Documentos Acadêmicos</p>
        </div>
      </footer>
    </div>
  );
}
