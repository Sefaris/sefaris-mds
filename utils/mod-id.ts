/**
 * Helpers for case-insensitive comparison of mod identifiers.
 *
 * Mod IDs come from external `mod.json` files so casing is not guaranteed
 * to be consistent. All equality / membership checks for mod IDs across the
 * application should go through these helpers.
 */

export function normalizeModId(id: string | null | undefined): string {
  return (id ?? '').toLowerCase();
}

export function isSameModId(a: string | null | undefined, b: string | null | undefined): boolean {
  return normalizeModId(a) === normalizeModId(b);
}

export function includesModId(
  ids: readonly (string | null | undefined)[] | null | undefined,
  id: string | null | undefined,
): boolean {
  if (!ids) return false;
  const target = normalizeModId(id);
  for (const value of ids) {
    if (normalizeModId(value) === target) return true;
  }
  return false;
}

export function equalModIdSets(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].map(normalizeModId).sort();
  const sortedB = [...b].map(normalizeModId).sort();
  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false;
  }
  return true;
}
