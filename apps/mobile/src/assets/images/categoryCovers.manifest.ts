// ⚠️ Otomatik üretildi. Düzenlemeyin.
export const CATEGORY_COVERS: Record<string, number> = {
  "1.1.6": require("./category-covers/1.1.6-.png"),
  "1.1.8": require("./category-covers/1.1.8-.png"),
  "1.2.7": require("./category-covers/1.2.7-.png"),
  "1.3.2": require("./category-covers/1.3.2-.png"),
  "1.3.6": require("./category-covers/1.3.6-.png"),
  "1.4.2": require("./category-covers/1.4.2-.png"),
  "1.4.3": require("./category-covers/1.4.3-.png"),
  "1.4.5": require("./category-covers/1.4.5-.png"),
  "1.4.7": require("./category-covers/1.4.7-.png"),
};

export const getCategoryCoverById = (id: string) => CATEGORY_COVERS[id];
