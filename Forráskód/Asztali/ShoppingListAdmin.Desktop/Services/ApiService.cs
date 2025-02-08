using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using ShoppingListAdmin.Desktop.Models;

public class ApiService
{
    private readonly HttpClient _httpClient;

    public ApiService()
    {
        _httpClient = new HttpClient { BaseAddress = new Uri("https://localhost:5001/") };
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