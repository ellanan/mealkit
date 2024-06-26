import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
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
  ingredientTypes: Array<IngredientType>;
  ingredients: Array<Ingredient>;
  popularRecipes: Array<Recipe>;
  recipe?: Maybe<Recipe>;
  recipes: Array<Recipe>;
  schedule: Array<MealPlanEntry>;
};


export type MealPlanPopularRecipesArgs = {
  endDate: Scalars['String'];
  limit?: Scalars['Int'];
  startDate: Scalars['String'];
};


export type MealPlanRecipeArgs = {
  recipeId: Scalars['ID'];
};


export type MealPlanRecipesArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  limit?: Scalars['Int'];
  order?: Order;
  orderBy?: RecipeOrderBy;
  search?: InputMaybe<Scalars['String']>;
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
  deleteAllMealPlanEntries?: Maybe<Scalars['Int']>;
  deleteIngredientType?: Maybe<IngredientType>;
  deleteMealPlanEntry?: Maybe<MealPlanEntry>;
  deleteRecipe?: Maybe<Recipe>;
  editIngredientType?: Maybe<IngredientType>;
  editRecipe?: Maybe<Recipe>;
  initWithData?: Maybe<MealPlan>;
  joinMealPlan?: Maybe<MealPlan>;
  removeIngredientFromRecipe?: Maybe<Recipe>;
  updateIngredient?: Maybe<Ingredient>;
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
  ingredientTypeId?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
};


export type MutationCreateIngredientTypeArgs = {
  ingredients?: InputMaybe<Array<Scalars['ID']>>;
  name: Scalars['String'];
};


export type MutationCreateRecipeArgs = {
  content?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  ingredientQuantities: Array<IngredientQuantityInput>;
  name: Scalars['String'];
};


export type MutationDeleteAllMealPlanEntriesArgs = {
  mealPlanId: Scalars['ID'];
};


export type MutationDeleteIngredientTypeArgs = {
  ingredientTypeId: Scalars['ID'];
};


export type MutationDeleteMealPlanEntryArgs = {
  mealPlanEntryId: Scalars['ID'];
};


export type MutationDeleteRecipeArgs = {
  recipeId: Scalars['ID'];
};


export type MutationEditIngredientTypeArgs = {
  ingredientTypeId: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationEditRecipeArgs = {
  content?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  recipeId: Scalars['String'];
};


export type MutationInitWithDataArgs = {
  startDate: Scalars['String'];
};


export type MutationJoinMealPlanArgs = {
  mealPlanId: Scalars['ID'];
};


export type MutationRemoveIngredientFromRecipeArgs = {
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
};


export type MutationUpdateIngredientArgs = {
  ingredientId: Scalars['ID'];
  ingredientTypeId: Scalars['ID'];
};


export type MutationUpdateIngredientQuantityInRecipeArgs = {
  amount?: InputMaybe<Scalars['Int']>;
  ingredientId: Scalars['ID'];
  recipeId: Scalars['ID'];
  unit?: InputMaybe<Scalars['String']>;
};

export enum Order {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  currentUser?: Maybe<User>;
  ingredientTypes: Array<IngredientType>;
  ingredients: Array<Ingredient>;
  recipe?: Maybe<Recipe>;
  recipeCategories: Array<RecipeCategory>;
};


export type QueryRecipeArgs = {
  recipeId: Scalars['ID'];
};

export type Recipe = {
  __typename?: 'Recipe';
  category?: Maybe<RecipeCategory>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  ingredientQuantities: Array<RecipeIngredientQuantity>;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type RecipeCategory = {
  __typename?: 'RecipeCategory';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type RecipeIngredientQuantity = {
  __typename?: 'RecipeIngredientQuantity';
  amount: Scalars['Float'];
  ingredient: Ingredient;
  recipe: Recipe;
  unit: Scalars['String'];
};

export enum RecipeOrderBy {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  mealPlan?: Maybe<MealPlan>;
  recipes: Array<Maybe<Recipe>>;
  username?: Maybe<Scalars['String']>;
};

export type ShoppingListQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type ShoppingListQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, ingredientTypes: Array<{ __typename?: 'IngredientType', id: string, name: string }>, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', unit: string, amount: number, ingredient: { __typename?: 'Ingredient', id: string, name: string, type?: { __typename?: 'IngredientType', id: string, name: string } | null } }> } }> } | null } | null };

export type CreateIngredientTypeMutationVariables = Exact<{
  name: Scalars['String'];
  ingredients?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type CreateIngredientTypeMutation = { __typename?: 'Mutation', createIngredientType?: { __typename?: 'IngredientType', id: string, name: string } | null };

export type UpdateIngredientMutationVariables = Exact<{
  ingredientId: Scalars['ID'];
  ingredientTypeId: Scalars['ID'];
}>;


export type UpdateIngredientMutation = { __typename?: 'Mutation', updateIngredient?: { __typename?: 'Ingredient', id: string, name: string, type?: { __typename?: 'IngredientType', id: string, name: string } | null } | null };

export type EditIngredientTypeMutationVariables = Exact<{
  ingredientTypeId: Scalars['ID'];
  name: Scalars['String'];
}>;


export type EditIngredientTypeMutation = { __typename?: 'Mutation', editIngredientType?: { __typename?: 'IngredientType', id: string, name: string } | null };

export type DeleteIngredientTypeMutationVariables = Exact<{
  ingredientTypeId: Scalars['ID'];
}>;


export type DeleteIngredientTypeMutation = { __typename?: 'Mutation', deleteIngredientType?: { __typename?: 'IngredientType', id: string } | null };

export type RecipeFragmentFragment = { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null };

export type RecipesAvailableQueryVariables = Exact<{ [key: string]: never; }>;


export type RecipesAvailableQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, recipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null }> } | null } | null };

