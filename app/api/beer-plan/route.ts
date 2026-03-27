import nodemailer from "nodemailer";

const RECIPIENT_EMAIL = "ege.bicakci54@gmail.com";

type BeerPlanPayload = {
  email?: string;
  phone?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: string) {
  return /^[+\d\s().-]{7,25}$/.test(value);
}

export async function POST(request: Request) {
  let payload: BeerPlanPayload;

  try {
    payload = (await request.json()) as BeerPlanPayload;
  } catch {
    return Response.json(
      { success: false, message: "Geçersiz istek verisi." },
      { status: 400 },
    );
  }

  const email = payload.email?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!email || !phone) {
    return Response.json(
      { success: false, message: "Mail ve telefon numarası zorunludur." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return Response.json(
      {
        success: false,
        field: "email",
        message: "Geçerli bir mail adresi girin.",
      },
      { status: 400 },
    );
  }

  if (!isValidPhone(phone)) {
    return Response.json(
      {
        success: false,
        field: "phone",
        message: "Geçerli bir telefon numarası girin.",
      },
      { status: 400 },
    );
  }

  const smtpUser = process.env.GMAIL_USER;
  const smtpPass = process.env.GMAIL_APP_PASSWORD;

  if (!smtpUser || !smtpPass) {
    return Response.json(
      {
        success: false,
        message:
          "Mail servisi henüz yapılandırılmamış. Vercel ortam değişkenlerini ekleyin.",
      },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Egebicakci Website" <${smtpUser}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: "Yeni bira planı talebi",
      text: [
        "Sitedeki şanslı çark formundan yeni bir talep geldi.",
        "",
        `Mail: ${email}`,
        `Telefon: ${phone}`,
        `Mesaj: ${message || "Yok"}`,
        `Tarih: ${new Date().toLocaleString("tr-TR", {
          timeZone: "Europe/Istanbul",
        })}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <h2>Yeni bira planı talebi</h2>
          <p>Sitedeki şanslı çark formundan yeni bir talep geldi.</p>
          <ul>
            <li><strong>Mail:</strong> ${email}</li>
            <li><strong>Telefon:</strong> ${phone}</li>
            <li><strong>Mesaj:</strong> ${message || "Yok"}</li>
            <li><strong>Tarih:</strong> ${new Date().toLocaleString("tr-TR", {
              timeZone: "Europe/Istanbul",
            })}</li>
          </ul>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Beer plan email failed", error);

    return Response.json(
      {
        success: false,
        message: "Form gönderilirken bir hata oluştu. Tekrar deneyin.",
      },
      { status: 500 },
    );
  }
}
