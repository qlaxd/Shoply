using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class AdminService
    {
        private readonly HttpClient _httpClient;

        public AdminService(string authToken)
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        }

        public async Task<List<UserModel>> GetAllUsersAsync()
        {
            var users = await _httpClient.GetFromJsonAsync<List<UserModel>>("admin/users");
            return users ?? new List<UserModel>();
        }

        public async Task PromoteToAdminAsync(string userId)
        {
            await _httpClient.PostAsJsonAsync($"admin/promote/{userId}", new { });
        }

        public async Task UpdateUserAsync(UserModel user)
        {
            await _httpClient.PutAsJsonAsync($"admin/users/{user.Id}", user);
        }
    }
}