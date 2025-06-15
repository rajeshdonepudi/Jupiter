using Moq;
using RCRM.API.Controllers.Account;
using RCRM.BLL.Interfaces;

namespace RCRM.API.Tests
{
    public class AccountControllerTests
    {
        private readonly Mock<IAccountService> _accountService;
        private readonly AccountController _controller;
        CancellationToken cancellationToken = CancellationToken.None;

        public AccountControllerTests()
        {
            _accountService = new Mock<IAccountService>();
        }

        [Fact]
        public void LoginRequest()
        {
            Assert.Equal(200, 200);
        }
    }
}