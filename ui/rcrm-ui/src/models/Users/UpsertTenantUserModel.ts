import { UpsertUserModel } from "./UpsertUserModel";

export interface UpsertTenantUserModel extends UpsertUserModel {
  accountAlias: string;
}
