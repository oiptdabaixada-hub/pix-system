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

    if (!valor || valor <= 0) {
      return NextResponse.json({
        sucesso: false,
        erro: "Valor inválido",
      });
    }

    if (!roomCode) {
      return NextResponse.json({
        sucesso: false,
        erro: "Sala do parceiro não enviada",
      });
    }

    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("room_code", roomCode)
      .single();

    if (roomError || !room) {
      return NextResponse.json({
        sucesso: false,
        erro: "Sala não encontrada no Supabase",
      });
    }

    const apiKey = getPagarmeKey(room.gateway_account);

    if (!apiKey) {
      return NextResponse.json({
        sucesso: false,
        erro: `Chave Pagar.me não configurada para ${
          room.gateway_account || "conta_1"
        }`,
      });
    }

    const splitBase = [
      {
        name: "principal",
        recipient_id: room.principal_recipient_id,
        amount: Number(room.principal_percent || 0),
      },
      {
        name: "pete021",
        recipient_id: room.pete_recipient_id,
        amount: Number(room.pete_percent || 0),
      },
      {
        name: "partner",
        recipient_id: room.partner_recipient_id,
        amount: Number(room.partner_percent || 0),
      },
    ].filter((item) => item.recipient_id && item.amount > 0);

    const totalPercent = splitBase.reduce(
      (total, item) => total + item.amount,
      0
    );

    if (splitBase.length === 0) {
      return NextResponse.json({
        sucesso: false,
        erro: "Nenhum recipient configurado nessa sala",
      });
    }

    if (totalPercent !== 100) {
      return NextResponse.json({
        sucesso: false,
        erro: `As porcentagens precisam somar 100%. Total atual: ${totalPercent}%`,
      });
    }

    const split = splitBase.map((item, index) => ({
      amount: item.amount,
      recipient_id: item.recipient_id,
      type: "percentage",
      options: {
        liable: index === 0,
        charge_processing_fee: index === 0,
        charge_remainder_fee: index === 0,
      },
    }));

    const clienteAleatorio =
      clientes[Math.floor(Math.random() * clientes.length)];

    const valorCentavos = Math.round(valor * 100);
    const auth = Buffer.from(`${apiKey}:`).toString("base64");

    const response = await fetch("https://api.pagar.me/core/v5/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
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
        items: [
          {
            amount: valorCentavos,
            description: "Liberação",
            quantity: 1,
            code: "pix",
          },
        ],
        payments: [
          {
            payment_method: "pix",
            pix: {
              expires_in: 3600,
            },
            split,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("RESPOSTA PAGARME:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.log("ERRO PAGARME:", JSON.stringify(data, null, 2));

      return NextResponse.json({
        sucesso: false,
        erro: data?.message || "Erro ao gerar PIX na Pagar.me",
        detalhes: data,
      });
    }

    const charge = data?.charges?.[0];
    const transaction = charge?.last_transaction;

    const codigoPix =
      transaction?.qr_code ||
      transaction?.qrCode ||
      transaction?.pix?.qr_code ||
      transaction?.pix?.qrCode ||
      charge?.qr_code ||
      charge?.qrCode ||
      data?.qr_code ||
      data?.qrCode;

    const qrCodeUrl =
      transaction?.qr_code_url ||
      transaction?.qrCodeUrl ||
      transaction?.pix?.qr_code_url ||
      charge?.qr_code_url ||
      data?.qr_code_url;

    if (!codigoPix) {
      return NextResponse.json({
        sucesso: false,
        erro: "PIX gerado, mas código não encontrado",
        detalhes: data,
      });
    }

    return NextResponse.json({
      sucesso: true,
      pix: codigoPix,
      qr_code_url: qrCodeUrl || null,
      cliente: clienteAleatorio,
      room_code: room.room_code,
      parceiro: room.partner_name,
      gateway_account: room.gateway_account || "conta_1",
      split,
      data,
    });
  } catch (error) {
    console.log("ERRO INTERNO:", error);

    return NextResponse.json({
      sucesso: false,
      erro: "Erro interno ao gerar PIX",
    });
  }
}