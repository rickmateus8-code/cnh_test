import { useLocalAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Lock, User, Eye, EyeOff, Shield, Mail, UserPlus } from "lucide-react";

export default function Register() {
  const { register } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password || !form.confirmPassword) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      toast.success("Conta criada com sucesso!");
      setLocation("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0d0d14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,170,50,0.08),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,170,50,0.05),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-[#2a2a3a] rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8aa32] to-[#a08828] mb-4 shadow-lg shadow-[#c8aa32]/20">
              <UserPlus className="w-8 h-8 text-[#0a0a0f]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Criar Conta</h1>
            <p className="text-[#8888aa] text-sm mt-1">Cadastre-se no DocMaster</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#aaaacc] text-sm font-medium">
                Usuário *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Escolha um nome de usuário"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-[#aaaacc] text-sm font-medium">
                Nome de Exibição
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#aaaacc] text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#aaaacc] text-sm font-medium">
                  Senha *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 caracteres"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#aaaacc] text-sm font-medium">
                  Confirmar *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#666688] hover:text-[#aaaacc] text-xs flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPassword ? "Ocultar senhas" : "Mostrar senhas"}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold shadow-lg shadow-[#c8aa32]/20 transition-all"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#666688] text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-[#c8aa32] hover:text-[#d4b83a] font-medium transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-[#444455] text-xs mt-6">
          DocMaster &copy; 2024 — Sistema de Documentos Acadêmicos
        </p>
      </div>
    </div>
  );
}
