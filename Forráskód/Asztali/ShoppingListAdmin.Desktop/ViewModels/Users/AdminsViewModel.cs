using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.Models;
using CommunityToolkit.Mvvm.Messaging;

namespace ShoppingListAdmin.Desktop.ViewModels.Users
{
    public partial class AdminsViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;

        // Adminisztrátorok listája
        public ObservableCollection<UserModel> Admins { get; set; }

        // A szűrési típus (admin/user)
        [ObservableProperty]
        private string _filter;

        public class AdminUpdatedMessage(bool value);

        // A RelayCommand-ot a ViewModel konstruktora hívja meg, és így az adminisztrátorok betöltése
        public AdminsViewModel(ApiService apiService)
        {
            _apiService = apiService;
            Admins = new ObservableCollection<UserModel>();
            LoadAdmins(); 

            
            WeakReferenceMessenger.Default.Register<AdminUpdatedMessage>(this, (r, m) => 
            {
                LoadAdmins();
            });

            
            _filter = "admin"; 
        }


        public AdminsViewModel()
        {
        }

        // Adminisztrátorok betöltése (példa, adatbázisból vagy API-ból)
        private async void LoadAdmins()
        {
            var users = await _apiService.GetUsersAsync();
            Admins.Clear();
            foreach (var user in users)
            {
                if (user.Role.ToLower() == "admin")
                {
                    Admins.Add(user);
                }
            }
        }

        // A szűrés alkalmazása
        private void ApplyFilter()
        {
            var filteredAdmins = Admins.Where(u => u.Role.ToLower() == Filter.ToLower()).ToList();
            Admins.Clear();
            foreach (var admin in filteredAdmins)
            {
                Admins.Add(admin);
            }
        }

        // CRUD parancsok
        [RelayCommand]
        public void AddAdmin()
        {
            // Logika új adminisztrátor hozzáadásához
            // Például egy új adminisztrátor hozzáadása (valós adatbázis helyett itt csak példa)
            var newAdmin = new UserModel { Id = "4", Username = "newadmin", Email = "newadmin@example.com", PasswordHash = "newpassword", Role = "admin" };
            Admins.Add(newAdmin);
        }

        [RelayCommand]
        public void EditAdmin()
        {
            // Logika adminisztrátor szerkesztéséhez
            // Például az adminisztrátor szerkesztése, a példában itt nem történik semmi
        }

        [RelayCommand]
        public void DeleteAdmin()
        {
            // Logika adminisztrátor törléséhez
            // Például egy adminisztrátor törlése, például az első adminisztrátor törlése
            if (Admins.Any())
            {
                Admins.RemoveAt(0);  // Töröljük az első adminisztrátort (példa)
            }
        }

        // A szűrés alkalmazása
        [RelayCommand]
        public void FilterAdmins()
        {
            ApplyFilter();
        }
    }
}
