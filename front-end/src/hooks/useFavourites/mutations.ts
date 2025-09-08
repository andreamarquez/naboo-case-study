import { useMutation } from '@apollo/client';
import { ADD_TO_FAVOURITES } from '@/graphql/mutations/user/addToFavourites';
import { REMOVE_FROM_FAVOURITES } from '@/graphql/mutations/user/removeFromFavourites';
import { REORDER_FAVOURITES } from '@/graphql/mutations/user/reorderFavourites';
import GetUser from '@/graphql/queries/auth/getUser';

export function useFavouritesMutations() {
  const [addToFavouritesMutation] = useMutation(ADD_TO_FAVOURITES, {
    update: (cache, { data }) => {
      if (data?.addToFavourites?.favouriteActivities) {
        // Update the user in the cache with new favourites
        cache.writeQuery({
          query: GetUser,
          data: {
            getMe: data.addToFavourites
          }
        });
      }
    }
  });

  const [removeFromFavouritesMutation] = useMutation(REMOVE_FROM_FAVOURITES, {
    update: (cache, { data }) => {
      if (data?.removeFromFavourites?.favouriteActivities !== undefined) {
        // Update the user in the cache with updated favourites
        cache.writeQuery({
          query: GetUser,
          data: {
            getMe: data.removeFromFavourites
          }
        });
      }
    }
  });

  const [reorderFavouritesMutation] = useMutation(REORDER_FAVOURITES, {
    update: (cache, { data }) => {
      if (data?.reorderFavourites?.favouriteActivities) {
        // Update the user in the cache with reordered favourites
        cache.writeQuery({
          query: GetUser,
          data: {
            getMe: data.reorderFavourites
          }
        });
      }
    }
  });

  return {
    addToFavouritesMutation,
    removeFromFavouritesMutation,
    reorderFavouritesMutation,
  };
}
