/**
 * WithAr içindeki her ürüne 1..5 arası geçici bir etiket atar.
 * Sonuç: generated/labels.json
 * Not: Deterministik olsun diye id -> sayı map'i basit bir hash ile üretilir.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const WITH_AR_PATH = "../../apps/mobile/src/app/data/ProductData/generated/WithAr";
const LABELS_PATH  = "../../apps/mobile/src/app/data/ProductData/generated/labels.json";
const EXPORT_NAME  = "productsWithAr";

// Basit deterministik hash: aynı id her zaman aynı sayıya karşılık gelir
function idToBucket1to5(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 5) + 1; // 1..5
}

async function importNoExtModule(noExt: string): Promise<Record<string, any>> {
  for (const ext of [".ts", ".tsx", ".js"]) {
    try {
      const mod = await import(pathToFileURL(path.resolve(noExt + ext)).href);
      return mod as Record<string, any>;
    } catch {}
  }
  throw new Error(`Modül bulunamadı: ${noExt}{.ts,.tsx,.js}`);
}

async function ensureDirFor(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function main() {
  const mod = await importNoExtModule(WITH_AR_PATH);
  const products: any[] =
    mod[EXPORT_NAME] ??
    mod.default?.[EXPORT_NAME] ??
    (Array.isArray(mod.default) ? mod.default : undefined);

  if (!products) throw new Error("productsWithAr export'u bulunamadı.");

  // labels.json formatı: { [productId]: { tag: number } }
  // ready-builder 'boş mu?' diye baktığı için {tag: 3} gibi tek alan yeterli.
  const labels: Record<string, { tag: number }> = {};
  for (const p of products) {
    labels[p.id] = { tag: idToBucket1to5(String(p.id)) };
  }

  await ensureDirFor(LABELS_PATH);
  await fs.writeFile(LABELS_PATH, JSON.stringify(labels, null, 2), "utf8");
  console.log(`✅ labels.json yazıldı: ${LABELS_PATH} | adet: ${Object.keys(labels).length}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
