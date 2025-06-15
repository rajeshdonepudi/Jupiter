import { ThemePreferenceEnum } from "@/enumerations/Theme/ThemePreferenceEnum";

export interface SiteTheme {
  id: string;
  isPrimary: boolean;
  primaryColor: string;
  secondaryColor: string;
  themePreference: ThemePreferenceEnum;
  fontFamily: string;
}
