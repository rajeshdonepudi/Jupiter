using Jupiter.Models.Entities.Base;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jupiter.Models.Entities.Common
{
    [Table("Images")]
    public class Image : BaseEntity
    {
        public required string Title { get; set; }
        public byte[]? Data { get; set; }
        public string Base64 => Data != null ? Convert.ToBase64String(Data) : string.Empty;
    }
}
