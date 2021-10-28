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
  schedule: Array<MealPlanEntry>;
};


export type MealPlanScheduleArgs = {
  endDate: Scalars['String'];
  startDate: Scalars['String'];
};

export type MealPlanEntry = {
  __typename?: 'MealPlanEntry';
  date: Scalars['String'];
  id: Scalars['ID'];
  mealType: MealType;
  recipe: Recipe;
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
  deleteRecipe?: Maybe<Recipe>;
  editRecipe?: Maybe<Recipe>;
  removeIngredientFromRecipe?: Maybe<Recipe>;
  updateIngredientQuantityInRecipe?: Maybe<Recipe>;
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
  content?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  ingredientQuantities: Array<IngredientQuantityInput>;
  name: Scalars['String'];
};


export type MutationDeleteMealPlanEntryArgs = {
  mealPlanEntryId: Scalars['ID'];
};


export type MutationDeleteRecipeArgs = {
  recipeId: Scalars['ID'];
};


export type MutationEditRecipeArgs = {
  content?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  recipeId: Scalars['String'];
};


export type MutationRemoveIngredientFromRecipeArgs = {
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
};


export type MutationUpdateIngredientQuantityInRecipeArgs = {
  amount?: Maybe<Scalars['Int']>;
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
  unit?: Maybe<Scalars['String']>;
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
  content?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  ingredientQuantities: Array<RecipeIngredientQuantity>;
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
  ingredient: Ingredient;
  recipe: Recipe;
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


export type RecipesAvailableQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined }> };

export type AddRecipeToMealPlanMutationMutationVariables = Exact<{
  mealPlanId: Scalars['ID'];
  recipeId: Scalars['ID'];
  date: Scalars['String'];
  mealType: MealType;
}>;


export type AddRecipeToMealPlanMutationMutation = { __typename?: 'Mutation', addRecipeToMealPlan?: { __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined } } | null | undefined };

export type IngredientsQueryVariables = Exact<{ [key: string]: never; }>;


export type IngredientsQuery = { __typename?: 'Query', ingredients: Array<{ __typename?: 'Ingredient', id: string, name: string }> };

export type CreateRecipeMutationVariables = Exact<{
  name: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  ingredientQuantities: Array<IngredientQuantityInput> | IngredientQuantityInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined } | null | undefined };

export type CreateIngredientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: string, name: string } };

export type MealScheduleQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type MealScheduleQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined } }> } | null | undefined } | null | undefined };

export type DeleteMealPlanEntryMutationMutationVariables = Exact<{
  mealPlanEntryId: Scalars['ID'];
}>;


export type DeleteMealPlanEntryMutationMutation = { __typename?: 'Mutation', deleteMealPlanEntry?: { __typename?: 'MealPlanEntry', id: string } | null | undefined };

export type RecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined }> };

export type ShoppingListQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type ShoppingListQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', unit: string, amount: number, ingredient: { __typename?: 'Ingredient', id: string, name: string, type?: { __typename?: 'IngredientType', id: string, name: string } | null | undefined } }> } }> } | null | undefined } | null | undefined };

export type SingleRecipeQueryVariables = Exact<{
  recipeId: Scalars['ID'];
}>;


export type SingleRecipeQuery = { __typename?: 'Query', recipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, content?: string | null | undefined, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', unit: string, amount: number, ingredient: { __typename?: 'Ingredient', id: string, name: string } }> } | null | undefined };

export type EditRecipeMutationVariables = Exact<{
  recipeId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
}>;


export type EditRecipeMutation = { __typename?: 'Mutation', editRecipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, content?: string | null | undefined } | null | undefined };

export type DeleteRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
}>;


export type DeleteRecipeMutation = { __typename?: 'Mutation', deleteRecipe?: { __typename?: 'Recipe', id: string } | null | undefined };

export type AddIngredientQuantityToRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientQuantity: IngredientQuantityInput;
}>;


export type AddIngredientQuantityToRecipeMutation = { __typename?: 'Mutation', addIngredientQuantityToRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', amount: number, unit: string, ingredient: { __typename?: 'Ingredient', id: string, name: string } }> } | null | undefined };

export type RemoveIngredientFromRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientId: Scalars['ID'];
}>;