export type AddRecipeToMealPlanMutationMutationVariables = Exact<{
  mealPlanId: Scalars['ID'];
  recipeId: Scalars['ID'];
  date: Scalars['String'];
  mealType: MealType;
}>;


export type AddRecipeToMealPlanMutationMutation = { __typename?: 'Mutation', addRecipeToMealPlan?: { __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null } } | null };

export type CurrentUserMealPlanQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserMealPlanQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string } | null } | null };

export type DeleteAllMealPlanEntriesMutationVariables = Exact<{
  mealPlanId: Scalars['ID'];
}>;


export type DeleteAllMealPlanEntriesMutation = { __typename?: 'Mutation', deleteAllMealPlanEntries?: number | null };

export type MealPlanScheduleFragmentFragment = { __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null } };

export type MealScheduleQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type MealScheduleQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null } }> } | null } | null };

export type DeleteMealPlanEntryMutationMutationVariables = Exact<{
  mealPlanEntryId: Scalars['ID'];
}>;


export type DeleteMealPlanEntryMutationMutation = { __typename?: 'Mutation', deleteMealPlanEntry?: { __typename?: 'MealPlanEntry', id: string } | null };

export type MealScheduleMobileQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type MealScheduleMobileQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null } }> } | null } | null };

export type DataForCreateRecipeQueryVariables = Exact<{ [key: string]: never; }>;


export type DataForCreateRecipeQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, ingredients: Array<{ __typename?: 'Ingredient', id: string, name: string }> } | null } | null };

export type CreateRecipeMutationVariables = Exact<{
  name: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  ingredientQuantities: Array<IngredientQuantityInput> | IngredientQuantityInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null } | null };

export type CreateIngredientMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateIngredientMutation = { __typename?: 'Mutation', createIngredient: { __typename?: 'Ingredient', id: string, name: string } };

export type CheckUserRecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckUserRecipesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, recipes: Array<{ __typename?: 'Recipe', id: string, name: string }> } | null } | null };

export type InitWithDataMutationVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type InitWithDataMutation = { __typename?: 'Mutation', initWithData?: { __typename?: 'MealPlan', id: string, schedule: Array<{ __typename?: 'MealPlanEntry', id: string, date: string, mealType: MealType, recipe: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null } }> } | null };

export type MonthlyPlannedMealsQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type MonthlyPlannedMealsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, popularRecipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null }> } | null } | null };

