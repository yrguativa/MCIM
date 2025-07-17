import { gql } from '@apollo/client';

export const SEARCH_DISCIPLES = gql`
  query SearchDisciples($searchTerm: String!) {
    searchDisciples(searchTerm: $searchTerm) {
      id
      name
      lastName
    }
  }
`;
