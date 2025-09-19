/**
 * build-image-metrics.ts
 * ------------------------------------------------------------
 * AMAÇ:
 *  - InApprovalProcess.ts içindeki ürünlerin imageUrls alanlarını tarar.
 *  - Her URL için (dosyayı indirmeden) width/height ölçmeye çalışır, ar = w/h hesaplar.
 *  - Sonuçları:
 *      1) image-metrics.json (cache / kaynak defteri)
 *      2) WithAr.ts (UI’nin doğrudan import edeceği, ar/w/h eklenmiş ürün listesi)
 *    olarak yazar.
 *
 * NEDEN BÖYLE?
 *  - UI dikey kartlarda yüksekliği "ilk karede" doğru çizsin (height = width / ar),
 *    onLoad beklenmesin, jank/reflow olmasın.
 *
 * ÇALIŞTIRMA:
 *   (tools/image-metrics klasöründe)
 *   npm run build:image-metrics
 *
 * İSTEĞE BAĞLI PARAMETRELER:
 *  --fakeDataPath=...   (uzantısız modül yolu) varsayılan: ../../apps/mobile/src/app/data/ProductData/InApprovalProcess
 *  --exportName=...     (ürün dizisi export adı)            varsayılan: fakeProducts
 *  --outProducts=...    (WithAr.ts çıkış yolu)              varsayılan: ../../apps/mobile/src/app/data/ProductData/generated/WithAr.ts
 *  --outMetrics=...     (metrics.json çıkış yolu)           varsayılan: ../../apps/mobile/src/app/data/ProductData/generated/image-metrics.json
 *  --withAr=false       (sadece metrics.json üretmek için)
 *  --concurrency=4      (eşzamanlı ölçüm sayısı)
 *  --timeoutMs=10000    (tek istek zaman aşımı)
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import probe from "probe-image-size";
import got from "got";
import pLimit from "p-limit";

/* ----------------------------- CLI ARGÜMANLARI ---------------------------- */

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.split("=");
    return [k.replace(/^--/, ""), v ?? "true"];
  })
);

// *** SENİN YAPINA GÖRE DEFAULTLAR ***
const FAKE_DATA_PATH =
  args.fakeDataPath ??
  "../../apps/mobile/src/app/data/ProductData/InApprovalProcess"; // uzantısız yol
const EXPORT_NAME = args.exportName ?? "fakeProducts"; // InApprovalProcess.ts içindeki export adı
const OUT_PRODUCTS =
  args.outProducts ??
  "../../apps/mobile/src/app/data/ProductData/generated/WithAr.ts";
const OUT_METRICS =
  args.outMetrics ??
  "../../apps/mobile/src/app/data/ProductData/generated/image-metrics.json";

const WITH_AR = String(args.withAr ?? "true").toLowerCase() !== "false";
const CONCURRENCY = Number(args.concurrency ?? 4);
const TIMEOUT_MS = Number(args.timeoutMs ?? 10_000);

/* --------------------------------- ARAÇLAR -------------------------------- */

const limit = pLimit(CONCURRENCY);