export type SortedRecipesQueryVariables = Exact<{
  orderBy: RecipeOrderBy;
  order: Order;
  limit: Scalars['Int'];
}>;


export type SortedRecipesQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, recipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null }> } | null } | null };

export type RecipesInRecipesPageQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['ID']>;
  limit: Scalars['Int'];
  order: Order;
  orderBy: RecipeOrderBy;
  search?: InputMaybe<Scalars['String']>;
}>;


export type RecipesInRecipesPageQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, recipes: Array<{ __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null, createdAt: any, updatedAt: any }> } | null } | null };

export type SingleRecipeQueryVariables = Exact<{
  recipeId: Scalars['ID'];
}>;


export type SingleRecipeQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, recipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null, content?: string | null, category?: { __typename?: 'RecipeCategory', id: string, name: string } | null, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', unit: string, amount: number, ingredient: { __typename?: 'Ingredient', id: string, name: string } }> } | null } | null } | null };

export type IngredientsQueryVariables = Exact<{ [key: string]: never; }>;


export type IngredientsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: string, mealPlan?: { __typename?: 'MealPlan', id: string, ingredients: Array<{ __typename?: 'Ingredient', id: string, name: string }> } | null } | null };

export type EditRecipeMutationVariables = Exact<{
  recipeId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
}>;


export type EditRecipeMutation = { __typename?: 'Mutation', editRecipe?: { __typename?: 'Recipe', id: string, name: string, imageUrl?: string | null, content?: string | null } | null };

export type DeleteRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
}>;


export type DeleteRecipeMutation = { __typename?: 'Mutation', deleteRecipe?: { __typename?: 'Recipe', id: string } | null };

export type AddIngredientQuantityToRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientQuantity: IngredientQuantityInput;
}>;


export type AddIngredientQuantityToRecipeMutation = { __typename?: 'Mutation', addIngredientQuantityToRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', amount: number, unit: string, ingredient: { __typename?: 'Ingredient', id: string, name: string } }> } | null };

export type RemoveIngredientFromRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientId: Scalars['ID'];
}>;


export type RemoveIngredientFromRecipeMutation = { __typename?: 'Mutation', removeIngredientFromRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', ingredient: { __typename?: 'Ingredient', id: string } }> } | null };

export type UpdateIngredientQuantityInRecipeMutationVariables = Exact<{
  recipeId: Scalars['ID'];
  ingredientId: Scalars['ID'];
  amount?: InputMaybe<Scalars['Int']>;
  unit?: InputMaybe<Scalars['String']>;
}>;


export type UpdateIngredientQuantityInRecipeMutation = { __typename?: 'Mutation', updateIngredientQuantityInRecipe?: { __typename?: 'Recipe', id: string, ingredientQuantities: Array<{ __typename?: 'RecipeIngredientQuantity', amount: number, unit: string, ingredient: { __typename?: 'Ingredient', id: string }, recipe: { __typename?: 'Recipe', id: string } }> } | null };

export type JoinMealPlanMutationVariables = Exact<{
  mealPlanId: Scalars['ID'];
}>;


export type JoinMealPlanMutation = { __typename?: 'Mutation', joinMealPlan?: { __typename?: 'MealPlan', id: string } | null };

export const RecipeFragmentFragmentDoc = gql`
    fragment RecipeFragment on Recipe {
  id
  name
  imageUrl
}
    `;
export const MealPlanScheduleFragmentFragmentDoc = gql`
    fragment MealPlanScheduleFragment on MealPlanEntry {
  id
  date
  mealType
  recipe {
    id
    name
    imageUrl
  }
}
    `;
export const ShoppingListDocument = gql`
    query ShoppingList($startDate: String!, $endDate: String!) {
  currentUser {
    id
    mealPlan {
      id
      ingredientTypes {
        id
        name
      }
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
export const CreateIngredientTypeDocument = gql`
    mutation CreateIngredientType($name: String!, $ingredients: [ID!]) {
  createIngredientType(name: $name, ingredients: $ingredients) {
    id
    name
  }
}
    `;
export type CreateIngredientTypeMutationFn = Apollo.MutationFunction<CreateIngredientTypeMutation, CreateIngredientTypeMutationVariables>;

/**
 * __useCreateIngredientTypeMutation__
 *
 * To run a mutation, you first call `useCreateIngredientTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateIngredientTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createIngredientTypeMutation, { data, loading, error }] = useCreateIngredientTypeMutation({
 *   variables: {
 *      name: // value for 'name'
 *      ingredients: // value for 'ingredients'
 *   },
 * });
 */
