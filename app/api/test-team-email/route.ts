import { NextRequest, NextResponse } from "next/server";
import {
  sendEmail,
  buildTeamNotificationEmail,
  type OrderEmailData,
} from "@/lib/email";

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
    const { testRecipient, ...orderData } = body;

    if (!testRecipient) {
      return cors({ ok: false, error: "testRecipient is required" }, 400);
    }

    const data: OrderEmailData = {
      customerName: orderData.customerName || "Cliente de Prueba",
      customerEmail: orderData.customerEmail || "test@example.com",
      customerPhone: orderData.customerPhone,
      orderId: orderData.orderId || "TEST-001",
      items: orderData.items || [],
      subtotal: orderData.subtotal ?? 0,
      deliveryFee: orderData.deliveryFee ?? 0,
      total: orderData.total ?? 0,
      deliveryDate: orderData.deliveryDate,
      deliveryTimeRange: orderData.deliveryTimeRange,
      deliveryTimeLabel: orderData.deliveryTimeLabel,
      address: orderData.address,
      invoiceType: orderData.invoiceType,
      dni: orderData.dni,
      ruc: orderData.ruc,
      razonSocial: orderData.razonSocial,
      notes: orderData.notes,
    };

    const result = await sendEmail({
      to: testRecipient,
      subject: `[TEST] Nuevo pedido #${data.orderId.slice(-8).toUpperCase()} — ${data.customerName}`,
      html: buildTeamNotificationEmail(data),
    });

    return cors({ ok: result.ok, result });
  } catch (err: any) {
    return cors({ ok: false, error: err.message ?? "Internal error" }, 500);
  }
}
