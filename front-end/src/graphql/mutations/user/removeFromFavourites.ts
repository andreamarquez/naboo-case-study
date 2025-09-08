import { gql } from '@apollo/client';

export const REMOVE_FROM_FAVOURITES = gql`
  mutation RemoveFromFavourites($input: RemoveFromFavouritesInput!) {
    removeFromFavourites(input: $input) {
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
