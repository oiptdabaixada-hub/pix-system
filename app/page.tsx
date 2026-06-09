import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020403] text-white">
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-green-500/20 blur-[140px]" />
        <div className="absolute right-[-20%] top-[20%] h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[25%] h-[500px] w-[500px] rounded-full bg-lime-400/10 blur-[160px]" />
      </div>

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6">
        <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.65)]">
              <span className="text-2xl font-black text-black">N</span>
            </div>
            <div>
              <p className="text-xl font-black tracking-tight">
                Nex<span className="text-green-400">Pay</span>
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                Private Pix
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#beneficios" className="hover:text-green-400">
              Benefícios
            </a>
            <a href="#taxas" className="hover:text-green-400">
              Taxas
            </a>
            <a href="#duvidas" className="hover:text-green-400">
              Dúvidas
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-full border border-green-400/30 bg-green-400/10 px-5 py-3 text-sm font-bold text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.2)] transition hover:bg-green-400 hover:text-black"
          >
            Fazer login
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)]" />
              Sistema PIX privado
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Cobrança PIX
              <br />
              <span className="text-green-400 drop-shadow-[0_0_35px_rgba(34,197,94,0.45)]">
                sem complicação.
              </span>
              <br />
              Com resultado.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl">
              Gere cobranças PIX em segundos, acompanhe tudo em um painel
              privado e deixe cada parceiro receber sua parte de forma
              organizada.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-2xl bg-green-400 px-8 py-4 text-center text-base font-black text-black shadow-[0_0_45px_rgba(34,197,94,0.45)] transition hover:scale-[1.02] hover:bg-green-300"
              >
                Entrar no sistema
              </Link>

              <a
                href="#beneficios"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-center text-base font-bold text-white/80 transition hover:border-green-400/40 hover:text-green-300"
              >
                Ver como funciona
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-green-400">PIX</p>
                <p className="mt-1 text-xs text-white/45">em segundos</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-green-400">24h</p>
                <p className="mt-1 text-xs text-white/45">sistema online</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-green-400">100%</p>
                <p className="mt-1 text-xs text-white/45">painel privado</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem] bg-green-400/20 blur-[90px]" />

            <div className="relative rounded-[2.5rem] border border-green-400/20 bg-[#07100b]/80 p-5 shadow-[0_0_90px_rgba(34,197,94,0.18)] backdrop-blur-xl">
              <div className="rounded-[2rem] border border-white/10 bg-black/40 p-5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/40">Dashboard NexPay</p>
                    <h2 className="mt-1 text-2xl font-black">Visão geral</h2>
                  </div>
                  <div className="rounded-full bg-green-400/15 px-4 py-2 text-sm font-bold text-green-300">
                    Online
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/45">Cobranças hoje</p>
                    <p className="mt-3 text-4xl font-black text-green-400">
                      R$ 18.732
                    </p>
                    <p className="mt-2 text-xs text-green-300">
                      +12% em relação a ontem
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/45">Pagas</p>
                    <p className="mt-3 text-4xl font-black">98</p>
                    <p className="mt-2 text-xs text-white/40">Hoje</p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <p className="mb-4 text-sm font-bold text-white/60">
                    Cobranças recentes
                  </p>

                  {[
                    ["R$ 497,00", "Pago", "Parceiro 01"],
                    ["R$ 197,00", "Pendente", "Parceiro 02"],
                    ["R$ 997,00", "Pago", "Parceiro 03"],
                  ].map((item) => (
                    <div
                      key={item[2]}
                      className="flex items-center justify-between border-t border-white/10 py-4 text-sm"
                    >
                      <span className="font-bold">{item[0]}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item[1] === "Pago"
                            ? "bg-green-400/15 text-green-300"
                            : "bg-yellow-400/15 text-yellow-300"
                        }`}
                      >
                        {item[1]}
                      </span>
                      <span className="text-white/45">{item[2]}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {["Rápido", "Privado", "Seguro"].map((tag) => (
                    <div
                      key={tag}
                      className="rounded-2xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-center text-sm font-black text-green-300"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-green-400">
            Por que usar
          </p>
          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Feito pra quem quer cobrar com mais controle.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "PIX em segundos",
              text: "Gere QR Code e Copia e Cola em poucos cliques, direto no painel.",
            },
            {
              title: "Receba sua parte",
              text: "Cada parceiro recebe sua parte automaticamente, sem precisar calcular por fora.",
            },
            {
              title: "Painel privado",
              text: "Acesso restrito, visual limpo e controle total das cobranças.",
            },
            {
              title: "Histórico organizado",
              text: "Veja valores, status, horários e cobranças em um só lugar.",
            },
            {
              title: "Configuração flexível",
              text: "Ajuste recebedores e porcentagens conforme a operação.",
            },
            {
              title: "Operação simples",
              text: "Menos burocracia. Mais velocidade. Mais resultado no dia a dia.",
            },
          ].map((card, index) => (
            <div
              key={card.title}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-green-400/40 hover:bg-green-400/[0.06]"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-green-400/10 text-xl font-black text-green-400 group-hover:bg-green-400 group-hover:text-black">
                {index + 1}
              </div>
              <h3 className="text-2xl font-black">{card.title}</h3>
              <p className="mt-4 leading-relaxed text-white/55">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="taxas" className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-[3rem] border border-green-400/20 bg-gradient-to-br from-green-400/10 via-white/[0.03] to-transparent p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.35em] text-green-400">
                Condições
              </p>
              <h2 className="text-4xl font-black md:text-6xl">
                Porcentagem justa.
                <br />
                Operação sem enrolação.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
                A NexPay foi pensada para operações privadas que precisam de
                agilidade, divisão automática e painel organizado.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm text-white/45">Modelo</p>
                <p className="mt-2 text-3xl font-black text-green-400">
                  Acesso privado
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm text-white/45">Taxa</p>
                <p className="mt-2 text-3xl font-black">
                  Porcentagem justa
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                <p className="text-sm text-white/45">Recebimento</p>
                <p className="mt-2 text-3xl font-black">
                  Cada um na sua conta
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="duvidas" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            [
              "A NexPay é pública?",
              "Não. É um sistema privado para parceiros e operações autorizadas.",
            ],
            [
              "Preciso entender de tecnologia?",
              "Não. O painel foi feito pra ser simples: gerar, copiar, acompanhar e organizar.",
            ],
            [
              "O que significa receber minha parte?",
              "Quando a cobrança é configurada, o valor pode ser dividido automaticamente entre os participantes.",
            ],
            [
              "Como consigo acesso?",
              "O acesso é liberado manualmente. Chama no privado para entender as condições.",
            ],
          ].map(([q, a]) => (
            <div
              key={q}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7"
            >
              <h3 className="text-xl font-black">{q}</h3>
              <p className="mt-3 leading-relaxed text-white/55">{a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 pb-8">
        <div className="flex flex-col gap-5 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-black">
              Nex<span className="text-green-400">Pay</span>
            </p>
            <p className="mt-1 text-sm text-white/45">
              Sistema PIX privado. Mais controle. Mais resultado.
            </p>
          </div>

          <Link
            href="/login"
            className="rounded-2xl bg-green-400 px-7 py-4 text-center font-black text-black transition hover:bg-green-300"
          >
            Acessar sistema
          </Link>
        </div>
      </footer>
    </main>
  );
}