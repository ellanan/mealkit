import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ingredient = {
  __typename?: 'Ingredient';
  id: Scalars['ID'];
  name: Scalars['String'];
  type?: Maybe<IngredientType>;
};

export type IngredientType = {
  __typename?: 'IngredientType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addIngredientToRecipe?: Maybe<Recipe>;
  createIngredient?: Maybe<Ingredient>;
  createIngredientType?: Maybe<IngredientType>;
  createRecipe?: Maybe<Recipe>;
  removeIngredientFromRecipe?: Maybe<Recipe>;
};

export type MutationAddIngredientToRecipeArgs = {
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
};

export type MutationCreateIngredientArgs = {
  ingredientTypeId: Scalars['ID'];
  name: Scalars['String'];
};

export type MutationCreateIngredientTypeArgs = {
  name: Scalars['String'];
};

export type MutationCreateRecipeArgs = {
  content: Scalars['String'];
  ingredientIds: Array<Scalars['ID']>;
  name: Scalars['String'];
};

export type MutationRemoveIngredientFromRecipeArgs = {
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  ingredientTypes: Array<IngredientType>;
  ingredients: Array<Ingredient>;
  recipeCategories: Array<RecipeCategory>;
  recipes: Array<Recipe>;
};

export type Recipe = {
  __typename?: 'Recipe';
  category?: Maybe<RecipeCategory>;
  id: Scalars['ID'];
  ingredients?: Maybe<Array<Ingredient>>;
  name: Scalars['String'];
};

export type RecipeCategory = {
  __typename?: 'RecipeCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
};

export type IngredientsQueryVariables = Exact<{ [key: string]: never }>;

export type IngredientsQuery = {
  __typename?: 'Query';
  ingredients: Array<{ __typename?: 'Ingredient'; id: string; name: string }>;
};

export type CreateRecipeMutationVariables = Exact<{
  name: Scalars['String'];
  content: Scalars['String'];
  ingredientIds: Array<Scalars['ID']> | Scalars['ID'];
}>;

export type CreateRecipeMutation = {
  __typename?: 'Mutation';
  createRecipe?: { __typename?: 'Recipe'; id: string } | null | undefined;
};

export type RecipesQueryVariables = Exact<{ [key: string]: never }>;

export type RecipesQuery = {
  __typename?: 'Query';
  ingredientTypes: Array<{
    __typename?: 'IngredientType';
    id: string;
    name: string;
  }>;
  ingredients: Array<{
    __typename?: 'Ingredient';
    id: string;
    name: string;
    type?:
      | { __typename?: 'IngredientType'; id: string; name: string }
      | null
      | undefined;
  }>;
  recipes: Array<{
    __typename?: 'Recipe';
    id: string;
    name: string;
    category?:
      | { __typename?: 'RecipeCategory'; id: string; name: string }
      | null
      | undefined;
    ingredients?:
      | Array<{ __typename?: 'Ingredient'; id: string; name: string }>
      | null
      | undefined;
  }>;
};

export type AddIngredientToRecipeMutationVariables = Exact<{
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
}>;

export type AddIngredientToRecipeMutation = {
  __typename?: 'Mutation';
  addIngredientToRecipe?:
    | {
        __typename?: 'Recipe';
        id: string;
        ingredients?:
          | Array<{ __typename?: 'Ingredient'; id: string }>
          | null
          | undefined;
      }
    | null
    | undefined;
};

export const IngredientsDocument = gql`
  query Ingredients {
    ingredients {
      id
      name
    }
  }
`;

/**
 * __useIngredientsQuery__
 *
 * To run a query within a React component, call `useIngredientsQuery` and pass it any options that fit your needs.
 * When your component renders, `useIngredientsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIngredientsQuery({
 *   variables: {
 *   },
 * });
 */
export function useIngredientsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    IngredientsQuery,
    IngredientsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<IngredientsQuery, IngredientsQueryVariables>(
    IngredientsDocument,
    options
  );
}
export function useIngredientsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    IngredientsQuery,
    IngredientsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<IngredientsQuery, IngredientsQueryVariables>(
    IngredientsDocument,
    options
  );
}
export type IngredientsQueryHookResult = ReturnType<typeof useIngredientsQuery>;
export type IngredientsLazyQueryHookResult = ReturnType<
  typeof useIngredientsLazyQuery