export type RemoveIngredientFromRecipeMutation = { __typename?: 'Mutation', removeIngredientFromRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', ingredient: { __typename?: 'Ingredient', id: string } }> } | null | undefined };

export type UpdateIngredientQuantityInRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientId: Scalars['ID'];
  amount?: Maybe<Scalars['Int']>;
  unit?: Maybe<Scalars['String']>;
}>;


export type UpdateIngredientQuantityInRecipeMutation = { __typename?: 'Mutation', updateIngredientQuantityInRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', amount: number, unit: string, ingredient: { __typename?: 'Ingredient', id: string }, recipe: { __typename?: 'Recipe', id: string } }> } | null | undefined };

export type RecipeInListFragment = { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null | undefined, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null | undefined };

export const RecipeInListFragmentDoc = gql`
    fragment RecipeInList on Recipe {
  id
  name
  imageUrl
  category {
    id
    name
  }
}
    `;
export const RecipesAvailableDocument = gql`
    query RecipesAvailable {
  recipes {
    id
    name
    imageUrl
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
    date
    mealType
    recipe {
      id
      name
      imageUrl
    }
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
    ...RecipeInList
  }
}
    ${RecipeInListFragmentDoc}`;
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
          imageUrl
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
export const DeleteMealPlanEntryMutationDocument = gql`
    mutation DeleteMealPlanEntryMutation($mealPlanEntryId: ID!) {
  deleteMealPlanEntry(mealPlanEntryId: $mealPlanEntryId) {
    id
  }
}
    `;
export type DeleteMealPlanEntryMutationMutationFn = Apollo.MutationFunction<DeleteMealPlanEntryMutationMutation, DeleteMealPlanEntryMutationMutationVariables>;

/**
 * __useDeleteMealPlanEntryMutationMutation__
 *
 * To run a mutation, you first call `useDeleteMealPlanEntryMutationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMealPlanEntryMutationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMealPlanEntryMutationMutation, { data, loading, error }] = useDeleteMealPlanEntryMutationMutation({
 *   variables: {
 *      mealPlanEntryId: // value for 'mealPlanEntryId'
 *   },
 * });
 */
export function useDeleteMealPlanEntryMutationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMealPlanEntryMutationMutation, DeleteMealPlanEntryMutationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMealPlanEntryMutationMutation, DeleteMealPlanEntryMutationMutationVariables>(DeleteMealPlanEntryMutationDocument, options);
      }
export type DeleteMealPlanEntryMutationMutationHookResult = ReturnType<typeof useDeleteMealPlanEntryMutationMutation>;
export type DeleteMealPlanEntryMutationMutationResult = Apollo.MutationResult<DeleteMealPlanEntryMutationMutation>;
export type DeleteMealPlanEntryMutationMutationOptions = Apollo.BaseMutationOptions<DeleteMealPlanEntryMutationMutation, DeleteMealPlanEntryMutationMutationVariables>;
export const RecipesDocument = gql`
    query Recipes {
  recipes {
    ...RecipeInList
  }
}
    ${RecipeInListFragmentDoc}`;

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
export const ShoppingListDocument = gql`
    query ShoppingList($startDate: String!, $endDate: String!) {
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
          ingredientQuantities {
            unit
            amount
            ingredient {
              id
              name
              type {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useShoppingListQuery__
 *
 * To run a query within a React component, call `useShoppingListQuery` and pass it any options that fit your needs.
 * When your component renders, `useShoppingListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useShoppingListQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useShoppingListQuery(baseOptions: Apollo.QueryHookOptions<ShoppingListQuery, ShoppingListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ShoppingListQuery, ShoppingListQueryVariables>(ShoppingListDocument, options);
      }
export function useShoppingListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ShoppingListQuery, ShoppingListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ShoppingListQuery, ShoppingListQueryVariables>(ShoppingListDocument, options);
        }
