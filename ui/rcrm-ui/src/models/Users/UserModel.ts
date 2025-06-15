export interface UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  resourceAlias: string;
  lockoutEnd: Date;
  isLocked: boolean;
  fullName: string;
  lockoutProbability: string;
  avatar: string;
}

export interface UserProfileInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  phone: string;
}

export interface UserBasicDetails {
  id: string;
  email: string;
  fullName: string;
  resourceAlias: string;
  profilePicture: string;
}
