import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("WEBHOOK RECEBIDO:", body);

    const txid = body?.txid;
    const status = body?.status;

    if (!txid) {
      return NextResponse.json({
        error: "txid não enviado",
      });
    }

    const { error } = await supabase
      .from("cobrancas")
      .update({
        status: status || "pago",
        pago: true,
      })
      .eq("txid", txid);

    if (error) {
      console.log(error);

      return NextResponse.json({
        error,
      });
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.log(err);

    return NextResponse.json({
      error: "erro interno",
    });
  }
}