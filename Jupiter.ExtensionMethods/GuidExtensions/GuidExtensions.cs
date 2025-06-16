namespace Jupiter.Extensions.GuidExtensions
{
    public static class GuidExtensions
    {
        public static string ToFormattedString(this Guid guid)
        {
            return guid.ToString("D");
        }

        public static bool EqualsIgnoreCase(this Guid guid, Guid other)
        {
            return guid.ToString("N").Equals(other.ToString("N"), StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsEmpty(this Guid guid)
        {
            return guid == Guid.Empty;
        }
    }
}
