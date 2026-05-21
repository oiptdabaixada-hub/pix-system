"use client";

import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GerarPix() {
  const router = useRouter();

  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [pixGerado, setPixGerado] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [valorGerado, setValorGerado] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");

    if (auth !== "cliente") {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    async function gerarQrCode() {
      if (!pixGerado) {
        setQrCode("");
        return;
      }

      const qr = await QRCode.toDataURL(pixGerado, {
        width: 320,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });

      setQrCode(qr);
    }

    gerarQrCode();
  }, [pixGerado]);

  async function gerarPix() {
    if (!valor) {
      setMensagem("Digite um valor para gerar o PIX.");
      return;
    }

    try {
      setLoading(true);
      setMensagem("");
      setPixGerado("");
      setQrCode("");

      const valorNumerico = Number(valor.replace(/\D/g, "")) / 100;

      const response = await fetch("/api/pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: valorNumerico,
        }),
      });

      const data = await response.json();

      if (data.sucesso) {
        setPixGerado(data.pix);
        setValorGerado(valor);

        const { error } = await supabase.from("cobrancas").insert({
          valor: valor,
          codigo_pix: data.pix,
          status: "pendente",
          txid: data.txid || "",
          pago: false,
        });

        if (error) {
          console.log("ERRO SUPABASE:", error);
          setMensagem(`PIX gerado, mas não salvou no histórico: ${error.message}`);
        } else {
          console.log("SALVO NO SUPABASE");
          setMensagem("");
        }
      } else {
        setMensagem("Não foi possível gerar o PIX.");
      }
    } catch (error) {
      console.log("ERRO GERAL:", error);
      setMensagem("Erro interno ao gerar PIX.");
    } finally {
      setLoading(false);
    }
  }

  async function copiarPix() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(pixGerado);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = pixGerado;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setMensagem("");
      setToast(true);

      setTimeout(() => {
        setToast(false);
      }, 2500);
    } catch (error) {
      setMensagem("Não foi possível copiar. Segure no código e copie manualmente.");
    }
  }

  function novaCobranca() {
    setValor("");
    setPixGerado("");
    setQrCode("");
    setValorGerado("");
    setMensagem("");
    setToast(false);
  }

  function sair() {
    localStorage.removeItem("auth");
    router.push("/login");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-6 text-white">
      <div className="absolute h-[500px] w-[500px] rounded-full bg-green-500/10 blur-3xl" />

      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-2xl border border-green-500/30 bg-green-500 px-6 py-4 text-sm font-black text-black shadow-[0_0_35px_rgba(34,197,94,0.45)]">
          ✅ PIX copiado com sucesso
        </div>
      )}

      <div className="relative w-full max-w-[580px] rounded-[35px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-black p-8 shadow-[0_0_80px_rgba(34,197,94,0.08)]">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              ● Sistema online
            </div>

            <h1 className="mt-4 text-5xl font-black tracking-tight text-white">
              Nex<span className="text-green-500">Pay</span>
            </h1>

            <p className="mt-2 text-zinc-400">
              Sistema premium de cobrança PIX
            </p>
          </div>

          <button
            onClick={sair}
            className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition active:scale-95 hover:bg-red-500 hover:text-white"
          >
            Sair
          </button>
        </div>

        {!pixGerado && (
          <div>
            <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
              <p className="text-sm uppercase tracking-[3px] text-zinc-500">
                Nova cobrança
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Gerar PIX
              </h2>

              <p className="mt-2 text-zinc-400">
                Digite o valor da cobrança
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="R$ 0,00"
                value={valor}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");

                  const formattedValue = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(value) / 100);

                  setValor(formattedValue);
                }}
                className="rounded-3xl border border-zinc-700 bg-zinc-900 p-6 text-center text-3xl font-black tracking-tight text-green-400 outline-none transition focus:border-green-500 focus:shadow-[0_0_30px_rgba(34,197,94,0.25)]"
              />

              <button
                onClick={gerarPix}
                disabled={loading}
                className="rounded-3xl bg-green-500 p-5 text-lg font-black text-black transition active:scale-95 hover:scale-[1.01] hover:bg-green-400 disabled:opacity-50"
              >
                {loading ? "Gerando cobrança..." : "Gerar PIX"}
              </button>
            </div>

            {loading && (
              <div className="mt-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-5 text-center text-green-400">
                Gerando PIX para você...
              </div>
            )}
          </div>
        )}

        {pixGerado && (
          <div>
            <div className="mb-6 rounded-3xl border border-green-500/20 bg-green-500/10 p-5 text-center">
              <p className="text-sm uppercase tracking-[3px] text-green-400">
                Cobrança criada
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                {valorGerado}
              </h2>
            </div>

            <div className="mb-6 flex justify-center">
              <div className="rounded-[35px] bg-white p-5 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
                {qrCode ? (
                  <img src={qrCode} alt="QR Code PIX" className="rounded-2xl" />
                ) : (
                  <div className="flex h-[320px] w-[320px] items-center justify-center text-black">
                    Gerando QR Code...
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={pixGerado}
              readOnly
              className="h-40 w-full rounded-3xl border border-zinc-700 bg-zinc-900 p-5 text-sm text-white outline-none"
            />

            <button
              onClick={copiarPix}
              className="mt-5 w-full rounded-3xl bg-green-500 p-5 text-lg font-black text-black transition active:scale-95 hover:scale-[1.01] hover:bg-green-400"
            >
              Copiar PIX copia e cola
            </button>

            <button
              onClick={novaCobranca}
              className="mt-4 w-full rounded-3xl border border-zinc-700 bg-zinc-900 p-5 text-lg font-bold text-zinc-300 transition active:scale-95 hover:border-green-500 hover:text-green-400"
            >
              Gerar nova cobrança
            </button>
          </div>
        )}

        {mensagem && (
          <div className="mt-6 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-center text-sm text-yellow-300">
            {mensagem}
          </div>
        )}
      </div>
    </main>
  );
}