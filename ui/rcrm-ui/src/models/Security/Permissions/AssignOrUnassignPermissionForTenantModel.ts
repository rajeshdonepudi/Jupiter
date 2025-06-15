import { KeyValuePair } from "@/models/Common/KeyValuePair";

export interface AssignOrUnassignPermissionForTenantModel {
  tenants: KeyValuePair<string, string>[];
}
