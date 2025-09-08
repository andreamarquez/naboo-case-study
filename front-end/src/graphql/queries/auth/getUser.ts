import gql from "graphql-tag";

const GetUser = gql`
  query GetUser {
    getMe {
      id
      firstName
      lastName
      email
      role
      favouriteActivities {
        id
        name
        city
        price
        description
        createdAt
        owner {
          firstName
          lastName
        }
      }
    }
  }
`;

export default GetUser;
