import { gql } from '@apollo/client';

export const REORDER_FAVOURITES = gql`
  mutation ReorderFavourites($input: ReorderFavouritesInput!) {
    reorderFavourites(input: $input) {
      id
      favouriteActivities {
        id
        name
        city
        price
        description
      }
    }
  }
`;
