// Genera la firma de integridad (hash) que exige Bold para bloquear el monto
// de un pago antes de mostrar el botón al cliente.
//
// Fórmula oficial de Bold: SHA256( orderId + amount + currency + LLAVE_SECRETA )
// La LLAVE_SECRETA nunca debe estar en el código ni en el navegador: vive
// únicamente como variable de entorno en Vercel (BOLD_SECRET_KEY).
//
// Configúrala en: Vercel -> tu proyecto -> Settings -> Environment Variables
//   Nombre:  BOLD_SECRET_KEY
//   Valor:   (la llave secreta que te da Bold al activar tus llaves de integración)

const crypto = require('crypto');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const secretKey = process.env.BOLD_SECRET_KEY;
    if (!secretKey) {
      res.status(500).json({ error: 'server_not_configured', message: 'Falta configurar BOLD_SECRET_KEY en Vercel.' });
      return;
    }

    const body = req.body || {};
    const orderId = String(body.orderId || '').trim();
    const amount = String(body.amount || '').trim();
    const currency = String(body.currency || 'COP').trim();

    if (!orderId || !amount || !/^[0-9]+$/.test(amount)) {
      res.status(400).json({ error: 'invalid_argument', message: 'orderId y amount (entero, sin decimales) son obligatorios.' });
      return;
    }

    const raw = orderId + amount + currency + secretKey;
    const signature = crypto.createHash('sha256').update(raw).digest('hex');

    res.status(200).json({ signature: signature, orderId: orderId, amount: amount, currency: currency });
  } catch (err) {
    res.status(500).json({ error: 'internal_error' });
  }
};
