import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailData {
  name:       string
  email:      string
  country:    string
  phone:      string
  whatsapp:   boolean
  viber:      boolean
  date:       string
  time:       string
  weight:     number
  bmi:        number
  bmiCat:     string
  bodyFat:    number
  leanMass:   number
  fatToLose:  number
  waist:      number
  whr:        number
  m2Weight:   number
  m2Waist:    number
  pdfUrl:     string
  dashUrl:    string
}

export async function sendReportEmail(data: EmailData) {
  const firstName = data.name.split(' ')[0]
  const protein1  = Math.round(data.weight * 1.8)
  const protein2  = Math.round(data.weight * 2.0)

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>Your Body Analytics Report</title>
</head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:40px 16px">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.1)">

  <!-- HEADER BAND -->
  <tr>
    <td style="background:linear-gradient(135deg,#d63a1a,#e87a20);padding:36px 40px">
      <div style="font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:8px">
        Body Analytics · Month 1 Baseline
      </div>
      <div style="font-size:34px;font-weight:800;color:#ffffff;text-transform:uppercase;line-height:1;letter-spacing:-0.5px;margin-bottom:6px">
        ${data.name}
      </div>
      <div style="font-size:13px;color:rgba(255,255,255,0.85)">
        ${data.date} &nbsp;·&nbsp; ${data.time} &nbsp;·&nbsp; ${data.country}
      </div>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="background:#ffffff;padding:36px 40px">

      <!-- Greeting -->
      <p style="font-size:18px;font-weight:700;color:#1c1810;margin:0 0 10px">Hey ${firstName}! 👋</p>
      <p style="font-size:14px;color:#6b7280;line-height:1.75;margin:0 0 8px">
        Your Month 1 body measurements have been recorded and your personalised fitness dashboard is ready. Here's your health snapshot:
      </p>
      ${data.phone ? `
      <p style="font-size:12px;color:#9ca3af;margin:0 0 24px;display:flex;align-items:center;gap:8px">
        📱 ${data.phone}
        ${data.whatsapp ? '<span style="background:#dcfce7;color:#16a34a;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:700;margin-left:6px">💬 WhatsApp</span>' : ''}
        ${data.viber    ? '<span style="background:#ede9fe;color:#7c3aed;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:700;margin-left:6px">📲 Viber</span>'    : ''}
      </p>` : '<div style="margin-bottom:24px"></div>'}

      <!-- Metrics grid -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
        <tr>
          <td width="22%" style="background:#fff1f0;border-radius:12px;padding:16px 12px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#d63a1a;margin-bottom:6px">BMI</div>
            <div style="font-size:28px;font-weight:800;color:#d63a1a;line-height:1">${data.bmi}</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:4px">${data.bmiCat}</div>
          </td>
          <td width="4%"></td>
          <td width="22%" style="background:#fff7ed;border-radius:12px;padding:16px 12px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#e87a20;margin-bottom:6px">Body Fat</div>
            <div style="font-size:28px;font-weight:800;color:#e87a20;line-height:1">${data.bodyFat}%</div>
            <div style="font-size:10px;color:#9ca3af;margin-top:4px">Navy Method</div>
          </td>
          <td width="4%"></td>
          <td width="22%" style="background:#f0fdf4;border-radius:12px;padding:16px 12px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#16a34a;margin-bottom:6px">Lean Mass</div>
            <div style="font-size:28px;font-weight:800;color:#16a34a;line-height:1">${data.leanMass}<span style="font-size:14px">kg</span></div>
            <div style="font-size:10px;color:#9ca3af;margin-top:4px">Strong Base ✓</div>
          </td>
          <td width="4%"></td>
          <td width="22%" style="background:#eff6ff;border-radius:12px;padding:16px 12px;text-align:center">
            <div style="font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1d4ed8;margin-bottom:6px">To Lose</div>
            <div style="font-size:28px;font-weight:800;color:#1d4ed8;line-height:1">~${data.fatToLose}<span style="font-size:14px">kg</span></div>
            <div style="font-size:10px;color:#9ca3af;margin-top:4px">To ideal</div>
          </td>
        </tr>
      </table>

      <!-- Month 2 targets -->
      <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:28px">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6b7280;margin-bottom:14px">
          Month 2 Targets
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${[
            ['Weight',   `${data.weight} kg`,  `${data.m2Weight} kg`],
            ['Waist',    `${data.waist}"`,       `${data.m2Waist}"`],
            ['WHR',      `${data.whr}`,          `${(data.whr - 0.03).toFixed(2)}`],
            ['BMI',      `${data.bmi}`,          `${(data.bmi - 1.1).toFixed(1)}`],
            ['Body Fat', `${data.bodyFat}%`,     `${(data.bodyFat - 2).toFixed(1)}%`],
          ].map(([n,c,t], i) => `
          <tr style="border-bottom:${i < 4 ? '1px solid #e5e7eb' : 'none'}">
            <td style="padding:8px 0;font-size:13px;font-weight:600;color:#374151;width:35%">${n}</td>
            <td style="padding:8px 0;font-size:13px;color:#d63a1a;font-weight:700;width:30%;text-align:center">${c}</td>
            <td style="padding:8px 0;font-size:16px;color:#d1d5db;width:5%;text-align:center">→</td>
            <td style="padding:8px 0;font-size:13px;color:#16a34a;font-weight:800;width:30%;text-align:center">${t}</td>
          </tr>`).join('')}
        </table>
      </div>

      <!-- Action plan snippet -->
      <div style="background:#1c1810;border-radius:12px;padding:20px;margin-bottom:28px">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#f97316;margin-bottom:12px">Month 2 Action Plan</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.9">
          <span style="color:#86efac;font-weight:700">Training:</span> 3× compound strength + 2× cardio per week<br>
          <span style="color:#86efac;font-weight:700">Protein:</span> ${protein1}–${protein2}g/day · ~500 kcal daily deficit<br>
          <span style="color:#86efac;font-weight:700">Priority:</span> Reduce waist to ${data.m2Waist}" · WHR below 0.87
        </div>
      </div>

      <!-- CTA Buttons -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="48%" align="center">
            <a href="${data.dashUrl}"
               style="display:block;background:linear-gradient(135deg,#d63a1a,#e87a20);color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 24px;border-radius:10px;letter-spacing:0.3px">
              📊 View Dashboard
            </a>
          </td>
          <td width="4%"></td>
          <td width="48%" align="center">
            <a href="${data.pdfUrl}"
               style="display:block;background:#1c1810;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 24px;border-radius:10px;letter-spacing:0.3px">
              📄 Download PDF
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb">
      <div style="font-size:11px;color:#9ca3af;line-height:1.7">
        Body Analytics System &nbsp;·&nbsp; Auto-generated report<br>
        BMI and body fat % are estimates via the Navy Circumference Method (kg/m²)<br>
        <em>Consult a healthcare professional before starting any new programme</em>
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`

  await transporter.sendMail({
    from:    `"${process.env.SENDER_NAME || 'Body Analytics'}" <${process.env.SMTP_USER}>`,
    to:      data.email,
    subject: `Your Body Analytics Report — ${data.name}`,
    html,
  })
}
