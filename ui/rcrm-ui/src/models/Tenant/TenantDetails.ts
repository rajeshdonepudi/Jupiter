export interface TenantDetails {
  id: string;
  name: string;
  accountId: number;
  accountAlias: string;
  host: string;
  modifiedOn: string | null;
  createdOn: string;
  profilePicture: string;
  isDeleted: boolean;
  deletedOn: string;
  userCount: number;
  themesCount: number;
}

export interface TenantBasicDetail {
  image: string;
  name: string;
  accountAlias: string;
}
