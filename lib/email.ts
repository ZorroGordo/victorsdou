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
}): Promise<{ ok: boolean; error?: string; messageId?: string }> {
  const toAddresses = Array.isArray(opts.to) ? opts.to : [opts.to];
  if (!toAddresses.length) return { ok: false, error: "No recipients" };

  const ses = getSES();
  if (!ses) {
    const msg = `No AWS SES credentials (AWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID ? "set" : "missing"}, AWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY ? "set" : "missing"})`;
    return { ok: false, error: msg };
  }

  const from = process.env.SES_FROM_EMAIL ?? "Victorsdou <hola@victorsdou.pe>";
  const ts = new Date().toISOString();
  console.log(`[SES ${ts}] Sending email | from=${from} | to=${toAddresses.join(",")} | subject="${opts.subject}"`);
  try {
    const result = await ses.send(
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
    const messageId = result.MessageId ?? "unknown";
    console.log(`[SES ${ts}] ✓ Email sent | messageId=${messageId} | to=${toAddresses.join(",")}`);
    return { ok: true, messageId };
  } catch (err: any) {
    const errMsg = err?.message ?? String(err);
    const errCode = err?.name ?? err?.Code ?? "UnknownError";
    console.error(`[SES ${ts}] ✗ Email FAILED | error=${errCode}: ${errMsg} | to=${toAddresses.join(",")}`);
    return { ok: false, error: `SES error (${errCode}): ${errMsg}` };
  }
}

// ── Brand constants ───────────────────────────────────────────────────────
const BRAND = {
  green: "#2D6A4F",
  greenLight: "#4A9158",
  cream: "#F5F0E8",
  creamDark: "#EDE9E1",
  charcoal: "#1A1A1A",
  gold: "#D4A574",
  text: "#333333",
  muted: "#888888",
  white: "#FFFFFF",
  logoUrl: "https://victorsdou.pe/images/logo.svg",
};

// ── Brand wrapper (customer-facing) ───────────────────────────────────────
const wrapCustomer = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.cream};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <!-- Header with logo -->
        <tr>
          <td style="background:${BRAND.charcoal};padding:32px 32px 28px;text-align:center;">
            <img src="${BRAND.logoUrl}" alt="Victorsdou" width="180" style="width:180px;height:auto;margin-bottom:8px;" />
            <p style="margin:0;color:${BRAND.gold};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'DM Sans',Arial,Helvetica,sans-serif;">Pan de masa madre artesanal</p>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:32px 32px 16px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;text-align:center;border-top:1px solid ${BRAND.creamDark};">
            <p style="margin:0 0 8px;font-family:'DM Sans',Arial,sans-serif;font-size:12px;color:${BRAND.muted};">
              Victorsdou · Lima, Peru
            </p>
            <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:12px;">
              <a href="https://victorsdou.pe" style="color:${BRAND.green};text-decoration:none;">victorsdou.pe</a>
              <span style="color:#ccc;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <a href="https://wa.me/51944200333" style="color:${BRAND.green};text-decoration:none;">WhatsApp</a>
              <span style="color:#ccc;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
              <a href="https://www.instagram.com/victorsdou/" style="color:${BRAND.green};text-decoration:none;">Instagram</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Brand wrapper (team/internal) ─────────────────────────────────────────
const wrapTeam = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'DM Sans',Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">
        <!-- Header -->
        <tr>
          <td style="background:${BRAND.green};padding:20px 32px;text-align:left;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <img src="${BRAND.logoUrl}" alt="Victorsdou" width="120" style="width:120px;height:auto;" />
                </td>
                <td style="text-align:right;vertical-align:middle;">
                  <p style="margin:0;color:rgba(255,255,255,.8);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Notificacion interna</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Content -->
        <tr><td style="padding:28px 32px 16px;">${content}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:${BRAND.muted};">
              Este email fue generado automaticamente por victorsdou.pe
              <span style="color:#ccc;">&nbsp;·&nbsp;</span>
              <a href="https://erp-rpjk.vercel.app" style="color:${BRAND.green};text-decoration:none;">Abrir ERP</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Helper: format date in Spanish ────────────────────────────────────────
