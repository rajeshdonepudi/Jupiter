import { ThemePreferenceEnum } from "@/enumerations/Theme/ThemePreferenceEnum";

export interface UpsertSiteTheme {
  id: string;
  isPrimary: boolean;
  themePreference: ThemePreferenceEnum;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}
