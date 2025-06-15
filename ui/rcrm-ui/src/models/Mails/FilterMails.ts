import { PageParams } from "@/models/Common/PageParams";

export interface FilterMail extends PageParams {
  userId: string;
  searchTerm: string | null;
}
