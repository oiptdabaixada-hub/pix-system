export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-green-500 mb-10">
        Sistema PIX 🔥
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* LOGIN */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <button className="w-full bg-green-500 text-black font-bold py-3 rounded-xl">
            Entrar
          </button>
        </div>

        {/* GERAR PIX */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Gerar PIX
          </h2>

          <input
            type="text"
            placeholder="Valor do PIX"
            className="w-full p-3 rounded-xl bg-zinc-800 mb-4 outline-none"
          />

          <button className="w-full bg-green-500 text-black font-bold py-3 rounded-xl mb-6">
            Gerar PIX
          </button>

          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-green-500 mb-2">
              PIX gerado com sucesso
            </p>

            <div className="bg-white w-40 h-40 rounded-xl mx-auto"></div>

            <button className="w-full mt-4 border border-green-500 text-green-500 py-2 rounded-xl">
              Copiar código
            </button>
          </div>
        </div>

        {/* CONFIG */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Configurações
          </h2>

          <div className="mb-4">
            <p className="mb-2">
              Conta Principal
            </p>

            <input
              type="text"
              placeholder="Recipient ID"
              className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
            />
          </div>

          <div className="mb-4">
            <p className="mb-2">
              Percentual
            </p>

            <input
              type="text"
              placeholder="70%"
              className="w-full p-3 rounded-xl bg-zinc-800 outline-none"
            />
          </div>

          <button className="w-full bg-green-500 text-black font-bold py-3 rounded-xl mt-4">
            Salvar
          </button>
        </div>

      </div>

    </main>
  );
}