using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using ShoppingListAdmin.Desktop.Models;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Services;

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

        // A RelayCommand-ot a ViewModel konstruktora hívja meg, és így a felhasználók betöltése
        public UsersViewModel(ApiService apiService)
        {
            _apiService = apiService;
            Users = new ObservableCollection<UserModel>();
            LoadUsers(); // Felhasználók betöltése

            // Alapértelmezett szűrési érték
            _filter = "user"; // Alapértelmezett szűrés a "user" szerepre
        }

        public UsersViewModel()
        {
        }

        // Felhasználók betöltése (példa, adatbázisból vagy API-ból)
        private async void LoadUsers()
        {
            var users = await _apiService.GetUsersAsync();
            Users.Clear();
            foreach (var user in users)
            {
                Users.Add(user);
            }
        }

        // A szűrési logika
        private void ApplyFilter()
        {
            var filteredUsers = Users.Where(u => u.Role.ToLower() == _filter.ToLower()).ToList();
            Users.Clear();
            foreach (var user in filteredUsers)
            {
                Users.Add(user);
            }
        }

        // CRUD parancsok
        [RelayCommand]
        public void AddUser()
        {
            // Logika új felhasználó hozzáadásához
            // Például egy új felhasználó hozzáadása (valós adatbázis helyett itt csak példa)
            var newUser = new UserModel { Id = "4", Username = "newuser", Email = "newuser@example.com", PasswordHash = "newpassword", Role = "user" };
            Users.Add(newUser);
        }

        [RelayCommand]
        public void EditUser()
        {
            // Logika felhasználó szerkesztéséhez
            // Például a felhasználó szerkesztése, a példában itt nem történik semmi
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
