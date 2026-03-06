import { trpc } from "@/lib/trpc";
import { createContext, useContext, useCallback, useMemo, type ReactNode } from "react";

type AuthUser = {
  id: number;
  username: string;
  displayName: string | null;
  email: string | null;
  role: "user" | "admin";
  balance: number;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: { username: string; password: string; confirmPassword: string; displayName?: string; email?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const login = useCallback(async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  }, [loginMutation]);

  const register = useCallback(async (data: { username: string; password: string; confirmPassword: string; displayName?: string; email?: string }) => {
    await registerMutation.mutateAsync(data);
  }, [registerMutation]);

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    utils.auth.me.setData(undefined, null);
    await utils.auth.me.invalidate();
  }, [logoutMutation, utils]);

  const value = useMemo(() => ({
    user: meQuery.data as AuthUser | null,
    loading: meQuery.isLoading,
    isAuthenticated: Boolean(meQuery.data),
    isAdmin: (meQuery.data as AuthUser | null)?.role === "admin",
    login,
    register,
    logout,
    refresh: () => meQuery.refetch(),
  }), [meQuery.data, meQuery.isLoading, login, register, logout, meQuery.refetch]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useLocalAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useLocalAuth must be used within AuthProvider");
  return ctx;
}
