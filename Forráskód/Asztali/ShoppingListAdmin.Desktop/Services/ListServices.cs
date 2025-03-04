using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

namespace ShoppingListAdmin.Desktop.Services
{
    public class ListService
    {
        private readonly HttpClient _httpClient;

        public ListService(string authToken)
        {
            _httpClient = new HttpClient { BaseAddress = new Uri("http://localhost:5000/api/") };
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authToken);
        }

        public async Task<List<ListModel>> GetAllListsAsync()
        {
            return await _httpClient.GetFromJsonAsync<List<ListModel>>("lists");
        }

        public async Task<ListModel> GetListByIdAsync(string listId)
        {
            return await _httpClient.GetFromJsonAsync<ListModel>($"lists/{listId}");
        }

        public async Task CreateListAsync(ListModel list)
        {
            await _httpClient.PostAsJsonAsync("lists", list);
        }

        public async Task UpdateListAsync(string listId, ListModel list)
        {
            await _httpClient.PutAsJsonAsync($"lists/{listId}", list);
        }

        public async Task DeleteListAsync(string listId)
        {
            await _httpClient.DeleteAsync($"lists/{listId}");
        }
    }
}