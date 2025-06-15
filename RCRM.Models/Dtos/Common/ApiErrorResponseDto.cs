namespace Jupiter.Models.Dtos.Common
{
    public record DetailedException : ApiErrorResponseDto
    {
        public string Exception { get; set; }
    }

    public record ApiErrorResponseDto
    {
        public required string Message { get; set; }
    }
}
