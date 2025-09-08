import gql from "graphql-tag";

const GetUser = gql`
  query GetUser {
    getMe {
      id
      firstName
      lastName
      email
      favouriteActivities {
        id
        name
        city
        price
        description
        owner {
          firstName
          lastName
        }
      }
    }
  }
`;

export default GetUser;