export function useCreateIngredientTypeMutation(baseOptions?: Apollo.MutationHookOptions<CreateIngredientTypeMutation, CreateIngredientTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateIngredientTypeMutation, CreateIngredientTypeMutationVariables>(CreateIngredientTypeDocument, options);
      }
export type CreateIngredientTypeMutationHookResult = ReturnType<typeof useCreateIngredientTypeMutation>;
export type CreateIngredientTypeMutationResult = Apollo.MutationResult<CreateIngredientTypeMutation>;
export type CreateIngredientTypeMutationOptions = Apollo.BaseMutationOptions<CreateIngredientTypeMutation, CreateIngredientTypeMutationVariables>;
export const UpdateIngredientDocument = gql`
    mutation UpdateIngredient($ingredientId: ID!, $ingredientTypeId: ID!) {
  updateIngredient(
    ingredientId: $ingredientId
    ingredientTypeId: $ingredientTypeId
  ) {
    id
    name
    type {
      id
      name
    }
  }
}
    `;
export type UpdateIngredientMutationFn = Apollo.MutationFunction<UpdateIngredientMutation, UpdateIngredientMutationVariables>;

/**
 * __useUpdateIngredientMutation__
 *
 * To run a mutation, you first call `useUpdateIngredientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateIngredientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateIngredientMutation, { data, loading, error }] = useUpdateIngredientMutation({
 *   variables: {
 *      ingredientId: // value for 'ingredientId'
 *      ingredientTypeId: // value for 'ingredientTypeId'
 *   },
 * });
 */
export function useUpdateIngredientMutation(baseOptions?: Apollo.MutationHookOptions<UpdateIngredientMutation, UpdateIngredientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateIngredientMutation, UpdateIngredientMutationVariables>(UpdateIngredientDocument, options);
      }
export type UpdateIngredientMutationHookResult = ReturnType<typeof useUpdateIngredientMutation>;
export type UpdateIngredientMutationResult = Apollo.MutationResult<UpdateIngredientMutation>;
export type UpdateIngredientMutationOptions = Apollo.BaseMutationOptions<UpdateIngredientMutation, UpdateIngredientMutationVariables>;
export const EditIngredientTypeDocument = gql`
    mutation EditIngredientType($ingredientTypeId: ID!, $name: String!) {
  editIngredientType(ingredientTypeId: $ingredientTypeId, name: $name) {
    id
    name
  }
}
    `;
export type EditIngredientTypeMutationFn = Apollo.MutationFunction<EditIngredientTypeMutation, EditIngredientTypeMutationVariables>;

/**
 * __useEditIngredientTypeMutation__
 *
 * To run a mutation, you first call `useEditIngredientTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditIngredientTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editIngredientTypeMutation, { data, loading, error }] = useEditIngredientTypeMutation({
 *   variables: {
 *      ingredientTypeId: // value for 'ingredientTypeId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditIngredientTypeMutation(baseOptions?: Apollo.MutationHookOptions<EditIngredientTypeMutation, EditIngredientTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditIngredientTypeMutation, EditIngredientTypeMutationVariables>(EditIngredientTypeDocument, options);
      }
export type EditIngredientTypeMutationHookResult = ReturnType<typeof useEditIngredientTypeMutation>;
export type EditIngredientTypeMutationResult = Apollo.MutationResult<EditIngredientTypeMutation>;
export type EditIngredientTypeMutationOptions = Apollo.BaseMutationOptions<EditIngredientTypeMutation, EditIngredientTypeMutationVariables>;
export const DeleteIngredientTypeDocument = gql`
    mutation DeleteIngredientType($ingredientTypeId: ID!) {
  deleteIngredientType(ingredientTypeId: $ingredientTypeId) {
    id
  }
}
    `;
export type DeleteIngredientTypeMutationFn = Apollo.MutationFunction<DeleteIngredientTypeMutation, DeleteIngredientTypeMutationVariables>;

/**
 * __useDeleteIngredientTypeMutation__
 *
 * To run a mutation, you first call `useDeleteIngredientTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteIngredientTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteIngredientTypeMutation, { data, loading, error }] = useDeleteIngredientTypeMutation({
 *   variables: {
 *      ingredientTypeId: // value for 'ingredientTypeId'
 *   },
 * });
 */
