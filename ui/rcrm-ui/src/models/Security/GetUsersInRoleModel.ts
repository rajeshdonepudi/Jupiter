import { PageParams } from "@models/Common/PageParams";

export interface GetUsersInRoleModel extends PageParams {
  roleId: string;
}
