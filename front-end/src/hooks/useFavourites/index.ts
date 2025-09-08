import { useContext, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { AuthContext } from '@/contexts/authContext';
import GetUser from '@/graphql/queries/auth/getUser';
import { ActivityFragment } from "@/graphql/generated/types";
import { UseFavouritesReturn } from './types';
import { useFavouriteActions } from './actions';

export function useFavourites(): UseFavouritesReturn {
  const { user: authUser } = useContext(AuthContext);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Get real-time user data from Apollo cache
  const { data: userData } = useQuery(GetUser, {
    skip: !authUser,
    errorPolicy: 'ignore',
  });

  const user = userData?.getMe || authUser;

  // Extract favourites data
  const favouriteActivities = (user as any)?.favouriteActivities || [];
  const favourites = favouriteActivities.map((activity: ActivityFragment) => activity.id);

  // Helper functions
  const isFavourite = useCallback((activityId: string): boolean => {
    return favourites.includes(activityId);
  }, [favourites]);

  const isLoading = useCallback((activityId?: string): boolean => {
    if (activityId) {
      return loadingStates[activityId] || false;
    }
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  // State management helpers
  const setActivityLoading = useCallback((activityId: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [activityId]: loading,
    }));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Get action handlers
  const { addToFavourites, removeFromFavourites, reorderFavourites } = useFavouriteActions({
    user,
    favourites,
    favouriteActivities,
    isFavourite,
    setActivityLoading,
    clearError,
    setError,
  });

  return {
    favourites,
    favouriteActivities,
    isFavourite,
    addToFavourites,
    removeFromFavourites,
    reorderFavourites,
    isLoading,
    error,
  };
}
