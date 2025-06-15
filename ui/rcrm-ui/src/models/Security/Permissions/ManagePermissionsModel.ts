import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";

export interface ManagePermissionsModel {
  users: string[];
  securityGroups: string[];
  permissions: string[];
  action: PermissionsActions;
}
