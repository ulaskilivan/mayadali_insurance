const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env manually to avoid extra dependencies.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    if (!line || line.trim().startsWith("#")) return;
    const idx = line.indexOf("=");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && !(key in process.env)) process.env[key] = value;
  });
}

const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const PRODUCT_LABELS = {
  trafik: "Trafik Sigortasi",
  kasko: "Kasko Sigortasi",
  "tamamlayici-saglik": "Tamamlayici Saglik",
  dask: "DASK",
  konut: "Konut Sigortasi",
  isyeri: "Is Yeri Sigortasi",
  seyahat: "Seyahat Sigortasi"
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
};

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf8");
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body cok buyuk."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Gecersiz JSON gonderildi."));
      }
    });
    req.on("error", reject);
  });

const validatePhone = (phone) => /^\+905\d{9}$/.test(phone);

const handleTeklif = async (req, res) => {
  try {
    const payload = await parseBody(req);
    const fullName = String(payload.fullName || "").trim();
    const product = String(payload.product || "").trim();
    const phone = String(payload.phone || "").trim();
    const note = String(payload.note || "").trim();

    if (!fullName || fullName.length < 2) {
      return sendJson(res, 400, { error: "Ad soyad alani gecersiz." });
    }
    if (!PRODUCT_LABELS[product]) {
      return sendJson(res, 400, { error: "Urun secimi gecersiz." });
    }
    if (!validatePhone(phone)) {
      return sendJson(res, 400, { error: "Telefon numarasi gecersiz." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.RESEND_TO_EMAIL;
    const replyTo = process.env.RESEND_REPLY_TO || process.env.RESEND_TO_EMAIL;

    if (!apiKey || !from || !to) {
      return sendJson(res, 500, {
        error: ".env eksik: RESEND_API_KEY, RESEND_FROM_EMAIL veya RESEND_TO_EMAIL ayarlanmamis."
      });
    }

    const html = `
      <h2>Yeni Teklif Talebi</h2>
      <p><strong>Ad Soyad:</strong> ${fullName}</p>
      <p><strong>Urun:</strong> ${PRODUCT_LABELS[product]}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <p><strong>Not:</strong> ${note || "-"}</p>
    `;

    const resendResp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Teklif Talebi - ${PRODUCT_LABELS[product]}`,
        html,
        reply_to: replyTo
      })
    });

    const resendData = await resendResp.json().catch(() => ({}));
    if (!resendResp.ok) {
      return sendJson(res, 502, {
        error: resendData?.message || "Resend tarafinda bir hata olustu."
      });
    }

    return sendJson(res, 200, { ok: true, id: resendData?.id || null });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Beklenmeyen bir hata olustu." });
  }
};

const serveStatic = (req, res) => {
  const basePath = __dirname;
  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const safeUrl = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = path.normalize(path.join(basePath, safeUrl));

  if (!filePath.startsWith(basePath)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Dosya bulunamadi.");
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  if (req.url === "/api/teklif") {
    if (req.method === "POST") {
      return void handleTeklif(req, res);
    }
    if (req.method === "GET") {
      return void sendJson(res, 200, {
        ok: true,
        message: "Endpoint hazir. Teklif gonderimi icin POST /api/teklif kullanin."
      });
    }
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        Allow: "GET, POST, OPTIONS",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      });
      return void res.end();
    }
    return void sendJson(res, 405, { error: "Method Not Allowed" });
  }
  return void serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Server calisiyor: http://localhost:${PORT}`);
});
