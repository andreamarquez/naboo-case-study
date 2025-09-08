import { useCallback } from 'react';
import { useSnackbar } from '@/hooks';
import { ActivityFragment } from "@/graphql/generated/types";
import { useFavouritesMutations } from './mutations';

interface UseFavouriteActionsProps {
  user: any;
  favourites: string[];
  favouriteActivities: ActivityFragment[];
  isFavourite: (activityId: string) => boolean;
  setActivityLoading: (activityId: string, loading: boolean) => void;
  clearError: () => void;
  setError: (error: string) => void;
}

export function useFavouriteActions({
  user,
  favourites,
  favouriteActivities,
  isFavourite,
  setActivityLoading,
  clearError,
  setError,
}: UseFavouriteActionsProps) {
  const snackbar = useSnackbar();
  const { addToFavouritesMutation, removeFromFavouritesMutation, reorderFavouritesMutation } = useFavouritesMutations();

  const addToFavourites = useCallback(async (activityId: string): Promise<void> => {
    if (!user) {
      snackbar.error('Veuillez vous connecter pour ajouter des favoris');
      return;
    }

    if (isFavourite(activityId)) {
      snackbar.success('Cette activité est déjà dans vos favoris');
      return;
    }

    try {
      clearError();
      setActivityLoading(activityId, true);

      await addToFavouritesMutation({
        variables: {
          input: { activityId },
        },
      });

      snackbar.success('Ajouté aux favoris');
    } catch (err) {
      const errorMessage = 'Échec de l\'ajout aux favoris';
      setError(errorMessage);
      snackbar.error(errorMessage);
      throw err;
    } finally {
      setActivityLoading(activityId, false);
    }
  }, [user, isFavourite, addToFavouritesMutation, snackbar, clearError, setActivityLoading, setError]);

  const removeFromFavourites = useCallback(async (activityId: string): Promise<void> => {
    if (!user) {
      snackbar.error('Veuillez vous connecter pour gérer vos favoris');
      return;
    }

    try {
      clearError();
      setActivityLoading(activityId, true);

      await removeFromFavouritesMutation({
        variables: {
          input: { activityId },
        },
      });

      snackbar.success('Retiré des favoris');
    } catch (err) {
      const errorMessage = 'Échec de la suppression des favoris';
      setError(errorMessage);
      snackbar.error(errorMessage);
      throw err;
    } finally {
      setActivityLoading(activityId, false);
    }
  }, [user, removeFromFavouritesMutation, snackbar, clearError, setActivityLoading, setError]);

  const reorderFavourites = useCallback(async (orderedIds: string[]): Promise<void> => {
    if (!user) {
      snackbar.error('Veuillez vous connecter pour réorganiser vos favoris');
      return;
    }

    // Validate that provided IDs match current favourites
    const currentIds = favourites.sort();
    const providedIds = [...orderedIds].sort();
    
    if (currentIds.length !== providedIds.length ||
        !currentIds.every((id: string, index: number) => id === providedIds[index])) {
      throw new Error('Les IDs d\'activité fournis ne correspondent pas aux favoris actuels');
    }

    try {
      clearError();

      await reorderFavouritesMutation({
        variables: {
          input: { activityIds: orderedIds },
        },
      });

      snackbar.success('Favoris réorganisés');
    } catch (err) {
      const errorMessage = 'Échec de la réorganisation des favoris';
      setError(errorMessage);
      snackbar.error(errorMessage);
      throw err;
    }
  }, [user, favourites, reorderFavouritesMutation, snackbar, clearError, setError]);

  return {
    addToFavourites,
    removeFromFavourites,
    reorderFavourites,
  };
}
