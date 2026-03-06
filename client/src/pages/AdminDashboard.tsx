/**
 * AdminDashboard — Painel Administrativo Completo
 * Gerenciamento: Membros, Saldo, Templates, Documentos, PIX, Configurações
 * Admin master: cyberpiolho
 */
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ArrowLeft, Users, CreditCard, FileText, Settings, Upload,
  Plus, Minus, Shield, UserCheck, UserX, RefreshCw, Eye, EyeOff,
  DollarSign, Clock, CheckCircle, XCircle, Trash2
} from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  balance: number;
  is_active: number;
  created_at: string;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  is_published: number;
  created_at: string;
}

type Tab = "users" | "templates" | "documents" | "pix" | "settings";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Balance modal
  const [balanceModal, setBalanceModal] = useState<{ userId: number; username: string } | null>(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<"credit" | "debit">("credit");

  // New user modal
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", role: "user" });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/v6/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const res = await fetch("/api/v6/admin/templates");
      if (res.ok) setTemplates(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/v6/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchTemplates();
    fetchSettings();
  }, [fetchUsers, fetchTemplates, fetchSettings]);

  const handleBalanceUpdate = async () => {
    if (!balanceModal || !balanceAmount) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v6/admin/users/${balanceModal.userId}/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: balanceAmount, type: balanceType, description: `${balanceType === "credit" ? "Crédito" : "Débito"} admin` }),
      });
      if (res.ok) {
        toast.success(`Saldo ${balanceType === "credit" ? "adicionado" : "removido"} com sucesso!`);
        setBalanceModal(null);
        setBalanceAmount("");
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar saldo");
      }
    } catch (e) { toast.error("Erro de conexão"); }
    setLoading(false);
  };

  const handleToggleActive = async (userId: number) => {
    try {
      const res = await fetch(`/api/v6/admin/users/${userId}/toggle-active`, { method: "POST" });
      if (res.ok) { fetchUsers(); toast.success("Status atualizado!"); }
    } catch (e) { toast.error("Erro"); }
  };

  const handleRoleChange = async (userId: number, role: string) => {
    try {
      const res = await fetch(`/api/v6/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) { fetchUsers(); toast.success("Permissão atualizada!"); }
    } catch (e) { toast.error("Erro"); }
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v6/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        toast.success("Usuário criado!");
        setNewUserModal(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao criar");
      }
    } catch (e) { toast.error("Erro"); }
    setLoading(false);
  };

  const handlePublishTemplate = async (id: number, publish: boolean) => {
    try {
      const res = await fetch(`/api/v6/admin/templates/${id}/${publish ? "publish" : "unpublish"}`, { method: "POST" });
      if (res.ok) { fetchTemplates(); toast.success(publish ? "Publicado!" : "Despublicado!"); }
    } catch (e) { toast.error("Erro"); }
  };

  const handleSettingUpdate = async (key: string, value: string) => {
    try {
      const res = await fetch("/api/v6/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (res.ok) { fetchSettings(); toast.success("Configuração salva!"); }
    } catch (e) { toast.error("Erro"); }
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "users", label: "Membros", icon: Users },
    { id: "templates", label: "Templates", icon: FileText },
    { id: "documents", label: "Documentos", icon: Upload },
    { id: "pix", label: "PIX / Saldo", icon: CreditCard },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-white overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-[#1a1a2a] bg-[#0d0d14] flex items-center px-6 gap-4 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/dashboard")} className="text-[#666688] hover:text-white">
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>
        <div className="h-6 w-px bg-[#2a2a3a]" />
        <Shield size={18} className="text-red-400" />
        <h1 className="text-base font-bold tracking-wide">Painel Administrativo</h1>
        <span className="text-xs px-2 py-0.5 rounded bg-red-900/40 text-red-400 font-mono">ADMIN MASTER</span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 border-r border-[#1a1a2a] bg-[#0b0b12] shrink-0 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1a1a2a] text-white border-r-2 border-emerald-500"
                  : "text-[#666688] hover:text-white hover:bg-[#111118]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* ===== MEMBROS ===== */}
          {activeTab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Gerenciamento de Membros</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={fetchUsers} className="border-[#2a2a3a] text-[#aaa]">
                    <RefreshCw size={14} className="mr-1" /> Atualizar
                  </Button>
                  <Button size="sm" onClick={() => setNewUserModal(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus size={14} className="mr-1" /> Novo Membro
                  </Button>
                </div>
              </div>

              <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a2a] text-[#666688]">
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Usuário</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-center">Permissão</th>
                      <th className="px-4 py-3 text-right">Saldo</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-[#111118] hover:bg-[#111118]">
                        <td className="px-4 py-3 text-[#555]">#{user.id}</td>
                        <td className="px-4 py-3 font-medium">{user.username}</td>
                        <td className="px-4 py-3 text-[#888]">{user.email}</td>
                        <td className="px-4 py-3 text-center">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="bg-[#1a1a2a] border border-[#2a2a3a] rounded px-2 py-1 text-xs"
                          >
                            <option value="admin">Admin</option>
                            <option value="user">Usuário</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-400">
                          R$ {user.balance.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {user.is_active ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Ativo</span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded bg-red-900/40 text-red-400">Inativo</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-emerald-400 hover:text-emerald-300"
                              onClick={() => setBalanceModal({ userId: user.id, username: user.username })}
                              title="Gerenciar Saldo"
                            >
                              <DollarSign size={14} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`h-7 w-7 p-0 ${user.is_active ? "text-red-400 hover:text-red-300" : "text-emerald-400 hover:text-emerald-300"}`}
                              onClick={() => handleToggleActive(user.id)}
                              title={user.is_active ? "Desativar" : "Ativar"}
                            >
                              {user.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Balance Modal */}
              {balanceModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="bg-[#0d0d14] border border-[#2a2a3a] rounded-xl p-6 w-96">
                    <h3 className="text-lg font-bold mb-4">Gerenciar Saldo — {balanceModal.username}</h3>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setBalanceType("credit")}
                        className={`flex-1 py-2 rounded text-sm font-medium ${balanceType === "credit" ? "bg-emerald-600 text-white" : "bg-[#1a1a2a] text-[#888]"}`}
                      >
                        <Plus size={14} className="inline mr-1" /> Adicionar
                      </button>
                      <button
                        onClick={() => setBalanceType("debit")}
                        className={`flex-1 py-2 rounded text-sm font-medium ${balanceType === "debit" ? "bg-red-600 text-white" : "bg-[#1a1a2a] text-[#888]"}`}
                      >
                        <Minus size={14} className="inline mr-1" /> Remover
                      </button>
                    </div>
                    <input
                      type="number"
                      value={balanceAmount}
                      onChange={(e) => setBalanceAmount(e.target.value)}
                      placeholder="Valor (R$)"
                      className="w-full bg-[#1a1a2a] border border-[#2a2a3a] rounded px-4 py-2 mb-4 text-white"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 border-[#2a2a3a]" onClick={() => setBalanceModal(null)}>Cancelar</Button>
                      <Button
                        className={`flex-1 ${balanceType === "credit" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
                        onClick={handleBalanceUpdate}
                        disabled={loading}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* New User Modal */}
              {newUserModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                  <div className="bg-[#0d0d14] border border-[#2a2a3a] rounded-xl p-6 w-96">
                    <h3 className="text-lg font-bold mb-4">Novo Membro</h3>
                    <div className="space-y-3">
                      <input
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Username"
                        className="w-full bg-[#1a1a2a] border border-[#2a2a3a] rounded px-4 py-2 text-white"
                      />
                      <input
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email"
                        className="w-full bg-[#1a1a2a] border border-[#2a2a3a] rounded px-4 py-2 text-white"
                      />
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Senha"
                        className="w-full bg-[#1a1a2a] border border-[#2a2a3a] rounded px-4 py-2 text-white"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="w-full bg-[#1a1a2a] border border-[#2a2a3a] rounded px-4 py-2 text-white"
                      >
                        <option value="user">Usuário</option>
                        <option value="admin">Admin</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1 border-[#2a2a3a]" onClick={() => setNewUserModal(false)}>Cancelar</Button>
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleCreateUser} disabled={loading}>
                        Criar Membro
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== TEMPLATES ===== */}
          {activeTab === "templates" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Templates de Documentos</h2>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={fetchTemplates} className="border-[#2a2a3a] text-[#aaa]">
                    <RefreshCw size={14} className="mr-1" /> Atualizar
                  </Button>
                  <Button size="sm" onClick={() => setLocation("/admin/pdf-manager")} className="bg-blue-600 hover:bg-blue-700">
                    <Upload size={14} className="mr-1" /> Upload PDF
                  </Button>
                </div>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-20 text-[#555]">
                  <FileText size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Nenhum template cadastrado.</p>
                  <p className="text-sm mt-1">Use "Upload PDF" para adicionar templates.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((t) => (
                    <div key={t.id} className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-sm">{t.name}</h3>
                        {t.is_published ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400">Publicado</span>
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-400">Rascunho</span>
                        )}
                      </div>
                      <p className="text-xs text-[#666] mb-2">{t.description || "Sem descrição"}</p>
                      <p className="text-xs text-[#888] mb-3">Categoria: {t.category} | Preço: R$ {t.price.toFixed(2)}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-[#2a2a3a]"
                          onClick={() => handlePublishTemplate(t.id, !t.is_published)}
                        >
                          {t.is_published ? <><EyeOff size={12} className="mr-1" /> Despublicar</> : <><Eye size={12} className="mr-1" /> Publicar</>}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== DOCUMENTOS ===== */}
          {activeTab === "documents" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Documentos</h2>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setLocation("/create/cnh")} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Plus size={14} className="mr-1" /> NOVO DOCUMENTO
                  </Button>
                </div>
              </div>

              {/* Tipos de Documento */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button onClick={() => setLocation("/create/cnh")} className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 hover:border-yellow-500 transition-colors text-left">
                  <div className="text-2xl mb-2">🪪</div>
                  <h3 className="font-bold text-sm">CNH Digital</h3>
                  <p className="text-xs text-[#666] mt-1">Carteira Nacional de Habilitação</p>
                </button>
                <button onClick={() => setLocation("/historico-rs")} className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 hover:border-yellow-500 transition-colors text-left">
                  <div className="text-2xl mb-2">📄</div>
                  <h3 className="font-bold text-sm">Histórico RS</h3>
                  <p className="text-xs text-[#666] mt-1">Histórico Escolar - Rio Grande do Sul</p>
                </button>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">🆔</div>
                  <h3 className="font-bold text-sm">RG Digital</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">⚓</div>
                  <h3 className="font-bold text-sm">CHA Náutica</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">🏥</div>
                  <h3 className="font-bold text-sm">Atestado Médico</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">🚗</div>
                  <h3 className="font-bold text-sm">CRLV</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">🧪</div>
                  <h3 className="font-bold text-sm">Toxicológico</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-4 opacity-50 cursor-not-allowed">
                  <div className="text-2xl mb-2">🎓</div>
                  <h3 className="font-bold text-sm">Diploma</h3>
                  <p className="text-xs text-[#666] mt-1">Em breve</p>
                </div>
              </div>

              <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-yellow-400" /> Documentos Recentes
                </h3>
                <div className="text-center py-10 text-[#555]">
                  <p>Documentos gerados pelos usuários aparecerão aqui.</p>
                  <p className="text-sm mt-1">Timing de expiração: 30 minutos (configurável).</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== PIX / SALDO ===== */}
          {activeTab === "pix" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Gateway PIX / Gestão de Saldo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-emerald-400" /> Status do Gateway
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#888]">Gateway PIX</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/40 text-yellow-400">
                        Aguardando API
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#888]">Provedor</span>
                      <span className="text-xs text-[#555]">Não configurado</span>
                    </div>
                    <p className="text-xs text-[#555] mt-4">
                      Configure a API Key e URL do gateway PIX nas Configurações para ativar pagamentos automáticos.
                    </p>
                  </div>
                </div>
                <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <DollarSign size={18} className="text-emerald-400" /> Resumo Financeiro
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#888]">Total de Membros</span>
                      <span className="font-mono text-emerald-400">{users.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#888]">Saldo Total (todos)</span>
                      <span className="font-mono text-emerald-400">
                        R$ {users.reduce((s, u) => s + u.balance, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== CONFIGURAÇÕES ===== */}
          {activeTab === "settings" && (
            <div>
              <h2 className="text-xl font-bold mb-6">Configurações do Sistema</h2>
              <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a2a] text-[#666688]">
                      <th className="px-4 py-3 text-left">Configuração</th>
                      <th className="px-4 py-3 text-left">Valor</th>
                      <th className="px-4 py-3 text-center">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings.map((s: any) => (
                      <tr key={s.key} className="border-b border-[#111118]">
                        <td className="px-4 py-3 font-mono text-xs">{s.key}</td>
                        <td className="px-4 py-3">
                          <input
                            defaultValue={s.value}
                            className="bg-[#1a1a2a] border border-[#2a2a3a] rounded px-3 py-1 text-sm text-white w-full max-w-xs"
                            onBlur={(e) => {
                              if (e.target.value !== s.value) {
                                handleSettingUpdate(s.key, e.target.value);
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-[#555]">
                          {s.updated_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
