import { Transaction } from '@sentry/types';

export type Context = {
  currentUser: {
    id: string;
  } | null;
  transaction: Transaction;
};
