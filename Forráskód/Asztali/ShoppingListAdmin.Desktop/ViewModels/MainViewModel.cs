using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FontAwesome.Sharp;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using ShoppingListAdmin.Desktop.ViewModels.ControlPanel;
using ShoppingListAdmin.Desktop.ViewModels.Users;
using ShoppingListAdmin.Desktop.ViewModels.Lists;
using ShoppingListAdmin.Desktop.ViewModels.Statistics;
using ShoppingListAdmin.Desktop.ViewModels.Settings;
using ShoppingListAdmin.Desktop.ViewModels.Products;
using ShoppingListAdmin.Desktop.ViewModels.Categories;
using ShoppingListAdmin.Desktop.Services;
using System.Windows;
using ShoppingListAdmin.Desktop.Views.Login;
using ShoppingListAdmin.Desktop.ViewModels.Login;
using System.Linq;
using ShoppingListAdmin.Desktop.Views;
using System;
using System.Diagnostics;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class MainViewModel : BaseViewModel
    {
        private readonly ControlPanelViewModel _controlPanelViewModel;
        private readonly UsersViewModel _usersViewModel;
        private readonly AdminsViewModel _adminsViewModel;
        private readonly ListsViewModel _listsViewModel;
        private readonly ProductViewModel _productViewModel;
        private readonly StatisticsViewModel _statisticsViewModel;
        private readonly SettingsViewModel _settingsViewModel;
        private readonly CategoryViewModel _categoriesViewModel;

        public MainViewModel()
        {
            var apiService = new ApiService(); // Assuming ApiService has a parameterless constructor
            _controlPanelViewModel = new ControlPanelViewModel();
            _usersViewModel = new UsersViewModel(apiService);
            _listsViewModel = new ListsViewModel();
            _productViewModel = new ProductViewModel();
            _statisticsViewModel = new StatisticsViewModel();
            _settingsViewModel = new SettingsViewModel();
            _adminsViewModel = new AdminsViewModel(apiService); // Initialize _adminsViewModel
            _categoriesViewModel = new CategoryViewModel();
            _currentChildView = _controlPanelViewModel;
        }

        public MainViewModel(
            ControlPanelViewModel controlPanelViewModel,
            UsersViewModel usersViewModel,
            ListsViewModel listsViewModel,
            ProductViewModel productViewModel,
            StatisticsViewModel statisticsViewModel,
            SettingsViewModel settingsViewModel,
            CategoryViewModel categoriesViewModel,
            AdminsViewModel adminsViewModel)
        {
            _controlPanelViewModel = controlPanelViewModel;
            _usersViewModel = usersViewModel;
            _listsViewModel = listsViewModel;
            _productViewModel = productViewModel;
            _statisticsViewModel = statisticsViewModel;
            _settingsViewModel = settingsViewModel;
            _categoriesViewModel = categoriesViewModel;
            _adminsViewModel = adminsViewModel;

            CurrentChildView = _controlPanelViewModel;
            ShowDashboard();
        }

        [ObservableProperty]
        private string _caption = string.Empty;

        [ObservableProperty]
        private IconChar _icon = new IconChar();

        [ObservableProperty]
        private BaseViewModel _currentChildView;

        [RelayCommand]
        public void ShowDashboard()
        {
            Caption = "Vezérlőpult";
            Icon=IconChar.SolarPanel;
            CurrentChildView = _controlPanelViewModel;
        }

        [RelayCommand]
        public void ShowUsers()
        {
            Caption = "Felhasználók";
            Icon = IconChar.Users;
            CurrentChildView = _usersViewModel;
        }

        [RelayCommand]
        public void ShowLists()
        {
            Caption = "Listák";
            Icon = IconChar.List;
            CurrentChildView = _listsViewModel;
        }

        [RelayCommand]
        public void ShowProducts()
        {
            Caption = "Termékek";
            Icon = IconChar.Box;
            CurrentChildView = _productViewModel;
        }

        [RelayCommand]
        public void ShowStatistics()
        {
            Caption = "Statisztikák";
            Icon = IconChar.ChartBar;
            CurrentChildView = _statisticsViewModel;
        }

                [RelayCommand]
        public void ShowCategories()
        {
            Caption = "Kategóriák";
            Icon = IconChar.Box;
            CurrentChildView = _categoriesViewModel;
        }

        [RelayCommand]
        public void ShowSettings()
        {
            Caption = "Beállítások";
            Icon = IconChar.Gear;
            CurrentChildView = _settingsViewModel;
        }

        [RelayCommand]
        public async void ShowAdmins()
        {
            Caption = "Adminisztrátorok";
            Icon = IconChar.UserShield;
            CurrentChildView = _adminsViewModel;
            
            // Explicitly load admin data when navigating to the view
            await _adminsViewModel.LoadAdmins();
        }

        
            [RelayCommand]
            public async void Logout()
            {
                try
                {
                    // Close the MainView
                    var mainWindow = Application.Current.Windows
                        .OfType<Window>()
                        .FirstOrDefault(w => w is MainView);

                    if (mainWindow != null)
                    {
                        mainWindow.Close();
                    }

                    // Relaunch the LoginView
                    var loginView = new LoginView
                    {
                        DataContext = new LoginViewModel() // Ensure LoginViewModel is properly initialized
                    };
                    loginView.Show();
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Error during logout: {ex.Message}");
                }
            }

    }
}
