import { KeyValuePair } from "@/models/Common/KeyValuePair";

export interface GroupedPermissions {
  id: string;
  name: string;
  permissions: KeyValuePair<string, string>[];
}