function formatDeliveryDate(dateStr?: string, timeRange?: string): string {
  if (!dateStr) return "\u2014";
  const parts = dateStr.split("-");
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const line = d.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (timeRange === "12:00 - 17:00") return line + " \u00b7 12:00 \u2013 5:00 PM";
  if (timeRange === "8:00 - 12:00") return line + " \u00b7 8:00 AM \u2013 12:00 PM";
  if (timeRange) return line + " \u00b7 " + timeRange;
  return line;
}

// ── Helper: format address ────────────────────────────────────────────────
function formatAddress(addr?: { street?: string; district?: string; city?: string; reference?: string }): string {
  if (!addr || !addr.street) return "\u2014";
  let line = addr.street;
  if (addr.district) line += ", " + addr.district;
  if (addr.city && addr.city !== "Lima") line += ", " + addr.city;
  if (addr.reference) line += " (" + addr.reference + ")";
  return line;
}

// ── Shared types ──────────────────────────────────────────────────────────
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

// ── Helper: IGV breakdown ─────────────────────────────────────────────────
// All customer-facing amounts (products + delivery) include IGV in Peru.
// This extracts the base (valor de venta) and tax from an IGV-inclusive amount.
function igv(amountInclIgv: number) {
  const base = amountInclIgv / 1.18;
  const tax = amountInclIgv - base;
  return { base, tax };
}