export function useDeleteIngredientTypeMutation(baseOptions?: Apollo.MutationHookOptions<DeleteIngredientTypeMutation, DeleteIngredientTypeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteIngredientTypeMutation, DeleteIngredientTypeMutationVariables>(DeleteIngredientTypeDocument, options);
      }
export type DeleteIngredientTypeMutationHookResult = ReturnType<typeof useDeleteIngredientTypeMutation>;
export type DeleteIngredientTypeMutationResult = Apollo.MutationResult<DeleteIngredientTypeMutation>;
export type DeleteIngredientTypeMutationOptions = Apollo.BaseMutationOptions<DeleteIngredientTypeMutation, DeleteIngredientTypeMutationVariables>;
export const RecipesAvailableDocument = gql`
    query RecipesAvailable {
  currentUser {
    id
    mealPlan {
      id
      recipes {
        ...RecipeFragment
      }
    }
  }
}
    ${RecipeFragmentFragmentDoc}`;

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
export const CurrentUserMealPlanDocument = gql`
    query CurrentUserMealPlan {
  currentUser {
    id
    mealPlan {
      id
    }
  }
}
    `;

/**
 * __useCurrentUserMealPlanQuery__
 *
 * To run a query within a React component, call `useCurrentUserMealPlanQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserMealPlanQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserMealPlanQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserMealPlanQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserMealPlanQuery, CurrentUserMealPlanQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserMealPlanQuery, CurrentUserMealPlanQueryVariables>(CurrentUserMealPlanDocument, options);
      }
export function useCurrentUserMealPlanLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserMealPlanQuery, CurrentUserMealPlanQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserMealPlanQuery, CurrentUserMealPlanQueryVariables>(CurrentUserMealPlanDocument, options);
        }
export type CurrentUserMealPlanQueryHookResult = ReturnType<typeof useCurrentUserMealPlanQuery>;
export type CurrentUserMealPlanLazyQueryHookResult = ReturnType<typeof useCurrentUserMealPlanLazyQuery>;
export type CurrentUserMealPlanQueryResult = Apollo.QueryResult<CurrentUserMealPlanQuery, CurrentUserMealPlanQueryVariables>;
export const DeleteAllMealPlanEntriesDocument = gql`
    mutation DeleteAllMealPlanEntries($mealPlanId: ID!) {
  deleteAllMealPlanEntries(mealPlanId: $mealPlanId)
}
    `;
export type DeleteAllMealPlanEntriesMutationFn = Apollo.MutationFunction<DeleteAllMealPlanEntriesMutation, DeleteAllMealPlanEntriesMutationVariables>;

/**
 * __useDeleteAllMealPlanEntriesMutation__
 *
 * To run a mutation, you first call `useDeleteAllMealPlanEntriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAllMealPlanEntriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAllMealPlanEntriesMutation, { data, loading, error }] = useDeleteAllMealPlanEntriesMutation({
 *   variables: {
 *      mealPlanId: // value for 'mealPlanId'
 *   },
 * });
 */
export function useDeleteAllMealPlanEntriesMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAllMealPlanEntriesMutation, DeleteAllMealPlanEntriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAllMealPlanEntriesMutation, DeleteAllMealPlanEntriesMutationVariables>(DeleteAllMealPlanEntriesDocument, options);
      }
