
import puppeteer from 'puppeteer';

const handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const data = req.body;

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body { font-family: sans-serif; padding: 20px; }
    .header { text-align: center; }
    .title { font-weight: bold; font-size: 20px; margin-top: 10px; }
    .section-title { font-weight: bold; margin-top: 10px; }
    .red { color: red; }
  </style></head><body>
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_BASE_URL || ''}/logo.png" style="max-width:200px;" />
      <div>Gold Tile Inc. | (857) 417-1357 | gold.tile@outlook.com</div>
      <div>12 Kendall Ave #9, Framingham, MA 01702</div>
      <div class="title">Work Order / Pricing Agreement</div>
      <div>Customer / Project: ${data.customer}</div>
    </div>

    ${data.rooms.map(room => `
      <div class="section-title">${room}:</div>
      <ul>${(data.services[room] || []).map(s => `<li>${s}</li>`).join('')}</ul>
    `).join('')}

    <div class="section-title">Total: $${data.price}</div>
    <p>${data.description}</p>

    <div class="section-title">Certificate of Agreement</div>
    <p>I hereby certify I will supply all the material for this project. I hereby acknowledge this satisfactory completion of the described work and agree with the total price. I am aware that any change in the work order might affect the total price.</p>

    <div class="red">
      <ul>
        <li>50% deposit upon order placement to begin the project.</li>
        <li>25% payment upon completion of preparation work.</li>
        <li>Remaining 25% balance upon final project completion.</li>
      </ul>
    </div>
  </body></html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4' });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=workorder.pdf');
  res.end(pdf);
};

export default handler;
