import { describe, expect, it } from 'vitest';
import { equalModIdSets, includesModId, isSameModId, normalizeModId } from '../../utils/mod-id';

describe('mod-id helpers', () => {
  describe('normalizeModId', () => {
    it('returns lowercase version of the id', () => {
      expect(normalizeModId('FooBar')).toBe('foobar');
    });

    it('returns empty string for null/undefined', () => {
      expect(normalizeModId(null)).toBe('');
      expect(normalizeModId(undefined)).toBe('');
    });
  });

  describe('isSameModId', () => {
    it('compares case-insensitively', () => {
      expect(isSameModId('Mod_A', 'mod_a')).toBe(true);
      expect(isSameModId('mod_a', 'MOD_A')).toBe(true);
    });

    it('returns false for different ids', () => {
      expect(isSameModId('mod_a', 'mod_b')).toBe(false);
    });

    it('handles null/undefined', () => {
      expect(isSameModId(null, undefined)).toBe(true);
      expect(isSameModId('mod_a', null)).toBe(false);
    });
  });

  describe('includesModId', () => {
    it('finds id regardless of letter case', () => {
      expect(includesModId(['Mod_A', 'Mod_B'], 'mod_b')).toBe(true);
      expect(includesModId(['mod_a'], 'MOD_A')).toBe(true);
    });

    it('returns false when id is not present', () => {
      expect(includesModId(['mod_a'], 'mod_c')).toBe(false);
    });

    it('returns false for empty / null array', () => {
      expect(includesModId([], 'mod_a')).toBe(false);
      expect(includesModId(null, 'mod_a')).toBe(false);
      expect(includesModId(undefined, 'mod_a')).toBe(false);
    });
  });

  describe('equalModIdSets', () => {
    it('treats sets as equal regardless of order and case', () => {
      expect(equalModIdSets(['Mod_A', 'mod_b'], ['MOD_B', 'mod_a'])).toBe(true);
    });

    it('returns false when lengths differ', () => {
      expect(equalModIdSets(['mod_a'], ['mod_a', 'mod_b'])).toBe(false);
    });

    it('returns false when elements differ', () => {
      expect(equalModIdSets(['mod_a', 'mod_b'], ['mod_a', 'mod_c'])).toBe(false);
    });

    it('treats two empty arrays as equal', () => {
      expect(equalModIdSets([], [])).toBe(true);
    });
  });
});
