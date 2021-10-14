import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export type IngredientQuantityInput = {
  amount: Scalars['Int'];
  ingredientId: Scalars['String'];
  unit: Scalars['String'];
};

export type IngredientType = {
  __typename?: 'IngredientType';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type MealPlan = {
  __typename?: 'MealPlan';
  id: Scalars['ID'];
  schedule: Array<Maybe<MealPlanEntry>>;
};


export type MealPlanScheduleArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};

export type MealPlanEntry = {
  __typename?: 'MealPlanEntry';
  date?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  mealType?: Maybe<MealType>;
  recipe?: Maybe<Recipe>;
};

export enum MealType {
  Breakfast = 'BREAKFAST',
  Dinner = 'DINNER',
  Lunch = 'LUNCH'
}

export type Mutation = {
  __typename?: 'Mutation';
  addIngredientQuantityToRecipe?: Maybe<Recipe>;
  addRecipeToMealPlan?: Maybe<MealPlanEntry>;
  createIngredient: Ingredient;
  createIngredientType?: Maybe<IngredientType>;
  createRecipe?: Maybe<Recipe>;
  deleteMealPlanEntry?: Maybe<MealPlanEntry>;
  removeIngredientFromRecipe?: Maybe<Recipe>;
};


export type MutationAddIngredientQuantityToRecipeArgs = {
  ingredientQuantity: IngredientQuantityInput;
  recipeId: Scalars['ID'];
};


export type MutationAddRecipeToMealPlanArgs = {
  date: Scalars['String'];
  mealPlanId: Scalars['ID'];
  mealType: MealType;
  recipeId: Scalars['ID'];
};


export type MutationCreateIngredientArgs = {
  ingredientTypeId?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
};


export type MutationCreateIngredientTypeArgs = {
  name: Scalars['String'];
};


export type MutationCreateRecipeArgs = {
  content: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  ingredientQuantities: Array<IngredientQuantityInput>;
  name: Scalars['String'];
};


export type MutationDeleteMealPlanEntryArgs = {
  mealPlanId: Scalars['ID'];
};


export type MutationRemoveIngredientFromRecipeArgs = {
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  currentUser?: Maybe<User>;
  ingredientTypes: Array<IngredientType>;
  ingredients: Array<Ingredient>;
  recipe?: Maybe<Recipe>;
  recipeCategories: Array<RecipeCategory>;
  recipes: Array<Recipe>;
};


export type QueryRecipeArgs = {
  recipeId: Scalars['ID'];
};

export type Recipe = {
  __typename?: 'Recipe';
  category?: Maybe<RecipeCategory>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  ingredientQuantities?: Maybe<Array<RecipeIngredientQuantity>>;
  name: Scalars['String'];
};

export type RecipeCategory = {
  __typename?: 'RecipeCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type RecipeIngredientQuantity = {
  __typename?: 'RecipeIngredientQuantity';
  amount: Scalars['Int'];
  ingredient?: Maybe<Ingredient>;
  recipe?: Maybe<Recipe>;
  unit: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  mealPlan?: Maybe<MealPlan>;
  recipes: Array<Maybe<Recipe>>;
  username?: Maybe<Scalars['String']>;
};

export type RecipesAvailableQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesAvailableQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, name: string, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined }> };

export type AddRecipeToMealPlanMutationMutationVariables = Exact<{
  mealPlanId: Scalars['ID'];
  recipeId: Scalars['ID'];
  date: Scalars['String'];
  mealType: MealType;
}>;


export type AddRecipeToMealPlanMutationMutation = { __typename?: 'Mutation', addRecipeToMealPlan?: { __typename?: 'MealPlanEntry', id?: string | null | undefined } | null | undefined };

export type IngredientsQueryVariables = Exact<{ [key: string]: never; }>;


export type IngredientsQuery = { __typename?: 'Query', ingredients: Array<{ __typename?: 'Ingredient', id: string, name: string }> };

export type CreateRecipeMutationVariables = Exact<{
  name: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  ingredientQuantities: Array<IngredientQuantityInput> | IngredientQuantityInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe?: { __typename?: 'Recipe', id: string } | null | undefined };

export type CreateIngredientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: string, name: string } };

export type MealScheduleQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type MealScheduleQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id?: string | null | undefined, date?: string | null | undefined, mealType?: MealType | null | undefined, recipe?: { __typename?: 'Recipe', id: string, name: string } | null | undefined } | null | undefined> } | null | undefined } | null | undefined };

export type RecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, name: string, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined }> };

export type SingleRecipeQueryVariables = Exact<{
  recipeId: Scalars['ID'];
}>;


