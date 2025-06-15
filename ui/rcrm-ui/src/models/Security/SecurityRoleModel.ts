export interface SecurityRole {
  id: string;
  name: string | null;
  normalizedName: string | null;
  modifiedOn: string | null;
  createdOn: string;
  usersInRole: number;
}

export interface SecurityGroupBasicDetails {
  id: string;
  usersInGroup: number;
  name: string;
  createdOn: string;
  modifiedOn: string | null;
}
