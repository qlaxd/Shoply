using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using ShoppingListAdmin.Desktop.Models;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Services;
using System;
using System.Diagnostics;
using CommunityToolkit.Mvvm.Messaging;
using static ShoppingListAdmin.Desktop.ViewModels.Users.AdminsViewModel;

namespace ShoppingListAdmin.Desktop.ViewModels.Users
{
    public partial class UsersViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;

        // Felhasználók listája
        public ObservableCollection<UserModel> Users { get; set; }

        // A szűrési típus (admin/user)
        [ObservableProperty]
        private string _filter;

        public UsersViewModel()
        {
            _apiService = new ApiService(); // Initialize with a default instance or mock
            Users = new ObservableCollection<UserModel>();
            _filter = "user"; // Default filter value
        }

        // A RelayCommand-ot a ViewModel konstruktora hívja meg, és így a felhasználók betöltése
        public UsersViewModel(ApiService apiService)
        {
            _apiService = apiService;
            Users = new ObservableCollection<UserModel>();
            LoadUsers(); // Felhasználók betöltése

            // Alapértelmezett szűrési érték
            _filter = "user"; // Alapértelmezett szűrés a "user" szerepre
        }

        // Felhasználók betöltése (példa, adatbázisból vagy API-ból)
        private async void LoadUsers()
        {
            var users = await _apiService.GetUsersAsync();
            Users.Clear();
            foreach (var user in users)
            {
                if (user.Role.ToLower() == "user")
                {
                    Users.Add(user);
                }
            }
        }

        // A szűrési logika
        private void ApplyFilter()
        {
            var filteredUsers = Users.Where(u => u.Role.ToLower() == Filter.ToLower()).ToList();
            Users.Clear();
            foreach (var user in filteredUsers)
            {
                Users.Add(user);
            }
        }
        

        [RelayCommand]
        public async Task PromoteToAdminAsync(UserModel user)
        {
        if (user != null)
        {
            try
            {
                await _apiService.PromoteToAdminAsync(user);
                // Frissítjük a felhasználók listáját a változások megjelenítéséhez
                LoadUsers();
                WeakReferenceMessenger.Default.Send(new AdminUpdatedMessage(true));
            }
            catch (Exception ex)
            {
                // Hibakezelés
                Debug.WriteLine($"Error promoting user to admin: {ex.Message}");
            }
        }
        }
        

        [RelayCommand]
        public void DeleteUser()
        {
            // Logika felhasználó törléséhez
            // Például egy felhasználó törlése, például az első felhasználó törlése
            if (Users.Any())
            {
                Users.RemoveAt(0);  // Töröljük az első felhasználót (példa)
            }
        }

        // A szűrés alkalmazása
        [RelayCommand]
        public void FilterUsers()
        {
            ApplyFilter();
        }
    }
}
