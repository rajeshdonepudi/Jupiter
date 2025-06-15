export interface UserInRoleModel {
  userId: string;
  email: string;
  resourceAlias: string;
  tenantInfo: TenantInfoModel[];
}

export interface TenantInfoModel {
  id: string;
  name: string;
}
