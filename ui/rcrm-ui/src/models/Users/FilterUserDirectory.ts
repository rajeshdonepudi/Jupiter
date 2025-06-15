import { PageParams } from "@models/Common/PageParams";

export interface FilterUserDirectory extends PageParams {
  searchTerm: string | null;
  tenants: string[] | null;
}
