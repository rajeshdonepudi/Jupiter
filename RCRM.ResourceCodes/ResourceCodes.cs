namespace FalconOne.ResourceCodes
{
    public class ResourceIdentifier
    {
        public static class Mail
        {
            public const string VIEW_MAIL = "VIEW_MAIL";
            public const string NEW_MAIL = "NEW_MAIL";
            public const string SENT_MAILS = "SENT_MAILS";
            public const string RECEIVED_MAILS = "RECEIVED_MAILS";
        }

        public static class Settings
        {
            public const string HASH_PASSWORD = "HASH_PASSWORD";
            public const string UPDATE_PROFILE_PICTURE = "UPDATE_PROFILE_PICTURE";
        }

        public static class Tenant
        {
            public const string TENANT_INFO = "TENANT_INFO";
            public const string ALL_TENANTS = "ALL_TENANTS";
            public const string TENANT_DASHBOARD_INFO = "TENANT_DASHBOARD_INFO";
            public const string TENANT_LOOKUP_FOR_DIRECTORY = "TENANT_LOOKUP_FOR_DIRECTORY";
        }

        public static class Account
        {
            public const string USER_CREATE = "USER_CREATE";
            public const string LOGIN = "LOGIN";
            public const string GET_USER = "GET_USER";
            public const string NEW_USER_SIGNUP = "REGISTER_NEW_USER";
            public const string FORGOT_PASSWORD = "FORGOT_PASSWORD";
            public const string RESET_PASSWORD = "RESET_PASSWORD";
            public const string REVOKE_REFRESH_TOKEN = "REVOKE_REFRESH_TOKEN";
            public const string REFRESH_TOKEN = "REFRESH_TOKEN";
            public const string AAC_UPDATE_EMAIL_CONFIRMED = "AAC_UPDATE_EMAIL_CONFIRMED";
        }

        public static class User
        {
            public const string UPLOAD_PROFILE_PICTURE = "UPLOAD_PROFILE_PICTURE";
            public const string ADD_NEW_USER = "ADD_NEW_USER";
            public const string DELETE_USER = "DELETE_USER";
            public const string USER_MANAGMENT_DASHBOARD = "USER_MANAGEMENT_DASHBOARD";
            public const string TAKE_BULK_ACTION = "TAKE_BULK_ACTION";
            public const string FILTER_USER_DIRECTORY = "FILTER_USER_DIRECTORY";
            public const string USER_LOOKUP_FOR_DIRECTORY = "USER_LOOKUP_FOR_DIRECTORY";
        }

        public static class Security
        {
            public const string GET_SECURITY_CLAIMS_LOOKUP = "GET_SECURITY_CLAIMS_LOOKUP";
            public const string GET_SECURITY_ROLES_LOOKUP = "GET_SECURITY_ROLES_LOOKUP";
            public const string HASH_USER_PASSWORD = "HASH_USER_PASSWORD";
            public const string CREATE_NEW_POLICY = "CREATE_NEW_POLICY";
            public const string GET_ROLE = "GET_ROLE";
            public const string CREATE_ROLE = "CREATE_ROLE";
            public const string DELETE_ROLE = "DELETE_ROLE";
            public const string GET_ALL_ROLES = "GET_ALL_ROLES";
            public const string GET_USERS_IN_ROLE = "GET_USERS_IN_ROLE";
        }

        public static class Logging
        {
            public const string VIEW_SECURITY_LOGS = "VIEW_SECURITY_LOGS";
            public const string REQUESTS_BY_RESOURCE_CODE = "REQUESTS_BY_RESOURCE_CODE";
            public const string GET_RESOURCE_CODES = "GET_RESOURCE_CODES";
        }

        public static class Theme
        {
            public const string GET_PRIMARY_SITE_SETTINGS = "GET_PRIMARY_SITE_SETTINGS";
            public const string GET_ALL_THEMES = "GET_ALL_THEMES";
            public const string DELETE_THEME = "DELETE_THEME";
            public const string ADD_THEME = "DELETE_THEME";
            public const string UPDATE_THEME = "DELETE_THEME";
        }

        public static class UserLookup
        {
            public const string ALL_USERS_LOOKUP = "ALL_USERS_LOOKUP";
        }
    }
}
