"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Cobranca {
  id: number;
  valor: string;
  status: string;
  codigo_pix: string;
  txid: string;
  pago: boolean;
  created_at: string;
}

export default function Dashboard() {
  const router = useRouter();

  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth !== "admin") {
      router.push("/login");
      return;
    }

    buscarCobrancas();
  }, [router]);

  async function buscarCobrancas() {
    const { data, error } = await supabase
      .from("cobrancas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setCobrancas(data || []);
    }

    setLoading(false);
  }

  const totalCobrado = cobrancas.reduce((acc, item) => {
    const valorLimpo = Number(
      item.valor
        .replace("R$", "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    );

    return acc + valorLimpo;
  }, 0);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10 flex items-center justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              ● Painel administrativo
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-tight">
              Dashboard <span className="text-green-500">NexPay</span>
            </h1>

            <p className="mt-2 text-zinc-400">
              Histórico completo de cobranças geradas
            </p>
          </div>

          <button
            onClick={() => router.push("/gerar-pix")}
            className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition active:scale-95 hover:scale-[1.02] hover:bg-green-400"
          >
            Gerar PIX
          </button>

        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">
              Total de cobranças
            </p>

            <h2 className="mt-3 text-4xl font-black">
              {cobrancas.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">
              Total gerado
            </p>

            <h2 className="mt-3 text-4xl font-black text-green-400">
              {totalCobrado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">
              Pendentes
            </p>

            <h2 className="mt-3 text-4xl font-black text-yellow-400">
              {
                cobrancas.filter((item) => !item.pago)
                  .length
              }
            </h2>
          </div>

        </div>

        <div className="rounded-[35px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-black">
                Histórico
              </h2>

              <p className="mt-1 text-zinc-400">
                Últimas cobranças geradas
              </p>
            </div>

          </div>

          {loading && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Carregando cobranças...
            </div>
          )}

          {!loading && cobrancas.length === 0 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Nenhuma cobrança encontrada.
            </div>
          )}

          <div className="flex flex-col gap-4">

            {cobrancas.map((item) => (

              <div
                key={item.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-green-500/30"
              >

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>

                    <div className="flex items-center gap-3">

                      <h3 className="text-3xl font-black text-white">
                        {item.valor}
                      </h3>

                      <div
                        className={`rounded-full px-4 py-2 text-xs font-black ${
                          item.pago
                            ? "bg-green-500/10 text-green-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {item.pago ? "PAGO" : "PENDENTE"}
                      </div>

                    </div>

                    <p className="mt-3 text-sm text-zinc-400">
                      {new Date(item.created_at).toLocaleString("pt-BR")}
                    </p>

                  </div>

                  <div className="max-w-[350px]">

                    <p className="mb-2 text-xs uppercase tracking-[2px] text-zinc-500">
                      Código PIX
                    </p>

                    <div className="rounded-2xl border border-zinc-800 bg-black p-4 text-xs text-zinc-400 break-all">
                      {item.codigo_pix}
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>
    </main>
  );
}