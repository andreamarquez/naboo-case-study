import gql from "graphql-tag";

const GetActivitiesWithDebugInfo = gql`
  query GetActivitiesWithDebugInfo {
    getActivitiesWithDebugInfo {
      id
      name
      description
      city
      price
      createdAt
      owner {
        id
        firstName
        lastName
      }
    }
  }
`;

export default GetActivitiesWithDebugInfo;