export type SingleRecipeQuery = { __typename?: 'Query', recipe?: { __typename?: 'Recipe', id: string, name: string } | null | undefined };


export const RecipesAvailableDocument = gql`
    query RecipesAvailable {
  recipes {
    id
    name
    category {
      id
      name
    }
  }
}
    `;

/**
 * __useRecipesAvailableQuery__
 *
 * To run a query within a React component, call `useRecipesAvailableQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesAvailableQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesAvailableQuery({
 *   variables: {
 *   },
 * });
 */
export function useRecipesAvailableQuery(baseOptions?: Apollo.QueryHookOptions<RecipesAvailableQuery, RecipesAvailableQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesAvailableQuery, RecipesAvailableQueryVariables>(RecipesAvailableDocument, options);
      }
export function useRecipesAvailableLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesAvailableQuery, RecipesAvailableQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesAvailableQuery, RecipesAvailableQueryVariables>(RecipesAvailableDocument, options);
        }
export type RecipesAvailableQueryHookResult = ReturnType<typeof useRecipesAvailableQuery>;
export type RecipesAvailableLazyQueryHookResult = ReturnType<typeof useRecipesAvailableLazyQuery>;
export type RecipesAvailableQueryResult = Apollo.QueryResult<RecipesAvailableQuery, RecipesAvailableQueryVariables>;
export const AddRecipeToMealPlanMutationDocument = gql`
    mutation AddRecipeToMealPlanMutation($mealPlanId: ID!, $recipeId: ID!, $date: String!, $mealType: MealType!) {
  addRecipeToMealPlan(
    mealPlanId: $mealPlanId
    recipeId: $recipeId
    date: $date
    mealType: $mealType
  ) {
    id
  }
}
    `;
export type AddRecipeToMealPlanMutationMutationFn = Apollo.MutationFunction<AddRecipeToMealPlanMutationMutation, AddRecipeToMealPlanMutationMutationVariables>;

/**
 * __useAddRecipeToMealPlanMutationMutation__
 *
 * To run a mutation, you first call `useAddRecipeToMealPlanMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRecipeToMealPlanMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRecipeToMealPlanMutationMutation, { data, loading, error }] = useAddRecipeToMealPlanMutationMutation({
 *   variables: {
 *      mealPlanId: // value for 'mealPlanId'
 *      recipeId: // value for 'recipeId'
 *      date: // value for 'date'
 *      mealType: // value for 'mealType'
 *   },
 * });
 */
export function useAddRecipeToMealPlanMutationMutation(baseOptions?: Apollo.MutationHookOptions<AddRecipeToMealPlanMutationMutation, AddRecipeToMealPlanMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddRecipeToMealPlanMutationMutation, AddRecipeToMealPlanMutationMutationVariables>(AddRecipeToMealPlanMutationDocument, options);
      }
export type AddRecipeToMealPlanMutationMutationHookResult = ReturnType<typeof useAddRecipeToMealPlanMutationMutation>;
export type AddRecipeToMealPlanMutationMutationResult = Apollo.MutationResult<AddRecipeToMealPlanMutationMutation>;
export type AddRecipeToMealPlanMutationMutationOptions = Apollo.BaseMutationOptions<AddRecipeToMealPlanMutationMutation, AddRecipeToMealPlanMutationMutationVariables>;
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
export function useIngredientsQuery(baseOptions?: Apollo.QueryHookOptions<IngredientsQuery, IngredientsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IngredientsQuery, IngredientsQueryVariables>(IngredientsDocument, options);
      }
export function useIngredientsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IngredientsQuery, IngredientsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IngredientsQuery, IngredientsQueryVariables>(IngredientsDocument, options);
        }
export type IngredientsQueryHookResult = ReturnType<typeof useIngredientsQuery>;
export type IngredientsLazyQueryHookResult = ReturnType<typeof useIngredientsLazyQuery>;
export type IngredientsQueryResult = Apollo.QueryResult<IngredientsQuery, IngredientsQueryVariables>;
export const CreateRecipeDocument = gql`
    mutation CreateRecipe($name: String!, $imageUrl: String, $content: String!, $ingredientQuantities: [IngredientQuantityInput!]!) {
  createRecipe(
    name: $name
    imageUrl: $imageUrl
    content: $content
    ingredientQuantities: $ingredientQuantities
  ) {
    id
  }
}
    `;
export type CreateRecipeMutationFn = Apollo.MutationFunction<CreateRecipeMutation, CreateRecipeMutationVariables>;

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
 *      imageUrl: // value for 'imageUrl'
 *      content: // value for 'content'
 *      ingredientQuantities: // value for 'ingredientQuantities'
 *   },
 * });
 */
