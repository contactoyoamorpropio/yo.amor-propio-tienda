# Tienda YO Amor Propio

Sitio estático (index.html) + una función serverless (api/bold-signature.js)
que firma los pagos en línea con Bold. Pensado para desplegarse en Vercel.

## Qué hay aquí

- `index.html` — la tienda completa: catálogo, carrito, checkout, WhatsApp y (cuando esté configurado) pago en línea con Bold.
- `logo.jpg`, `product-1.jpg` a `product-5.jpg` — imágenes del catálogo.
- `api/bold-signature.js` — genera la firma de integridad que exige Bold antes de mostrar el botón de pago, sin exponer la llave secreta en el navegador.

## Activar el pago en línea con Bold

1. Abre tu Cuenta Bold en bold.co y activa "Llaves de integración -> API pagos en línea" (Bold revisa la solicitud y te entrega una llave de identidad y una llave secreta).
2. En Vercel: Project Settings -> Environment Variables -> agrega `BOLD_SECRET_KEY` con el valor de tu llave secreta. Nunca la pegues en el código.
3. En `index.html`, busca la línea `var BOLD_API_KEY = "";` (dentro del `<script>` final) y pon ahí tu llave de identidad (esa sí es pública). Vuelve a desplegar.
4. Con eso el botón "Pagar en línea ahora" aparece automáticamente en el checkout. Antes de esto, la tienda funciona igual pero solo con el pago manual + WhatsApp.
5. Prueba primero con las llaves de pruebas (sandbox) que te da Bold antes de pasar a producción.

## Desplegar cambios

Con Vercel CLI instalado y la sesión iniciada:

```
vercel        # despliega una vista previa
vercel --prod # publica en el dominio de producción
```
