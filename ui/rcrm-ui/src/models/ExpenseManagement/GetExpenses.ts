import { PageParams } from "../Common/PageParams";

export interface GetExpenses extends PageParams {
  searchParams: string | null;
}

export interface GetExpenseCategories extends PageParams {
  searchParams: string | null;
}

export interface BasicExpenseCategory {
  id: string;
  name: string;
  description: string;
}
