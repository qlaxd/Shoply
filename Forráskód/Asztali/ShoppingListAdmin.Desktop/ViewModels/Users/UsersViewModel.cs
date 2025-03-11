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

        public UsersViewModel(ApiService apiService)
        {
            _apiService = apiService;
            Users = new ObservableCollection<UserModel>();
            LoadUsers(); // Felhasználók betöltése
            _filter = "user"; // Alapértelmezett szűrés
        }

        private async void LoadUsers()
        {
            try 
            {
                var users = await _apiService.GetUsersAsync();
                Users.Clear();
                foreach (var user in users.Where(u => u.Role.ToLower() == "user"))
                {
                    Users.Add(user);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"LoadUsers error: {ex.Message}");
                // Esetleg navigáció a login képernyőre ha 401-es hiba
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
        public async Task DeleteUserAsync(UserModel user)
        {
            if (user != null)
            {
                try
                {
                    await _apiService.DeleteUserAsync(user);
                    Users.Remove(user);  // Töröljük a felhasználót a listából
                }
                catch (Exception ex)
                {
                    // Hibakezelés
                    Debug.WriteLine($"Error deleting user: {ex.Message}");
                }
            }
        }

        [RelayCommand]
        public async Task EditUserAsync(UserModel user)
        {
            if (user != null)
            {
                try
                {
                    await _apiService.UpdateUserAsync(user);
                    // Frissítjük a felhasználók listáját a változások megjelenítéséhez
                    LoadUsers();
                }
                catch (Exception ex)
                {
                    // Hibakezelés
                    Debug.WriteLine($"Error updating user: {ex.Message}");
                }
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
