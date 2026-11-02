import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\FORWARD\\.gemini\\antigravity-ide\\brain\\67f47163-ffae-4775-8664-49caa573c4a5';
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function run() {
  console.log('Launching browser with Edge...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('1. Loading store...');
  await page.goto('http://localhost:5173/?view=store', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_01_hero_header.png') });
  console.log('Saved roastify_01_hero_header.png');

  // Scroll to catalog
  console.log('2. Capturing catalog...');
  await page.evaluate(() => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_02_catalog.png') });
  console.log('Saved roastify_02_catalog.png');

  // Scroll to subscription
  console.log('3. Capturing subscription...');
  await page.evaluate(() => {
    const el = document.getElementById('suscripcion');
    if (el) el.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_03_subscription.png') });
  console.log('Saved roastify_03_subscription.png');

  // 4. Cart Drawer with Items
  console.log('4. Capturing cart drawer...');
  await page.evaluate(() => {
    localStorage.setItem('tueste_store_cart', JSON.stringify({
      items: [
        {
          id: 'PROD-05',
          name: 'Pack Degustación 3 Bolsas (Propuesta Comercial)',
          price: 48.00,
          quantity: 1,
          itemSubtotal: 48.00,
          qualifiesFreeShipping: true,
          weightGrams: 1020,
          bagsCount: 3
        }
      ],
      itemsCount: 1,
      subtotal: 48.00,
      shippingCost: 0,
      total: 48.00,
      freeShippingApplied: true,
      amountNeededForFreeShipping: 0
    }));
  });
  await page.goto('http://localhost:5173/?view=store&cart=open', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#proceed-to-checkout-btn', { visible: true, timeout: 5000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_04_cart_drawer.png') });
  console.log('Saved roastify_04_cart_drawer.png');

  // 5. Checkout Modal
  console.log('5. Capturing checkout modal...');
  await page.goto('http://localhost:5173/?view=store&checkout=open', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#checkout-name-input', { visible: true, timeout: 5000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_05_checkout_modal.png') });
  console.log('Saved roastify_05_checkout_modal.png');

  // 6. Order Receipt Modal
  console.log('6. Capturing order receipt modal...');
  await page.evaluate(() => {
    localStorage.setItem('tueste_store_orders', JSON.stringify([{
      orderId: 'TUE-2026-9842',
      createdAt: new Date().toISOString(),
      customer: {
        name: 'Valentina Morales',
        email: 'valentina@ejemplo.com',
        address: 'Av. Las Camelias 450, Piso 3',
        city: 'San José',
        phone: '+506 8888-9999'
      },
      items: [
        {
          id: 'PROD-05',
          name: 'Pack Degustación 3 Bolsas (Propuesta Comercial)',
          price: 48.00,
          quantity: 1,
          itemSubtotal: 48.00
        }
      ],
      totals: {
        subtotal: 48.00,
        shippingCost: 0,
        total: 48.00,
        freeShippingApplied: true
      },
      payment: {
        method: 'Tarjeta de Crédito Demo',
        brand: 'Visa Demo',
        last4: '4242',
        status: 'APPROVED',
        authorizationCode: 'AUTH-DEMO-847291'
      },
      status: 'CONFIRMED'
    }]));
  });
  await page.goto('http://localhost:5173/?view=store&receipt=open', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#receipt-close-btn', { visible: true, timeout: 5000 });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_06_order_receipt.png') });
  console.log('Saved roastify_06_order_receipt.png');

  // 7. Mobile Viewport
  console.log('7. Capturing mobile view...');
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:5173/?view=store', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_07_mobile_view.png') });
  console.log('Saved roastify_07_mobile_view.png');

  // 8. Admin Dashboard Intact (AURA ROAST)
  console.log('8. Capturing admin dashboard...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?view=admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'roastify_08_admin_dashboard_intact.png') });
  console.log('Saved roastify_08_admin_dashboard_intact.png');

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('ERROR in capture script:', err);
  process.exit(1);
});
