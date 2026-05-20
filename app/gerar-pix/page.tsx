"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GerarPix() {
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [pixGerado, setPixGerado] = useState("");
  const [valorGerado, setValorGerado] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth !== "cliente") {
      router.push("/login");
    }
  }, [router]);

  async function gerarPix() {
    if (!valor) {
      setMensagem("Digite um valor para gerar o PIX.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("");
      setPixGerado("");

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valor }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setPixGerado(data.pix);
        setValorGerado(valor);
        setMensagem("PIX gerado com sucesso!");
      } else {
        setMensagem("Não foi possível gerar o PIX.");
      }
    } catch (error) {
      setMensagem("Erro interno ao gerar PIX.");
    } finally {
      setLoading(false);
    }
  }

  function copiarPix() {
    navigator.clipboard.writeText(pixGerado);
    setMensagem("Código PIX copiado!");
  }

  function novaCobranca() {
    setValor("");
    setPixGerado("");
    setValorGerado("");
    setMensagem("");
  }

  function sair() {
    localStorage.removeItem("auth");
    router.push("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-[560px] animate-[fadeIn_0.4s_ease-in-out] rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-green-500">
              NexPay ⚡
            </h1>
            <p className="mt-2 text-zinc-400">
              Sistema de pagamento via PIX
            </p>
          </div>

          <button
            onClick={sair}
            className="rounded-xl border border-red-500 px-4 py-2 text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Sair
          </button>
        </div>

        {!pixGerado && (
          <div className="animate-[fadeIn_0.4s_ease-in-out]">
            <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm text-zinc-400">Nova cobrança</p>
              <h2 className="mt-1 text-2xl font-bold">
                Gerar PIX
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="Digite o valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-xl text-white outline-none transition focus:border-green-500"
              />

              <button
                onClick={gerarPix}
                disabled={loading}
                className="rounded-2xl bg-green-500 p-5 text-xl font-bold text-black transition hover:bg-green-400 disabled:opacity-50"
              >
                {loading ? "Gerando cobrança..." : "Gerar PIX"}
              </button>
            </div>

            {loading && (
              <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-center text-green-400">
                Conectando à Pagar.me e criando QR Code...
              </div>
            )}
          </div>
        )}

        {pixGerado && (
          <div className="animate-[fadeIn_0.4s_ease-in-out]">
            <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center">
              <p className="text-green-400">PIX gerado com sucesso</p>
              <h2 className="mt-2 text-4xl font-black text-white">
                R$ {Number(valorGerado).toFixed(2).replace(".", ",")}
              </h2>
            </div>

            <div className="mb-6 flex justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
                  pixGerado
                )}`}
                alt="QR Code PIX"
                className="rounded-3xl bg-white p-4 shadow-lg"
              />
            </div>

            <textarea
              value={pixGerado}
              readOnly
              className="h-36 w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-sm text-white outline-none"
            />

            <button
              onClick={copiarPix}
              className="mt-4 w-full rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400"
            >
              Copiar PIX copia e cola
            </button>

            <button
              onClick={novaCobranca}
              className="mt-3 w-full rounded-2xl border border-zinc-700 p-4 font-bold text-zinc-300 transition hover:border-green-500 hover:text-green-400"
            >
              Gerar nova cobrança
            </button>
          </div>
        )}

        {mensagem && (
          <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-center text-sm text-zinc-200">
            {mensagem}
          </div>
        )}
      </div>
    </main>
  );
}