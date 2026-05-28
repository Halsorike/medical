import { Resend } from "resend";
import { env } from "@/lib/env";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

type OrderEmailInput = {
  orderId: string;
  to: string;
  items: unknown[];
  total: number;
  shippingAddress: Record<string, unknown>;
};

type AppointmentEmailInput = {
  to: string;
  patientName: string;
  date: string;
  slot: string;
  department: string;
  service: string;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatAddress(address: Record<string, unknown>) {
  const parts = [
    address.name,
    address.line1,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean);

  return parts.map(escapeHtml).join("<br />");
}

function renderItems(items: unknown[]) {
  if (items.length === 0) {
    return "<li>Order item details will be confirmed shortly.</li>";
  }

  return items
    .map((item) => {
      const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const name = escapeHtml(record.name ?? record.productName ?? record.productId ?? "Medical product");
      const qty = escapeHtml(record.qty ?? 1);
      const price = typeof record.price === "number" ? ` - ${formatCurrency(record.price)}` : "";
      return `<li>${name} x ${qty}${price}</li>`;
    })
    .join("");
}

export async function sendEmail({ to, subject, html }: EmailInput) {
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY is missing; skipped email to ${to}`);
    return { skipped: true };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    return { skipped: false };
  } catch (error) {
    console.warn("[email] Resend send failed; continuing without blocking request", error);
    return { skipped: true };
  }
}

export async function sendOrderConfirmationEmail({ orderId, to, items, total, shippingAddress }: OrderEmailInput) {
  return sendEmail({
    to,
    subject: `Order confirmation ${orderId}`,
    html: `
      <main>
        <h1>Order confirmation</h1>
        <p>Thank you for your order. We have received order <strong>${escapeHtml(orderId)}</strong>.</p>
        <h2>Items</h2>
        <ul>${renderItems(items)}</ul>
        <h2>Total</h2>
        <p><strong>${formatCurrency(total)}</strong></p>
        <h2>Shipping address</h2>
        <p>${formatAddress(shippingAddress)}</p>
      </main>
    `,
  });
}

export async function sendAppointmentConfirmationEmail({
  to,
  patientName,
  date,
  slot,
  department,
  service,
}: AppointmentEmailInput) {
  return sendEmail({
    to,
    subject: "Appointment confirmation",
    html: `
      <main>
        <h1>Appointment confirmation</h1>
        <p>Hello ${escapeHtml(patientName)}, your appointment has been received.</p>
        <ul>
          <li><strong>Date:</strong> ${escapeHtml(date)}</li>
          <li><strong>Time:</strong> ${escapeHtml(slot)}</li>
          <li><strong>Department:</strong> ${escapeHtml(department)}</li>
          <li><strong>Service:</strong> ${escapeHtml(service)}</li>
        </ul>
        <p><strong>Clinic address:</strong><br />123 Health Ave<br />Boston, MA 02115</p>
      </main>
    `,
  });
}
