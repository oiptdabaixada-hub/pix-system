"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Configuracoes() {

  const router = useRouter();

  const [mensagem, setMensagem] = useState("");

  const [apiKey, setApiKey] = useState("");

  const [idPrincipal, setIdPrincipal] = useState("");
  const [percentPrincipal, setPercentPrincipal] = useState("1");

  const [idRecebedor, setIdRecebedor] = useState("");
  const [percentRecebedor, setPercentRecebedor] = useState("10");

  const [idSocio, setIdSocio] = useState("");
  const [percentSocio, setPercentSocio] = useState("89");

  useEffect(() => {

    const auth = localStorage.getItem("auth");

    if (auth !== "admin") {
      router.push("/login");
    }

    const configSalva = localStorage.getItem("nexpay_config");

    if (configSalva) {

      const config = JSON.parse(configSalva);

      setApiKey(config.apiKey || "");

      setIdPrincipal(config.idPrincipal || "");
      setPercentPrincipal(config.percentPrincipal || "1");

      setIdRecebedor(config.idRecebedor || "");
      setPercentRecebedor(config.percentRecebedor || "10");

      setIdSocio(config.idSocio || "");
      setPercentSocio(config.percentSocio || "89");

    }

  }, []);

  function salvarConfiguracoes() {

    const configuracoes = {
      apiKey,

      idPrincipal,
      percentPrincipal,

      idRecebedor,
      percentRecebedor,

      idSocio,
      percentSocio,
    };

    localStorage.setItem(
      "nexpay_config",
      JSON.stringify(configuracoes)
    );

    setMensagem("✅ Configurações salvas com sucesso!");

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  function sair() {
    localStorage.removeItem("auth");
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white">

      <div className="mx-auto max-w-[800px]">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black text-green-500">
              NexPay ⚡
            </h1>

            <p className="mt-2 text-zinc-400">
              Painel administrativo do sistema
            </p>

          </div>

          <button
            onClick={sair}
            className="rounded-xl border border-red-500 px-5 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
          >
            Sair
          </button>

        </div>

        {mensagem && (
          <div className="mb-6 rounded-2xl border border-green-500 bg-green-500/10 p-4 text-center text-green-400">
            {mensagem}
          </div>
        )}

        <div className="flex flex-col gap-6">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-2xl font-bold text-green-400">
              API da Pagar.me
            </h2>

            <input
              type="text"
              placeholder="Cole sua API KEY"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
            />

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-2xl font-bold text-green-400">
              Conta Principal
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Recipient ID"
                value={idPrincipal}
                onChange={(e) => setIdPrincipal(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

              <input
                type="number"
                placeholder="% da conta principal"
                value={percentPrincipal}
                onChange={(e) => setPercentPrincipal(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-2xl font-bold text-green-400">
              Meu Recebedor
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Recipient ID"
                value={idRecebedor}
                onChange={(e) => setIdRecebedor(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

              <input
                type="number"
                placeholder="% do recebedor"
                value={percentRecebedor}
                onChange={(e) => setPercentRecebedor(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

            </div>

          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

            <h2 className="mb-4 text-2xl font-bold text-green-400">
              Sócio
            </h2>

            <div className="flex flex-col gap-4">

              <input
                type="text"
                placeholder="Recipient ID"
                value={idSocio}
                onChange={(e) => setIdSocio(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

              <input
                type="number"
                placeholder="% do sócio"
                value={percentSocio}
                onChange={(e) => setPercentSocio(e.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-800 p-4 outline-none"
              />

            </div>

          </div>

          <button
            onClick={salvarConfiguracoes}
            className="rounded-2xl bg-green-500 p-5 text-xl font-bold text-black transition hover:bg-green-400"
          >
            Salvar Configurações
          </button>

        </div>

      </div>

    </main>
  );
}