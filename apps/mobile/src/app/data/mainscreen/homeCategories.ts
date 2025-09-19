// File: src/app/data/mainscreen/homeCategories.ts
export type HomeCategoryItem = { id: string; title: string };

// ID’ler aynı kalsın
export const HOME_CATEGORY_IDS: string[] = [
  '1.1.6','1.1.8','1.2.7','1.3.2','1.3.6','1.4.2','1.4.3','1.4.5','1.4.7',
];

// 👇 YENİ: Taxonomy’den isim çek
import { findCategoryById } from '../../../config/taxonomy';

export const HOME_CATEGORIES: HomeCategoryItem[] = HOME_CATEGORY_IDS.map((id) => {
  const node = findCategoryById(id);
  return { id, title: node?.name ?? id }; // bulunamazsa ID’ye düşer
});
