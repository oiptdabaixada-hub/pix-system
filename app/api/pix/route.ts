import { NextResponse } from "next/server";
import { clientes } from "@/lib/clientes";
import { supabase } from "@/lib/supabaseClient";

function getPagarmeKey(gatewayAccount: string | null | undefined) {
  const account = gatewayAccount || "conta_1";
  const keys: Record<string, string | undefined> = {
    conta_1: process.env.PAGARME_CONTA_1,
    conta_2: process.env.PAGARME_CONTA_2,
    conta_3: process.env.PAGARME_CONTA_3,
  };
  return keys[account] || process.env.PAGARME_SECRET_KEY;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valor = Number(body.valor);
    const roomCode = body.room_code;
    if (!Number.isFinite(valor) || valor <= 0) {
      return NextResponse.json({ sucesso: false, erro: "Valor inválido" });
    }
    if (!roomCode) {
      return NextResponse.json({ sucesso: false, erro: "Sala do parceiro não enviada" });
    }

    const { data: room, error: roomError } = await supabase
      .from("rooms").select("*").eq("room_code", roomCode).single();
    if (roomError || !room) {
      return NextResponse.json({ sucesso: false, erro: "Sala não encontrada no Supabase" });
    }
    const apiKey = getPagarmeKey(room.gateway_account);
    if (!apiKey) {
      return NextResponse.json({
        sucesso: false,
        erro: `Chave Pagar.me não configurada para ${room.gateway_account || "conta_1"}`,
      });
    }

    const splitRows = [
      { name: "principal", recipient_id: room.principal_recipient_id, amount: Number(room.principal_percent || 0) },
      { name: "pete021", recipient_id: room.pete_recipient_id, amount: Number(room.pete_percent || 0) },
      { name: "partner", recipient_id: room.partner_recipient_id, amount: Number(room.partner_percent || 0) },
      { name: "extra_1", recipient_id: room.extra_recipient_1_id, amount: Number(room.extra_recipient_1_percent || 0) },
      { name: "extra_2", recipient_id: room.extra_recipient_2_id, amount: Number(room.extra_recipient_2_percent || 0) },
      { name: "extra_3", recipient_id: room.extra_recipient_3_id, amount: Number(room.extra_recipient_3_percent || 0) },
      { name: "extra_4", recipient_id: room.extra_recipient_4_id, amount: Number(room.extra_recipient_4_percent || 0) },
    ];
    if (splitRows.some((item) => !Number.isFinite(item.amount) || item.amount < 0 || item.amount > 100)) {
      return NextResponse.json({ sucesso: false, erro: "Porcentagem inválida." });
    }
    const invalidRows = splitRows.filter((item) => {
      const hasId = Boolean(item.recipient_id && String(item.recipient_id).trim());
      return hasId !== (item.amount > 0);
    });
    if (invalidRows.length > 0) {
      return NextResponse.json({ sucesso: false, erro: "Cada recipient usado precisa ter ID e porcentagem maior que 0." });
    }
    const splitBase = splitRows.filter((item) => item.recipient_id && String(item.recipient_id).trim() && item.amount > 0);
    if (!splitBase.length) {
      return NextResponse.json({ sucesso: false, erro: "Nenhum recipient configurado nessa sala" });
    }
    // Porcentagens em centésimos para evitar erro de ponto flutuante.
    const percentUnits = splitBase.map((item) => Math.round(item.amount * 100));
    if (splitBase.some((item, i) => Math.abs(item.amount * 100 - percentUnits[i]) > 0.000001)) {
      return NextResponse.json({ sucesso: false, erro: "Use no máximo duas casas decimais nas porcentagens." });
    }
    const totalUnits = percentUnits.reduce((sum, n) => sum + n, 0);
    if (totalUnits !== 10000) {
      return NextResponse.json({ sucesso: false, erro: `As porcentagens precisam somar 100%. Total atual: ${totalUnits / 100}%` });
    }

    const valorCentavos = Math.round(valor * 100);
    if (!Number.isSafeInteger(valorCentavos) || valorCentavos <= 0) {
      return NextResponse.json({ sucesso: false, erro: "Valor em centavos inválido" });
    }
    // Método dos maiores restos: distribui cada centavo e garante soma exata.
    const allocations = percentUnits.map((units, index) => {
      const numerator = valorCentavos * units;
      return { index, cents: Math.floor(numerator / 10000), remainder: numerator % 10000 };
    });
    let remaining = valorCentavos - allocations.reduce((sum, a) => sum + a.cents, 0);
    const byRemainder = [...allocations].sort((a, b) => b.remainder - a.remainder || a.index - b.index);
    for (let i = 0; i < remaining; i++) byRemainder[i].cents += 1;
    const split = allocations.map((a) => ({
      amount: a.cents,
      recipient_id: String(splitBase[a.index].recipient_id).trim(),
      type: "flat" as const,
      options: {
        liable: a.index === 0,
        charge_processing_fee: a.index === 0,
        charge_remainder_fee: a.index === 0,
      },
    }));
    if (split.some((s) => s.amount <= 0)) {
      return NextResponse.json({ sucesso: false, erro: "Valor insuficiente para dividir entre todos os recipients configurados." });
    }

    const clienteAleatorio = clientes[Math.floor(Math.random() * clientes.length)];
    const auth = Buffer.from(`${apiKey}:`).toString("base64");
    const response = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: clienteAleatorio.nome,
          email: clienteAleatorio.email,
          type: "individual",
          document: clienteAleatorio.documento,
          phones: {
            mobile_phone: {
              country_code: "55",
              area_code: clienteAleatorio.telefone.slice(0, 2),
              number: clienteAleatorio.telefone.slice(2),
            },
          },
        },
        items: [{ amount: valorCentavos, description: "Liberação", quantity: 1, code: "pix" }],
        payments: [{ payment_method: "pix", pix: { expires_in: 3600 }, split }],
      }),
    });
    const data = await response.json();
    console.log("RESPOSTA PAGARME:", JSON.stringify(data, null, 2));
    if (!response.ok) {
      console.log("ERRO PAGARME:", JSON.stringify(data, null, 2));
      return NextResponse.json({ sucesso: false, erro: data?.message || "Erro ao gerar PIX na Pagar.me", detalhes: data });
    }
    const charge = data?.charges?.[0];
    const transaction = charge?.last_transaction;
    const codigoPix =
      transaction?.qr_code || transaction?.qrCode || transaction?.pix?.qr_code ||
      transaction?.pix?.qrCode || charge?.qr_code || charge?.qrCode || data?.qr_code || data?.qrCode;
    const qrCodeUrl = transaction?.qr_code_url || transaction?.qrCodeUrl ||
      transaction?.pix?.qr_code_url || charge?.qr_code_url || data?.qr_code_url;
    if (!codigoPix) {
      return NextResponse.json({ sucesso: false, erro: "PIX gerado, mas código não encontrado", detalhes: data });
    }
    return NextResponse.json({
      sucesso: true, pix: codigoPix, qr_code_url: qrCodeUrl || null,
      cliente: clienteAleatorio, room_code: room.room_code,
      parceiro: room.partner_name, gateway_account: room.gateway_account || "conta_1", split, data,
    });
  } catch (error) {
    console.log("ERRO INTERNO:", error);
    return NextResponse.json({ sucesso: false, erro: "Erro interno ao gerar PIX" });
  }
}
