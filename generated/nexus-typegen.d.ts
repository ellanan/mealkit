/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as PrismaClient from ".prisma/client"
import type { Context as ContextModule } from "./../api/contextModule"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Ingredient: PrismaClient.Ingredient;
  IngredientType: PrismaClient.IngredientType;
  MealPlan: PrismaClient.MealPlan;
  MealPlanEntry: PrismaClient.MealPlanEntry;
  Mutation: {};
  Query: {};
  Recipe: PrismaClient.Recipe;
  RecipeCategory: PrismaClient.RecipeCategory;
  User: PrismaClient.User;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Ingredient: { // field return type
    id: string; // ID!
    name: string; // String!
    type: NexusGenRootTypes['IngredientType'] | null; // IngredientType
  }
  IngredientType: { // field return type
    id: string; // ID!
    name: string; // String!
  }
  MealPlan: { // field return type
    id: string; // ID!
    schedule: Array<NexusGenRootTypes['MealPlanEntry'] | null>; // [MealPlanEntry]!
  }
  MealPlanEntry: { // field return type
    date: string | null; // String
    id: string | null; // ID
    mealType: string | null; // String
    recipe: NexusGenRootTypes['Recipe'] | null; // Recipe
  }
  Mutation: { // field return type
    addIngredientToRecipe: NexusGenRootTypes['Recipe'] | null; // Recipe
    createIngredient: NexusGenRootTypes['Ingredient'] | null; // Ingredient
    createIngredientType: NexusGenRootTypes['IngredientType'] | null; // IngredientType
    createRecipe: NexusGenRootTypes['Recipe'] | null; // Recipe
    removeIngredientFromRecipe: NexusGenRootTypes['Recipe'] | null; // Recipe
  }
  Query: { // field return type
    allUsers: NexusGenRootTypes['User'][]; // [User!]!
    currentUser: NexusGenRootTypes['User'] | null; // User
    ingredientTypes: NexusGenRootTypes['IngredientType'][]; // [IngredientType!]!
    ingredients: NexusGenRootTypes['Ingredient'][]; // [Ingredient!]!
    recipe: NexusGenRootTypes['Recipe'] | null; // Recipe
    recipeCategories: NexusGenRootTypes['RecipeCategory'][]; // [RecipeCategory!]!
    recipes: NexusGenRootTypes['Recipe'][]; // [Recipe!]!
  }
  Recipe: { // field return type
    category: NexusGenRootTypes['RecipeCategory'] | null; // RecipeCategory
    id: string; // ID!
    ingredients: NexusGenRootTypes['Ingredient'][] | null; // [Ingredient!]
    name: string; // String!
  }
  RecipeCategory: { // field return type
    id: string; // ID!
    name: string; // String!
  }
  User: { // field return type
    email: string | null; // String
    id: string; // ID!
    mealPlan: NexusGenRootTypes['MealPlan'] | null; // MealPlan
    recipes: Array<NexusGenRootTypes['Recipe'] | null>; // [Recipe]!
    username: string | null; // String
  }
}

export interface NexusGenFieldTypeNames {
  Ingredient: { // field return type name
    id: 'ID'
    name: 'String'
    type: 'IngredientType'
  }
  IngredientType: { // field return type name
    id: 'ID'
    name: 'String'
  }
  MealPlan: { // field return type name
    id: 'ID'
    schedule: 'MealPlanEntry'
  }
  MealPlanEntry: { // field return type name
    date: 'String'
    id: 'ID'
    mealType: 'String'
    recipe: 'Recipe'
  }
  Mutation: { // field return type name
    addIngredientToRecipe: 'Recipe'
    createIngredient: 'Ingredient'
    createIngredientType: 'IngredientType'
    createRecipe: 'Recipe'
    removeIngredientFromRecipe: 'Recipe'
  }
  Query: { // field return type name
    allUsers: 'User'
    currentUser: 'User'
    ingredientTypes: 'IngredientType'
    ingredients: 'Ingredient'
    recipe: 'Recipe'
    recipeCategories: 'RecipeCategory'
    recipes: 'Recipe'
  }
  Recipe: { // field return type name
    category: 'RecipeCategory'
    id: 'ID'
    ingredients: 'Ingredient'
    name: 'String'
  }
  RecipeCategory: { // field return type name
    id: 'ID'
    name: 'String'
  }
  User: { // field return type name
    email: 'String'
    id: 'ID'
    mealPlan: 'MealPlan'
    recipes: 'Recipe'
    username: 'String'
  }
}

export interface NexusGenArgTypes {
  MealPlan: {
    schedule: { // args
      endDate: string; // String!
      startDate: string; // String!
    }
  }
  Mutation: {
    addIngredientToRecipe: { // args
      ingredientId: string; // ID!
      recipeId: string; // ID!
    }
    createIngredient: { // args
      ingredientTypeId: string; // ID!
      name: string; // String!
    }
    createIngredientType: { // args
      name: string; // String!
    }
    createRecipe: { // args
      content: string; // String!
      ingredientIds: string[]; // [ID!]!
      name: string; // String!
    }
    removeIngredientFromRecipe: { // args
      ingredientId: string; // ID!
      recipeId: string; // ID!
    }
  }
  Query: {
    recipe: { // args
      recipeId: string; // ID!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: ContextModule;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}