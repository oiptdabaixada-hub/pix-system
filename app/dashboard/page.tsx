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

type Filtro = "hoje" | "ontem" | "7dias" | "30dias" | "1ano" | "todos";

export default function Dashboard() {
  const router = useRouter();

  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");

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

  function dentroDoFiltro(data: string) {
    const agora = new Date();
    const itemData = new Date(data);

    const hojeInicio = new Date(agora);
    hojeInicio.setHours(0, 0, 0, 0);

    const hojeFim = new Date(agora);
    hojeFim.setHours(23, 59, 59, 999);

    const ontemInicio = new Date(agora);
    ontemInicio.setDate(ontemInicio.getDate() - 1);
    ontemInicio.setHours(0, 0, 0, 0);

    const ontemFim = new Date(agora);
    ontemFim.setDate(ontemFim.getDate() - 1);
    ontemFim.setHours(23, 59, 59, 999);

    const seteDias = new Date(agora);
    seteDias.setDate(seteDias.getDate() - 7);

    const trintaDias = new Date(agora);
    trintaDias.setDate(trintaDias.getDate() - 30);

    const umAno = new Date(agora);
    umAno.setFullYear(umAno.getFullYear() - 1);

    if (filtro === "hoje") return itemData >= hojeInicio && itemData <= hojeFim;
    if (filtro === "ontem") return itemData >= ontemInicio && itemData <= ontemFim;
    if (filtro === "7dias") return itemData >= seteDias;
    if (filtro === "30dias") return itemData >= trintaDias;
    if (filtro === "1ano") return itemData >= umAno;

    return true;
  }

  const cobrancasFiltradas = cobrancas.filter((item) =>
    dentroDoFiltro(item.created_at)
  );

  const totalCobrado = cobrancasFiltradas.reduce((acc, item) => {
    const valorLimpo = Number(
      item.valor.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
    );

    return acc + valorLimpo;
  }, 0);

  const filtros = [
    { id: "hoje", label: "Hoje" },
    { id: "ontem", label: "Ontem" },
    { id: "7dias", label: "7 dias" },
    { id: "30dias", label: "30 dias" },
    { id: "1ano", label: "1 ano" },
    { id: "todos", label: "Todos" },
  ] as const;

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

        <div className="mb-6 flex flex-wrap gap-3">
          {filtros.map((item) => (
            <button
              key={item.id}
              onClick={() => setFiltro(item.id)}
              className={`rounded-2xl px-5 py-3 text-sm font-black transition active:scale-95 ${
                filtro === item.id
                  ? "bg-green-500 text-black"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-green-500/40 hover:text-green-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Total de cobranças</p>
            <h2 className="mt-3 text-4xl font-black">
              {cobrancasFiltradas.length}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Total gerado</p>
            <h2 className="mt-3 text-4xl font-black text-green-400">
              {totalCobrado.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-zinc-400">Pendentes</p>
            <h2 className="mt-3 text-4xl font-black text-yellow-400">
              {cobrancasFiltradas.filter((item) => !item.pago).length}
            </h2>
          </div>
        </div>

        <div className="rounded-[35px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-6">
          <div className="mb-6">
            <h2 className="text-3xl font-black">Histórico</h2>
            <p className="mt-1 text-zinc-400">Últimas cobranças geradas</p>
          </div>

          {loading && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Carregando cobranças...
            </div>
          )}

          {!loading && cobrancasFiltradas.length === 0 && (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Nenhuma cobrança encontrada nesse filtro.
            </div>
          )}

          <div className="flex flex-col gap-4">
            {cobrancasFiltradas.map((item) => (
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

                    <div className="break-all rounded-2xl border border-zinc-800 bg-black p-4 text-xs text-zinc-400">
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