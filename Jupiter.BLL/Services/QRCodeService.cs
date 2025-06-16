using Jupiter.BLL.Interfaces;
using QRCoder;

namespace Jupiter.BLL.Services
{
    public class QRCodeService : IQRCodeService
    {
        public string GetQRCode(string content)
        {
            var generator = new QRCodeGenerator();

            var data = generator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);

            var code = new Base64QRCode(data);

            var image = code.GetGraphic(20);

            return image;
        }
    }
}
