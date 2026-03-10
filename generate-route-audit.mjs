import PDFDocument from "pdfkit";
import fs from "fs";

const doc = new PDFDocument({ margin: 50, size: "A4" });
const stream = fs.createWriteStream("client/public/nxcar-route-audit.pdf");
doc.pipe(stream);

const TEAL = "#4BA8A0";
const RED = "#E74C3C";
const GREEN = "#27AE60";
const ORANGE = "#F39C12";
const GRAY = "#7F8C8D";
const DARK = "#2C3E50";

function title(text) {
  doc.fontSize(22).font("Helvetica-Bold").fillColor(TEAL).text(text, { align: "center" });
  doc.moveDown(0.3);
}

function subtitle(text) {
  doc.fontSize(10).font("Helvetica").fillColor(GRAY).text(text, { align: "center" });
  doc.moveDown(1);
}

function sectionHeader(text, color = DARK) {
  doc.moveDown(0.5);
  doc.fontSize(14).font("Helvetica-Bold").fillColor(color).text(text);
  doc.moveDown(0.3);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(color).lineWidth(1).stroke();
  doc.moveDown(0.5);
}

function tableRow(cols, widths, opts = {}) {
  const startY = doc.y;
  const font = opts.bold ? "Helvetica-Bold" : "Helvetica";
  const size = opts.size || 9;
  const color = opts.color || DARK;
  
  let maxH = 0;
  cols.forEach((col, i) => {
    const x = 50 + widths.slice(0, i).reduce((a, b) => a + b, 0);
    const cellColor = opts.colors ? (opts.colors[i] || color) : color;
    doc.font(font).fontSize(size).fillColor(cellColor);
    const h = doc.heightOfString(col, { width: widths[i] - 5 });
    if (h > maxH) maxH = h;
  });
  
  if (startY + maxH + 5 > doc.page.height - 60) {
    doc.addPage();
  }
  
  const y = doc.y;
  cols.forEach((col, i) => {
    const x = 50 + widths.slice(0, i).reduce((a, b) => a + b, 0);
    const cellColor = opts.colors ? (opts.colors[i] || color) : color;
    doc.font(font).fontSize(size).fillColor(cellColor).text(col, x, y, { width: widths[i] - 5 });
  });
  doc.y = y + maxH + 4;
}

function divider() {
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor("#E0E0E0").lineWidth(0.5).stroke();
  doc.moveDown(0.2);
}

// ==================== PAGE 1: TITLE ====================
title("Nxcar Route Audit Report");
subtitle("Generated: February 20, 2026 | Full comparison of nxcar.in routes vs our build");
doc.moveDown(1);

// Summary boxes
const completed = 32;
const missing = 10;
const notUseful = 14;
const total = 56;

doc.fontSize(11).font("Helvetica").fillColor(DARK).text("Summary", { align: "center" });
doc.moveDown(0.5);

const boxW = 110;
const boxH = 50;
const startX = 75;
const boxY = doc.y;

[[`${completed} COMPLETED`, GREEN], [`${missing} MISSING`, RED], [`${notUseful} NOT USEFUL`, ORANGE], [`${total} TOTAL`, TEAL]].forEach(([label, color], i) => {
  const x = startX + i * (boxW + 15);
  doc.roundedRect(x, boxY, boxW, boxH, 5).fillAndStroke(color, color);
  doc.fontSize(13).font("Helvetica-Bold").fillColor("white").text(label, x, boxY + 18, { width: boxW, align: "center" });
});

doc.y = boxY + boxH + 30;

// ==================== SECTION 1: COMPLETED ====================
sectionHeader(`COMPLETED ROUTES (${completed})`, GREEN);

const W = [30, 200, 185, 80];
tableRow(["#", "Route Path", "Description", "Status"], W, { bold: true, color: TEAL });
divider();

