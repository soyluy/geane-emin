// File: src/app/screens/home/useHomeProductAreas.ts
// Amaç: MainScreen'deki ProductArea'lara gidecek ürünleri
// doğrudan Ready.ts (productsReady) kaynağından seçip vitrinlere bölmek.
// Not: Bu hook veri ÇEKMEZ; hazır listeyi yansıtır.

// React
import { useMemo } from 'react';

// Ready kaynağı (relative path; '@' alias'ı yoksa böyle olmalı)
import { productsReady } from '../../data/ProductData/ready/Ready';

// UI'nin tükettiği minimal tip (ProductArea/ProductCard'ın ihtiyaç duyduğu alanlar)
export type UIProduct = {
  id: string;
  title: string;
  price: number;
  imageUrls: string[];
  category?: string;
  brand?: string;
};

export type HomeArea = {
  key: string;
  title: string;
  items: UIProduct[];
};

// Render edilebilir ürün kontrolü (eksik/verisiz olanları dışarıda bırakır)
function isRenderable(p: any): boolean {
  const hasId = typeof p?.id === 'string' && p.id.length > 0;
  const hasPrice = typeof p?.price === 'number' && !Number.isNaN(p.price);
  const hasImages =
    Array.isArray(p?.images) &&
    p.images.length > 0 &&
    typeof p.images[0]?.url === 'string' &&
    p.images[0].url.length > 0;
  return hasId && hasPrice && hasImages;
}

// Ready item → UIProduct (alan EŞLEME; eksik veri uydurmaz)
function toUI(p: any): UIProduct | null {
  if (!isRenderable(p)) return null;

  const imageUrls = (p.images as any[])
    .map((im) => (typeof im?.url === 'string' ? im.url : null))
    .filter((u: string | null): u is string => !!u);

  if (imageUrls.length === 0) return null;

  return {
    id: p.id as string,
    title: p.title as string,
    price: p.price as number,
    imageUrls,
    category: typeof p.category === 'string' ? p.category : undefined,
    brand: typeof p.brand === 'string' ? p.brand : undefined,
  };
}

// Vitrin kuralları (örnek: labels.tag'e göre)
const AREA_CONFIG: Array<{ key: string; title: string; tag: number; limit: number }> = [
  { key: 'similar', title: 'Beğendiklerin ile benzer', tag: 1, limit: 12 },
  { key: 'for-you', title: 'Senin için hazırlandı', tag: 2, limit: 12 },
  { key: 'black-dress-highlights', title: 'Siyah elbisede öne çıkanlar', tag: 3, limit: 12 },
  { key: 'seasonal', title: 'Sizin için sezonluk öneriler', tag: 4, limit: 12 },
];

// 👉 MainScreen, bu fonksiyonu **named export** olarak çağırıyor.
export function useHomeProductAreas(): HomeArea[] {
  // 1) Ready listesini UI tipine eşle
  const allUI: UIProduct[] = useMemo(() => {
    const src: any[] = Array.isArray(productsReady) ? productsReady : [];
    return src.map(toUI).filter((x): x is UIProduct => !!x);
  }, []);

  // 2) Tag'e göre vitrinlere böl
  const areas: HomeArea[] = useMemo(() => {
    // id → raw ürün map'i (labels.tag erişimi için)
    const rawById = new Map<string, any>();
    if (Array.isArray(productsReady)) {
      for (const r of productsReady as any[]) {
        if (r?.id) rawById.set(r.id, r);
      }
    }

    const pickByTag = (tag: number) =>
      allUI.filter((u) => {
        const raw = rawById.get(u.id);
        return typeof raw?.labels?.tag === 'number' && raw.labels.tag === tag;
      });

    const result: HomeArea[] = [];
    for (const cfg of AREA_CONFIG) {
      const pool = pickByTag(cfg.tag);
      const items = pool.slice(0, cfg.limit); // gerekirse burada sort/random ekleyebilirsin
      result.push({ key: cfg.key, title: cfg.title, items });
    }
    return result;
  }, [allUI]);

  return areas;
}
