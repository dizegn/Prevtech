import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-white rounded-lg px-8 py-5 inline-block mb-4">
            <p className="text-black text-3xl font-bold">PrevTech</p>
          </div>
          <h1 className="text-2xl font-semibold">Sistema de Gestão</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Contratos e Suprimentos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Usuário</Label>
            <Input
              id="email"
              type="text"
              placeholder="Digite seu usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" className="w-full bg-black hover:bg-gray-800">
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025 PrevTech. Todos os direitos reservados.
        </p>
      </Card>
    </div>
  );
}