import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import React, { useState } from 'react';

export const SearchForm = () => {
  const [search, setSearch] = useState<string>('');

  const { data, error } = useQuery<GraphQLTypes.RecipesQuery>(gql`
    query RecipesForSearchPage {
      recipes {
        id
        name
        category {
          id
          name
        }
        ingredients {
          id
          name
        }
      }
    }
  `);
  if (error) {
    throw error;
  }

  return (
    <>
      <form>
        <label htmlFor='name'>search recipes</label>
        <input
          type='text'
          id='name'
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </form>
      {data?.recipes
        .filter((recipe) =>
          recipe.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((recipe) => (
          <div>{recipe.name}</div>
        ))}
    </>
  );
};
