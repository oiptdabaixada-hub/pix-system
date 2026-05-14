import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const valor = Number(body.valor);

    const valorCentavos = Math.round(valor * 100);

    const split = [
      {
        amount: Number(process.env.PERCENT_MAIN),
        recipient_id: process.env.RECIPIENT_MAIN_ID,
        type: "percentage",
      },

      {
        amount: Number(process.env.PERCENT_YOU),
        recipient_id: process.env.RECIPIENT_YOU_ID,
        type: "percentage",
      },

      {
        amount: Number(process.env.PERCENT_PARTNER),
        recipient_id: process.env.RECIPIENT_PARTNER_ID,
        type: "percentage",
      },
    ];

    const response = await fetch(
      "https://api.pagar.me/core/v5/orders",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            "Basic " +
            Buffer.from(
              process.env.PAGARME_SECRET_KEY + ":"
            ).toString("base64"),
        },

        body: JSON.stringify({

          items: [
            {
              amount: valorCentavos,
              description: "Pagamento PIX NexPay",
              quantity: 1,
              code: "NEXPAYPIX",
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
      }
    );

    const data = await response.json();
    console.log(data)
    if (!response.ok) {

      return NextResponse.json({
        sucesso: false,
        erro: data,
      });

    }

    const qrCode =
      data?.charges?.[0]?.last_transaction?.qr_code;

    return NextResponse.json({
      sucesso: true,
      pix: qrCode,
    });

  } catch (error) {

    return NextResponse.json({
      sucesso: false,
      erro: "Erro interno",
    });

  }

}