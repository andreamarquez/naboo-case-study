import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { formatCreationDate } from '../dateFormatter';

describe('Date Formatter Utility - KISS Version', () => {
  describe('formatCreationDate', () => {
    it('should format date in European format DD/MM/YYYY', () => {
      const testDate = '2024-01-15T10:30:00.000Z';
      const result = formatCreationDate(testDate);
      
      expect(result).toBe('Créé le 15/01/2024');
    });

    it('should handle invalid date strings', () => {
      const invalidDate = 'invalid-date';
      const result = formatCreationDate(invalidDate);
      
      expect(result).toBe('Date non disponible');
    });

    it('should handle null/undefined dates', () => {
      expect(formatCreationDate(null)).toBe('Date non disponible');
      expect(formatCreationDate(undefined)).toBe('Date non disponible');
    });

    it('should handle empty string', () => {
      expect(formatCreationDate('')).toBe('Date non disponible');
    });
  });
});
