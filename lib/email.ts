/**
 * lib/email.ts
 * AWS SES email utility for victorsdou.pe
 * Env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 *           AWS_REGION (default sa-east-1),
 *           SES_FROM_EMAIL (default hola@victorsdou.pe)
 */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

let _ses: SESClient | null = null;

function getSES(): SESClient | null {
  const key = process.env.AWS_ACCESS_KEY_ID;
  const secret = process.env.AWS_SECRET_ACCESS_KEY;
  if (!key || !secret) return null;
  if (!_ses) {
    _ses = new SESClient({
      region: process.env.AWS_REGION ?? "sa-east-1",
      credentials: { accessKeyId: key, secretAccessKey: secret },
    });
  }
  return _ses;
}

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  const toAddresses = Array.isArray(opts.to) ? opts.to : [opts.to];
  if (!toAddresses.length) return;

  const ses = getSES();
  if (!ses) {
    console.log("[email] No AWS SES credentials — skipping send to:", toAddresses.join(", "));
    console.log("[email] Subject:", opts.subject);
    return;
  }

  const from = process.env.SES_FROM_EMAIL ?? "Victorsdou <hola@victorsdou.pe>";
  try {
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: toAddresses },
        Message: {
          Subject: { Data: opts.subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: opts.html, Charset: "UTF-8" },
            ...(opts.text ? { Text: { Data: opts.text, Charset: "UTF-8" } } : {}),
          },
        },
      }),
    );
    console.log("[email] Sent to", toAddresses.join(", "), "|", opts.subject);
  } catch (err) {
    console.error("[email] SES error:", err);
  }
}

// ── Brand wrapper ──────────────────────────────────────────────────────────
const wrap = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f5f0;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f5f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1a1a1a;padding:28px 32px;text-align:center;">
            <p style="margin:0;color:#c8b560;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-family:Arial,sans-serif;">PAN DE MASA MADRE ARTESANAL</p>
            <h1 style="margin:6px 0 0;color:#fff;font-size:26px;letter-spacing:2px;text-transform:uppercase;">Victorsdou</h1>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px 32px 8px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f5f0;padding:20px 32px;text-align:center;border-top:1px solid #ede9e1;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#888;">
              Victorsdou · Pan de masa madre artesanal · Lima, Peru<br>
              <a href="https://victorsdou.pe" style="color:#6b7c4b;text-decoration:none;">victorsdou.pe</a>&nbsp;&nbsp;|&nbsp;&nbsp;
              <a href="https://wa.me/51944200333" style="color:#6b7c4b;text-decoration:none;">WhatsApp</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Helper: format date in Spanish ─────────────────────────────────────────
function formatDeliveryDate(dateStr?: string, timeRange?: string): string {
  if (!dateStr) return "—";
  const parts = dateStr.split("-");
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const line = d.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (timeRange === "12:00 - 17:00") return line + " · 12:00 – 5:00 PM";
  if (timeRange === "8:00 - 12:00") return line + " · 8:00 AM – 12:00 PM";
  if (timeRange) return line + " · " + timeRange;
  return line;
}

// ── Helper: format address ─────────────────────────────────────────────────
function formatAddress(addr?: { street?: string; district?: string; city?: string; reference?: string }): string {
  if (!addr || !addr.street) return "—";
  let line = addr.street;
  if (addr.district) line += ", " + addr.district;
  if (addr.city && addr.city !== "Lima") line += ", " + addr.city;
  if (addr.reference) line += " (" + addr.reference + ")";
  return line;
}

// ── Shared types ───────────────────────────────────────────────────────────
export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryDate?: string;
  deliveryTimeRange?: string;
  deliveryTimeLabel?: string;
  address?: { street: string; district: string; city?: string; reference?: string };
  invoiceType?: string;
  dni?: string;
  ruc?: string;
  razonSocial?: string;
  notes?: string;
}

