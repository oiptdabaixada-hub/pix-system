"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GerarPix() {

  const router = useRouter();

  const [valor, setValor] = useState("");

  const [loading, setLoading] = useState(false);

  const [mensagem, setMensagem] = useState("");

  const [pixGerado, setPixGerado] = useState("");

  useEffect(() => {

    const auth = localStorage.getItem("auth");

    if (auth !== "cliente") {
      router.push("/login");
    }

  }, []);

  async function gerarPix() {

    if (!valor) {

      setMensagem("❌ Digite um valor");

      return;

    }

    try {

      setLoading(true);

      setMensagem("");

      const response = await fetch("/api/pix", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          valor,
        }),

      });

      const data = await response.json();

      console.log(data);

      if (data.sucesso) {

        setPixGerado(data.pix);

        setMensagem("✅ PIX gerado com sucesso!");

      } else {

        setMensagem(`❌ ${JSON.stringify(data, null, 2)}`);

      }

    } catch (error) {

      console.log(error);

      setMensagem("❌ Erro interno");

    } finally {

      setLoading(false);

    }

  }

  function copiarPix() {

    navigator.clipboard.writeText(pixGerado);

    setMensagem("📋 Código PIX copiado!");

  }

  function sair() {

    localStorage.removeItem("auth");

    router.push("/login");

  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-black p-6">

      <div className="w-full max-w-[550px] rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black text-green-500">
              NexPay ⚡
            </h1>

            <p className="mt-2 text-zinc-400">
              Gerador de PIX
            </p>

          </div>

          <button
            onClick={sair}
            className="rounded-xl border border-red-500 px-4 py-2 text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Sair
          </button>

        </div>

        <div className="flex flex-col gap-4">

          <input
            type="number"
            placeholder="Digite o valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="rounded-2xl border border-zinc-700 bg-zinc-800 p-5 text-white outline-none"
          />

          <button
            onClick={gerarPix}
            disabled={loading}
            className="rounded-2xl bg-green-500 p-5 text-xl font-bold text-black transition hover:bg-green-400 disabled:opacity-50"
          >
            {loading ? "Gerando PIX..." : "Gerar PIX"}
          </button>

        </div>

        {mensagem && (

          <div className="mt-6 rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-center text-white">

            {mensagem}

          </div>

        )}

        {pixGerado && (

          <div className="mt-8">

            <div className="mb-6 flex justify-center">

              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                  pixGerado
                )}`}
                alt="QR Code PIX"
                className="rounded-2xl bg-white p-4"
              />

            </div>

            <textarea
              value={pixGerado}
              readOnly
              className="h-40 w-full rounded-2xl border border-zinc-700 bg-zinc-800 p-4 text-sm text-white outline-none"
            />

            <button
              onClick={copiarPix}
              className="mt-4 w-full rounded-2xl border border-green-500 p-4 font-bold text-green-400 transition hover:bg-green-500 hover:text-black"
            >
              Copiar código PIX
            </button>

          </div>

        )}

      </div>

    </main>

  );

}