export type ShoppingListQueryHookResult = ReturnType<typeof useShoppingListQuery>;
export type ShoppingListLazyQueryHookResult = ReturnType<typeof useShoppingListLazyQuery>;
export type ShoppingListQueryResult = Apollo.QueryResult<ShoppingListQuery, ShoppingListQueryVariables>;
export const SingleRecipeDocument = gql`
    query SingleRecipe($recipeId: ID!) {
  recipe(recipeId: $recipeId) {
    id
    name
    imageUrl
    content
    category {
      id
      name
    }
    ingredientQuantities {
      unit
      amount
      ingredient {
        id
        name
      }
    }
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
export const EditRecipeDocument = gql`
    mutation EditRecipe($recipeId: String!, $name: String, $imageUrl: String, $content: String) {
  editRecipe(
    recipeId: $recipeId
    name: $name
    imageUrl: $imageUrl
    content: $content
  ) {
    id
    name
    imageUrl
    content
  }
}
    `;
export type EditRecipeMutationFn = Apollo.MutationFunction<EditRecipeMutation, EditRecipeMutationVariables>;

/**
 * __useEditRecipeMutation__
 *
 * To run a mutation, you first call `useEditRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editRecipeMutation, { data, loading, error }] = useEditRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      name: // value for 'name'
 *      imageUrl: // value for 'imageUrl'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useEditRecipeMutation(baseOptions?: Apollo.MutationHookOptions<EditRecipeMutation, EditRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditRecipeMutation, EditRecipeMutationVariables>(EditRecipeDocument, options);
      }
export type EditRecipeMutationHookResult = ReturnType<typeof useEditRecipeMutation>;
export type EditRecipeMutationResult = Apollo.MutationResult<EditRecipeMutation>;
export type EditRecipeMutationOptions = Apollo.BaseMutationOptions<EditRecipeMutation, EditRecipeMutationVariables>;
export const DeleteRecipeDocument = gql`
    mutation DeleteRecipe($recipeId: ID!) {
  deleteRecipe(recipeId: $recipeId) {
    id
  }
}
    `;
export type DeleteRecipeMutationFn = Apollo.MutationFunction<DeleteRecipeMutation, DeleteRecipeMutationVariables>;

/**
 * __useDeleteRecipeMutation__
 *
 * To run a mutation, you first call `useDeleteRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRecipeMutation, { data, loading, error }] = useDeleteRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *   },
 * });
 */
export function useDeleteRecipeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRecipeMutation, DeleteRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteRecipeMutation, DeleteRecipeMutationVariables>(DeleteRecipeDocument, options);
      }
export type DeleteRecipeMutationHookResult = ReturnType<typeof useDeleteRecipeMutation>;
export type DeleteRecipeMutationResult = Apollo.MutationResult<DeleteRecipeMutation>;
export type DeleteRecipeMutationOptions = Apollo.BaseMutationOptions<DeleteRecipeMutation, DeleteRecipeMutationVariables>;
export const AddIngredientQuantityToRecipeDocument = gql`
    mutation AddIngredientQuantityToRecipe($recipeId: ID!, $ingredientQuantity: IngredientQuantityInput!) {
  addIngredientQuantityToRecipe(
    recipeId: $recipeId
    ingredientQuantity: $ingredientQuantity
  ) {
    id
    ingredientQuantities {
      ingredient {
        id
        name
      }
      amount
      unit
    }
  }
}
    `;
export type AddIngredientQuantityToRecipeMutationFn = Apollo.MutationFunction<AddIngredientQuantityToRecipeMutation, AddIngredientQuantityToRecipeMutationVariables>;

/**
 * __useAddIngredientQuantityToRecipeMutation__
 *
 * To run a mutation, you first call `useAddIngredientQuantityToRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddIngredientQuantityToRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addIngredientQuantityToRecipeMutation, { data, loading, error }] = useAddIngredientQuantityToRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      ingredientQuantity: // value for 'ingredientQuantity'
 *   },
 * });
 */
export function useAddIngredientQuantityToRecipeMutation(baseOptions?: Apollo.MutationHookOptions<AddIngredientQuantityToRecipeMutation, AddIngredientQuantityToRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddIngredientQuantityToRecipeMutation, AddIngredientQuantityToRecipeMutationVariables>(AddIngredientQuantityToRecipeDocument, options);
      }
