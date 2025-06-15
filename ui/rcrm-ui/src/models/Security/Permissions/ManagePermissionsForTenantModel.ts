import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";

export interface ManagePermissionsForTenantModel {
  tenants: string[];
  permissions: string[];
  action: PermissionsActions;
}