/** Verilen dosya yolu için klasörleri oluşturur. */
async function ensureDirFor(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

/** TS/TSX/JS modülünü (uzantısız verilen) dinamik import eder. */
async function importModuleNoExt(resolvedNoExt: string): Promise<Record<string, any>> {
  for (const ext of [".ts", ".tsx", ".js"]) {
    try {
      const file = resolvedNoExt + ext;
      const mod = await import(pathToFileURL(file).href);
      return mod as Record<string, any>;
    } catch {
      // diğer uzantıyı dene
    }
  }
  throw new Error(`Modül bulunamadı: ${resolvedNoExt}{.ts,.tsx,.js}`);
}

/** URL içinden width/height yakalamaya çalışan pratik sezgisel (heuristic) çözüm. */
function parseSizeFromUrl(url: string): { w?: number; h?: number } {
  try {
    const u = new URL(url);

    // 1) Query param: width/height ya da w/h
    const wQ = Number(u.searchParams.get("width") ?? u.searchParams.get("w"));
    const hQ = Number(u.searchParams.get("height") ?? u.searchParams.get("h"));

    // 2) Yol içinde sw1128sh1600 veya w1200h1600 gibi pattern'ler
    const m1 = u.pathname.match(/(?:^|[^\w])(sw|w)(\d+)(sh|h)(\d+)/i);
    const wP1 = m1 ? Number(m1[2]) : undefined;
    const hP1 = m1 ? Number(m1[4]) : undefined;

    // 3) Dosya adının sonunda 1200x1600 gibi pattern
    const m2 = u.pathname.match(/(\d+)[xX](\d+)(?:\.\w+)?$/);
    const wP2 = m2 ? Number(m2[1]) : undefined;
    const hP2 = m2 ? Number(m2[2]) : undefined;

    const w = Number.isFinite(wQ) ? wQ : (wP1 ?? wP2);
    const h = Number.isFinite(hQ) ? hQ : (hP1 ?? hP2);

    return { w, h };
  } catch {
    return {};
  }
}

/**
 * Bir görsel URL'si için ölçüm yapar:
 *  0) URL'den sezgisel (heuristic) çıkarım
 *  1) probe(url) ile doğrudan (server header/ilk byte)
 *  2) got.stream + probe(stream) (UA/Accept header ile)
 *  Olmazsa { ar:null } döner.
 */
async function measure(url: string, timeoutMs: number) {
  // 0) Heuristik (ör: ?width=1200&height=1600, .../sw1128sh1600.webp)
  const guess = parseSizeFromUrl(url);
  if (guess.w && guess.h) {
    const ar = +(guess.w / guess.h).toFixed(4);
    return { w: guess.w, h: guess.h, ar, ok: true, src: "heuristic" as const };
  }

  // 1) Standart probe (direkt URL)
  try {
    const info = await probe(url);
    const w = info.width ?? 0;
    const h = info.height ?? 0;
    const ar = h > 0 ? +(w / h).toFixed(4) : null;
    if (ar) return { w, h, ar, ok: true, src: "probe" as const };
  } catch {
    // devam
  }

  // 2) Header'lı stream ile probe
  try {
    const stream = got.stream(url, {
      headers: {
        "User-Agent": "GEANE-image-metrics/1.0 (+https://geane.local)",
        "Accept": "image/*,*/*;q=0.8",
      },
      timeout: { request: timeoutMs },
      retry: { limit: 1 },
    });
    const info = await probe(stream);
    const w = info.width ?? 0;
    const h = info.height ?? 0;
    const ar = h > 0 ? +(w / h).toFixed(4) : null;
    if (ar) return { w, h, ar, ok: true, src: "probe-stream" as const };
  } catch {
    // devam
  }

  // 3) Başarısız
  return { w: 0, h: 0, ar: null as number | null, ok: false, src: "fail" as const };
}

/** Var olan metrics.json'u okur (yoksa boş döner). */
async function loadExistingMetrics(file: string) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

/* ---------------------------------- MAIN ---------------------------------- */

async function main() {
  // 1) Ham ürün modülünü yükle
  const resolvedNoExt = path.isAbsolute(FAKE_DATA_PATH)
    ? FAKE_DATA_PATH
    : path.resolve(FAKE_DATA_PATH);

  const mod = await importModuleNoExt(resolvedNoExt);

  // 2) Ürün dizisini bul (varsayılan export adı: fakeProducts)
  let products: any[] | undefined =
    mod[EXPORT_NAME] ??
    mod.default?.[EXPORT_NAME] ??
    (Array.isArray(mod.default) ? mod.default : undefined);

  if (!products || !Array.isArray(products)) {
    // Hata hâlinde hangi export'lar var göstermek faydalı
    console.error("Mevcut export'lar:", Object.keys(mod));
    console.error("Default altındaki export'lar:", Object.keys(mod.default ?? {}));
    throw new Error(`'${EXPORT_NAME}' adlı dizi export'u bulunamadı.`);
  }

  // 3) Benzersiz URL havuzu
  const allUrls = Array.from(
    new Set(products.flatMap((p) => Array.from(p.imageUrls ?? [])))
  );

  // 4) Var olan metrics cache'ini yükle (artımlı ölçüm)
  const metrics: Record<string, { w: number; h: number; ar: number | null }> =
    await loadExistingMetrics(OUT_METRICS);

  const toMeasure = allUrls.filter(
    (u) => !metrics[u] || metrics[u].ar == null || metrics[u].h === 0
  );

  console.log(
    `Toplam URL: ${allUrls.length} | Ölçülecek: ${toMeasure.length} | Eşzamanlılık: ${CONCURRENCY}`
  );

  // 5) Ölçüm (sadece eksikler)
  let failed: string[] = [];
  await Promise.all(
    toMeasure.map((url) =>
      limit(async () => {
        const m = await measure(url, TIMEOUT_MS);
        metrics[url] = { w: m.w, h: m.h, ar: m.ar };
        if (!m.ok) {
          failed.push(url);
          console.warn(`⚠️ Ölçülemedi: ${url}`);
        }
      })
    )
  );

  // 6) metrics.json yaz
  await ensureDirFor(OUT_METRICS);
  await fs.writeFile(OUT_METRICS, JSON.stringify(metrics, null, 2), "utf8");
  console.log(`✅ metrics yazıldı: ${OUT_METRICS}`);

  // 7) (opsiyonel) WithAr.ts üret
  if (WITH_AR) {
    // Not: UI’da ar bilinmeyenlere geçici default vermek istersen 0.75 kullanıyoruz.
    const productsWithAr = products.map((p) => {
      const images = (p.imageUrls ?? []).map((url: string) => {
        const m = metrics[url] ?? { w: 0, h: 0, ar: null };
        return { url, w: m.w, h: m.h, ar: m.ar ?? 0.75 };
      });
      const primaryAr = images[0]?.ar ?? 0.75;
      return { ...p, images, primaryAr };
    });

    const fileContent =
      `// AUTO-GENERATED by build-image-metrics.ts\n` +
      `// Bu dosya script tarafından üretildi. El ile düzenlemeyin.\n` +
      `export const productsWithAr = ${JSON.stringify(productsWithAr, null, 2)} as const;\n`;

    await ensureDirFor(OUT_PRODUCTS);
    await fs.writeFile(OUT_PRODUCTS, fileContent, "utf8");
    console.log(`✅ withAr yazıldı: ${OUT_PRODUCTS}`);
  }

  // 8) Özet
  const failedCount = failed.length;
  if (failedCount > 0) {
    console.log(`\nTamamlandı, ancak ölçülemeyen ${failedCount} URL var (yukarıda listelendi).`);
    console.log(
      "Tekrar çalıştırdığında sadece eksikler denenir. Gerekirse --concurrency ve --timeoutMs ile oynayabilirsin."
    );
  } else {
    console.log("🎉 Tüm URL'ler başarıyla ölçüldü.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
