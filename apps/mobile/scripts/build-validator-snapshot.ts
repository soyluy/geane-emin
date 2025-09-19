/* mobile/scripts/build-validator-snapshot.ts
 * GEANE — Validator Snapshot Builder
 * Kategoriler (categories.master.ts) + Etiketler (attributes.master.ts) birleşir,
 * her kategori için geçerli attribute set ve kullanılacak değerler tek JSON’a yazılır.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { CATEGORIES, type CategoryNode } from "../src/config/taxonomy/categories.master";
import {
  ALL_ATTRIBUTES,
  type AttributeDef,
  type AttributeCode,
} from "../src/config/taxonomy/attributes.master";

type SnapshotAttribute = {
  code: AttributeCode;
  name: string;
  type: AttributeDef["type"];
  multi?: boolean;
  values?: { code: string; label: string; sort?: number }[];
};

type SnapshotCategory = {
  id: string;
  name: string;
  attributes: SnapshotAttribute[];
  children?: SnapshotCategory[];
};

type Snapshot = {
  version: string;
  generatedAt: string;
  categoriesTree: SnapshotCategory;
  categoriesFlat: Record<string, SnapshotCategory>;
};

const ATTR_INDEX: Record<AttributeCode, AttributeDef> = ALL_ATTRIBUTES.reduce((acc, def) => {
  acc[def.code] = def as AttributeDef;
  return acc;
}, {} as Record<AttributeCode, AttributeDef>);

function buildSnapshotNode(node: CategoryNode): SnapshotCategory {
  const attrs = (node.attributes ?? []).map(code => {
    const def = ATTR_INDEX[code];
    if (!def) throw new Error(`Attribute "${code}" tanımsız!`);
    return {
      code: def.code,
      name: def.name,
      type: def.type,
      multi: def.multi,
      values: def.values?.map(v => ({ code: v.code, label: v.label, sort: v.sort })),
    };
  });
  const children = node.children?.map(buildSnapshotNode);
  return { id: node.id, name: node.name, attributes: attrs, ...(children?.length ? { children } : {}) };
}

function flatten(node: SnapshotCategory, acc: Record<string, SnapshotCategory>) {
  if (node.id !== "ROOT") acc[node.id] = node;
  node.children?.forEach(child => flatten(child, acc));
}

function main() {
  const tree = buildSnapshotNode(CATEGORIES);
  const flat: Record<string, SnapshotCategory> = {};
  flatten(tree, flat);

  const snapshot: Snapshot = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    categoriesTree: tree,
    categoriesFlat: flat,
  };

  const outDir = path.join(__dirname, "../src/assets/taxonomy");
  const outFile = path.join(outDir, "validator.snapshot.json");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(snapshot, null, 2), "utf-8");

  console.log(`✓ validator.snapshot.json yazıldı → ${outFile}`);
}

main();
