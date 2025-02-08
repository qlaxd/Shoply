using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Models;

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
        _authToken = token;
        _httpClient.DefaultRequestHeaders.Authorization = 
            new AuthenticationHeaderValue("Bearer", token);
    }

    public async Task<List<User>> GetUsersAsync()
    {
        return await _httpClient.GetFromJsonAsync<List<User>>("api/users");
    }

    public async Task AddUserAsync(User user)
    {
        await _httpClient.PostAsJsonAsync("api/users", user);
    }
}

public class LoginResponse
{
    public string Token { get; set; }
    public string Message { get; set; }
}
//
//    public partial class UsersView : UserControl
//{
//   private readonly ApiService _apiService;
//    private List<User> _users;
//
//    public UsersView()
//    {
//        InitializeComponent();
 //       _apiService = new ApiService();
//        LoadUsers();
  //  }
//
 //   private async void LoadUsers()
  //  {
 //       _users = await _apiService.GetUsersAsync();
  //      UsersDataGrid.ItemsSource = _users;
  //  }
//}