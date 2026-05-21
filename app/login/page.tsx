"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [loadingScreen, setLoadingScreen] = useState(true);

  const [entrando, setEntrando] = useState(false);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoadingScreen(false);
    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  async function fazerLogin() {

    setErro("");

    // LOGIN ADMIN
    if (
      email === "admin@nexpay.com" &&
      senha === "92637092#Pt"
    ) {

      setEntrando(true);

      localStorage.setItem("auth", "admin");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);

      return;
    }

    // LOGIN CLIENTE
    if (
      email === "cliente@nexpay.com" &&
      senha === "9263#Nexpay"
    ) {

      setEntrando(true);

      localStorage.setItem("auth", "cliente");

      setTimeout(() => {
        router.push("/gerar-pix");
      }, 1800);

      return;
    }

    setErro("Email ou senha inválidos");
  }

  // SPLASH SCREEN
  if (loadingScreen) {

    return (

      <main className="flex h-screen items-center justify-center overflow-hidden bg-black">

        <div className="absolute h-[400px] w-[400px] rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col items-center">

          <div className="flex h-28 w-28 animate-pulse items-center justify-center rounded-[32px] border border-green-500/30 bg-green-500/10 shadow-[0_0_60px_rgba(34,197,94,0.45)]">

            <span className="text-7xl font-black text-green-400">
              N
            </span>

          </div>

          <p className="mt-8 text-sm tracking-[8px] text-zinc-400">
            NEXPAY SYSTEM
          </p>

        </div>

      </main>

    );

  }

  // LOADING LOGIN
  if (entrando) {

    return (

      <main className="flex h-screen items-center justify-center bg-black">

        <div className="flex flex-col items-center">

          <div className="h-28 w-28 animate-spin rounded-full border-4 border-zinc-800 border-t-green-500" />

          <p className="mt-8 animate-pulse text-lg text-zinc-400">
            Entrando no sistema...
          </p>

        </div>

      </main>

    );

  }

  // LOGIN
  return (

    <main className="flex h-screen items-center justify-center overflow-hidden bg-black px-6">

      <div className="absolute h-[500px] w-[500px] rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative w-full max-w-[420px] rounded-[35px] border border-zinc-800 bg-zinc-900/90 p-8 backdrop-blur-xl">

        <div className="mb-10 flex flex-col items-center">

          <div className="rounded-[28px] border border-green-500/20 bg-black/30 px-8 py-5 shadow-[0_0_60px_rgba(34,197,94,0.25)]">

            <h1 className="text-6xl font-black tracking-tight text-white">
              Nex<span className="text-green-400">Pay</span>
            </h1>

          </div>

          <p className="mt-4 text-sm tracking-[5px] text-zinc-500">
            PAYMENT SYSTEM
          </p>

        </div>

        {erro && (

          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-400">

            {erro}

          </div>

        )}

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-white outline-none transition focus:border-green-500"
          />

          <div className="relative">

            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-5 pr-14 text-white outline-none transition focus:border-green-500"
            />

            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-green-400"
            >

              {mostrarSenha ? (
                <EyeOff size={22} />
              ) : (
                <Eye size={22} />
              )}

            </button>

          </div>

          <button
            onClick={fazerLogin}
            className="mt-3 rounded-2xl bg-green-500 p-5 text-lg font-black text-black transition hover:scale-[1.02] hover:bg-green-400"
          >
            Entrar no sistema
          </button>

        </div>

      </div>

    </main>

  );

}