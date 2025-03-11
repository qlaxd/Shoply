using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Users;
using ShoppingListAdmin.Desktop.Models;
using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace ShoppingListAdmin.Desktop.Views.Users
{
    /// <summary>
    /// Interaction logic for UsersView.xaml
    /// </summary>
    public partial class UsersView : UserControl
    {
        public UsersView()
        {
            InitializeComponent();
        }

        private void DeleteUser_Click(object sender, RoutedEventArgs e)
        {
            // Add new user
        }

        private async void EditUser_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.DataContext is UserModel user)
            {
                var viewModel = DataContext as UsersViewModel;
                if (viewModel != null)
                {
                    await viewModel.EditUserAsync(user);
                }
            }
        }

        private void FilterButton_Click(object sender, RoutedEventArgs e)
        {
            // Filter users
        }
    }
}
