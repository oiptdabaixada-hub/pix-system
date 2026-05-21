"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);

  useEffect(() => {
    buscarCobrancas();
  }, []);

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
  }

  return (
    <div className="p-5 text-white">
      <h1 className="text-3xl font-bold mb-5">
        Histórico de Cobranças
      </h1>

      <div className="space-y-4">
        {cobrancas.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
          >
            <p>Valor: R$ {item.valor}</p>

            <p>Status: {item.status}</p>

            <p>
              Pago:
              {item.pago ? " ✅ Pago" : " ❌ Pendente"}
            </p>

            <p>TXID: {item.txid}</p>

            <p className="text-sm text-zinc-400">
              {new Date(item.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}