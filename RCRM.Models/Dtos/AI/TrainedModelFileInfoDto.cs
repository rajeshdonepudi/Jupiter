namespace Jupiter.Models.Dtos.AI
{
    public record TrainedModelFileInfoDto
    {
        public string Name { get; set; }
        public string Size { get; set; }
        public DateTime LastTrained { get; set; }
    }
}
