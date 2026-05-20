import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const valor = Number(body.valor);

    if (!valor || valor <= 0) {
      return NextResponse.json({
        sucesso: false,
        mensagem: "❌ Valor inválido",
      });
    }

    const apiKey = process.env.PAGARME_SECRET_KEY;

    if (!apiKey) {
      return NextResponse.json({
        sucesso: false,
        mensagem: "❌ Chave API não configurada",
      });
    }

    const split = [
      {
        amount: Number(process.env.PERCENT_MAIN || 0),
        recipient_id: process.env.RECIPIENT_MAIN_ID,
        type: "percentage",
        options: {
          liable: true,
          charge_processing_fee: true,
          charge_remainder_fee: true,
        },
      },
      {
        amount: Number(process.env.PERCENT_YOU || 0),
        recipient_id: process.env.RECIPIENT_YOU_ID,
        type: "percentage",
        options: {
          liable: false,
          charge_processing_fee: false,
          charge_remainder_fee: false,
        },
      },
      {
        amount: Number(process.env.PERCENT_PARTNER || 0),
        recipient_id: process.env.RECIPIENT_PARTNER_ID,
        type: "percentage",
        options: {
          liable: false,
          charge_processing_fee: false,
          charge_remainder_fee: false,
        },
      },
    ].filter((item) => item.amount > 0 && item.recipient_id);

    const totalPercent = split.reduce((total, item) => total + item.amount, 0);

    if (totalPercent !== 100) {
      return NextResponse.json({
        sucesso: false,
        mensagem: "❌ As porcentagens precisam somar 100%",
        erro: {
          totalPercent,
          split,
        },
      });
    }

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
          name: "Cliente NexPay",
          email: "cliente@nexpay.com",
          type: "individual",
          document: "61356621392",
        },
        items: [
          {
            amount: valorCentavos,
            description: "Pix NexPay",
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

    if (!response.ok) {
      console.log(JSON.stringify(data, null, 2));

      return NextResponse.json({
        sucesso: false,
        mensagem: "❌ Erro ao gerar PIX",
        erro: data,
      });
    }

    const codigoPix = data?.charges?.[0]?.last_transaction?.qr_code;

    if (!codigoPix) {
      return NextResponse.json({
        sucesso: false,
        mensagem: "❌ PIX gerado, mas código não encontrado",
        erro: data,
      });
    }

    return NextResponse.json({
      sucesso: true,
      mensagem: "✅ PIX gerado com sucesso",
      pix: codigoPix,
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      sucesso: false,
      mensagem: "❌ Erro interno ao gerar PIX",
    });
  }
}