const completedRoutes = [
  ["/", "Homepage", "Done"],
  ["/about", "About page", "Done"],
  ["/used-car-loan", "Used car loan page", "Done"],
  ["/used-car-loan/eligibility", "Loan eligibility checker", "Done"],
  ["/calculator", "EMI calculator", "Done"],
  ["/car-services", "Car services page", "Done"],
  ["/partner", "Channel partner page", "Done"],
  ["/contact-us", "Contact us page", "Done"],
  ["/:filters", "City filter listing (e.g. /new-delhi)", "Done"],
  ["/sell-used-cars", "Sell car page (alias)", "Done"],
  ["/sell-car-edit/:vehicle_id", "Edit car listing", "Done"],
  ["/used-car-in/:city/:make/:model/:variant", "Car detail redirect (with ID extraction)", "Done"],
  ["/my-cars", "My cars page", "Done"],
  ["/my-transactions", "Transactions page (protected)", "Done"],
  ["/profile-edit", "Profile edit (protected)", "Done"],
  ["/blogs-of-nxcar", "Blog listing page", "Done"],
  ["/blogs-of-nxcar/:slug/:id", "Blog detail page", "Done"],
  ["/list-your-car", "List your car (alias to sell)", "Done"],
  ["/faq", "FAQ page", "Done"],
  ["/privacy-policy", "Privacy policy", "Done"],
  ["/terms-of-use", "Terms of use (alias)", "Done"],
  ["/grievance-policy", "Grievance policy", "Done"],
  ["/insurance-check", "Insurance check", "Done"],
  ["/challan-check", "Challan check", "Done"],
  ["/rc-check", "RC check", "Done"],
  ["/rc-details", "RC report page", "Done"],
  ["/carscope", "DriveAway inspection", "Done"],
  ["/carscope/:vehicleNumber", "DriveAway with vehicle", "Done"],
  ["/used-car-dealers-in/:city/:dealer", "Dealer detail page", "Done"],
  ["/login", "Login page", "Done"],
  ["/otp", "OTP page (redirects to login)", "Done"],
  ["*", "404 catch-all", "Done"],
];

completedRoutes.forEach(([path, desc, status], i) => {
  tableRow([`${i + 1}`, path, desc, status], W, { colors: [GRAY, DARK, DARK, GREEN] });
  if (i < completedRoutes.length - 1) divider();
});

// ==================== SECTION 2: MISSING ====================
doc.addPage();
sectionHeader(`MISSING ROUTES — USEFUL TO ADD (${missing})`, RED);

const W2 = [30, 200, 180, 85];
tableRow(["#", "Route Path", "Description", "Priority"], W2, { bold: true, color: TEAL });
divider();

const missingRoutes = [
  ["/sell-used-cars-gurugram", "City-specific sell page (Gurugram)", "Medium"],
  ["/sell-form-submitted", "Post-submit confirmation page", "High"],
  ["/refer-to-friend", "Referral program page", "Medium"],
  ["/web-inspection-booked/:id", "Inspection booking confirmation", "Medium"],
  ["/service-partner", "Service partner page (different from /partner)", "Low"],
  ["/nxcar-extended-warranty-terms-and-conditions", "Extended warranty T&C", "Low"],
  ["/otp-is-submitted", "OTP submitted confirmation", "Low"],
  ["/challan-check-panel", "Challan admin panel (protected)", "Medium"],
  ["/used-car-dealers-in-/:city/:url", "Dealer page (alternate URL pattern)", "Low"],
  ["/used-car-dealers-in/:city?/", "Become partner via dealer page", "Low"],
];

missingRoutes.forEach(([path, desc, priority], i) => {
  const prioColor = priority === "High" ? RED : priority === "Medium" ? ORANGE : GRAY;
  tableRow([`${i + 1}`, path, desc, priority], W2, { colors: [GRAY, DARK, DARK, prioColor] });
  if (i < missingRoutes.length - 1) divider();
});

doc.moveDown(1);
doc.fontSize(10).font("Helvetica-Bold").fillColor(RED).text("Recommended next steps:");
doc.fontSize(9).font("Helvetica").fillColor(DARK);
doc.text("1. /sell-form-submitted — Show a success page after sell form is submitted (High priority)");
doc.text("2. /sell-used-cars-gurugram — City-specific sell landing page for Gurugram market");
doc.text("3. /refer-to-friend — Referral/invite program page");
doc.text("4. /web-inspection-booked/:id — Confirmation after booking a CarScope inspection");
doc.text("5. /challan-check-panel — Protected admin panel for challan management");

// ==================== SECTION 3: NOT USEFUL ====================
doc.addPage();
sectionHeader(`NOT USEFUL / INTERNAL ROUTES (${notUseful})`, ORANGE);

const W3 = [30, 210, 175, 80];
tableRow(["#", "Route Path", "Description", "Reason"], W3, { bold: true, color: TEAL });
divider();

const notUsefulRoutes = [
  ["/test", "Testing page", "Dev/internal only"],
  ["/jarvis", "Jarvis internal tool", "Internal tool"],
  ["/nxcar-t3rms-8$d-m$rv$pe", "Obfuscated terms of service", "Security-through-obscurity"],
  ["/p1rtn5rs-@ccou5t", "Obfuscated account deletion", "Security-through-obscurity"],
  ["/app_qr", "App QR code display", "Mobile app promo only"],
  ["/nxcar-p1rtn5rs-pr1va3y-poli3y", "Obfuscated app privacy policy", "Security-through-obscurity"],
  ["/nxcar-ipl-gameplay-poli3y", "IPL gameplay policy", "Seasonal/campaign"],
  ["/nxcar-ipl-gameplay-poli3y'", "IPL policy (typo duplicate)", "Broken route"],
  ["/redirect", "Generic redirect handler", "Internal utility"],
  ["/nxcar-listing-app", "Listing app QR page", "Mobile app promo only"],
  ["/nxcar-download", "App download redirect", "Mobile app promo only"],
  ["/nxcar-qr-generator", "QR code builder tool", "Internal tool"],
  ["/dealerqr/:id", "Dealer QR page", "Internal/QR only"],
  ["/used-car-dealers-in/:city?/", "Become partner (query param)", "Duplicate of /partner"],
];