>;
export type IngredientsQueryResult = Apollo.QueryResult<
  IngredientsQuery,
  IngredientsQueryVariables
>;
export const CreateRecipeDocument = gql`
  mutation CreateRecipe(
    $name: String!
    $content: String!
    $ingredientIds: [ID!]!
  ) {
    createRecipe(
      name: $name
      content: $content
      ingredientIds: $ingredientIds
    ) {
      id
    }
  }
`;
export type CreateRecipeMutationFn = Apollo.MutationFunction<
  CreateRecipeMutation,
  CreateRecipeMutationVariables
>;

/**
 * __useCreateRecipeMutation__
 *
 * To run a mutation, you first call `useCreateRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRecipeMutation, { data, loading, error }] = useCreateRecipeMutation({
 *   variables: {
 *      name: // value for 'name'
 *      content: // value for 'content'
 *      ingredientIds: // value for 'ingredientIds'
 *   },
 * });
 */
export function useCreateRecipeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateRecipeMutation,
    CreateRecipeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateRecipeMutation,
    CreateRecipeMutationVariables
  >(CreateRecipeDocument, options);
}
export type CreateRecipeMutationHookResult = ReturnType<
  typeof useCreateRecipeMutation
>;
export type CreateRecipeMutationResult =
  Apollo.MutationResult<CreateRecipeMutation>;
export type CreateRecipeMutationOptions = Apollo.BaseMutationOptions<
  CreateRecipeMutation,
  CreateRecipeMutationVariables
>;
export const RecipesDocument = gql`
  query Recipes {
    ingredientTypes {
      id
      name
    }
    ingredients {
      id
      name
      type {
        id
        name
      }
    }
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
`;

/**
 * __useRecipesQuery__
 *
 * To run a query within a React component, call `useRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecipesQuery(
  baseOptions?: Apollo.QueryHookOptions<RecipesQuery, RecipesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<RecipesQuery, RecipesQueryVariables>(
    RecipesDocument,
    options
  );
}
export function useRecipesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RecipesQuery, RecipesQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<RecipesQuery, RecipesQueryVariables>(
    RecipesDocument,
    options
  );
}
export type RecipesQueryHookResult = ReturnType<typeof useRecipesQuery>;
export type RecipesLazyQueryHookResult = ReturnType<typeof useRecipesLazyQuery>;
export type RecipesQueryResult = Apollo.QueryResult<
  RecipesQuery,
  RecipesQueryVariables
>;
export const AddIngredientToRecipeDocument = gql`
  mutation AddIngredientToRecipe($ingredientId: ID!, $recipeId: ID!) {
    addIngredientToRecipe(ingredientId: $ingredientId, recipeId: $recipeId) {
      id
      ingredients {
        id
      }
    }
  }
`;
export type AddIngredientToRecipeMutationFn = Apollo.MutationFunction<
  AddIngredientToRecipeMutation,
  AddIngredientToRecipeMutationVariables
>;

/**
 * __useAddIngredientToRecipeMutation__
 *
 * To run a mutation, you first call `useAddIngredientToRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddIngredientToRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addIngredientToRecipeMutation, { data, loading, error }] = useAddIngredientToRecipeMutation({
 *   variables: {
 *      ingredientId: // value for 'ingredientId'
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useAddIngredientToRecipeMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AddIngredientToRecipeMutation,
    AddIngredientToRecipeMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AddIngredientToRecipeMutation,
    AddIngredientToRecipeMutationVariables
  >(AddIngredientToRecipeDocument, options);
}
export type AddIngredientToRecipeMutationHookResult = ReturnType<
  typeof useAddIngredientToRecipeMutation
>;
export type AddIngredientToRecipeMutationResult =
  Apollo.MutationResult<AddIngredientToRecipeMutation>;
export type AddIngredientToRecipeMutationOptions = Apollo.BaseMutationOptions<
  AddIngredientToRecipeMutation,
  AddIngredientToRecipeMutationVariables
>;
