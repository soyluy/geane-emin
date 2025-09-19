// mobile/src/config/taxonomy/index.ts
import { CATEGORIES, type CategoryNode } from "./categories.master";
import {
  ALL_ATTRIBUTES,
  type AttributeDef,
  type AttributeCode
} from "./attributes.master";

export type { CategoryNode, AttributeDef, AttributeCode };

export const TAXONOMY = {
  version: "1.0.0",
  categories: CATEGORIES,
  attributes: ALL_ATTRIBUTES
};

// Yardımcılar (ihtiyaç oldukça genişletiriz)
export function walkCategories(
  node: CategoryNode,
  visit: (n: CategoryNode) => void
) {
  visit(node);
  node.children?.forEach((c) => walkCategories(c, visit));
}

export function findCategoryById(id: string): CategoryNode | null {
  let result: CategoryNode | null = null;
  walkCategories(CATEGORIES, (n) => {
    if (n.id === id) result = n;
  });
  return result;
}
