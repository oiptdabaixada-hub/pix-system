"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function fazerLogin() {

    setErro("");

    // LOGIN ADMIN
    if (
      email === "admin@nexpay.com" &&
      senha === "92637092#Pt"
    ) {

      localStorage.setItem("auth", "admin");

      router.push("/configuracoes");

      return;
    }

    // LOGIN CLIENTE
    if (
      email === "cliente@nexpay.com" &&
      senha === "9263#Nexpay"
    ) {

      localStorage.setItem("auth", "cliente");

      router.push("/gerar-pix");

      return;
    }

    setErro("Email ou senha inválidos");
  }

  return (
    <main className="flex h-screen items-center justify-center bg-black">

      <div className="w-[400px] rounded-2xl border border-zinc-800 bg-zinc-900 p-8">

        <h1 className="mb-8 text-center text-4xl font-bold text-green-500">
          NexPay ⚡
        </h1>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-500 bg-red-500/10 p-4 text-center text-red-400">
            {erro}
          </div>
        )}

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-lg border border-zinc-700 bg-zinc-800 p-4 text-white outline-none"
          />

          <button
            onClick={fazerLogin}
            className="rounded-lg bg-green-500 p-4 font-bold text-black transition hover:bg-green-400"
          >
            Entrar
          </button>

        </div>

      </div>

    </main>
  );
}