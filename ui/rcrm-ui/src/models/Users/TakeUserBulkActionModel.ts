import { UserBulkActionsEnum } from "@/enumerations/Users/user-bulk-action.enum";

export interface TakeUserBulkAction {
  resourceAliases: string[];
  action: UserBulkActionsEnum;
}
