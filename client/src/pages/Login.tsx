import { useLocalAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";

export default function Login() {
  const { login, loading: authLoading } = useLocalAuth();
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Login realizado com sucesso!");
      setLocation("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0d0d14]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,170,50,0.08),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,170,50,0.05),_transparent_60%)]" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#141420]/80 backdrop-blur-xl border border-[#2a2a3a] rounded-2xl p-8 shadow-2xl">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8aa32] to-[#a08828] mb-4 shadow-lg shadow-[#c8aa32]/20">
              <Shield className="w-8 h-8 text-[#0a0a0f]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">DocMaster</h1>
            <p className="text-[#8888aa] text-sm mt-1">Sistema de Documentos Acadêmicos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#aaaacc] text-sm font-medium">
                Usuário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#aaaacc] text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666688]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-[#0d0d18] border-[#2a2a3a] text-white placeholder:text-[#555566] focus:border-[#c8aa32] focus:ring-[#c8aa32]/20 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666688] hover:text-[#aaaacc]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || authLoading}
              className="w-full h-11 bg-gradient-to-r from-[#c8aa32] to-[#a08828] hover:from-[#d4b83a] hover:to-[#b09830] text-[#0a0a0f] font-semibold shadow-lg shadow-[#c8aa32]/20 transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#666688] text-sm">
              Não tem uma conta?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="text-[#c8aa32] hover:text-[#d4b83a] font-medium transition-colors"
              >
                Criar conta
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