export function useCreateRecipeMutation(baseOptions?: Apollo.MutationHookOptions<CreateRecipeMutation, CreateRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRecipeMutation, CreateRecipeMutationVariables>(CreateRecipeDocument, options);
      }
export type CreateRecipeMutationHookResult = ReturnType<typeof useCreateRecipeMutation>;
export type CreateRecipeMutationResult = Apollo.MutationResult<CreateRecipeMutation>;
export type CreateRecipeMutationOptions = Apollo.BaseMutationOptions<CreateRecipeMutation, CreateRecipeMutationVariables>;
export const CreateIngredientDocument = gql`
    mutation CreateIngredient($name: String!) {
  createIngredient(name: $name) {
    id
    name
  }
}
    `;
export type CreateIngredientMutationFn = Apollo.MutationFunction<CreateIngredientMutation, CreateIngredientMutationVariables>;

/**
 * __useCreateIngredientMutation__
 *
 * To run a mutation, you first call `useCreateIngredientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIngredientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIngredientMutation, { data, loading, error }] = useCreateIngredientMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateIngredientMutation(baseOptions?: Apollo.MutationHookOptions<CreateIngredientMutation, CreateIngredientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIngredientMutation, CreateIngredientMutationVariables>(CreateIngredientDocument, options);
      }
export type CreateIngredientMutationHookResult = ReturnType<typeof useCreateIngredientMutation>;
export type CreateIngredientMutationResult = Apollo.MutationResult<CreateIngredientMutation>;
export type CreateIngredientMutationOptions = Apollo.BaseMutationOptions<CreateIngredientMutation, CreateIngredientMutationVariables>;
export const MealScheduleDocument = gql`
    query MealSchedule($startDate: String!, $endDate: String!) {
  currentUser {
    id
    mealPlan {
      id
      schedule(startDate: $startDate, endDate: $endDate) {
        id
        date
        mealType
        recipe {
          id
          name
        }
      }
    }
  }
}
    `;

/**
 * __useMealScheduleQuery__
 *
 * To run a query within a React component, call `useMealScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useMealScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMealScheduleQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useMealScheduleQuery(baseOptions: Apollo.QueryHookOptions<MealScheduleQuery, MealScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MealScheduleQuery, MealScheduleQueryVariables>(MealScheduleDocument, options);
      }
export function useMealScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MealScheduleQuery, MealScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MealScheduleQuery, MealScheduleQueryVariables>(MealScheduleDocument, options);
        }
export type MealScheduleQueryHookResult = ReturnType<typeof useMealScheduleQuery>;
export type MealScheduleLazyQueryHookResult = ReturnType<typeof useMealScheduleLazyQuery>;
export type MealScheduleQueryResult = Apollo.QueryResult<MealScheduleQuery, MealScheduleQueryVariables>;
export const RecipesDocument = gql`
    query Recipes {
  recipes {
    id
    name
    category {
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
export function useRecipesQuery(baseOptions?: Apollo.QueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, options);
      }
export function useRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesQuery, RecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesQuery, RecipesQueryVariables>(RecipesDocument, options);
        }
export type RecipesQueryHookResult = ReturnType<typeof useRecipesQuery>;
export type RecipesLazyQueryHookResult = ReturnType<typeof useRecipesLazyQuery>;
export type RecipesQueryResult = Apollo.QueryResult<RecipesQuery, RecipesQueryVariables>;
export const SingleRecipeDocument = gql`
    query SingleRecipe($recipeId: ID!) {
  recipe(recipeId: $recipeId) {
    id
    name
  }
}
    `;

/**
 * __useSingleRecipeQuery__
 *
 * To run a query within a React component, call `useSingleRecipeQuery` and pass it any options that fit your needs.
 * When your component renders, `useSingleRecipeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSingleRecipeQuery({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useSingleRecipeQuery(baseOptions: Apollo.QueryHookOptions<SingleRecipeQuery, SingleRecipeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SingleRecipeQuery, SingleRecipeQueryVariables>(SingleRecipeDocument, options);
      }
export function useSingleRecipeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SingleRecipeQuery, SingleRecipeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SingleRecipeQuery, SingleRecipeQueryVariables>(SingleRecipeDocument, options);
        }
export type SingleRecipeQueryHookResult = ReturnType<typeof useSingleRecipeQuery>;
export type SingleRecipeLazyQueryHookResult = ReturnType<typeof useSingleRecipeLazyQuery>;
export type SingleRecipeQueryResult = Apollo.QueryResult<SingleRecipeQuery, SingleRecipeQueryVariables>;