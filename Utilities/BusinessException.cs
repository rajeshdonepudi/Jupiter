namespace Jupiter.Helpers.Helpers
{
    public class BusinessException : Exception
    {
        public int ErrorCode { get; private set; }

        public BusinessException(string message)
            : base(message)
        {
        }

        public BusinessException(string message, int errorCode)
            : base(message)
        {
            ErrorCode = errorCode;
        }

        public BusinessException(string message, Exception innerException)
            : base(message, innerException)
        {
        }

        public BusinessException(string message, int errorCode, Exception innerException)
            : base(message, innerException)
        {
            ErrorCode = errorCode;
        }

        public override string ToString()
        {
            return $"{base.ToString()}, ErrorCode: {ErrorCode}";
        }
    }

}
