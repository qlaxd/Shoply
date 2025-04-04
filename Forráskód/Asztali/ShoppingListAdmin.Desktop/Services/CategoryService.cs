using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class CategoryService
    {
        private readonly HttpClient _httpClient;

        public CategoryService(string authToken)
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        }

        public async Task<List<CategoryModel>> GetAllCategoriesAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<CategoryModel>>("categories");
        }

        public async Task<CategoryModel> GetCategoryByIdAsync(string categoryId)
        {
            return await _httpClient.GetFromJsonAsync<CategoryModel>($"categories/{categoryId}");
        }

        public async Task<List<CategoryModel>> SearchCategoriesAsync(string searchTerm)
        {
            return await _httpClient.GetFromJsonAsync<List<CategoryModel>>($"categories/search?term={searchTerm}");
        }

        public async Task CreateCategoryAsync(CategoryModel category)
        {
            await _httpClient.PostAsJsonAsync("categories", category);
        }

        public async Task UpdateCategoryAsync(string categoryId, CategoryModel category)
        {
            await _httpClient.PutAsJsonAsync($"categories/{categoryId}", category);
        }

        public async Task DeleteCategoryAsync(string categoryId)
        {
            await _httpClient.DeleteAsync($"categories/{categoryId}");
        }
    }
}