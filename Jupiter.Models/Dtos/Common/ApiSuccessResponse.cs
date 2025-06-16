namespace Jupiter.Models.Dtos.Common
{
    public record ApiSuccessResponse : ApiResponse
    {
        public required object Data { get; set; }
    }
}
