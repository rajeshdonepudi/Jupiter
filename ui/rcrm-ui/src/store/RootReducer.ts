import { combineReducers } from "@reduxjs/toolkit";
import { accountAPI } from "@services/Auth/AccountService";
import { userManagementAPI } from "@/services/User/UserManagementService";
import { rolesAPI } from "@/services/Security/RoleService";
import { authSlice } from "@slices/authSlice";
import { settingsAPI } from "@/services/Settings/SettingService";
import { siteThemesAPI } from "@/services/Theme/ThemeService";
import { landingPageAPI } from "@/services/Public/LandingPageService";
import { themeSlice } from "@slices/themeSlice";
import { logsAPI } from "@/services/SystemLogs/LogsService";
import { tenantSlice } from "./Slices/tenantSlice";
import { tenantsAPI } from "@/services/Tenant/TenantService";
import { userAPI } from "@/services/User/UserService";
import { commonSlice } from "@slices/commonSlice";
import { permissionsAPI } from "@/services/Security/PermissionService";
import { securityGroupsAPI } from "@/services/Security/SecurityGroupService";
import { domainServiceAPI } from "@/services/Domain/DomainService";
import { questionsAPI } from "@/services/QuestionsAndAnswers/QuestionService";
import { expenseServiceAPI } from "@/services/ExpenseManagement/ExpenseService";
import { expenseCategoryServiceAPI } from "@/services/ExpenseManagement/ExpenseCategoryService";

const rootReducer = combineReducers({
  [siteThemesAPI.reducerPath]: siteThemesAPI.reducer,
  [accountAPI.reducerPath]: accountAPI.reducer,
  [userManagementAPI.reducerPath]: userManagementAPI.reducer,
  [tenantsAPI.reducerPath]: tenantsAPI.reducer,
  [settingsAPI.reducerPath]: settingsAPI.reducer,
  [rolesAPI.reducerPath]: rolesAPI.reducer,
  [landingPageAPI.reducerPath]: landingPageAPI.reducer,
  [logsAPI.reducerPath]: logsAPI.reducer,

  [userAPI.reducerPath]: userAPI.reducer,
  [permissionsAPI.reducerPath]: permissionsAPI.reducer,
  [securityGroupsAPI.reducerPath]: securityGroupsAPI.reducer,
  [questionsAPI.reducerPath]: questionsAPI.reducer,
  [domainServiceAPI.reducerPath]: domainServiceAPI.reducer,
  [expenseServiceAPI.reducerPath]: expenseServiceAPI.reducer,
  [expenseCategoryServiceAPI.reducerPath]: expenseCategoryServiceAPI.reducer,
  auth: authSlice.reducer,
  theme: themeSlice.reducer,
  tenant: tenantSlice.reducer,
  common: commonSlice.reducer,
});

export default rootReducer;
