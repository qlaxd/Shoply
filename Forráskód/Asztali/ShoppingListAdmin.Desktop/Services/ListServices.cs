using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Text.Json;
using System.Linq;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ListService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "http://localhost:5000/api/";
        private readonly JsonSerializerOptions _jsonOptions;

        public ListService(string authToken)
        {
            if (string.IsNullOrEmpty(authToken))
            {
                throw new ArgumentException("Auth token cannot be null or empty", nameof(authToken));
            }

            _httpClient = new HttpClient
            {
                BaseAddress = new Uri(BaseUrl),
                Timeout = TimeSpan.FromSeconds(30)
            };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            
            Debug.WriteLine($"ListService initialized with BaseUrl: {BaseUrl}");
            Debug.WriteLine($"Auth token: {authToken.Substring(0, Math.Min(10, authToken.Length))}...");
        }

        public async Task<List<ProductListModel>> GetAllListsAsync()
        {
            try
            {
                Debug.WriteLine("Fetching all lists...");
                var response = await _httpClient.GetAsync("admin/lists");
                
                Debug.WriteLine($"Response status code: {response.StatusCode}");
                Debug.WriteLine($"Response headers: {string.Join(", ", response.Headers.Select(h => $"{h.Key}: {string.Join(", ", h.Value)}"))}");
                
                var content = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Received response: {content}");
                
                response.EnsureSuccessStatusCode();
                
                var lists = await response.Content.ReadFromJsonAsync<List<ProductListModel>>(_jsonOptions);
                Debug.WriteLine($"Successfully deserialized {lists?.Count ?? 0} lists");
                
                if (lists == null || lists.Count == 0)
                {
                    Debug.WriteLine("Warning: No lists found in the response");
                }
                else
                {
                    foreach (var list in lists)
                    {
                        Debug.WriteLine($"List: Id={list.Id}, Name={list.Name}, Owner={list.Owner}, Products={list.Products?.Count ?? 0}");
                    }
                }
                
                return lists ?? new List<ProductListModel>();
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"HTTP request failed in GetAllListsAsync: {ex.Message}");
                throw new Exception($"Failed to fetch lists from server: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                Debug.WriteLine($"JSON deserialization failed in GetAllListsAsync: {ex.Message}");
                throw new Exception("Failed to parse server response", ex);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Unexpected error in GetAllListsAsync: {ex}");
                throw new Exception("An unexpected error occurred while fetching lists", ex);
            }
        }

        public async Task<ProductListModel> GetListByIdAsync(string listId)
        {
            try
            {
                Debug.WriteLine($"Fetching list with ID: {listId}");
                var response = await _httpClient.GetAsync($"lists/{listId}");
                response.EnsureSuccessStatusCode();
                
                var content = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Received response: {content}");
                
                var list = await response.Content.ReadFromJsonAsync<ProductListModel>(_jsonOptions);
                Debug.WriteLine($"Successfully deserialized list with ID: {listId}");
                return list ?? throw new Exception($"List with ID {listId} not found");
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"HTTP request failed in GetListByIdAsync: {ex.Message}");
                throw new Exception($"Failed to fetch list {listId}: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                Debug.WriteLine($"JSON deserialization failed in GetListByIdAsync: {ex.Message}");
                throw new Exception($"Failed to parse server response for list {listId}", ex);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Unexpected error in GetListByIdAsync: {ex}");
                throw new Exception($"An unexpected error occurred while fetching list {listId}", ex);
            }
        }

        public async Task CreateListAsync(ProductListModel list)
        {
            try
            {
                Debug.WriteLine($"Creating new list: {list.Name}");
                var response = await _httpClient.PostAsJsonAsync("lists", list, _jsonOptions);
                response.EnsureSuccessStatusCode();
                Debug.WriteLine("List created successfully");
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"HTTP request failed in CreateListAsync: {ex.Message}");
                throw new Exception($"Failed to create list: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                Debug.WriteLine($"JSON serialization failed in CreateListAsync: {ex.Message}");
                throw new Exception("Failed to serialize list data", ex);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Unexpected error in CreateListAsync: {ex}");
                throw new Exception("An unexpected error occurred while creating the list", ex);
            }
        }

        public async Task UpdateListAsync(string listId, ProductListModel list)
        {
            try
            {
                Debug.WriteLine($"Updating list with ID: {listId}");
                var response = await _httpClient.PutAsJsonAsync($"lists/{listId}", list, _jsonOptions);
                response.EnsureSuccessStatusCode();
                Debug.WriteLine($"Successfully updated list with ID: {listId}");
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"HTTP request failed in UpdateListAsync: {ex.Message}");
                throw new Exception($"Failed to update list {listId}: {ex.Message}", ex);
            }
            catch (JsonException ex)
            {
                Debug.WriteLine($"JSON serialization failed in UpdateListAsync: {ex.Message}");
                throw new Exception($"Failed to serialize list data for {listId}", ex);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Unexpected error in UpdateListAsync: {ex}");
                throw new Exception($"An unexpected error occurred while updating list {listId}", ex);
            }
        }

        public async Task DeleteListAsync(string listId)
        {
            try
            {
                Debug.WriteLine($"Deleting list with ID: {listId}");
                var response = await _httpClient.DeleteAsync($"lists/{listId}");
                response.EnsureSuccessStatusCode();
                Debug.WriteLine($"Successfully deleted list with ID: {listId}");
            }
            catch (HttpRequestException ex)
            {
                Debug.WriteLine($"HTTP request failed in DeleteListAsync: {ex.Message}");
                throw new Exception($"Failed to delete list {listId}: {ex.Message}", ex);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Unexpected error in DeleteListAsync: {ex}");
                throw new Exception($"An unexpected error occurred while deleting list {listId}", ex);
            }
        }

        // New methods for list sharing
        public async Task ShareListAsync(string listId, string userId)
        {
            await _httpClient.PostAsJsonAsync($"lists/{listId}/share", new { userId });
        }

        public async Task UnshareListAsync(string listId, string userId)
        {
            await _httpClient.DeleteAsync($"lists/{listId}/unshare");
        }

        // New methods for product management within lists
        public async Task AddProductToListAsync(string listId, ProductModel product)
        {
            await _httpClient.PostAsJsonAsync($"lists/{listId}/products", product);
        }

        public async Task RemoveProductFromListAsync(string listId, string productId)
        {
            await _httpClient.DeleteAsync($"lists/{listId}/products/{productId}");
        }

        public async Task UpdateProductInListAsync(string listId, string productId, ProductModel product)
        {
            await _httpClient.PutAsJsonAsync($"lists/{listId}/products/{productId}", product);
        }
    }
}