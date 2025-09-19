/**
 * ready-builder.ts
 * ------------------------------------------------------------------
 * AMAÇ (Feynman usulü kısa): 
 *  - Mutfaktaki iki aşçı işini bitirdi mi diye bakıp servise hazır listeyi üretir.
 *    1) Imaging: Görseller ölçülmüş mü? (w,h,ar)
 *    2) Tagging: Etiketler var mı?
 *  - İkisi de "Evet" ise ürünü READY listesine alır; değilse PENDING kalır.
 *
 * GİRDİLER:
 *  - generated/WithAr.ts  : Imaging sonrası ürünler (images[{url,w,h,ar}], primaryAr)
 *  - generated/labels.json: Tagging servisi çıktısı (id -> etiketler)
 *  - generated/image-metrics.json: Ölçüm defteri (URL -> {w,h,ar})
 *
 * ÇIKTI:
 *  - ready/Ready.ts: Sadece imagingDone && taggingDone olan ürünler
 *
 * DEMO MODU (HIZLI):
 *  - --allowFallback=true verilirse, metrics.json'da ar=null olsa bile
 *    WithAr.ts içindeki images[].ar (fallback 0.75 dahi olsa) "imagingDone" sayılır.
 *  - Üretimde bu bayrağı kullanma; kalıcı çözümde tüm URL'ler metrics'te ar != null olmalı.
 *
 * KULLANIM:
 *   npx tsx ready-builder.ts \
 *     --withArPath=../../apps/mobile/src/app/data/ProductData/generated/WithAr \
 *     --labelsPath=../../apps/mobile/src/app/data/ProductData/generated/labels.json \
 *     --metricsPath=../../apps/mobile/src/app/data/ProductData/generated/image-metrics.json \
 *     --outReady=../../apps/mobile/src/app/data/ProductData/ready/Ready.ts \
 *     --exportName=productsWithAr \
 *     --allowFallback=true        // DEMO için
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

/* -------------------------- CLI arg parse (basit) ------------------------- */
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.split("=");
    return [k.replace(/^--/, ""), v ?? "true"];
  })
);

const WITH_AR_PATH =
  args.withArPath ??
  "../../apps/mobile/src/app/data/ProductData/generated/WithAr";
const EXPORT_NAME = args.exportName ?? "productsWithAr";
const LABELS_PATH =
  args.labelsPath ??
  "../../apps/mobile/src/app/data/ProductData/generated/labels.json";
const METRICS_PATH =
  args.metricsPath ??
  "../../apps/mobile/src/app/data/ProductData/generated/image-metrics.json";
const OUT_READY =
  args.outReady ??
  "../../apps/mobile/src/app/data/ProductData/ready/Ready.ts";

// DEMO bayrağı: fallback ar (WithAr.ts içindeki) kabul edilsin mi?
const ALLOW_FALLBACK =
  String(args.allowFallback ?? "false").toLowerCase() === "true";

/* ------------------------------- yardımcılar ------------------------------ */
async function ensureDirFor(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function importNoExtModule(resolvedNoExt: string): Promise<Record<string, any>> {
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

async function loadJson<T = any>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/* ---------------------------------- main ---------------------------------- */
async function main() {
  // 1) WithAr modülünü yükle
  const withArAbs = path.isAbsolute(WITH_AR_PATH) ? WITH_AR_PATH : path.resolve(WITH_AR_PATH);
  const withArMod = await importNoExtModule(withArAbs);

  const productsWithAr: any[] =
    withArMod[EXPORT_NAME] ??
    withArMod.default?.[EXPORT_NAME] ??
    (Array.isArray(withArMod.default) ? withArMod.default : undefined);

  if (!productsWithAr || !Array.isArray(productsWithAr)) {
    console.error("Mevcut export'lar:", Object.keys(withArMod));
    console.error("Default altındaki export'lar:", Object.keys(withArMod.default ?? {}));
    throw new Error(`WithAr içinden '${EXPORT_NAME}' adlı dizi export'u bulunamadı.`);
  }

  // 2) labels.json ve image-metrics.json'u yükle
  const labelsMap = await loadJson<Record<string, any>>(path.resolve(LABELS_PATH), {}); 
  const metrics = await loadJson<Record<string, { w: number; h: number; ar: number | null }>>(
    path.resolve(METRICS_PATH),
    {}
  );

  // 3) Hazır ürünleri topla
  const ready: any[] = [];
  const pending: any[] = [];

  for (const p of productsWithAr) {
    const id = p.id;

    // Tagging DONE? (labels.json'da id var ve boş değil)
    const rawLabels = labelsMap[id];
    const labels =
      rawLabels && typeof rawLabels === "object"
        ? (rawLabels.labels ?? rawLabels) // hem {A:..} hem {labels:{A:..}} destekle
        : null;
    const taggingDone = !!(labels && Object.keys(labels).length > 0);

    // Imaging DONE? (katı kural: üründeki TÜM url'ler metrics'te ar != null)
    const urls: string[] = Array.from(p.imageUrls ?? []);
    let imagingDone =
      urls.length > 0 && urls.every((u) => metrics[u] && metrics[u].ar != null);

    // DEMO modu: katı kural sağlanmadıysa, WithAr içindeki images[].ar (fallback dahil) kabul et
    if (!imagingDone && ALLOW_FALLBACK) {
      const imgs = Array.isArray(p.images) ? p.images : [];
      imagingDone =
        imgs.length > 0 && imgs.every((im: any) => typeof im?.ar === "number" && im.ar > 0);
    }

    if (imagingDone && taggingDone) {
      // READY: Uygulamanın doğrudan tüketeceği minimal veri
      ready.push({
        id,
        title: p.title,
        price: p.price,
        images: p.images,   // {url,w,h,ar} WithAr'dan hazır
        labels,             // labels.json'dan normalize edilmiş etiketler
        imagingStatus: "done",
        taggingStatus: "done",
        readyForSale: true
      });
    } else {
      // PENDING: Hangi bacak eksik?
      pending.push({
        id,
        imagingDone,
        taggingDone
      });
    }
  }

  // 4) Ready.ts yaz
  const fileContent =
    `// AUTO-GENERATED by ready-builder.ts\n` +
    `// Bu dosya script tarafından üretildi. El ile düzenlemeyin.\n` +
    `export const productsReady = ${JSON.stringify(ready, null, 2)} as const;\n`;

  await ensureDirFor(OUT_READY);
  await fs.writeFile(OUT_READY, fileContent, "utf8");

  // 5) Özet
  console.log(`✅ Ready yazıldı: ${OUT_READY}`);
  console.log(`🟢 Ready: ${ready.length} ürün`);
  console.log(`🟡 Pending: ${pending.length} ürün`);
  if (pending.length) {
    // küçük bir rapor çıksın:
    const first5 = pending.slice(0, 5);
    console.log("Örnek pending (ilk 5):", first5);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