// ── Email 1: Customer order confirmation ──────────────────────────────────
export function buildCustomerConfirmationEmail(data: OrderEmailData): string {
  const rows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.creamDark};color:${BRAND.text};font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${i.name}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.creamDark};text-align:center;color:#666;font-size:14px;font-family:'DM Sans',Arial,sans-serif;">${i.quantity}</td>
      <td style="padding:12px 0;border-bottom:1px solid ${BRAND.creamDark};text-align:right;color:${BRAND.text};font-size:14px;font-family:'DM Sans',Arial,sans-serif;">S/ ${(i.unitPrice * i.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  // IGV applies to the full total (products + delivery) — all Peru consumer prices include IGV
  const { base: totalBase, tax: totalTax } = igv(data.total);
  const deliveryLine = formatDeliveryDate(data.deliveryDate, data.deliveryTimeRange);
  const addrLine = formatAddress(data.address);

  return wrapCustomer(`
    <h2 style="margin:0 0 6px;color:${BRAND.charcoal};font-size:24px;font-weight:normal;">\u00a1Gracias por tu pedido!</h2>
    <p style="margin:0 0 28px;color:#666;font-family:'DM Sans',Arial,sans-serif;font-size:14px;line-height:1.5;">
      Hemos recibido tu pedido y el pago fue procesado exitosamente. Te enviaremos un mensaje por WhatsApp cuando tu pedido este en camino.
    </p>

    <!-- Order number badge -->
    <div style="background:${BRAND.cream};border-radius:8px;padding:16px 20px;margin-bottom:28px;border-left:4px solid ${BRAND.gold};">
      <p style="margin:0;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;">Pedido</p>
      <p style="margin:4px 0 0;font-size:20px;color:${BRAND.charcoal};font-weight:bold;font-family:'DM Sans',Arial,sans-serif;">#${data.orderId.slice(-8).toUpperCase()}</p>
    </div>

    <!-- Items table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;">
      <thead>
        <tr>
          <th style="padding:10px 0;text-align:left;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid ${BRAND.creamDark};">Producto</th>
          <th style="padding:10px 0;text-align:center;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid ${BRAND.creamDark};">Cant.</th>
          <th style="padding:10px 0;text-align:right;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;border-bottom:2px solid ${BRAND.creamDark};">Precio</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Totals with IGV breakdown -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;font-family:'DM Sans',Arial,sans-serif;">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#999;">Productos</td>
        <td style="padding:4px 0;font-size:13px;color:#999;text-align:right;">S/ ${data.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#999;">Delivery</td>
        <td style="padding:4px 0;font-size:13px;color:#999;text-align:right;">S/ ${data.deliveryFee.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:1px solid ${BRAND.creamDark};margin:8px 0;"></div></td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:1px solid ${BRAND.creamDark};margin:6px 0;"></div></td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:13px;color:#999;">Valor de venta</td>
        <td style="padding:3px 0;font-size:13px;color:#999;text-align:right;">S/ ${totalBase.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:13px;color:#999;">IGV (18%)</td>
        <td style="padding:3px 0;font-size:13px;color:#999;text-align:right;">S/ ${totalTax.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:2px solid ${BRAND.creamDark};margin:6px 0;"></div></td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:16px;color:${BRAND.charcoal};font-weight:bold;">Total pagado</td>
        <td style="padding:4px 0;font-size:16px;color:${BRAND.charcoal};font-weight:bold;text-align:right;">S/ ${data.total.toFixed(2)}</td>
      </tr>
    </table>

    <!-- Delivery details -->
    <div style="background:${BRAND.cream};border-radius:8px;padding:20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:24px;vertical-align:top;padding-right:12px;">
            <div style="width:20px;height:20px;background:${BRAND.green};border-radius:50%;text-align:center;line-height:20px;color:#fff;font-size:11px;">&#x2713;</div>
          </td>
          <td style="vertical-align:top;">
            <p style="margin:0 0 4px;font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;">Entrega programada</p>
            <p style="margin:0 0 2px;font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:${BRAND.charcoal};font-weight:600;">${deliveryLine}</p>
            <p style="margin:4px 0 0;font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#666;">${addrLine}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- WhatsApp CTA -->
    <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#666;margin-bottom:24px;line-height:1.5;">
      Si tienes alguna pregunta sobre tu pedido, escribenos por
      <a href="https://wa.me/51944200333" style="color:${BRAND.green};font-weight:600;text-decoration:none;">WhatsApp</a>.
    </p>

    <!-- CTA button -->
    <div style="text-align:center;padding-bottom:8px;">
      <a href="https://victorsdou.pe/tienda"
         style="display:inline-block;background:${BRAND.green};color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:1px;">
        Seguir comprando
      </a>
    </div>
  `);
}

// ── Email 2: Team notification (new order received) ───────────────────────
export function buildTeamNotificationEmail(data: OrderEmailData): string {
  const rows = data.items
    .map(
      (i) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;font-size:14px;">${i.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:center;font-size:14px;">${i.quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;white-space:nowrap;">S/ ${i.unitPrice.toFixed(2)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f0f0f0;text-align:right;font-size:14px;font-weight:600;white-space:nowrap;">S/ ${(i.unitPrice * i.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  const { base: totalBase, tax: totalTax } = igv(data.total);
  const deliveryLine = formatDeliveryDate(data.deliveryDate, data.deliveryTimeRange);
  const addrLine = formatAddress(data.address);

  const invoiceInfo =
    data.invoiceType === "factura"
      ? `<span style="background:#e8f0fe;color:#1a73e8;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;">FACTURA</span> RUC: ${data.ruc || "\u2014"} \u00b7 ${data.razonSocial || "\u2014"}`
      : `<span style="background:#fef3e0;color:#e67e22;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600;">BOLETA</span> DNI: ${data.dni || "\u2014"}`;

  return wrapTeam(`
    <!-- Alert banner -->
    <div style="background:#f0f9f4;border:1px solid #c3e6cb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="width:36px;vertical-align:top;">
            <div style="width:32px;height:32px;background:${BRAND.green};border-radius:50%;text-align:center;line-height:32px;color:#fff;font-size:16px;">$</div>
          </td>
          <td style="padding-left:12px;vertical-align:middle;">
            <p style="margin:0;font-size:18px;color:${BRAND.charcoal};font-weight:700;">Nuevo pedido recibido</p>
            <p style="margin:2px 0 0;font-size:13px;color:#666;">Pedido <strong>#${data.orderId.slice(-8).toUpperCase()}</strong> \u00b7 ${new Date().toLocaleString("es-PE", { timeZone: "America/Lima" })}</p>
          </td>
          <td style="text-align:right;vertical-align:middle;">
            <p style="margin:0;font-size:22px;color:${BRAND.green};font-weight:700;">S/ ${data.total.toFixed(2)}</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- Two-column: Customer + Delivery -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="width:50%;vertical-align:top;padding-right:12px;">
          <p style="margin:0 0 8px;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;font-weight:600;">Cliente</p>
          <p style="margin:0 0 4px;font-size:15px;color:${BRAND.charcoal};font-weight:600;">${data.customerName}</p>
          <p style="margin:0 0 2px;font-size:13px;color:#666;"><a href="mailto:${data.customerEmail}" style="color:${BRAND.green};text-decoration:none;">${data.customerEmail}</a></p>
          <p style="margin:0 0 2px;font-size:13px;color:#666;"><a href="tel:${data.customerPhone || ''}" style="color:${BRAND.green};text-decoration:none;">${data.customerPhone || "\u2014"}</a></p>
          <p style="margin:8px 0 0;font-size:13px;color:#666;">${invoiceInfo}</p>
        </td>
        <td style="width:50%;vertical-align:top;padding-left:12px;border-left:1px solid #eee;">
          <p style="margin:0 0 8px;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;font-weight:600;">Entrega</p>
          <p style="margin:0 0 4px;font-size:15px;color:${BRAND.charcoal};font-weight:600;">${deliveryLine}</p>
          <p style="margin:0 0 2px;font-size:13px;color:#666;">${addrLine}</p>
          ${data.notes ? `<p style="margin:8px 0 0;font-size:13px;color:#666;background:#fff8e1;padding:6px 10px;border-radius:4px;border-left:3px solid #ffc107;"><strong>Nota:</strong> ${data.notes}</p>` : ""}
        </td>
      </tr>
    </table>

    <!-- Items table -->
    <p style="margin:0 0 8px;font-size:11px;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;font-weight:600;">Productos</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:4px;border:1px solid #eee;border-radius:8px;overflow:hidden;">
      <thead>
        <tr style="background:#fafafa;">
          <th style="padding:10px 12px;text-align:left;font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Producto</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Cant.</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">P/U</th>
          <th style="padding:10px 12px;text-align:right;font-size:11px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:1px;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Totals -->
    <table width="280" cellpadding="0" cellspacing="0" align="right" style="margin-bottom:24px;">
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#999;">Productos</td>
        <td style="padding:4px 0;font-size:13px;color:#999;text-align:right;">S/ ${data.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#999;">Delivery</td>
        <td style="padding:4px 0;font-size:13px;color:#999;text-align:right;">S/ ${data.deliveryFee.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:1px solid #eee;margin:4px 0;"></div></td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:13px;color:#999;">Valor de venta</td>
        <td style="padding:3px 0;font-size:13px;color:#999;text-align:right;">S/ ${totalBase.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding:3px 0;font-size:13px;color:#999;">IGV (18%)</td>
        <td style="padding:3px 0;font-size:13px;color:#999;text-align:right;">S/ ${totalTax.toFixed(2)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:2px solid ${BRAND.green};margin:6px 0;"></div></td>
      </tr>
      <tr>
        <td style="padding:4px 0;font-size:16px;color:${BRAND.charcoal};font-weight:bold;">Total</td>
        <td style="padding:4px 0;font-size:16px;color:${BRAND.charcoal};font-weight:bold;text-align:right;">S/ ${data.total.toFixed(2)}</td>
      </tr>
    </table>
    <div style="clear:both;"></div>

    <!-- Action button -->
    <div style="text-align:center;padding:8px 0 4px;">
      <a href="https://erp-rpjk.vercel.app"
         style="display:inline-block;background:${BRAND.green};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
        Ver pedido en ERP
      </a>
    </div>
  `);
}
