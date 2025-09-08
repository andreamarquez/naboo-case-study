import { gql } from '@apollo/client';

export const ADD_TO_FAVOURITES = gql`
  mutation AddToFavourites($input: AddToFavouritesInput!) {
    addToFavourites(input: $input) {
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
