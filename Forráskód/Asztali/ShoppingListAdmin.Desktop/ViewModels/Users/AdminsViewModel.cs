using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ShoppingListAdmin.Desktop.ViewModels.Users
{
    public partial class AdminsViewModel : ObservableObject
    {
        // Adminisztrátorok listája
        [ObservableProperty]
        private ObservableCollection<Admin> _admins;

        // Konstruktor
        public AdminsViewModel()
        {
            _admins = new ObservableCollection<Admin>();
        }

        // Parancs az adminisztrátorok betöltésére
        [RelayCommand]
        public async Task LoadAdminsAsync()
        {
            // Itt töltheted be az adminisztrátorok listáját, például egy adatbázisból vagy API-ból
            var admins = await AdminService.GetAdminsAsync();
            Admins.Clear();
            foreach (var admin in admins)
            {
                Admins.Add(admin);
            }
        }

        // Parancs egy adminisztrátor törlésére
        [RelayCommand]
        public async Task DeleteAdminAsync(Admin admin)
        {
            if (admin != null)
            {
                // Itt törölhetjük az adminisztrátort (például adatbázisból, vagy API-n keresztül)
                bool result = await AdminService.DeleteAdminAsync(admin.Id);
                if (result)
                {
                    Admins.Remove(admin);  // Törlés a listából, ha sikeres
                }
            }
        }

        // Parancs egy adminisztrátor szerkesztésére
        [RelayCommand]
        public async Task EditAdminAsync(Admin admin)
        {
            if (admin != null)
            {
                // Itt szerkeszthetjük az adminisztrátort (például egy új adatbekérő képernyőn keresztül)
                var updatedAdmin = await AdminService.EditAdminAsync(admin);
                if (updatedAdmin != null)
                {
                    // Frissítjük az admin listáját a módosított adminnal
                    var index = Admins.IndexOf(admin);
                    if (index >= 0)
                    {
                        Admins[index] = updatedAdmin;
                    }
                }
            }
        }
    }

    // Admin osztály példa
    public class Admin
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
    }

    // Példa AdminService, ami kommunikál az adatforrással (API, adatbázis, stb.)
    public static class AdminService
    {
        public static async Task<ObservableCollection<Admin>> GetAdminsAsync()
        {
            // Itt kellene az adminok lekérését megvalósítani (API vagy adatbázis)
            // Példa adat:
            await Task.Delay(500); // Szimulálunk egy API hívást
            return new ObservableCollection<Admin>
            {
                new Admin { Id = "1", Username = "admin1", Email = "admin1@example.com" },
                new Admin { Id = "2", Username = "admin2", Email = "admin2@example.com" }
            };
        }

        public static async Task<bool> DeleteAdminAsync(string adminId)
        {
            // Itt törölhetjük az adminisztrátort
            await Task.Delay(500); // Szimuláljuk a törlés folyamatát
            return true; // Visszatérünk true-val, ha sikerült
        }

        public static async Task<Admin> EditAdminAsync(Admin admin)
        {
            // Itt szerkeszthetjük az admin adatokat
            await Task.Delay(500); // Szimuláljuk a szerkesztést
            admin.Email = "updated@example.com"; // Például frissítjük az email címet
            return admin;
        }
    }
}
