using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Threading.Tasks;
using System;
using System.Security;
using System.Runtime.InteropServices;
using ShoppingListAdmin.Desktop.Services;

namespace ShoppingListAdmin.Desktop.ViewModels.Login
{
    public partial class LoginViewModel : ObservableObject
    {
        private readonly ApiService _apiService;

        public LoginViewModel(ApiService apiService)
        {
            _apiService = apiService;
            _password = new SecureString();
        }

        [ObservableProperty]
        private string _email = string.Empty;

        [ObservableProperty]
        private SecureString _password;

        [ObservableProperty]
        private string _errorMessage = string.Empty;

        [ObservableProperty]
        private bool _isViewVisible = true;

        private string ConvertSecureStringToString(SecureString secureString)
        {
            IntPtr unmanagedString = IntPtr.Zero;
            try
            {
                unmanagedString = Marshal.SecureStringToGlobalAllocUnicode(secureString);
                return Marshal.PtrToStringUni(unmanagedString);
            }
            finally
            {
                Marshal.ZeroFreeGlobalAllocUnicode(unmanagedString);
            }
        }

        [RelayCommand]
        private async Task LoginAsync()
        {
            try
            {
                Console.WriteLine($"Login attempt with Email: {Email}");
                
                if (string.IsNullOrEmpty(Email) || Password == null || Password.Length == 0)
                {
                    ErrorMessage = "Email and password are required";
                    return;
                }

                var passwordString = ConvertSecureStringToString(Password);
                var success = await _apiService.LoginAsync(Email, passwordString);
                Console.WriteLine($"Login result: {success}");
                
                if (success)
                {
                    IsViewVisible = false;
                }
                else
                {
                    ErrorMessage = "Invalid email or password";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                ErrorMessage = "Login failed";
            }
        }

        private bool CanLogin()
        {
            return !string.IsNullOrEmpty(Email) && 
                   Password?.Length > 0 && 
                   Email.Contains("@");
        }
    }
}
