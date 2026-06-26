"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Room = {
  id: string;
  room_code: string;
  room_name: string;
  partner_name: string | null;
  partner_login: string | null;
  partner_password: string | null;
  status: string | null;
  principal_recipient_id: string | null;
  principal_percent: number | null;
  pete_recipient_id: string | null;
  pete_percent: number | null;
  partner_recipient_id: string | null;
  partner_percent: number | null;
  gateway_account: string | null;
};

const menu = [
  { icon: "🏠", label: "Escritório", key: "office" },
  { icon: "🚪", label: "Salas", key: "rooms" },
  { icon: "💰", label: "Financeiro", key: "finance" },
  { icon: "👥", label: "Usuários", key: "users" },
  { icon: "⚡", label: "Transações", key: "transactions" },
  { icon: "⚙️", label: "Configurações", key: "settings" },
];

const roomPositions: Record<string, string> = {
  sala01: "joao",
  sala02: "pedro",
  sala03: "michael",
  sala04: "carlos",
  sala05: "lucas",
};

function emptyToText(value: string | null | undefined, fallback = "") {
  return value && value.trim() ? value : fallback;
}

function gatewayBadge(value: string | null | undefined) {
  if (value === "conta_2") return "C2";
  if (value === "conta_3") return "C3";
  return "C1";
}

function gatewayName(value: string | null | undefined) {
  if (value === "conta_2") return "Conta 2";
  if (value === "conta_3") return "Conta 3";
  return "Conta 1";
}

