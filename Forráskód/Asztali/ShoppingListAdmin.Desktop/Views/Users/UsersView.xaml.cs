using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Users;
using ShoppingListAdmin.Desktop.Models;
using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace ShoppingListAdmin.Desktop.Views.Users
{
    public partial class UsersView : UserControl
    {
        public UsersView()
        {
            InitializeComponent();
        }

        private async void DeleteUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.DataContext is UserModel user)
            {
                var viewModel = DataContext as UsersViewModel;
                if (viewModel != null)
                {
                    var result = MessageBox.Show($"Biztosan törölni szeretnéd a(z) {user.Username} felhasználót?", "Megerősítés", MessageBoxButton.YesNo, MessageBoxImage.Warning);
                    if (result == MessageBoxResult.Yes)
                    {
                        await viewModel.DeleteUserAsync(user);
                    }
                }
            }
        }

        private async void EditUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.DataContext is UserModel user)
            {
                var viewModel = DataContext as UsersViewModel;
                if (viewModel != null)
                {
                    var dialog = new EditUserDialog(user);
                    if (dialog.ShowDialog() == true)
                    {
                        // If a new password was entered, update it
                        if (!string.IsNullOrEmpty(dialog.NewPassword))
                        {
                            user.PasswordHash = dialog.NewPassword; // Note: In a real application, this should be hashed
                        }
                        await viewModel.EditUserAsync(user);
                    }
                }
            }
        }

        private void FilterButton_Click(object sender, RoutedEventArgs e)
        {
            // Filter users
        }
    }
}
