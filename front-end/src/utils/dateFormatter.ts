/**
 * Formats creation date for debug display - KISS approach
 */
export function formatCreationDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return 'Date non disponible';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date non disponible';
    }

    // European format: DD/MM/YYYY
    return `Créé le ${date.toLocaleDateString('fr-FR')}`;
  } catch (error) {
    return 'Date non disponible';
  }
}
