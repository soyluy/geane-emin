// scripts/build-category-covers-manifest.ts
import fs from "fs";
import path from "path";

const imagesRoot = path.join(__dirname, "../src/assets/images");
const altDir     = path.join(imagesRoot, "category-covers"); // varsa bunu da tara
const outFile    = path.join(imagesRoot, "categoryCovers.manifest.ts");

const VALID_EXT = new Set([".png", ".jpg", ".jpeg"]);

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function toPosix(p: string) {
  return p.replace(/\\/g, "/");
}

function main() {
  try {
    if (!fs.existsSync(imagesRoot)) {
      console.error("❌ Klasör bulunamadı:", imagesRoot);
      console.error("ℹ️  Görsellerini buraya koy: src/assets/images/");
      process.exit(1);
    }

    // 1) imagesRoot ve altDir (varsa) içini rekürsif tara
    const candidates = [...new Set([imagesRoot, altDir].filter(fs.existsSync))];
    const allFiles = candidates.flatMap((d) => walk(d));

    // 2) Geçerli uzantı ve isim deseni: "<KOD>-..."
    const matched = allFiles
      .filter((f) => VALID_EXT.has(path.extname(f).toLowerCase()))
      .filter((f) => {
        const base = path.basename(f);
        return /^([0-9]+(\.[0-9]+)*)-/.test(base);
      });

    if (matched.length === 0) {
      console.error("❌ Eşleşecek görsel bulunamadı (uzantı .png/.jpg/.jpeg ve ad '<KOD>-...' olmalı).");
      console.error("Aranan dizin(ler):");
      for (const d of candidates) console.error("  -", d);
      console.error("\nBulunan dosyalar (uzantı/isim uygun mu kontrol et):");
      for (const f of allFiles.slice(0, 100)) console.error("  •", f);
      process.exit(1);
    }

    // 3) KOD → dosya (son dosya kazanır; istersen öncelik kuralı eklenebilir)
    matched.sort((a, b) => a.localeCompare(b, "en"));
    const map: Record<string, string> = {};
    for (const fileAbs of matched) {
      const base = path.basename(fileAbs);
      const m = base.match(/^([0-9]+(\.[0-9]+)*)-/)!;
      const code = m[1];
      map[code] = fileAbs; // sonuncuyu bırak
    }

    // 4) Manifest dosyasına göre GÖRECELİ require yolu üret
    ensureDir(path.dirname(outFile));
    const lines: string[] = [];
    lines.push("// ⚠️ Otomatik üretildi. Düzenlemeyin.");
    lines.push("export const CATEGORY_COVERS: Record<string, number> = {");

    const codes = Object.keys(map).sort((a, b) => a.localeCompare(b, "en"));
    for (const code of codes) {
      const absPath = map[code];
      let rel = path.relative(path.dirname(outFile), absPath); // manifest konumuna göre
      rel = toPosix(rel);
      if (!rel.startsWith(".")) rel = "./" + rel; // require için görece yol
      lines.push(`  "${code}": require("${rel}"),`);
    }

    lines.push("};");
    lines.push("");
    lines.push("export const getCategoryCoverById = (id: string) => CATEGORY_COVERS[id];");
    lines.push("");

    fs.writeFileSync(outFile, lines.join("\n"), "utf-8");
    console.log("✅ Manifest üretildi:", outFile);
    console.log(`ℹ️  ${codes.length} kapak eşlendi.`);
  } catch (err) {
    console.error("💥 Beklenmeyen hata:", err);
    process.exit(1);
  }
}

main();
