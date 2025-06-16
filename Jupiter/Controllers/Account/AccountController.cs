using Jupiter.BLL.Interfaces;
using Jupiter.Models.Dtos.Account;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Jupiter.API.Controllers.Account
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class AccountController : BaseAccountController
    {
        public AccountController(IAccountService accountService) : base(accountService) { }

        [HttpPost("signup")]

        [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> Signup(SignupRequestDto model)
        {
            var response = await _accountService.RegisterAsync(model);

            return Ok(response);
        }

        [HttpPost("login")]
        [EnableRateLimiting("Token")]
        [ProducesResponseType(typeof(LoginRequestDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> Login(LoginRequestDto model, CancellationToken cancellationToken)
        {
            var response = await _accountService.LoginAsync(model, cancellationToken);

            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequestDto model)
        {
            var response = await _accountService.SendForgotPasswordResetTokenAsync(model);

            if (response)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto model)
        {
            var response = await _accountService.ResetPasswordAsync(model);

            if (response)
            {
                return Ok();
            }
            return BadRequest();
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto model, CancellationToken cancellationToken)
        {
            var response = await _accountService.GetJWTByRefreshTokenAsync(model.RefreshToken, cancellationToken);

            return Ok(response);
        }

        [HttpPost("username-available")]
        public async Task<IActionResult> IsUserNameAvailable(string username)
        {
            var response = await _accountService.IsUserNameAvailableAsync(username);

            if (response)
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
