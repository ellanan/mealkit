import { Transaction } from "@sentry/types";

export type Context = {
  currentUser: {
    id: string;
    mealPlanId: string;
  } | null;
  transaction: Transaction;
};