export type DeleteAllMealPlanEntriesMutationHookResult = ReturnType<typeof useDeleteAllMealPlanEntriesMutation>;
export type DeleteAllMealPlanEntriesMutationResult = Apollo.MutationResult<DeleteAllMealPlanEntriesMutation>;
export type DeleteAllMealPlanEntriesMutationOptions = Apollo.BaseMutationOptions<DeleteAllMealPlanEntriesMutation, DeleteAllMealPlanEntriesMutationVariables>;
export const MealScheduleDocument = gql`
    query MealSchedule($startDate: String!, $endDate: String!) {
  currentUser {
    id
    mealPlan {
      id
      schedule(startDate: $startDate, endDate: $endDate) {
        ...MealPlanScheduleFragment
      }
    }
  }
}
    ${MealPlanScheduleFragmentFragmentDoc}`;

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
export const MealScheduleMobileDocument = gql`
    query MealScheduleMobile($startDate: String!, $endDate: String!) {
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
 * __useMealScheduleMobileQuery__
 *
 * To run a query within a React component, call `useMealScheduleMobileQuery` and pass it any options that fit your needs.
 * When your component renders, `useMealScheduleMobileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMealScheduleMobileQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useMealScheduleMobileQuery(baseOptions: Apollo.QueryHookOptions<MealScheduleMobileQuery, MealScheduleMobileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MealScheduleMobileQuery, MealScheduleMobileQueryVariables>(MealScheduleMobileDocument, options);
      }
export function useMealScheduleMobileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MealScheduleMobileQuery, MealScheduleMobileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MealScheduleMobileQuery, MealScheduleMobileQueryVariables>(MealScheduleMobileDocument, options);
        }
export type MealScheduleMobileQueryHookResult = ReturnType<typeof useMealScheduleMobileQuery>;
export type MealScheduleMobileLazyQueryHookResult = ReturnType<typeof useMealScheduleMobileLazyQuery>;
export type MealScheduleMobileQueryResult = Apollo.QueryResult<MealScheduleMobileQuery, MealScheduleMobileQueryVariables>;
export const DataForCreateRecipeDocument = gql`
    query DataForCreateRecipe {
  currentUser {
    id
    mealPlan {
      id
      ingredients {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useDataForCreateRecipeQuery__
 *
 * To run a query within a React component, call `useDataForCreateRecipeQuery` and pass it any options that fit your needs.
 * When your component renders, `useDataForCreateRecipeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDataForCreateRecipeQuery({
 *   variables: {
 *   },
 * });
 */
export function useDataForCreateRecipeQuery(baseOptions?: Apollo.QueryHookOptions<DataForCreateRecipeQuery, DataForCreateRecipeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DataForCreateRecipeQuery, DataForCreateRecipeQueryVariables>(DataForCreateRecipeDocument, options);
      }
export function useDataForCreateRecipeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DataForCreateRecipeQuery, DataForCreateRecipeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DataForCreateRecipeQuery, DataForCreateRecipeQueryVariables>(DataForCreateRecipeDocument, options);
        }
export type DataForCreateRecipeQueryHookResult = ReturnType<typeof useDataForCreateRecipeQuery>;
export type DataForCreateRecipeLazyQueryHookResult = ReturnType<typeof useDataForCreateRecipeLazyQuery>;
export type DataForCreateRecipeQueryResult = Apollo.QueryResult<DataForCreateRecipeQuery, DataForCreateRecipeQueryVariables>;
export const CreateRecipeDocument = gql`
    mutation CreateRecipe($name: String!, $imageUrl: String, $content: String!, $ingredientQuantities: [IngredientQuantityInput!]!) {
  createRecipe(
    name: $name
    imageUrl: $imageUrl
    content: $content
    ingredientQuantities: $ingredientQuantities
  ) {
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
export const CheckUserRecipesDocument = gql`
    query CheckUserRecipes {
  currentUser {
    id
    mealPlan {
      recipes {
        id
        name
      }
      id
    }
  }
}
    `;

/**
 * __useCheckUserRecipesQuery__
 *
 * To run a query within a React component, call `useCheckUserRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUserRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUserRecipesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCheckUserRecipesQuery(baseOptions?: Apollo.QueryHookOptions<CheckUserRecipesQuery, CheckUserRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckUserRecipesQuery, CheckUserRecipesQueryVariables>(CheckUserRecipesDocument, options);
      }
