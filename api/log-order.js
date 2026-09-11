
// Reenvía los datos de un pedido a la hoja de cálculo de Google Sheets, a través
// de un Apps Script Web App. Así, ni la URL del script ni el secreto compartido
// quedan expuestos en el navegador del cliente (solo este archivo, que corre en
// el servidor de Vercel, los conoce).
//
// Configura en Vercel -> Settings -> Environment Variables:
//   GOOGLE_SCRIPT_URL  = la URL de tu Apps Script Web App (termina en /exec)
//   ORDERS_SECRET      = un texto secreto inventado por ti (debe coincidir
//                        exactamente con SHARED_SECRET en el Apps Script)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const secret = process.env.ORDERS_SECRET;

    if (!scriptUrl || !secret) {
      res.status(500).json({ error: 'server_not_configured', message: 'Falta configurar GOOGLE_SCRIPT_URL y/o ORDERS_SECRET en Vercel.' });
      return;
    }

    const body = req.body || {};
    const payload = {
      secret: secret,
      orderId: String(body.orderId || '').slice(0, 60),
      metodoPago: String(body.metodoPago || '').slice(0, 60),
      nombre: String(body.nombre || '').slice(0, 120),
      telefono: String(body.telefono || '').slice(0, 40),
      ciudad: String(body.ciudad || '').slice(0, 80),
      direccion: String(body.direccion || '').slice(0, 200),
      notas: String(body.notas || '').slice(0, 300),
      productos: String(body.productos || '').slice(0, 500),
      total: String(body.total || '').slice(0, 30)
    };

    if (!payload.orderId || !payload.nombre) {
      res.status(400).json({ error: 'invalid_argument' });
      return;
    }

    const resp = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow'
    });

    if (!resp.ok) {
      res.status(502).json({ error: 'sheet_error' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'internal_error' });
  }
};
