import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  buildCustomerConfirmationEmail,
  buildTeamNotificationEmail,
  type OrderEmailData,
} from "@/lib/email";

const TEAM_EMAIL = process.env.TEAM_ORDER_EMAIL ?? "ecommerce@victorsdou.com";

function cors(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      orderId,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryDate,
      deliveryTimeRange,
      deliveryTimeLabel,
      address,
      invoiceType,
      dni,
      ruc,
      razonSocial,
      notes,
    } = body;

    if (!customerEmail || !orderId) {
      return cors({ ok: false, error: "customerEmail and orderId are required" }, 400);
    }

    const data: OrderEmailData = {
      customerName: customerName || customerEmail,
      customerEmail,
      customerPhone,
      orderId,
      items: items || [],
      subtotal: subtotal ?? 0,
      deliveryFee: deliveryFee ?? 0,
      total: total ?? 0,
      deliveryDate,
      deliveryTimeRange,
      deliveryTimeLabel,
      address,
      invoiceType,
      dni,
      ruc,
      razonSocial,
      notes,
    };

    // Send both emails concurrently (fire-and-forget style but we await for response)
    const results = await Promise.allSettled([
      // 1. Customer confirmation
      sendEmail({
        to: customerEmail,
        subject: "Pedido confirmado — Victorsdou",
        html: buildCustomerConfirmationEmail(data),
      }),
      // 2. Team notification
      sendEmail({
        to: TEAM_EMAIL,
        subject: `Nuevo pedido #${orderId.slice(-8).toUpperCase()} — ${customerName || customerEmail}`,
        html: buildTeamNotificationEmail(data),
      }),
    ]);

    const customerOk = results[0].status === "fulfilled";
    const teamOk = results[1].status === "fulfilled";

    return cors({ ok: true, customerEmailSent: customerOk, teamEmailSent: teamOk });
  } catch (err: any) {
    console.error("[send-order-email] Error:", err);
    return cors({ ok: false, error: err.message ?? "Internal error" }, 500);
  }
}
