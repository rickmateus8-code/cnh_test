import { useLocalAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  FileText, GraduationCap, Award, Search, Plus, Trash2, Edit, Download,
  LayoutDashboard, Users, Settings, Bell, ChevronDown, LogOut, Shield,
  Clock, FileCheck, Menu, X, Scroll, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type TabType = "todos" | "historico" | "diploma";

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, logout, loading: authLoading } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const documentsQuery = trpc.documents.list.useQuery(undefined, { enabled: isAuthenticated });
  const profilesQuery = trpc.profiles.list.useQuery(undefined, { enabled: isAuthenticated });
  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => {
      documentsQuery.refetch();
      toast.success("Documento excluído");
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#c8aa32] border-t-transparent rounded-full" />
      </div>
    );
  }

  const documents = documentsQuery.data || [];
  const profiles = profilesQuery.data || [];

  const filteredDocs = documents.filter((doc: any) => {
    const matchesTab = activeTab === "todos" || doc.tipo === activeTab;
    const matchesSearch = !searchQuery ||
      doc.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tipo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: documents.length,
    historicos: documents.filter((d: any) => d.tipo === "historico").length,
    diplomas: documents.filter((d: any) => d.tipo === "diploma").length,
    perfis: profiles.length,
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, onClick: () => {} },
    { icon: FileText, label: "Documentos", onClick: () => setActiveTab("todos") },
    { icon: GraduationCap, label: "Histórico UNINTER", onClick: () => setLocation("/historico") },
    { icon: BookOpen, label: "Histórico Rio Grande do Sul", onClick: () => setLocation("/historico-rs") },
    { icon: BookOpen, label: "Histórico São Paulo", onClick: () => setLocation("/historico-sp") },
    { icon: Award, label: "Diploma UNINTER", onClick: () => setLocation("/diploma") },
    { icon: Users, label: "Perfis", onClick: () => setLocation("/profiles") },
  ];

  const adminItems = isAdmin ? [
    { icon: Shield, label: "Admin", onClick: () => setLocation("/admin") },
    { icon: Bell, label: "Anúncios", onClick: () => toast.info("Funcionalidade em breve") },
    { icon: Settings, label: "Configurações", onClick: () => toast.info("Funcionalidade em breve") },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
        ${sidebarOpen ? "w-64" : "w-20"}
        ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-[#0d0d14] border-r border-[#1a1a2a] flex flex-col transition-all duration-300
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-[#1a1a2a] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8aa32] to-[#a08828] flex items-center justify-center shrink-0 shadow-lg shadow-[#c8aa32]/10">
            <Shield className="w-5 h-5 text-[#0a0a0f]" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-white font-bold text-lg leading-none">DocMaster</h1>
              <p className="text-[#555566] text-[10px] mt-0.5 uppercase tracking-wider">Sistema Pro</p>
            </div>
          )}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto lg:hidden text-[#666688] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[#444455] text-[10px] uppercase tracking-wider px-3 py-2 font-semibold">
            {sidebarOpen ? "Menu Principal" : ""}
          </p>
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                item.active
                  ? "bg-[#c8aa32]/10 text-[#c8aa32] border border-[#c8aa32]/20"
                  : "text-[#8888aa] hover:text-white hover:bg-[#1a1a2a]"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}

          {adminItems.length > 0 && (
            <>
              <p className="text-[#444455] text-[10px] uppercase tracking-wider px-3 py-2 mt-4 font-semibold">
                {sidebarOpen ? "Administração" : ""}
              </p>
              {adminItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8888aa] hover:text-white hover:bg-[#1a1a2a] transition-all"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-[#1a1a2a]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1a2a] transition-all">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8aa32] to-[#a08828] flex items-center justify-center shrink-0 text-[#0a0a0f] font-bold text-sm">
                  {(user?.displayName || user?.username || "?").charAt(0).toUpperCase()}
                </div>
                {sidebarOpen && (
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user?.displayName || user?.username}</p>
                    <p className="text-[#555566] text-xs truncate">
                      {isAdmin ? "Administrador" : "Usuário"}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#141420] border-[#2a2a3a]">
              <DropdownMenuItem className="text-[#aaaacc] focus:text-white focus:bg-[#1a1a2a]">
                <Settings className="w-4 h-4 mr-2" /> Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#2a2a3a]" />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1a1a2a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-[#8888aa] hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-white text-lg font-semibold">Dashboard</h2>
                <p className="text-[#555566] text-sm">Bem-vindo, {user?.displayName || user?.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
                <Input
                  placeholder="Buscar documentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-[#141420] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] h-9"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold h-9 gap-2">
                    <Plus className="w-4 h-4" /> Novo Documento
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-[#141420] border-[#2a2a3a]">
                  <DropdownMenuItem
                    onClick={() => setLocation("/historico")}
                    className="text-[#aaaacc] focus:text-white focus:bg-[#1a1a2a] gap-2"
                  >
                    <GraduationCap className="w-4 h-4" /> Histórico UNINTER
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocation("/historico-rs")}
                    className="text-[#aaaacc] focus:text-white focus:bg-[#1a1a2a] gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Histórico Rio Grande do Sul
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocation("/historico-sp")}
                    className="text-[#aaaacc] focus:text-white focus:bg-[#1a1a2a] gap-2"
                  >
                    <BookOpen className="w-4 h-4" /> Histórico São Paulo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLocation("/diploma")}
                    className="text-[#aaaacc] focus:text-white focus:bg-[#1a1a2a] gap-2"
                  >
                    <Award className="w-4 h-4" /> Diploma UNINTER
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Documentos", value: stats.total, icon: FileText, color: "from-[#c8aa32] to-[#a08828]" },
              { label: "Históricos", value: stats.historicos, icon: GraduationCap, color: "from-blue-500 to-blue-600" },
              { label: "Diplomas", value: stats.diplomas, icon: Award, color: "from-emerald-500 to-emerald-600" },
              { label: "Perfis", value: stats.perfis, icon: Users, color: "from-purple-500 to-purple-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#141420] border border-[#1a1a2a] rounded-xl p-4 hover:border-[#2a2a3a] transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#666688] text-sm">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setLocation("/historico")}
              className="bg-[#141420] border border-[#1a1a2a] rounded-xl p-6 hover:border-[#c8aa32]/30 hover:bg-[#141420]/80 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c8aa32]/20 to-[#a08828]/20 flex items-center justify-center group-hover:from-[#c8aa32]/30 group-hover:to-[#a08828]/30 transition-all">
                  <GraduationCap className="w-7 h-7 text-[#c8aa32]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Histórico UNINTER</h3>
                  <p className="text-[#666688] text-sm mt-1">Gerar histórico escolar acadêmico</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setLocation("/diploma")}
              className="bg-[#141420] border border-[#1a1a2a] rounded-xl p-6 hover:border-[#c8aa32]/30 hover:bg-[#141420]/80 transition-all group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-emerald-600/30 transition-all">
                  <Award className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Diploma UNINTER</h3>
                  <p className="text-[#666688] text-sm mt-1">Gerar diploma de graduação</p>
                </div>
              </div>
            </button>
          </div>

          {/* Document tabs & list */}
          <div className="bg-[#141420] border border-[#1a1a2a] rounded-xl overflow-hidden">
            <div className="border-b border-[#1a1a2a] px-4">
              <div className="flex gap-1">
                {[
                  { key: "todos" as TabType, label: "Todos", icon: FileText },
                  { key: "historico" as TabType, label: "Históricos", icon: GraduationCap },
                  { key: "diploma" as TabType, label: "Diplomas", icon: Award },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                      activeTab === tab.key
                        ? "border-[#c8aa32] text-[#c8aa32]"
                        : "border-transparent text-[#666688] hover:text-[#aaaacc]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {filteredDocs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#2a2a3a] mx-auto mb-3" />
                  <p className="text-[#666688] text-sm">Nenhum documento encontrado</p>
                  <p className="text-[#444455] text-xs mt-1">Crie um novo documento para começar</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredDocs.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0d0d14] border border-[#1a1a2a] hover:border-[#2a2a3a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          doc.tipo === "historico"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {doc.tipo === "historico" ? <GraduationCap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{doc.titulo || `${doc.tipo === "historico" ? "Histórico" : "Diploma"} #${doc.id}`}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              doc.status === "finalizado" ? "bg-emerald-500/10 text-emerald-400" :
                              doc.status === "exportado" ? "bg-blue-500/10 text-blue-400" :
                              "bg-[#c8aa32]/10 text-[#c8aa32]"
                            }`}>
                              {doc.status}
                            </span>
                            <span className="text-[#444455] text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(doc.updatedAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#666688] hover:text-[#c8aa32] hover:bg-[#c8aa32]/10 h-8 w-8 p-0"
                          onClick={() => toast.info("Funcionalidade em breve")}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#666688] hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 p-0"
                          onClick={() => toast.info("Funcionalidade em breve")}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#666688] hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                          onClick={() => {
                            if (confirm("Excluir este documento?")) {
                              deleteDoc.mutate({ id: doc.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