// ── Email 1: Customer order confirmation ───────────────────────────────────
export function buildCustomerConfirmationEmail(data: OrderEmailData): string {
  const rows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece3;color:#333;font-size:14px;">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece3;text-align:center;color:#666;font-size:14px;">${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0ece3;text-align:right;color:#333;font-size:14px;">S/ ${(i.unitPrice * i.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  const deliveryLine = formatDeliveryDate(data.deliveryDate, data.deliveryTimeRange);
  const addrLine = formatAddress(data.address);

  return wrap(`
    <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:22px;">¡Gracias por tu pedido!</h2>
    <p style="margin:0 0 24px;color:#666;font-family:Arial,sans-serif;font-size:14px;">
      Hola ${data.customerName}, hemos recibido tu pedido y tu pago fue procesado exitosamente.
    </p>

    <div style="background:#f9f5f0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Numero de pedido</p>
      <p style="margin:4px 0 0;font-size:18px;color:#1a1a1a;font-weight:bold;">#${data.orderId.slice(-8).toUpperCase()}</p>
    </div>

    <h3 style="margin:0 0 12px;color:#1a1a1a;font-size:15px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Tu pedido</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr>
          <th style="padding:8px 0;text-align:left;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #ede9e1;">Producto</th>
          <th style="padding:8px 0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #ede9e1;">Cant.</th>
          <th style="padding:8px 0;text-align:right;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;border-bottom:2px solid #ede9e1;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="text-align:right;margin-bottom:24px;">
      <p style="margin:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#666;">Subtotal: S/ ${data.subtotal.toFixed(2)}</p>
      <p style="margin:4px 0;font-family:Arial,sans-serif;font-size:14px;color:#666;">Delivery: S/ ${data.deliveryFee.toFixed(2)}</p>
      <p style="margin:4px 0;font-family:Arial,sans-serif;font-size:16px;color:#1a1a1a;font-weight:bold;">Total pagado: S/ ${data.total.toFixed(2)}</p>
    </div>

    <div style="border-top:1px solid #ede9e1;padding-top:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:50%;padding-right:16px;vertical-align:top;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Entrega</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#333;">${deliveryLine}</p>
          </td>
          <td style="width:50%;vertical-align:top;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;color:#888;letter-spacing:1px;text-transform:uppercase;">Direccion</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#333;">${addrLine}</p>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-family:Arial,sans-serif;font-size:14px;color:#666;margin-bottom:24px;">
      Si tienes alguna pregunta sobre tu pedido, escribenos por
      <a href="https://wa.me/51944200333" style="color:#6b7c4b;font-weight:600;">WhatsApp</a>.
    </p>

    <div style="text-align:center;padding-bottom:8px;">
      <a href="https://victorsdou.pe"
         style="display:inline-block;background:#6b7c4b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
        Visitar la tienda
      </a>
    </div>
  `);
}

// ── Email 2: Team notification ─────────────────────────────────────────────
export function buildTeamNotificationEmail(data: OrderEmailData): string {
  const rows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;font-size:14px;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;font-size:14px;">S/ ${(i.unitPrice * i.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  const deliveryLine = formatDeliveryDate(data.deliveryDate, data.deliveryTimeRange);
  const addrLine = formatAddress(data.address);

  const invoiceInfo =
    data.invoiceType === "factura"
      ? `Factura — RUC: ${data.ruc || "—"} · ${data.razonSocial || "—"}`
      : `Boleta — DNI: ${data.dni || "—"}`;

  return wrap(`
    <h2 style="margin:0 0 4px;color:#1a1a1a;font-size:22px;">Nuevo pedido recibido</h2>
    <p style="margin:0 0 20px;color:#666;font-family:Arial,sans-serif;font-size:14px;">
      Se ha recibido un nuevo pedido en victorsdou.pe
    </p>

    <!-- Order ID + Time -->
    <div style="background:#f0f4ea;border-left:4px solid #6b7c4b;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#6b7c4b;letter-spacing:1px;text-transform:uppercase;font-weight:600;">Pedido #${data.orderId.slice(-8).toUpperCase()}</p>
      <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">Recibido: ${new Date().toLocaleString("es-PE", { timeZone: "America/Lima" })}</p>
    </div>

    <!-- Customer info -->
    <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:15px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Cliente</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td style="padding:4px 0;color:#888;width:120px;">Nombre:</td><td style="padding:4px 0;color:#333;">${data.customerName}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Email:</td><td style="padding:4px 0;color:#333;"><a href="mailto:${data.customerEmail}" style="color:#6b7c4b;">${data.customerEmail}</a></td></tr>
      <tr><td style="padding:4px 0;color:#888;">Telefono:</td><td style="padding:4px 0;color:#333;"><a href="tel:${data.customerPhone || ''}" style="color:#6b7c4b;">${data.customerPhone || "—"}</a></td></tr>
      <tr><td style="padding:4px 0;color:#888;">Comprobante:</td><td style="padding:4px 0;color:#333;">${invoiceInfo}</td></tr>
    </table>

    <!-- Items -->
    <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:15px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Productos</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#f9f5f0;">
          <th style="padding:8px 12px;text-align:left;font-family:Arial,sans-serif;font-size:12px;color:#888;text-transform:uppercase;">Producto</th>
          <th style="padding:8px 12px;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#888;text-transform:uppercase;">Cant.</th>
          <th style="padding:8px 12px;text-align:right;font-family:Arial,sans-serif;font-size:12px;color:#888;text-transform:uppercase;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="text-align:right;margin-bottom:20px;font-family:Arial,sans-serif;">
      <p style="margin:4px 0;font-size:14px;color:#666;">Subtotal: S/ ${data.subtotal.toFixed(2)}</p>
      <p style="margin:4px 0;font-size:14px;color:#666;">Delivery: S/ ${data.deliveryFee.toFixed(2)}</p>
      <p style="margin:4px 0;font-size:16px;color:#1a1a1a;font-weight:bold;">Total: S/ ${data.total.toFixed(2)}</p>
    </div>

    <!-- Delivery -->
    <h3 style="margin:0 0 8px;color:#1a1a1a;font-size:15px;font-family:Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;">Entrega</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td style="padding:4px 0;color:#888;width:120px;">Fecha:</td><td style="padding:4px 0;color:#333;font-weight:600;">${deliveryLine}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Direccion:</td><td style="padding:4px 0;color:#333;">${addrLine}</td></tr>
      ${data.notes ? `<tr><td style="padding:4px 0;color:#888;">Notas:</td><td style="padding:4px 0;color:#333;">${data.notes}</td></tr>` : ""}
    </table>
  `);
}
