using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;
using System;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ProductCatalogService
    {
        private readonly HttpClient _httpClient;

        public ProductCatalogService(string authToken)
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        }

        public ProductCatalogService()
        {
        }

        public async Task<List<ProductCatalogModel>> GetAllProductCatalogsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<ProductCatalogModel>>("productCatalogs");
        }

        public async Task<ProductCatalogModel> GetProductCatalogByIdAsync(string productId)
        {
            return await _httpClient.GetFromJsonAsync<ProductCatalogModel>($"productCatalogs/{productId}");
        }

        public async Task<List<ProductCatalogModel>> SearchProductCatalogsAsync(string searchTerm)
        {
            return await _httpClient.GetFromJsonAsync<List<ProductCatalogModel>>($"productCatalogs/search?term={searchTerm}");
        }

        public async Task CreateProductCatalogAsync(ProductCatalogModel product)
        {
            await _httpClient.PostAsJsonAsync("productCatalogs", product);
        }

        public async Task UpdateProductCatalogAsync(string productId, ProductCatalogModel product)
        {
            await _httpClient.PutAsJsonAsync($"productCatalogs/{productId}", product);
        }

        public async Task DeleteProductCatalogAsync(string productId)
        {
            await _httpClient.DeleteAsync($"productCatalogs/{productId}");
        }
    }
}