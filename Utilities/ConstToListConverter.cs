using System.Reflection;

namespace Jupiter.Helpers.Helpers
{
    public static class ConstToListConverter
    {
        public static List<string> GetAllConstStringsAsList(Type type)
        {
            List<string> constStrings = new List<string>();

            Type[] nestedTypes = type.GetNestedTypes(BindingFlags.Public | BindingFlags.Static);

            foreach (var nestedType in nestedTypes)
            {
                constStrings.AddRange(GetAllConstStringsAsList(nestedType));
            }

            FieldInfo[] fields = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                .Where(fi => fi.IsLiteral && !fi.IsInitOnly).ToArray();

            foreach (var field in fields)
            {
                constStrings.Add(field.GetValue(null)!.ToString()!);
            }

            return constStrings;
        }

        public static Dictionary<string, List<string>> GetAllConstStringsAsDictionary(Type type)
        {
            var constStringsByClass = new Dictionary<string, List<string>>();

            GetAllConstStrings(type, constStringsByClass);

            return constStringsByClass;
        }

        private static void GetAllConstStrings(Type type, Dictionary<string, List<string>> constStringsByClass, string prefix = "")
        {
            // Get all nested types
            Type[] nestedTypes = type.GetNestedTypes(BindingFlags.Public | BindingFlags.Static);

            foreach (var nestedType in nestedTypes)
            {
                // Properly concatenate the prefix with the nested type name
                string nestedPrefix = string.IsNullOrEmpty(prefix) ? nestedType.Name : $"{prefix}.{nestedType.Name}";
                GetAllConstStrings(nestedType, constStringsByClass, nestedPrefix);
            }

            // Get all public static constants
            FieldInfo[] fields = type.GetFields(BindingFlags.Public | BindingFlags.Static | BindingFlags.FlattenHierarchy)
                .Where(fi => fi.IsLiteral && !fi.IsInitOnly).ToArray();

            foreach (var field in fields)
            {
                if (!constStringsByClass.ContainsKey(prefix))
                {
                    constStringsByClass[prefix] = new List<string>();
                }
                constStringsByClass[prefix].Add(field.GetValue(null)!.ToString()!);
            }
        }
    }
}
