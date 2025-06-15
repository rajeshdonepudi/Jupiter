namespace Jupiter.Security
{
    public static class PermissionPool
    {
        public static class AI
        {
            public const string VIEW_TRAINED_MODELS = "VIEW_TRAINED_MODELS";
        }

        public static class Security_Group
        {
            public const string VIEW_SECURITY_GROUP_INFO = "VIEW_SECURITY_GROUP_INFO";
            public const string CREATE_SECURITY_GROUP = "CREATE_SECURITY_GROUP";
            public const string VIEW_SECURITY_GROUP_USERS = "VIEW_SECURITY_GROUP_USERS";
            public const string UPDATE_SECURITY_GROUP = "UPDATE_SECURITY_GROUP";
            public const string VIEW_SECURITY_GROUPS = "VIEW_SECURITY_GROUPS";
            public const string DELETE_SECURITY_GROUP = "DELETE_SECURITY_GROUP";
            public const string VIEW_SECURITY_GROUPS_LOOKUP = "VIEW_SECURITY_GROUPS_LOOKUP";
            public const string ADD_USERS_TO_SECURITY_GROUP = "ADD_USERS_TO_SECURITY_GROUP";
            public const string DELETE_USER_FROM_SECURITY_GROUP = "DELETE_USER_FROM_SECURITY_GROUP";
            public const string VIEW_SECURITY_GROUP_PERMISSIONS = "VIEW_SECURITY_GROUP_PERMISSIONS";
            public const string VIEW_SECURITY_GROUPS_BASIC_DETAILS = "VIEW_SECURITY_GROUPS_BASIC_DETAILS";
        }

        public static class Permission_Management
        {
            public const string VIEW_PERMISSIONS = "VIEW_PERMISSIONS";
            public const string MANAGE_PERMISSIONS = "MANAGE_PERMISSIONS";
        }

        public static class User_Permissions
        {
            public const string USER_DASHBOARD_METRIC_INFO = "USER_DASHBOARD_METRIC_INFO";
            public const string VIEW_USER_INFO = "GET_USER_INFO";
            public const string VIEW_USER_PROFILE_INFO = "VIEW_USER_PROFILE_INFO";
            public const string VIEW_USERS_LOOKUP = "VIEW_USERS_LOOKUP";
            public const string GET_USER_INFO = "GET_USER_INFO";
            public const string VIEW_USER_ROLES = "VIEW_USER_ROLES";
            public const string VIEW_USER_PERMISSIONS = "VIEW_USER_PERMISSIONS";
            public const string CHANGE_PROFILE_PICTURE = "CHANGE_PROFILE_PICTURE";
            public const string VIEW_USERS_BASIC_DETAILS = "VIEW_USERS_BASIC_DETAILS";
        }

        public static class Theme_Managment
        {
            public const string VIEW_ALL_THEMES = "VIEW_ALL_THEMES";
            public const string UPDATE_THEME = "UPDATE_THEME";
            public const string CREATE_THEME = "CREATE_THEME";
            public const string DELETE_THEME = "DELETE_THEME";
        }

        public static class Expense_Management
        {
            public const string ADD_EXPENSE = "ADD_EXPENSE";
            public const string VIEW_EXPENSE_INFO = "VIEW_EXPENSE_INFO";
            public const string VIEW_EXPENSES_DASHBOARD = "VIEW_EXPENSES_DASHBOARD";
            public const string ADD_EXPENSE_CATEGORY = "ADD_EXPENSE_CATEGORY";
            public const string UPDATE_EXPENSE_CATEGORY = "UPDATE_EXPENSE_CATEGORY";
            public const string ADD_EXPENSES_BULK = "ADD_EXPENSES_BULK";
            public const string DELETE_EXPENSE = "DELETE_EXPENSE";
            public const string DELETE_EXPENSE_CATEGORY = "DELETE_EXPENSE_CATEGORY";
            public const string UPDATE_EXPENSE = "UPDATE_EXPENSE";
            public const string VIEW_ALL_EXPENSE = "VIEW_ALL_EXPENSE";
            public const string VIEW_ALL_EXPENSES = "VIEW_ALL_EXPENSES";
            public const string VIEW_ALL_EXPENSE_CATEGORIES = "VIEW_ALL_EXPENSE_CATEGORIES";
            public const string VIEW_ALL_EXPENSE_CATEGORIES_LOOKUP = "VIEW_ALL_EXPENSE_CATEGORIES_LOOKUP";
            public const string VIEW_ALL_EXPENSE_TYPES_LOOKUP = "VIEW_ALL_EXPENSE_TYPES_LOOKUP";
        }

        public static class Role_Managment
        {
            public const string CREATE_ROLE = "CREATE_ROLE";
            public const string VIEW_ROLE = "VIEW_ROLE";
            public const string DELETE_ROLE = "DELETE_ROLE";
            public const string VIEW_ROLES = "VIEW_ROLES";
            public const string VIEW_USER_ROLES = "VIEW_USER_ROLES";
            public const string VIEW_USERS_IN_ROLES = "VIEW_USERS_IN_ROLES";
            public const string ADD_USER_TO_ROLE = "ADD_USER_TO_ROLE";
            public const string REMOVE_USER_FROM_ROLE = "REMOVE_USER_FROM_ROLE";
        }

        public static class User_Management
        {
            public const string ADD_USER = "ADD_USER";
            public const string VIEW_USERS = "VIEW_USERS";
            public const string CREATE_USER = "CREATE_USER";
            public const string UPDATE_USER = "UPDATE_USER";
            public const string DELETE_USER = "DELETE_USER";
            public const string REVOKE_ACCESS = "REVOKE_ACCESS";
            public const string BULK_USER_ACTIONS = "BULK_USER_ACTIONS";
            public const string USER_METRIC_BASIC_INFO = "USER_METRIC_BASIC_INFO";
        }
    }
}