export default function AdminHQPage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  async function loadRooms() {
    setLoading(true);

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("room_code", { ascending: true });

    if (error) {
      console.error(error);
      alert("Erro ao buscar salas no Supabase: " + error.message);
      setLoading(false);
      return;
    }

    setRooms(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadRooms();
  }, []);

  const totalPercent = useMemo(() => {
    if (!selectedRoom) return 0;

    return (
      Number(selectedRoom.principal_percent || 0) +
      Number(selectedRoom.pete_percent || 0) +
      Number(selectedRoom.partner_percent || 0)
    );
  }, [selectedRoom]);

  const onlineRooms = rooms.filter((room) => room.status === "online").length;

  const wrongSplits = rooms.filter((room) => {
    const total =
      Number(room.principal_percent || 0) +
      Number(room.pete_percent || 0) +
      Number(room.partner_percent || 0);

    return total !== 100;
  }).length;

  function updateSelectedRoom(field: keyof Room, value: string | number) {
    if (!selectedRoom) return;

    setSelectedRoom({
      ...selectedRoom,
      [field]: value,
    });
  }

  async function saveRoomConfig() {
    if (!selectedRoom) return;

    if (totalPercent !== 100) {
      setSavedMessage("A soma das porcentagens precisa dar 100%.");
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .update({
        partner_name: selectedRoom.partner_name,
        partner_login: selectedRoom.partner_login,
        partner_password: selectedRoom.partner_password,
        status: selectedRoom.status,
        gateway_account: selectedRoom.gateway_account || "conta_1",

        principal_recipient_id: selectedRoom.principal_recipient_id,
        principal_percent: selectedRoom.principal_percent,

        pete_recipient_id: selectedRoom.pete_recipient_id,
        pete_percent: selectedRoom.pete_percent,

        partner_recipient_id: selectedRoom.partner_recipient_id,
        partner_percent: selectedRoom.partner_percent,

        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedRoom.id);

    if (error) {
      setSavedMessage("Erro ao salvar: " + error.message);
      return;
    }

    setSavedMessage("Configuração salva no Supabase com sucesso.");
    await loadRooms();
  }

  return (
    <main className="page">
      <aside className={menuOpen ? "sidebar" : "sidebar closed"}>
        <button className="toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className="logo">
          <span></span>
          {menuOpen && (
            <strong>
              NEX<span>PAY</span>
            </strong>
          )}
        </div>

        <nav>
          {menu.map((item) => (
            <button
              key={item.key}
              className={
                panel === item.key || (!panel && item.key === "office")
                  ? "nav active"
                  : "nav"
              }
              onClick={() => {
                setSelectedRoom(null);
                setPanel(item.key === "office" ? null : item.key);
              }}
            >
              <span className="emoji">{item.icon}</span>
              {menuOpen && <b>{item.label}</b>}
            </button>
          ))}
        </nav>

        {menuOpen && (
          <div className="resume">
            <small>RESUMO GERAL</small>
            <p>
              Salas online <strong>{onlineRooms}/{rooms.length || 5}</strong>
            </p>
            <p>
              Splits errados{" "}
              <strong className={wrongSplits === 0 ? "green" : "redText"}>
                {wrongSplits}
              </strong>
            </p>
            <p>
              Supabase <strong className="green">Conectado</strong>
            </p>
          </div>
        )}
      </aside>

      <section className="main">
        <header>
          <div>
            <h1>
              NEXPAY <span>PAINEL</span>
            </h1>
            <p>Escritório virtual conectado!</p>
          </div>

          <div className="profile">
            <b>P</b>
            <div>
              <strong>Petê 021</strong>
              <small>ADMIN</small>
            </div>
          </div>
        </header>

        <section className="map">
          <div className="fxLayer">
            <div className="scanLine" />

            <div className="matrixRain">
              <span>NEXPAY</span>
              <span>PIX_CORE</span>
              <span>SPLIT</span>
              <span>ROOM_01</span>
              <span>PAYMENT</span>
              <span>ONLINE</span>
              <span>API</span>
              <span>WEBHOOK</span>
              <span>R$ 46,90</span>
              <span>CONNECTED</span>
            </div>

            <div className="server serverLeft">
              <strong>777</strong>
              <small>ONLINE</small>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div className="server serverRight">
              <strong>  777</strong>
              <small>CONNECTED</small>
              <i></i>
              <i></i>
              <i></i>
            </div>

            <div className="holoCenter">
              <strong>MILLIONS</strong>
              <span>01 DO DIGITAL É NÓS!</span>
            </div>
          </div>

          <div className="floor" />

          <button
            className="room boss"
            onClick={() => {
              setSelectedRoom(null);
              setPanel("boss");
            }}
          >
            <span className="roomLabel">SALA DO CHEFE</span>
            <div className="avatar bossAvatar">P</div>
            <h2>Petê021</h2>
            <p>Fundador & CEO</p>
            <small className="online">● Online</small>
          </button>

          {loading && (
            <div className="loading">Carregando salas do Supabase...</div>
          )}

          {!loading &&
            rooms.map((room) => {
              const name = emptyToText(room.partner_name, room.room_name);
              const status = room.status === "online" ? "online" : "offline";

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setPanel(null);
                    setSavedMessage("");
                  }}
                  className={`room ${roomPositions[room.room_code] || ""}`}
                >
                  <span className="roomLabel">{room.room_name}</span>
                  <span className="gatewayBadge">{gatewayBadge(room.gateway_account)}</span>
                  <div
                    className={
                      status === "online" ? "avatar" : "avatar offlineAvatar"
                    }
                  >
                    {name[0]?.toUpperCase() || "?"}
                  </div>
                  <h2>{name}</h2>
                  <small
                    className={status === "online" ? "online" : "offline"}
                  >
                    ● {status === "online" ? "Online" : "Offline"}
                  </small>
                </button>
              );
            })}
        </section>
      </section>

      {selectedRoom && (
        <div className="modalOverlay" onClick={() => setSelectedRoom(null)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedRoom(null)}>
              ×
            </button>

            <div className="modalTop">
              <div
                className={
                  selectedRoom.status === "online"
                    ? "modalAvatar"
                    : "modalAvatar red"
                }
              >
                {emptyToText(selectedRoom.partner_name, selectedRoom.room_name)[0]}
              </div>

              <div>
                <small>{selectedRoom.room_name}</small>
                <h2>
                  {emptyToText(selectedRoom.partner_name, "Parceiro sem nome")}
                </h2>
                <p
                  className={
                    selectedRoom.status === "online"
                      ? "modalOnline"
                      : "modalOffline"
                  }
                >
                  ● {selectedRoom.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <div className="splitWarning">
              <strong>Configuração da sala</strong>
              <span className={totalPercent === 100 ? "totalOk" : "totalError"}>
                Total: {totalPercent}%
              </span>
            </div>

            <div className="partnerBox">
              <label>Nome do parceiro</label>
              <input
                value={selectedRoom.partner_name || ""}
                onChange={(e) =>
                  updateSelectedRoom("partner_name", e.target.value)
                }
                placeholder="Ex: João"
              />

              <label>Login do parceiro</label>
              <input
                value={selectedRoom.partner_login || ""}
                onChange={(e) =>
                  updateSelectedRoom("partner_login", e.target.value)
                }
                placeholder="Ex: joao"
              />

              <label>Senha do parceiro</label>
              <input
                value={selectedRoom.partner_password || ""}
                onChange={(e) =>
                  updateSelectedRoom("partner_password", e.target.value)
                }
                placeholder="Ex: 123456"
              />

              <label>Status</label>
              <select
                value={selectedRoom.status || "offline"}
                onChange={(e) => updateSelectedRoom("status", e.target.value)}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              <label>Gateway Pagar.me</label>
              <select
                value={selectedRoom.gateway_account || "conta_1"}
                onChange={(e) => updateSelectedRoom("gateway_account", e.target.value)}
              >
                <option value="conta_1">Conta 1</option>
                <option value="conta_2">Conta 2</option>
                <option value="conta_3">Conta 3</option>
              </select>
            </div>

            <div className="splitGrid">
              <SplitCard
                title="Conta principal Pagar.me"
                subtitle="CNPJ cadastrado na Pagar.me"
                recipientValue={selectedRoom.principal_recipient_id || ""}
                percentValue={Number(selectedRoom.principal_percent || 0)}
                onRecipientChange={(value) =>
                  updateSelectedRoom("principal_recipient_id", value)
                }
                onPercentChange={(value) =>
                  updateSelectedRoom("principal_percent", value)
                }
              />

              <SplitCard
                title="Petê021"
                subtitle="Seu ID / sua porcentagem"
                recipientValue={selectedRoom.pete_recipient_id || ""}
                percentValue={Number(selectedRoom.pete_percent || 0)}
                onRecipientChange={(value) =>
                  updateSelectedRoom("pete_recipient_id", value)
                }
                onPercentChange={(value) =>
                  updateSelectedRoom("pete_percent", value)
                }
              />

              <SplitCard
                title="Parceiro"
                subtitle="Parceiro dono dessa sala"
                recipientValue={selectedRoom.partner_recipient_id || ""}
                percentValue={Number(selectedRoom.partner_percent || 0)}
                onRecipientChange={(value) =>
                  updateSelectedRoom("partner_recipient_id", value)
                }
                onPercentChange={(value) =>
                  updateSelectedRoom("partner_percent", value)
                }
              />
            </div>

            {savedMessage && (
              <div
                className={totalPercent === 100 ? "message success" : "message error"}
              >
                {savedMessage}
              </div>
            )}

            <div className="actions">
              <button onClick={saveRoomConfig}>Salvar no Supabase</button>
              <button className="ghost" onClick={() => setSelectedRoom(null)}>
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}

      {panel && (
        <div className="modalOverlay" onClick={() => setPanel(null)}>
          <section
            className="modal panelModal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={() => setPanel(null)}>
              ×
            </button>

            {panel === "boss" && (
              <>
                <PanelTitle
                  title="Sala do Chefe"
                  subtitle="Controle geral da operação NexPay"
                />
                <div className="dashGrid">
                  <DashBox label="Salas cadastradas" value={`${rooms.length}`} />
                  <DashBox label="Salas online" value={`${onlineRooms}`} />
                  <DashBox
                    label="Splits errados"
                    value={`${wrongSplits}`}
                    danger={wrongSplits > 0}
                  />
                  <DashBox label="Banco" value="Supabase" />
                </div>
              </>
            )}

            {panel === "rooms" && (
              <>
                <PanelTitle
                  title="Salas"
                  subtitle="Todas as salas cadastradas no Supabase"
                />
                <div className="listGrid">
                  {rooms.map((room) => (
                    <button
                      className="listItem"
                      key={room.id}
                      onClick={() => {
                        setPanel(null);
                        setSelectedRoom(room);
                      }}
                    >
                      <b>{room.room_name}</b>
                      <strong>{emptyToText(room.partner_name, "Sem parceiro")}</strong>
                      <span>{room.status || "offline"} • {gatewayName(room.gateway_account)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {panel === "finance" && (
              <>
                <PanelTitle
                  title="Financeiro"
                  subtitle="Resumo visual das porcentagens por sala"
                />
                <div className="financeTable">
                  {rooms.map((room) => (
                    <div key={room.id}>
                      <span>{emptyToText(room.partner_name, room.room_name)}</span>
                      <b>{room.partner_percent || 0}% parceiro</b>
                      <small>
                        {room.pete_percent || 0}% Petê021 /{" "}
                        {room.principal_percent || 0}% CNPJ
                      </small>
                    </div>
                  ))}
                </div>
              </>
            )}

            {panel === "users" && (
              <>
                <PanelTitle title="Usuários" subtitle="Logins dos parceiros" />
                <div className="listGrid">
                  {rooms.map((room) => (
                    <div className="listItem" key={room.id}>
                      <b>{room.room_name}</b>
                      <strong>{emptyToText(room.partner_name, "Sem parceiro")}</strong>
                      <span>login: {emptyToText(room.partner_login, "não definido")}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {panel === "transactions" && (
              <PanelTitle
                title="Transações"
                subtitle="Depois vamos puxar os PIX reais aqui"
              />
            )}

            {panel === "settings" && (
              <PanelTitle
                title="Configurações"
                subtitle="Depois vamos colocar chave Pagar.me e webhook aqui"
              />
            )}
          </section>
        </div>
      )}

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #03040a; }

        .page {
          min-height: 100vh;
          display: flex;
          background: radial-gradient(circle at center, #101524, #03040a 72%);
          color: white;
          font-family: Arial, sans-serif;
          overflow: hidden;
        }

        .sidebar {
          width: 220px;
          padding: 18px 14px;
          background: rgba(3, 5, 12, .94);
          border-right: 1px solid rgba(255, 105, 25, .18);
          flex-shrink: 0;
          transition: .25s ease;
          position: relative;
          z-index: 30;
        }

        .sidebar.closed { width: 76px; padding-inline: 12px; }

        .toggle {
          position: absolute;
          top: 18px;
          right: 14px;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 10px;
          background: rgba(255,255,255,.08);
          color: white;
          cursor: pointer;
          font-size: 17px;
        }

        .logo {
          height: 50px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 25px;
          font-weight: 950;
          margin-bottom: 28px;
        }

        .logo > span { color: #ff6a1a; filter: drop-shadow(0 0 10px #ff6a1a); }
        .logo strong span { color: #ff6a1a; }

        nav { display: grid; gap: 10px; }

        .nav {
          height: 46px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border-radius: 12px;
          color: #bcc3d2;
          font-size: 14px;
          white-space: nowrap;
          background: transparent;
          border: 0;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
        }

        .sidebar.closed .nav { justify-content: center; padding: 0; }
        .emoji { font-size: 18px; width: 22px; text-align: center; }

        .nav.active {
          background: linear-gradient(90deg, #ff3d00, #ffb35a);
          color: white;
          font-weight: 800;
          box-shadow: 0 0 26px rgba(255, 100, 20, .55);
        }

        .resume {
          margin-top: 34px;
          padding: 16px;
          border-radius: 16px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
        }

        .resume small { color: #9aa2b8; font-weight: 800; }
        .resume p { color: #aeb5c7; font-size: 12px; margin: 14px 0 0; }
        .resume strong { display: block; color: white; font-size: 16px; margin-top: 4px; }
        .green { color: #00ff88 !important; }
        .redText { color: #ff6868 !important; }

        .main { flex: 1; padding: 25px; min-width: 0; }

        header {
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 20;
        }

        h1 { margin: 0; font-size: 28px; letter-spacing: -1px; }

        h1 span {
          font-size: 11px;
          color: #ff7a1f;
          border: 1px solid #ff7a1f;
          padding: 5px 9px;
          border-radius: 7px;
          margin-left: 8px;
        }

        header p { margin: 6px 0 0; color: #9ca3b5; }

        .profile { display: flex; align-items: center; gap: 10px; }

        .profile b {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff6a1a, #111);
          border: 2px solid #ff9855;
          display: grid;
          place-items: center;
        }

        .profile strong { display: block; font-size: 13px; }
        .profile small { color: #ff8a35; font-weight: 900; }

        .map {
          position: relative;
          height: calc(100vh - 95px);
          min-height: 720px;
          border-radius: 26px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 24%, rgba(0, 180, 255, .16), transparent 34%),
            radial-gradient(circle at 50% 70%, rgba(75, 105, 255, .12), transparent 35%),
            radial-gradient(circle at 20% 20%, rgba(0, 255, 160, .08), transparent 26%),
            #070912;
          box-shadow: inset 0 0 90px rgba(0,0,0,.86);
        }

        .fxLayer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .fxLayer::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(115deg, transparent 0%, rgba(0, 255, 255, .08) 45%, transparent 70%),
            radial-gradient(circle at 15% 50%, rgba(0, 180, 255, .10), transparent 30%),
            radial-gradient(circle at 85% 50%, rgba(0, 255, 180, .08), transparent 30%);
          animation: hqPulse 5s ease-in-out infinite alternate;
        }

        .scanLine {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,255,.9), transparent);
          box-shadow: 0 0 22px rgba(0,255,255,.8), 0 0 45px rgba(0,255,255,.35);
          animation: scanMove 6s linear infinite;
          opacity: .55;
        }

        .matrixRain {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .matrixRain span {
          position: absolute;
          top: -80px;
          color: rgba(0, 255, 180, .18);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 2px;
          text-shadow: 0 0 12px rgba(0,255,180,.5);
          animation: rainDown 11s linear infinite;
        }

        .matrixRain span:nth-child(1) { left: 5%; animation-delay: 0s; }
        .matrixRain span:nth-child(2) { left: 14%; animation-delay: 2s; }
        .matrixRain span:nth-child(3) { left: 24%; animation-delay: 4s; }
        .matrixRain span:nth-child(4) { left: 35%; animation-delay: 1s; }
        .matrixRain span:nth-child(5) { left: 48%; animation-delay: 5s; }
        .matrixRain span:nth-child(6) { left: 60%; animation-delay: 3s; }
        .matrixRain span:nth-child(7) { left: 72%; animation-delay: 6s; }
        .matrixRain span:nth-child(8) { left: 82%; animation-delay: 2.5s; }
        .matrixRain span:nth-child(9) { left: 90%; animation-delay: 7s; }
        .matrixRain span:nth-child(10) { left: 42%; animation-delay: 8s; }

        .server {
          position: absolute;
          width: 175px;
          padding: 15px;
          border-radius: 18px;
          background: rgba(0, 20, 35, .36);
          border: 1px solid rgba(0,255,255,.24);
          box-shadow:
            0 0 35px rgba(0,255,255,.10),
            inset 0 0 25px rgba(0,255,255,.08);
          backdrop-filter: blur(6px);
          opacity: .9;
        }

        .server strong {
          display: block;
          color: #67f7ff;
          font-size: 13px;
          letter-spacing: 1px;
        }

        .server small {
          display: block;
          margin-top: 5px;
          color: #00ff88;
          font-weight: 950;
          font-size: 10px;
        }

        .server i {
          display: block;
          height: 5px;
          margin-top: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #00ffaa, #00a2ff, transparent);
          box-shadow: 0 0 14px rgba(0,255,255,.45);
          animation: barPulse 2.4s ease-in-out infinite alternate;
        }

        .server i:nth-child(4) { width: 70%; animation-delay: .3s; }
        .server i:nth-child(5) { width: 45%; animation-delay: .7s; }

        .serverLeft { top: 34px; left: 35px; }
        .serverRight { top: 34px; right: 35px; }

        .holoCenter {
          position: absolute;
          left: 50%;
          top: 280px;
          transform: translateX(-50%);
          width: 260px;
          height: 78px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          text-align: center;
          border: 1px solid rgba(0,255,255,.16);
          background: radial-gradient(circle, rgba(0,255,255,.10), transparent 62%);
          box-shadow: 0 0 50px rgba(0,255,255,.12);
          animation: holoFloat 4s ease-in-out infinite alternate;
          opacity: .55;
        }

        .holoCenter strong {
          color: rgba(120,255,255,.9);
          font-size: 18px;
          letter-spacing: 2px;
          text-shadow: 0 0 18px rgba(0,255,255,.8);
        }

        .holoCenter span {
          display: block;
          color: rgba(0,255,136,.75);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .floor {
          position: absolute;
          inset: -80px;
          z-index: 1;
          background-image:
            linear-gradient(rgba(0, 200, 255, .08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 200, 255, .08) 1px, transparent 1px);
          background-size: 48px 48px;
          transform: perspective(800px) rotateX(58deg) scale(1.35);
          transform-origin: center top;
          opacity: .80;
          animation: floorGlow 5s ease-in-out infinite alternate;
        }

        @keyframes hqPulse {
          from { opacity: .45; filter: saturate(1); }
          to { opacity: .95; filter: saturate(1.7); }
        }

        @keyframes scanMove {
          from { top: -10%; }
          to { top: 110%; }
        }

        @keyframes rainDown {
          from { transform: translateY(-140px); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          to { transform: translateY(980px); opacity: 0; }
        }

        @keyframes barPulse {
          from { opacity: .3; transform: scaleX(.75); }
          to { opacity: 1; transform: scaleX(1); }
        }

        @keyframes holoFloat {
          from { transform: translateX(-50%) translateY(0); }
          to { transform: translateX(-50%) translateY(-12px); }
        }

        @keyframes floorGlow {
          from { opacity: .45; }
          to { opacity: .9; }
        }

        .loading {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          color: #00ff88;
          font-weight: 900;
          z-index: 10;
        }

        .room {
          position: absolute;
          z-index: 10;
          width: 235px;
          height: 165px;
          border: 0;
          cursor: pointer;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          clip-path: polygon(11% 0, 89% 0, 100% 15%, 100% 85%, 89% 100%, 11% 100%, 0 85%, 0 15%);
          background: linear-gradient(145deg, rgba(25, 31, 55, .90), rgba(5, 8, 18, .94));
          border: 1px solid rgba(255, 117, 35, .48);
          box-shadow: 0 0 26px rgba(75, 115, 255, .28), inset 0 0 34px rgba(70, 100, 255, .22);
          transition: .2s ease;
          font-family: inherit;
        }

        .room:hover { translate: 0 -4px; scale: 1.02; }

        .room::before {
          content: "";
          position: absolute;
          inset: 10px;
          clip-path: polygon(11% 0, 89% 0, 100% 15%, 100% 85%, 89% 100%, 11% 100%, 0 85%, 0 15%);
          border: 2px solid rgba(95, 120, 255, .60);
          box-shadow: inset 0 0 20px rgba(95, 120, 255, .32);
          pointer-events: none;
        }

        .room::after {
          content: "";
          position: absolute;
          left: 28px;
          right: 28px;
          bottom: 14px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ff7a1f, transparent);
          box-shadow: 0 0 16px #ff7a1f;
        }

        .roomLabel {
          position: absolute;
          top: 17px;
          left: 50%;
          transform: translateX(-50%);
          padding: 5px 13px;
          border-radius: 7px;
          border: 1px solid #8c69ff;
          background: rgba(78, 52, 150, .86);
          color: white;
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 0 16px rgba(125, 90, 255, .8);
          white-space: nowrap;
          z-index: 3;
        }

        .gatewayBadge {
          position: absolute;
          top: 18px;
          right: 22px;
          z-index: 4;
          padding: 5px 9px;
          border-radius: 999px;
          border: 1px solid rgba(0, 255, 255, .45);
          background: rgba(0, 20, 35, .70);
          color: #67f7ff;
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 0 15px rgba(0, 255, 255, .28);
        }

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #1c2338, #080a12);
          border: 2px solid #22ff86;
          box-shadow: 0 0 18px rgba(34, 255, 134, .72);
          font-weight: 950;
          font-size: 14px;
          margin-top: 16px;
          z-index: 3;
        }

        .bossAvatar {
          width: 34px;
          height: 34px;
          font-size: 15px;
          border-color: #ff8735;
          box-shadow: 0 0 22px rgba(255, 125, 40, .85);
        }

        .offlineAvatar {
          border-color: #ff5a5a;
          box-shadow: 0 0 18px rgba(255, 70, 70, .72);
        }

        .room h2 {
          margin: 0;
          font-size: 17px;
          line-height: 17px;
          font-weight: 950;
          text-shadow: 0 3px 9px black;
          z-index: 3;
        }

        .room p {
          margin: 0;
          color: #d7ddff;
          font-size: 11px;
          font-weight: 800;
          z-index: 3;
        }

        .room small {
          font-size: 10px;
          font-weight: 950;
          padding: 4px 14px;
          border-radius: 999px;
          z-index: 3;
        }

        .online { color: #00ff88; background: rgba(0, 255, 136, .08); }
        .offline { color: #ff6868; background: rgba(255, 70, 70, .10); }

        .boss {
          width: 290px;
          height: 190px;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          border-color: rgba(255, 120, 35, .75);
        }

        .boss .roomLabel {
          background: rgba(100,45,10,.9);
          border-color: #ff7a1f;
          box-shadow: 0 0 16px rgba(255,100,20,.85);
        }

        .joao { top: 120px; left: 55px; }
        .pedro { top: 120px; right: 55px; }
        .michael { top: 380px; left: 80px; }
        .carlos { top: 400px; left: 50%; transform: translateX(-50%); }
        .lucas { top: 380px; right: 80px; }

        .modalOverlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(0, 0, 0, .70);
          backdrop-filter: blur(9px);
          display: grid;
          place-items: center;
          padding: 20px;
        }

        .modal {
          width: min(980px, 94vw);
          max-height: 92vh;
          overflow: auto;
          border-radius: 26px;
          background:
            radial-gradient(circle at 20% 0%, rgba(255, 106, 26, .18), transparent 35%),
            linear-gradient(145deg, rgba(18, 24, 42, .98), rgba(5, 8, 18, .98));
          border: 1px solid rgba(255, 117, 35, .45);
          box-shadow: 0 0 60px rgba(255, 106, 26, .18), inset 0 0 45px rgba(70, 100, 255, .13);
          padding: 26px;
          position: relative;
        }

        .panelModal { width: min(900px, 94vw); }

        .close {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 12px;
          background: rgba(255,255,255,.08);
          color: white;
          font-size: 25px;
          cursor: pointer;
        }

        .modalTop {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 22px;
        }

        .modalAvatar {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 25px;
          font-weight: 950;
          border: 3px solid #00ff88;
          box-shadow: 0 0 25px rgba(0,255,136,.65);
          background: #080b14;
        }

        .modalAvatar.red {
          border-color: #ff5a5a;
          box-shadow: 0 0 25px rgba(255,80,80,.65);
        }

        .modalTop small {
          color: #ff9a4d;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .modalTop h2 {
          margin: 4px 0;
          font-size: 30px;
        }

        .modalOnline { color: #00ff88; margin: 0; font-weight: 900; }
        .modalOffline { color: #ff6868; margin: 0; font-weight: 900; }

        .splitWarning {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.08);
          margin-bottom: 16px;
        }

        .splitWarning span {
          font-size: 14px;
          font-weight: 950;
          padding: 7px 13px;
          border-radius: 999px;
        }

        .totalOk { color: #00ff88; background: rgba(0,255,136,.09); }
        .totalError { color: #ff6b6b; background: rgba(255,80,80,.12); }

        .partnerBox {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 16px;
        }

        .splitGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .splitCard,
        .partnerBox {
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.08);
        }

        .splitCard h3 { margin: 0; font-size: 15px; }
        .splitCard p { margin: 6px 0 16px; color: #9fa8c0; font-size: 12px; }

        .splitCard label,
        .partnerBox label {
          display: block;
          margin: 8px 0 7px;
          color: #c8cfe4;
          font-size: 12px;
          font-weight: 800;
        }

        .splitCard input,
        .partnerBox input,
        .partnerBox select {
          width: 100%;
          height: 42px;
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 12px;
          background: rgba(0,0,0,.25);
          color: white;
          padding: 0 12px;
          outline: none;
        }

        .message {
          margin-top: 15px;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 800;
        }

        .message.success {
          color: #00ff88;
          background: rgba(0,255,136,.08);
          border: 1px solid rgba(0,255,136,.18);
        }

        .message.error {
          color: #ff6b6b;
          background: rgba(255,80,80,.10);
          border: 1px solid rgba(255,80,80,.22);
        }

        .actions {
          margin-top: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .actions button {
          border: 0;
          border-radius: 12px;
          padding: 12px 16px;
          background: linear-gradient(90deg, #ff3d00, #ff9d42);
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .actions .ghost {
          background: rgba(255,255,255,.08);
          color: #d9deed;
          border: 1px solid rgba(255,255,255,.12);
        }

        .panelTitle { margin-bottom: 22px; }
        .panelTitle small { color: #ff9a4d; font-weight: 900; letter-spacing: 1px; }
        .panelTitle h2 { margin: 5px 0; font-size: 31px; }
        .panelTitle p { margin: 0; color: #aeb6cb; }

        .dashGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .dashBox,
        .listItem,
        .financeTable div {
          border-radius: 16px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.08);
          padding: 16px;
        }

        .dashBox span { display: block; color: #9fa8c0; font-size: 12px; margin-bottom: 8px; }
        .dashBox strong { font-size: 22px; }
        .dashBox.danger strong { color: #ff6868; }

        .listGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .listItem {
          text-align: left;
          color: white;
          cursor: pointer;
          font-family: inherit;
        }

        .listItem b { display: block; color: #ff9a4d; margin-bottom: 6px; }
        .listItem strong { display: block; font-size: 20px; margin-bottom: 5px; }
        .listItem span { color: #b8c0d3; font-size: 13px; }

        .financeTable {
          display: grid;
          gap: 10px;
        }

        .financeTable div {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 12px;
          align-items: center;
        }

        .financeTable span { font-weight: 900; }
        .financeTable b { color: #00ff88; }
        .financeTable small { color: #aeb6cb; }

        @media (max-width: 1150px) {
          .page {
            flex-direction: column;
            overflow: auto;
          }

          .sidebar {
            width: 100%;
            height: auto;
            padding: 14px 12px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 105, 25, .18);
            display: flex;
            align-items: center;
            gap: 10px;
            overflow-x: auto;
          }

          .sidebar.closed {
            width: 100%;
          }

          .toggle {
            position: relative;
            top: auto;
            right: auto;
            flex: 0 0 auto;
          }

          .logo {
            height: 42px;
            margin: 0;
            flex: 0 0 auto;
          }

          nav {
            display: flex;
            gap: 10px;
            flex: 1;
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .nav {
            flex: 0 0 auto;
            width: 48px;
            height: 48px;
            justify-content: center;
            padding: 0;
            border-radius: 14px;
          }

          .nav b {
            display: none;
          }

          .resume {
            display: none;
          }

          .main {
            padding: 16px;
            width: 100%;
          }

          header {
            height: auto;
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
            margin-bottom: 18px;
          }

          h1 {
            font-size: 27px;
          }

          h1 span {
            font-size: 9px;
            padding: 4px 7px;
          }

          header p {
            font-size: 14px;
          }

          .profile {
            width: 100%;
            justify-content: flex-start;
            padding: 12px;
            border-radius: 18px;
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.08);
          }

          .map {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            height: auto;
            min-height: auto;
            padding: 18px;
            overflow: visible;
            border-radius: 24px;
          }

          .fxLayer {
            display: none;
          }

          .floor {
            display: none;
          }

          .boss,
          .room {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            right: auto !important;
            transform: none !important;
            translate: none !important;
            width: 100%;
            max-width: 420px;
            height: 150px;
            margin: 0;
          }

          .boss {
            order: -1;
            height: 165px;
          }

          .room:hover {
            translate: none;
            scale: 1;
          }

          .modalOverlay {
            align-items: flex-start;
            padding: 14px;
            overflow-y: auto;
          }

          .modal {
            width: 100%;
            max-height: none;
            border-radius: 24px;
            padding: 20px;
          }

          .modalTop {
            padding-right: 42px;
          }

          .modalTop h2 {
            font-size: 24px;
          }

          .partnerBox,
          .splitGrid,
          .dashGrid,
          .listGrid {
            grid-template-columns: 1fr;
          }

          .financeTable div {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }

          .actions button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

function SplitCard({
  title,
  subtitle,
  recipientValue,
  percentValue,
  onRecipientChange,
  onPercentChange,
}: {
  title: string;
  subtitle: string;
  recipientValue: string;
  percentValue: number;
  onRecipientChange: (value: string) => void;
  onPercentChange: (value: number) => void;
}) {
  return (
    <div className="splitCard">
      <h3>{title}</h3>
      <p>{subtitle}</p>

      <label>Recipient ID</label>
      <input
        value={recipientValue}
        onChange={(e) => onRecipientChange(e.target.value)}
      />

      <label>Porcentagem</label>
      <input
        type="number"
        value={percentValue}
        onChange={(e) => onPercentChange(Number(e.target.value))}
      />
    </div>
  );
}

function PanelTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="panelTitle">
      <small>NEXPAY HQ</small>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

function DashBox({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className={danger ? "dashBox danger" : "dashBox"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}