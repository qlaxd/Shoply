using CommunityToolkit.Mvvm.ComponentModel;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Repositories;
using System.Threading;

namespace ShoppingListAdmin.Controls.ViewModels
{
    public partial class UserOptionControlViewModel : ObservableObject
    {
        private UserRepository _userRepository = new();

        [ObservableProperty]
        private UserAccount _currentUser = new();

        public UserOptionControlViewModel()
        {
            LoadCurrentUserData();
        }

        private void LoadCurrentUserData()
        {
            if (Thread.CurrentPrincipal is not null && Thread.CurrentPrincipal.Identity is not null && Thread.CurrentPrincipal.Identity.Name is not null)
            {
                User? user = _userRepository.GetByUsername(Thread.CurrentPrincipal.Identity.Name);

                if (user is not null)
                {
                    CurrentUser.Username = user.Username;
                    CurrentUser.DisplayName = user.HungarianFullName;
                }
            }
            CurrentUser.DisplayName = "Nincs felhasználó";
        }
    }
}
