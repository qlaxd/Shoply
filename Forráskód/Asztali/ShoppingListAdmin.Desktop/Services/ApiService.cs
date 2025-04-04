using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;
using System.Diagnostics;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private string _authToken;

        public ApiService()
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        public async Task<bool> LoginAsync(string email, string password)
        {
            try
            {
                Console.WriteLine($"Attempting login with email: {email}");
                
                var payload = new { email, password };
                Console.WriteLine($"Request payload: {System.Text.Json.JsonSerializer.Serialize(payload)}");
                
                var response = await _httpClient.PostAsJsonAsync("auth/login", payload);
                
                Console.WriteLine($"Response status: {response.StatusCode}");
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response content: {content}");

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<LoginResponse>();
                    if (result?.Token != null)
                    {
                        SetAuthToken(result.Token);
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return false;
            }
        }

        private void SetAuthToken(string token)
        {
            if (!string.IsNullOrEmpty(token))
            {
                _authToken = token;
                _httpClient.DefaultRequestHeaders.Authorization = 
                    new AuthenticationHeaderValue("Bearer", token);
            }
        }

        public string GetAuthToken()
        {
            return _authToken;
        }

        // User management methods
        public async Task<UserModel> GetCurrentUserAsync()
        {
            return await _httpClient.GetFromJsonAsync<UserModel>("users/me");
        }

        public async Task UpdateUserProfileAsync(UserModel userModel)
        {
            await _httpClient.PutAsJsonAsync("users/profile", userModel);
        }

        public async Task ChangePasswordAsync(string currentPassword, string newPassword)
        {
            var payload = new { currentPassword, newPassword };
            await _httpClient.PutAsJsonAsync("users/password", payload);
        }

        public async Task<List<UserModel>> SearchUsersAsync(string searchTerm)
        {
            return await _httpClient.GetFromJsonAsync<List<UserModel>>($"users/search?term={searchTerm}");
        }

        public async Task<UserModel> GetUserByIdAsync(string userId)
        {
            return await _httpClient.GetFromJsonAsync<UserModel>($"users/{userId}");
        }

        // Admin methods
        public async Task<List<UserModel>> GetUsersAsync()
        {
            try 
            {
                if (string.IsNullOrEmpty(_authToken))
                {
                    throw new UnauthorizedAccessException("No authentication token available");
                }

            var response = await _httpClient.GetAsync("admin/users");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<List<UserModel>>();

            }
            
            throw new HttpRequestException($"Error: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"GetUsersAsync error: {ex.Message}");
            throw;
        }
    }

    public async Task PromoteToAdminAsync(UserModel userModel)
    {
        await _httpClient.PostAsJsonAsync($"admin/promote/{userModel.Id}", userModel);
    }

    public async Task UpdateUserAsync(UserModel userModel)
    {
        await _httpClient.PutAsJsonAsync($"admin/users/{userModel.Id}", userModel);
    }
     
    public async Task DeleteUserAsync(UserModel user)
    {
        await _httpClient.PutAsJsonAsync($"admin/users/{user.Id}", user);
    }

    

    public async Task DemoteToUserAsync(string userId)
    {
    

    var response = await _httpClient.PostAsync($"admin/demote/{userId}", null);
    if (!response.IsSuccessStatusCode)
    {
        throw new HttpRequestException($"Failed to demote user. Status code: {response.StatusCode}");
    }
    }
}

    public class LoginResponse
    {
        public string? Token { get; set; }
        public string? Message { get; set; }
    }
}