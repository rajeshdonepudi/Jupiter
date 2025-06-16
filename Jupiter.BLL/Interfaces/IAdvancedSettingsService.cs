﻿namespace Jupiter.BLL.Interfaces
{
    public interface IAdvancedSettingsService
    {
        /// <summary>
        ///  Method to update password asynchronously.
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        Task<string> HashPasswordAsync(string password);
        Task<bool> UpdateProfileForAllUsers(byte[] data, CancellationToken cancellationToken);
    }
}
