using ShoppingListAdmin.Desktop.Models;
using System.Windows;

namespace ShoppingListAdmin.Desktop.Views.Users
{
    public partial class EditUserDialog : Window
    {
        private readonly UserModel _user;
        public string NewPassword { get; private set; }

        public EditUserDialog(UserModel user)
        {
            InitializeComponent();
            _user = user;
            LoadUserData();
        }

        private void LoadUserData()
        {
            UsernameTextBox.Text = _user.Username;
            EmailTextBox.Text = _user.Email;
            NewPasswordBox.Password = string.Empty;
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            _user.Username = UsernameTextBox.Text;
            _user.Email = EmailTextBox.Text;
            
            // Only update password if a new one was entered
            if (!string.IsNullOrEmpty(NewPasswordBox.Password))
            {
                NewPassword = NewPasswordBox.Password;
            }
            
            DialogResult = true;
            Close();
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
            Close();
        }
    }
} 