notUsefulRoutes.forEach(([path, desc, reason], i) => {
  tableRow([`${i + 1}`, path, desc, reason], W3, { colors: [GRAY, DARK, DARK, ORANGE] });
  if (i < notUsefulRoutes.length - 1) divider();
});

doc.moveDown(1);
doc.fontSize(10).font("Helvetica-Bold").fillColor(ORANGE).text("Why these are not useful:");
doc.fontSize(9).font("Helvetica").fillColor(DARK);
doc.text("• /test, /jarvis — Internal development/testing tools, not public-facing");
doc.text("• Obfuscated URLs (/nxcar-t3rms..., /p1rtn5rs...) — Security-through-obscurity patterns for app-side pages");
doc.text("• /app_qr, /nxcar-listing-app, /nxcar-download — Only relevant for mobile app promotion");
doc.text("• /nxcar-qr-generator, /dealerqr/:id — Internal tools for generating dealer QR codes");
doc.text("• IPL gameplay policy — Seasonal campaign page, not core to the platform");

// ==================== SECTION 4: API INTEGRATION GAPS ====================
doc.addPage();
sectionHeader("API INTEGRATION STATUS", TEAL);

const W4 = [30, 180, 165, 120];
tableRow(["#", "API / Feature", "Current State", "Action Needed"], W4, { bold: true, color: TEAL });
divider();

const apis = [
  ["Car listings API", "api.nxcar.in/listallcars", "Working — fetches live cars", GREEN],
  ["Vehicle lookup API", "api.nxcar.in/vehicle_details", "Working — used in sell form, CarScope", GREEN],
  ["Dealers/Partners API", "api.nxcar.in/partners/web-urls", "Working — dealer network pages", GREEN],
  ["Models API", "api.nxcar.in/model", "Working — brand/model dropdowns", GREEN],
  ["Fuel types API", "api.nxcar.in/v2/fuel-type", "Working — filter options", GREEN],
  ["Inspection slots API", "api.nxcar.in/inspection-slots", "Referenced but unused", ORANGE],
  ["Inspection franchise API", "api.nxcar.in/v2/inspection-franchise", "Referenced but unused", ORANGE],
  ["Car images CDN", "d3ob14o27m4cky.cloudfront.net", "Working — car listing photos", GREEN],
  ["Sell form submission", "POST to local DB", "Working — stores in PostgreSQL", GREEN],
  ["Blog content", "Local PostgreSQL DB", "Working — 20 articles with images", GREEN],
];

apis.forEach(([name, endpoint, state, color], i) => {
  tableRow([`${i + 1}`, `${name}\n${endpoint}`, state, color === GREEN ? "No action" : "Consider integrating"], W4, { colors: [GRAY, DARK, color, color === GREEN ? GREEN : RED] });
  if (i < apis.length - 1) divider();
});

// ==================== SECTION 5: POLISH ITEMS ====================
doc.moveDown(1);
sectionHeader("CORNER CASES & POLISH ITEMS", DARK);

const polishItems = [
  ["Sell form confirmation page", "/sell-form-submitted should show success after car listing submission", "High"],
  ["City-specific sell pages", "/sell-used-cars-gurugram and similar city variants", "Medium"],
  ["Referral program", "/refer-to-friend needs design and implementation", "Medium"],
  ["Inspection booking flow", "/web-inspection-booked/:id confirmation after CarScope booking", "Medium"],
  ["Challan admin panel", "/challan-check-panel for admin challan management", "Medium"],
  ["Extended warranty terms", "Legal page for warranty conditions", "Low"],
  ["Service partner page", "Separate from channel partner — for service centers", "Low"],
];

const W5 = [30, 190, 210, 65];
tableRow(["#", "Item", "Details", "Priority"], W5, { bold: true, color: TEAL });
divider();

polishItems.forEach(([item, details, priority], i) => {
  const prioColor = priority === "High" ? RED : priority === "Medium" ? ORANGE : GRAY;
  tableRow([`${i + 1}`, item, details, priority], W5, { colors: [GRAY, DARK, DARK, prioColor] });
  if (i < polishItems.length - 1) divider();
});

// ==================== FOOTER ====================
doc.moveDown(2);
doc.fontSize(8).font("Helvetica").fillColor(GRAY).text("Nxcar Route Audit Report — Generated by Nxcar Development Team — February 2026", { align: "center" });

doc.end();

stream.on("finish", () => {
  console.log("PDF generated: client/public/nxcar-route-audit.pdf");
});
