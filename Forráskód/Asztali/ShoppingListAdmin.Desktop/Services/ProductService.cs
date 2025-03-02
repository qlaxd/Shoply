using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ProductService
    {
        private readonly HttpClient _httpClient;

        public ProductService(string authToken)
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        }

        public async Task<List<ProductModel>> GetAllProductsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<ProductModel>>("products");
        }

        public async Task<ProductModel> GetProductByIdAsync(string productId)
        {
            return await _httpClient.GetFromJsonAsync<ProductModel>($"products/{productId}");
        }

        public async Task CreateProductAsync(ProductModel product)
        {
            await _httpClient.PostAsJsonAsync("products", product);
        }

        public async Task UpdateProductAsync(string productId, ProductModel product)
        {
            await _httpClient.PutAsJsonAsync($"products/{productId}", product);
        }

        public async Task DeleteProductAsync(string productId)
        {
            await _httpClient.DeleteAsync($"products/{productId}");
        }
    }
}