export function useCheckUserRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUserRecipesQuery, CheckUserRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckUserRecipesQuery, CheckUserRecipesQueryVariables>(CheckUserRecipesDocument, options);
        }
export type CheckUserRecipesQueryHookResult = ReturnType<typeof useCheckUserRecipesQuery>;
export type CheckUserRecipesLazyQueryHookResult = ReturnType<typeof useCheckUserRecipesLazyQuery>;
export type CheckUserRecipesQueryResult = Apollo.QueryResult<CheckUserRecipesQuery, CheckUserRecipesQueryVariables>;
export const InitWithDataDocument = gql`
    mutation InitWithData($startDate: String!, $endDate: String!) {
  initWithData(startDate: $startDate) {
    id
    schedule(startDate: $startDate, endDate: $endDate) {
      ...MealPlanScheduleFragment
      recipe {
        ...RecipeFragment
      }
    }
  }
}
    ${MealPlanScheduleFragmentFragmentDoc}
${RecipeFragmentFragmentDoc}`;
export type InitWithDataMutationFn = Apollo.MutationFunction<InitWithDataMutation, InitWithDataMutationVariables>;

/**
 * __useInitWithDataMutation__
 *
 * To run a mutation, you first call `useInitWithDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInitWithDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [initWithDataMutation, { data, loading, error }] = useInitWithDataMutation({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useInitWithDataMutation(baseOptions?: Apollo.MutationHookOptions<InitWithDataMutation, InitWithDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InitWithDataMutation, InitWithDataMutationVariables>(InitWithDataDocument, options);
      }
export type InitWithDataMutationHookResult = ReturnType<typeof useInitWithDataMutation>;
export type InitWithDataMutationResult = Apollo.MutationResult<InitWithDataMutation>;
export type InitWithDataMutationOptions = Apollo.BaseMutationOptions<InitWithDataMutation, InitWithDataMutationVariables>;
export const MonthlyPlannedMealsDocument = gql`
    query MonthlyPlannedMeals($startDate: String!, $endDate: String!) {
  currentUser {
    id
    mealPlan {
      id
      popularRecipes(startDate: $startDate, endDate: $endDate, limit: 3) {
        id
        name
        imageUrl
      }
    }
  }
}
    `;

/**
 * __useMonthlyPlannedMealsQuery__
 *
 * To run a query within a React component, call `useMonthlyPlannedMealsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMonthlyPlannedMealsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMonthlyPlannedMealsQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useMonthlyPlannedMealsQuery(baseOptions: Apollo.QueryHookOptions<MonthlyPlannedMealsQuery, MonthlyPlannedMealsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MonthlyPlannedMealsQuery, MonthlyPlannedMealsQueryVariables>(MonthlyPlannedMealsDocument, options);
      }
export function useMonthlyPlannedMealsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MonthlyPlannedMealsQuery, MonthlyPlannedMealsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MonthlyPlannedMealsQuery, MonthlyPlannedMealsQueryVariables>(MonthlyPlannedMealsDocument, options);
        }
export type MonthlyPlannedMealsQueryHookResult = ReturnType<typeof useMonthlyPlannedMealsQuery>;
export type MonthlyPlannedMealsLazyQueryHookResult = ReturnType<typeof useMonthlyPlannedMealsLazyQuery>;
export type MonthlyPlannedMealsQueryResult = Apollo.QueryResult<MonthlyPlannedMealsQuery, MonthlyPlannedMealsQueryVariables>;
export const SortedRecipesDocument = gql`
    query SortedRecipes($orderBy: RecipeOrderBy!, $order: Order!, $limit: Int!) {
  currentUser {
    id
    mealPlan {
      id
      recipes(orderBy: $orderBy, order: $order, limit: $limit) {
        id
        name
        imageUrl
      }
    }
  }
}
    `;

/**
 * __useSortedRecipesQuery__
 *
 * To run a query within a React component, call `useSortedRecipesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSortedRecipesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSortedRecipesQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      order: // value for 'order'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useSortedRecipesQuery(baseOptions: Apollo.QueryHookOptions<SortedRecipesQuery, SortedRecipesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SortedRecipesQuery, SortedRecipesQueryVariables>(SortedRecipesDocument, options);
      }
export function useSortedRecipesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SortedRecipesQuery, SortedRecipesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SortedRecipesQuery, SortedRecipesQueryVariables>(SortedRecipesDocument, options);
        }
export type SortedRecipesQueryHookResult = ReturnType<typeof useSortedRecipesQuery>;
export type SortedRecipesLazyQueryHookResult = ReturnType<typeof useSortedRecipesLazyQuery>;
export type SortedRecipesQueryResult = Apollo.QueryResult<SortedRecipesQuery, SortedRecipesQueryVariables>;
export const RecipesInRecipesPageDocument = gql`
    query RecipesInRecipesPage($cursor: ID, $limit: Int!, $order: Order!, $orderBy: RecipeOrderBy!, $search: String) {
  currentUser {
    id
    mealPlan {
      id
      recipes(
        cursor: $cursor
        limit: $limit
        order: $order
        orderBy: $orderBy
        search: $search
      ) {
        id
        name
        imageUrl
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useRecipesInRecipesPageQuery__
 *
 * To run a query within a React component, call `useRecipesInRecipesPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecipesInRecipesPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecipesInRecipesPageQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      limit: // value for 'limit'
 *      order: // value for 'order'
 *      orderBy: // value for 'orderBy'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useRecipesInRecipesPageQuery(baseOptions: Apollo.QueryHookOptions<RecipesInRecipesPageQuery, RecipesInRecipesPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecipesInRecipesPageQuery, RecipesInRecipesPageQueryVariables>(RecipesInRecipesPageDocument, options);
      }
export function useRecipesInRecipesPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecipesInRecipesPageQuery, RecipesInRecipesPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecipesInRecipesPageQuery, RecipesInRecipesPageQueryVariables>(RecipesInRecipesPageDocument, options);
        }
export type RecipesInRecipesPageQueryHookResult = ReturnType<typeof useRecipesInRecipesPageQuery>;
export type RecipesInRecipesPageLazyQueryHookResult = ReturnType<typeof useRecipesInRecipesPageLazyQuery>;
export type RecipesInRecipesPageQueryResult = Apollo.QueryResult<RecipesInRecipesPageQuery, RecipesInRecipesPageQueryVariables>;
export const SingleRecipeDocument = gql`
    query SingleRecipe($recipeId: ID!) {
  currentUser {
    id
    mealPlan {
      id
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
export const IngredientsDocument = gql`
    query Ingredients {
  currentUser {
    id
    mealPlan {
      id
      ingredients {
        id
        name
      }
    }
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
export const JoinMealPlanDocument = gql`
    mutation JoinMealPlan($mealPlanId: ID!) {
  joinMealPlan(mealPlanId: $mealPlanId) {
    id
  }
}
    `;
export type JoinMealPlanMutationFn = Apollo.MutationFunction<JoinMealPlanMutation, JoinMealPlanMutationVariables>;

/**
 * __useJoinMealPlanMutation__
 *
 * To run a mutation, you first call `useJoinMealPlanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinMealPlanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinMealPlanMutation, { data, loading, error }] = useJoinMealPlanMutation({
 *   variables: {
 *      mealPlanId: // value for 'mealPlanId'
 *   },
 * });
 */
export function useJoinMealPlanMutation(baseOptions?: Apollo.MutationHookOptions<JoinMealPlanMutation, JoinMealPlanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinMealPlanMutation, JoinMealPlanMutationVariables>(JoinMealPlanDocument, options);
      }
export type JoinMealPlanMutationHookResult = ReturnType<typeof useJoinMealPlanMutation>;
export type JoinMealPlanMutationResult = Apollo.MutationResult<JoinMealPlanMutation>;
export type JoinMealPlanMutationOptions = Apollo.BaseMutationOptions<JoinMealPlanMutation, JoinMealPlanMutationVariables>;