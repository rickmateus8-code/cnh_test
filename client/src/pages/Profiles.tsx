import { useLocalAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Users, Plus, Edit, Trash2, Search, ArrowLeft, Save, X, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

export default function Profiles() {
  const { isAuthenticated, loading: authLoading } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    nome: "", cpf: "", rg: "", nacionalidade: "Brasileira",
    naturalidade: "", dataNascimento: "", curso: "Licenciatura em História",
    tituloConferido: "Licenciado", grauConferido: "Licenciatura",
    habilitacao: "", emec: "", dataConclusao: "", dataColacao: "",
    dataEmissao: "", endereco: "",
  });

  const profilesQuery = trpc.profiles.list.useQuery(undefined, { enabled: isAuthenticated });
  const createProfile = trpc.profiles.create.useMutation({
    onSuccess: () => { profilesQuery.refetch(); setShowForm(false); resetForm(); toast.success("Perfil criado!"); },
  });
  const updateProfile = trpc.profiles.update.useMutation({
    onSuccess: () => { profilesQuery.refetch(); setShowForm(false); resetForm(); toast.success("Perfil atualizado!"); },
  });
  const deleteProfile = trpc.profiles.delete.useMutation({
    onSuccess: () => { profilesQuery.refetch(); toast.success("Perfil excluído!"); },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) setLocation("/login");
  }, [authLoading, isAuthenticated, setLocation]);

  const resetForm = () => {
    setForm({
      nome: "", cpf: "", rg: "", nacionalidade: "Brasileira",
      naturalidade: "", dataNascimento: "", curso: "Licenciatura em História",
      tituloConferido: "Licenciado", grauConferido: "Licenciatura",
      habilitacao: "", emec: "", dataConclusao: "", dataColacao: "",
      dataEmissao: "", endereco: "",
    });
    setEditingId(null);
  };

  const handleEdit = (profile: any) => {
    setForm({
      nome: profile.nome || "",
      cpf: profile.cpf || "",
      rg: profile.rg || "",
      nacionalidade: profile.nacionalidade || "",
      naturalidade: profile.naturalidade || "",
      dataNascimento: profile.dataNascimento || "",
      curso: profile.curso || "",
      tituloConferido: profile.tituloConferido || "",
      grauConferido: profile.grauConferido || "",
      habilitacao: profile.habilitacao || "",
      emec: profile.emec || "",
      dataConclusao: profile.dataConclusao || "",
      dataColacao: profile.dataColacao || "",
      dataEmissao: profile.dataEmissao || "",
      endereco: profile.endereco || "",
    });
    setEditingId(profile.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.nome) { toast.error("Nome é obrigatório"); return; }
    if (editingId) {
      updateProfile.mutate({ id: editingId, ...form });
    } else {
      createProfile.mutate(form);
    }
  };

  const profiles = (profilesQuery.data || []).filter((p: any) =>
    !searchQuery || p.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cpf?.includes(searchQuery)
  );

  const fields = [
    { key: "nome", label: "Nome Completo", required: true },
    { key: "cpf", label: "CPF" },
    { key: "rg", label: "RG" },
    { key: "nacionalidade", label: "Nacionalidade" },
    { key: "naturalidade", label: "Naturalidade" },
    { key: "dataNascimento", label: "Data de Nascimento" },
    { key: "curso", label: "Curso" },
    { key: "tituloConferido", label: "Título Conferido" },
    { key: "grauConferido", label: "Grau Conferido" },
    { key: "habilitacao", label: "Habilitação" },
    { key: "emec", label: "Cód. e-MEC" },
    { key: "dataConclusao", label: "Data de Conclusão" },
    { key: "dataColacao", label: "Data de Colação" },
    { key: "dataEmissao", label: "Data de Emissão" },
    { key: "endereco", label: "Endereço" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1a1a2a] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <div>
              <h2 className="text-white text-lg font-semibold">Gerenciar Perfis</h2>
              <p className="text-[#555566] text-sm">{profiles.length} perfis cadastrados</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555566]" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-[#141420] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] h-9"
              />
            </div>
            <Button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold h-9 gap-2"
            >
              <Plus className="w-4 h-4" /> Novo Perfil
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {profiles.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-[#2a2a3a] mx-auto mb-4" />
            <p className="text-[#666688] text-lg">Nenhum perfil cadastrado</p>
            <p className="text-[#444455] text-sm mt-1">Crie um perfil para começar a gerar documentos</p>
            <Button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="mt-4 bg-gradient-to-r from-[#c8aa32] to-[#a08828] text-[#0a0a0f] font-semibold gap-2"
            >
              <Plus className="w-4 h-4" /> Criar Primeiro Perfil
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile: any) => (
              <div key={profile.id} className="bg-[#141420] border border-[#1a1a2a] rounded-xl p-5 hover:border-[#2a2a3a] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c8aa32]/20 to-[#a08828]/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#c8aa32]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{profile.nome}</p>
                      <p className="text-[#555566] text-xs">{profile.cpf || "CPF não informado"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(profile)} className="text-[#666688] hover:text-blue-400 h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { if (confirm("Excluir perfil?")) deleteProfile.mutate({ id: profile.id }); }} className="text-[#666688] hover:text-red-400 h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  {profile.curso && <p className="text-[#8888aa]"><span className="text-[#555566]">Curso:</span> {profile.curso}</p>}
                  {profile.dataConclusao && <p className="text-[#8888aa]"><span className="text-[#555566]">Conclusão:</span> {profile.dataConclusao}</p>}
                  {profile.endereco && <p className="text-[#8888aa] truncate"><span className="text-[#555566]">Endereço:</span> {profile.endereco}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-[#141420] border-[#2a2a3a] text-white max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#c8aa32]">
              {editingId ? "Editar Perfil" : "Novo Perfil"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {fields.map((field) => (
              <div key={field.key} className={field.key === "endereco" ? "md:col-span-2" : ""}>
                <Label className="text-[#aaaacc] text-sm">{field.label} {field.required && "*"}</Label>
                <Input
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] mt-1"
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }} className="text-[#666688]">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createProfile.isPending || updateProfile.isPending}
              className="bg-gradient-to-r from-[#c8aa32] to-[#a08828] text-[#0a0a0f] font-semibold"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingId ? "Salvar Alterações" : "Criar Perfil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
