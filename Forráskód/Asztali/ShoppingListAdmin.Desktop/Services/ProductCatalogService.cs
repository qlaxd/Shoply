using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ProductCatalogService
    {
        private readonly HttpClient _httpClient;

        public ProductCatalogService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<ProductCatalogModel>> GetAllProductCatalogsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<ProductCatalogModel>>("api/productCatalogs");
        }

        public async Task CreateProductCatalogAsync(ProductCatalogModel product)
        {
            await _httpClient.PostAsJsonAsync("api/productCatalogs", product);
        }

        public async Task UpdateProductCatalogAsync(string productId, ProductCatalogModel product)
        {
            await _httpClient.PutAsJsonAsync($"api/productCatalogs/{productId}", product);
        }

        public async Task DeleteProductCatalogAsync(string productId)
        {
            await _httpClient.DeleteAsync($"api/productCatalogs/{productId}");
        }
    }
}