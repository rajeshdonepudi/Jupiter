﻿using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Jupiter.Extensions.Enumerations
{
    public static class EnumExtensions
    {
        public static string GetDisplayName(this Enum value)
        {
            FieldInfo field = value.GetType().GetField(value.ToString());

            DisplayAttribute attribute = (DisplayAttribute)Attribute.GetCustomAttribute(field, typeof(DisplayAttribute));

            return attribute == null ? value.ToString() : attribute.Name;
        }

        public static string GetDescription<T>(this T enumValue)
            where T : struct, IConvertible
        {
            if (!typeof(T).IsEnum)
                return null;

            string? description = enumValue.ToString();
            FieldInfo? fieldInfo = enumValue.GetType().GetField(enumValue.ToString());

            if (fieldInfo != null)
            {
                object[] attrs = fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), true);
                if (attrs != null && attrs.Length > 0)
                {
                    description = ((DescriptionAttribute)attrs[0]).Description;
                }
            }

            return description;
        }

        public static List<KeyValuePair<TKey, TValue>> GetEnumKeyValuePairList<TEnum, TKey, TValue>()
         where TEnum : Enum
        {
            Array enumValues = Enum.GetValues(typeof(TEnum));

            List<KeyValuePair<TKey, TValue>> keyValuePairs = new();

            foreach (TEnum enumValue in enumValues)
            {
                object key = GetEnumDescription(enumValue);

                object enumVal = Convert.ChangeType(enumValue, typeof(TValue));

                keyValuePairs.Add(new KeyValuePair<TKey, TValue>((TKey)key, (TValue)enumVal));
            }
            return keyValuePairs;
        }

        private static string GetEnumDescription<TEnum>(TEnum value)
        where TEnum : Enum
        {
            Type type = value.GetType();
            MemberInfo[] memberInfo = type.GetMember(value.ToString());

            if (memberInfo.Length > 0)
            {
                object[] attributes = memberInfo[0].GetCustomAttributes(typeof(DescriptionAttribute), false);

                if (attributes.Length > 0)
                {
                    return ((DescriptionAttribute)attributes[0]).Description;
                }
            }

            return value.ToString();
        }
    }
}