export type AddIngredientQuantityToRecipeMutationHookResult = ReturnType<typeof useAddIngredientQuantityToRecipeMutation>;
export type AddIngredientQuantityToRecipeMutationResult = Apollo.MutationResult<AddIngredientQuantityToRecipeMutation>;
export type AddIngredientQuantityToRecipeMutationOptions = Apollo.BaseMutationOptions<AddIngredientQuantityToRecipeMutation, AddIngredientQuantityToRecipeMutationVariables>;
export const RemoveIngredientFromRecipeDocument = gql`
    mutation RemoveIngredientFromRecipe($recipeId: ID!, $ingredientId: ID!) {
  removeIngredientFromRecipe(recipeId: $recipeId, ingredientId: $ingredientId) {
    id
    ingredientQuantities {
      ingredient {
        id
      }
    }
  }
}
    `;
export type RemoveIngredientFromRecipeMutationFn = Apollo.MutationFunction<RemoveIngredientFromRecipeMutation, RemoveIngredientFromRecipeMutationVariables>;

/**
 * __useRemoveIngredientFromRecipeMutation__
 *
 * To run a mutation, you first call `useRemoveIngredientFromRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveIngredientFromRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeIngredientFromRecipeMutation, { data, loading, error }] = useRemoveIngredientFromRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      ingredientId: // value for 'ingredientId'
 *   },
 * });
 */
export function useRemoveIngredientFromRecipeMutation(baseOptions?: Apollo.MutationHookOptions<RemoveIngredientFromRecipeMutation, RemoveIngredientFromRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveIngredientFromRecipeMutation, RemoveIngredientFromRecipeMutationVariables>(RemoveIngredientFromRecipeDocument, options);
      }
export type RemoveIngredientFromRecipeMutationHookResult = ReturnType<typeof useRemoveIngredientFromRecipeMutation>;
export type RemoveIngredientFromRecipeMutationResult = Apollo.MutationResult<RemoveIngredientFromRecipeMutation>;
export type RemoveIngredientFromRecipeMutationOptions = Apollo.BaseMutationOptions<RemoveIngredientFromRecipeMutation, RemoveIngredientFromRecipeMutationVariables>;
export const UpdateIngredientQuantityInRecipeDocument = gql`
    mutation UpdateIngredientQuantityInRecipe($recipeId: ID!, $ingredientId: ID!, $amount: Int, $unit: String) {
  updateIngredientQuantityInRecipe(
    recipeId: $recipeId
    ingredientId: $ingredientId
    amount: $amount
    unit: $unit
  ) {
    id
    ingredientQuantities {
      amount
      unit
      ingredient {
        id
      }
      recipe {
        id
      }
    }
  }
}
    `;
export type UpdateIngredientQuantityInRecipeMutationFn = Apollo.MutationFunction<UpdateIngredientQuantityInRecipeMutation, UpdateIngredientQuantityInRecipeMutationVariables>;

/**
 * __useUpdateIngredientQuantityInRecipeMutation__
 *
 * To run a mutation, you first call `useUpdateIngredientQuantityInRecipeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIngredientQuantityInRecipeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIngredientQuantityInRecipeMutation, { data, loading, error }] = useUpdateIngredientQuantityInRecipeMutation({
 *   variables: {
 *      recipeId: // value for 'recipeId'
 *      ingredientId: // value for 'ingredientId'
 *      amount: // value for 'amount'
 *      unit: // value for 'unit'
 *   },
 * });
 */
export function useUpdateIngredientQuantityInRecipeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIngredientQuantityInRecipeMutation, UpdateIngredientQuantityInRecipeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIngredientQuantityInRecipeMutation, UpdateIngredientQuantityInRecipeMutationVariables>(UpdateIngredientQuantityInRecipeDocument, options);
      }
export type UpdateIngredientQuantityInRecipeMutationHookResult = ReturnType<typeof useUpdateIngredientQuantityInRecipeMutation>;
export type UpdateIngredientQuantityInRecipeMutationResult = Apollo.MutationResult<UpdateIngredientQuantityInRecipeMutation>;
export type UpdateIngredientQuantityInRecipeMutationOptions = Apollo.BaseMutationOptions<UpdateIngredientQuantityInRecipeMutation, UpdateIngredientQuantityInRecipeMutationVariables>;