import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./RootReducer";
import { accountAPI } from "@services/Auth/AccountService";
import { userManagementAPI } from "@services/User/UserManagementService";
import { settingsAPI } from "@services/Settings/SettingService";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rolesAPI } from "@/services/Security/RoleService";
import { siteThemesAPI } from "@/services/Theme/ThemeService";
import { landingPageAPI } from "@/services/Public/LandingPageService";
import { logsAPI } from "@/services/SystemLogs/LogsService";
import { tenantsAPI } from "@/services/Tenant/TenantService";
import { mailsAPI } from "@/services/Mail/MailService";
import { userAPI } from "@/services/User/UserService";
import { permissionsAPI } from "@/services/Security/PermissionService";
import { securityGroupsAPI } from "@/services/Security/SecurityGroupService";
import { domainServiceAPI } from "@/services/Domain/DomainService";
import { questionsAPI } from "@/services/QuestionsAndAnswers/QuestionService";
import { mailReaderAPI } from "@/services/Mail/MailReaderService";
import { expenseServiceAPI } from "@/services/ExpenseManagement/ExpenseService";
import { expenseCategoryServiceAPI } from "@/services/ExpenseManagement/ExpenseCategoryService";

const persistConfig = {
  key: "falcon-one",
  storage,
  whitelist: ["auth", "theme", "common"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(userManagementAPI.middleware)
      .concat(accountAPI.middleware)
      .concat(settingsAPI.middleware)
      .concat(siteThemesAPI.middleware)
      .concat(landingPageAPI.middleware)
      .concat(tenantsAPI.middleware)
      .concat(logsAPI.middleware)
      .concat(mailsAPI.middleware)
      .concat(userAPI.middleware)
      .concat(permissionsAPI.middleware)
      .concat(securityGroupsAPI.middleware)
      .concat(rolesAPI.middleware)
      .concat(domainServiceAPI.middleware)
      .concat(questionsAPI.middleware)
      .concat(mailReaderAPI.middleware)
      .concat(expenseServiceAPI.middleware)
      .concat(expenseCategoryServiceAPI.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
