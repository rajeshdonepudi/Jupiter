using IdenticonSharp.Identicons;
using Jupiter.BLL.Helpers;
using Jupiter.BLL.Interfaces;
using Jupiter.DAL.Contracts;
using Jupiter.Models.Dtos.Account;
using Jupiter.Models.Entities.Common;
using Jupiter.Models.Entities.Security;
using Jupiter.Models.Entities.Users;
using Jupiter.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Jupiter.BLL.Services
{
    public class AccountService : BaseService, IAccountService
    {
        #region Fields
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IAppConfigService _appConfigService;

        /// <summary>
        /// The data protection purpose used for the reset password related methods.
        /// </summary>
        public const string ResetPasswordTokenPurpose = "ResetPassword";

        /// <summary>
        /// The data protection purpose used for the change phone number methods.
        /// </summary>
        public const string ChangePhoneNumberTokenPurpose = "ChangePhoneNumber";

        /// <summary>
        /// The data protection purpose used for the email confirmation related methods.
        /// </summary>
        public const string ConfirmEmailTokenPurpose = "EmailConfirmation";
        #endregion

        #region Constructor
        public AccountService(UserManager<User> userManager,
            IUnitOfWork unitOfWork,
            SignInManager<User> signInManager,
            ITenantProvider tenantService,
            ITokenService tokenService,
            IAppConfigService appConfigService,
            IHttpContextAccessor httpContextAccessor,
            IConfiguration configuration, IIdenticonProvider identiconProvider) : base(userManager, unitOfWork, httpContextAccessor, configuration, tenantService, identiconProvider)
        {
            _signInManager = signInManager;
            _tokenService = tokenService;
            _appConfigService = appConfigService;
        }
        #endregion

        #region Implementation

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto model, CancellationToken cancellationToken)
        {
            User user = null;

            user = await _unitOfWork.UserRepository.QueryAsync(expression: x => x.Email == model.Email,
                                                              includeProperties: query => query.Include(x => x.ProfilePicture),
                                                              cancellationToken: cancellationToken);

            var isGod = await _userManager.IsInRoleAsync(user, SecurityRoles.GOD);

            if (!isGod)
            {
                user = await _unitOfWork.UserRepository
                                        .GetTenantUserInfoByEmail(TenantId, model.Email, CancellationToken.None);
            }

            if (user is null)
            {
                throw new Exception(ErrorMessages.LOGIN_FAILED);
            }

            await IsVerifiedUser(user);

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, model.Password, true);

            await HandleSignInAction(signInResult, user);

            var accessToken = await GenerateAccessTokenAsync(user, isGod, cancellationToken);

            var refreshToken = await GenerateRefreshTokenAsync();

            await RemoveExpiredRefreshTokensAsync(user.Id, cancellationToken);

            user.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(user);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var response = new LoginResponseDto()
            {
                Email = user.Email!,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Id = user.Id,
                AccessToken = accessToken,
                RefreshToken = refreshToken?.Token!,
                TenantId = TenantId,
                ProfilePicture = user?.ProfilePicture?.Data != null ? user.ProfilePicture.Base64 : "",
            };

            response.AccessToken = accessToken;

            response.RefreshToken = refreshToken?.Token!;

            return response;
        }

        public async Task<RegisterResponse> RegisterAsync(SignupRequestDto model)
        {
            var newUser = new User()
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                UserName = model.UserName,
                PhoneNumber = model.PhoneNumber,
                CreatedOn = DateTime.UtcNow,
                ProfilePicture = new Image
                {
                    Data = GenerateProfilePicture(model.FirstName, model.LastName),
                    Title = $"{model.FirstName}_{model.LastName}_profile"
                }
            };

            var result = await _userManager.CreateAsync(newUser, model.ConfirmPassword);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }

            User? user = await _userManager.FindByEmailAsync(model.Email);

            if (user is null)
            {
                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }
            return new RegisterResponse(user.FirstName, user.LastName, user.Email);
        }

        public async Task<bool> SendForgotPasswordResetTokenAsync(ForgotPasswordRequestDto model)
        {
            User? user = await _unitOfWork.UserRepository.GetTenantUserInfoByEmail(TenantId, model.Email, CancellationToken.None);

            if (user is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            await IsVerifiedUser(user);

            string resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            if (!string.IsNullOrEmpty(resetToken))
            {
                return true;
            }
            return false;
        }

        public async Task<RefreshAccessTokenResponseDto> GetJWTByRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
        {
            User account = await _userManager.Users.Include(x => x.RefreshTokens).FirstOrDefaultAsync(x => x.RefreshTokens.Any(x => x.Token == refreshToken), cancellationToken);


            if (account is null)
            {
                throw new Exception(ErrorMessages.INVALID_REFRESH_TOKEN);
            }

            var isGod = await _userManager.IsInRoleAsync(account, SecurityRoles.GOD);

            RefreshToken? token = account.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);

            if (token!.IsRevoked)
            {
                await RevokeDescendantRefreshTokensAsync(token, account, "", ErrorMessages.REUSE_OF_REVOKED_ANCESTOR_TOKEN);

                var updateResult = await _userManager.UpdateAsync(account);

                throw new Exception(ErrorMessages.SOMETHING_WENT_WRONG);
            }

            RefreshToken newRefreshToken = await RotateRefreshTokenAsync(token, IpAddress);

            account.RefreshTokens.Add(newRefreshToken);

            await RemoveExpiredRefreshTokensAsync(account.Id, cancellationToken);

            var result = await _userManager.UpdateAsync(account);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }

            string jwtToken = await GenerateAccessTokenAsync(account, isGod, cancellationToken);

            var response = new RefreshAccessTokenResponseDto()
            {
                JWTToken = jwtToken,
                RefreshToken = newRefreshToken.Token!
            };

            return response;
        }
        public async Task<bool> ResetPasswordAsync(ResetPasswordRequestDto model)
        {
            var user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                throw new Exception(ErrorMessages.USER_NOT_FOUND);
            }

            await IsVerifiedUser(user);

            var result = await _userManager.ResetPasswordAsync(user, model.ResetToken, model.ConfirmNewPassword);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }
            return result.Succeeded;
        }



        public async Task<bool> ConfirmEmailAsync(ConfirmEmailRequestDto model)
        {
            User? user = await _userManager.FindByIdAsync(model.UserId);

            if (user is null)
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            if (await _userManager.IsEmailConfirmedAsync(user))
            {
                throw new Exception(ErrorMessages.INVALID_REQUEST);
            }

            var result = await _userManager.ConfirmEmailAsync(user, model.ConfirmationToken);

            if (!result.Succeeded)
            {
                throw new Exception(FormatIdentityErrors(result.Errors));
            }
            return result.Succeeded;
        }

        public async Task<bool> IsUserNameAvailableAsync(string username)
        {
            if (!string.IsNullOrEmpty(username))
            {
                var result = await _unitOfWork.UserRepository.IsUserNameAvailable(username, CancellationToken.None);

                return result;
            }
            return false;
        }

        #endregion

        #region Private methods
        private async Task<string> GenerateAccessTokenAsync(User user, bool isGod, CancellationToken cancellationToken)
        {
            IList<Claim> claims = await _userManager.GetClaimsAsync(user);

            List<string> roles = new List<string>();

            if (isGod)
            {
                roles = await _unitOfWork.UserRepository.GetUserRolesAsync(user.Id, cancellationToken);
            }
            else
            {
                roles = await _unitOfWork.UserRepository.GetTenantUserRoles(TenantId, user.Id, cancellationToken);
            }

            foreach (var claim in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, claim!));
            }

            claims.Add(new Claim("TenantId", TenantId.ToString()));
            claims.Add(new Claim(ClaimTypes.Email, user.Email));
            claims.Add(new Claim(ClaimTypes.Actor, user.Id.ToString()));
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.FirstName + " " + user.LastName));
            claims.Add(new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName));

            string token = await _tokenService.GenerateJWTToken(user, claims);

            return await Task.FromResult(token);
        }


        private async Task<RefreshToken> GenerateRefreshTokenAsync()
        {
            RefreshToken refreshToken = await GetRefreshTokenAsync();

            List<RefreshToken> refreshTokens = await _userManager.Users.AsNoTracking().SelectMany(x => x.RefreshTokens).ToListAsync();

            if (refreshTokens.Any())
            {
                bool isUniqueToken = !refreshTokens.Any(t => t.Token == refreshToken.Token);

                if (!isUniqueToken)
                {
                    RefreshToken newToken = await GenerateRefreshTokenAsync();
                    return await Task.FromResult(newToken);
                }
            }
            return await Task.FromResult(refreshToken);
        }
        private async Task<RefreshToken> GetRefreshTokenAsync()
        {
            return await Task.FromResult(new RefreshToken
            {
                Token = Convert.ToHexString(GetRandomBytes(64)),
                Expires = DateTime.UtcNow.AddDays(double.Parse(await _appConfigService.GetValueAsync("JWT:RefreshTokenValidityInDays"))),
                Created = DateTime.UtcNow,
                CreatedByIp = IpAddress,
            });
        }
        private byte[] GetRandomBytes(int length)
        {
            return RandomNumberGenerator.GetBytes(length);
        }

        private async Task RemoveExpiredRefreshTokensAsync(Guid userId, CancellationToken cancellationToken)
        {
            var tokens = await _unitOfWork.RefreshTokenRepository.GetAllAsync(x => x.UserId == userId, cancellationToken);

            var lastRefreshToken = tokens.LastOrDefault();

            var oldTokens = tokens.Where(x => x.Id != lastRefreshToken!.Id).ToList();

            _unitOfWork.RefreshTokenRepository.RemoveRange(oldTokens);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private async Task RevokeDescendantRefreshTokensAsync(RefreshToken refreshToken, User user, string ipAddress, string reason)
        {
            if (!string.IsNullOrEmpty(refreshToken.ReplacedByToken))
            {
                RefreshToken? childRefreshToken = user.RefreshTokens.SingleOrDefault(t => t.Token == refreshToken.ReplacedByToken);

                if (childRefreshToken is not null)
                {
                    if (childRefreshToken.IsActive)
                    {
                        UpdateRefreshTokenSettings(childRefreshToken);
                    }
                    else
                    {
                        await RevokeDescendantRefreshTokensAsync(childRefreshToken, user, ipAddress, reason);
                    }
                }
            }
        }

        private void UpdateRefreshTokenSettings(RefreshToken token, string ipAddress = "", string reason = null, string replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }

        private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken refreshToken, string ipAddress)
        {
            RefreshToken newRefreshToken = await GenerateRefreshTokenAsync();
            UpdateRefreshTokenSettings(refreshToken, ipAddress, ErrorMessages.REPLACED_WITH_NEW_TOKEN, newRefreshToken.Token!);
            return newRefreshToken;
        }

        private async Task HandleSignInAction(SignInResult result, User user)
        {
            // Record the login attempt based on success or failure
            var loginAttempt = new UserLoginAttempt
            {
                IsSucessfull = result.Succeeded,
                LoginAttemptDate = DateTime.UtcNow,
            };

            // Add the login attempt to the user's list of attempts
            user.LoginAttempts.Add(loginAttempt);

            // Update the user to save login attempts
            await _userManager.UpdateAsync(user);

            // Handle specific error cases after updating the user
            if (result.IsLockedOut)
            {
                throw new Exception(MessageHelper.LoginErrors.ACCOUNT_LOCKED);
            }

            if (result.IsNotAllowed)
            {
                throw new Exception(MessageHelper.LoginErrors.LOGIN_FAILED);
            }

            // If login failed and none of the above conditions were met
            if (!result.Succeeded)
            {
                throw new Exception(MessageHelper.LoginErrors.LOGIN_FAILED);
            }
        }

        #endregion
    }
}
