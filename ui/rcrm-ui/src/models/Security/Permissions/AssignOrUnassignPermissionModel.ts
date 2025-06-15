import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { UserLookupModel } from "@/models/Users/UserLookupModel";

export interface AssignOrUnassignPermissionModel {
  users: UserLookupModel[];
  securityGroups: KeyValuePair<string, string>[];
  action: PermissionsActions;
}
