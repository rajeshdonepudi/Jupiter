using Jupiter.Models.Dtos.Account;

namespace Jupiter.BLL.Interfaces
{
    public interface IAccountService
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<LoginResponseDto> LoginAsync(LoginRequestDto model, CancellationToken cancellationToken);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<RegisterResponse> RegisterAsync(SignupRequestDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        Task<RefreshAccessTokenResponseDto> GetJWTByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> ConfirmEmailAsync(ConfirmEmailRequestDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> SendForgotPasswordResetTokenAsync(ForgotPasswordRequestDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        Task<bool> ResetPasswordAsync(ResetPasswordRequestDto model);
        /// <summary>
        /// 
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        Task<bool> IsUserNameAvailableAsync(string username);
    }
}
