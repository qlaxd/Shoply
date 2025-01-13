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

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class MainViewModel : BaseViewModel
    {
        private ControlPanelViewModel _controlPanelViewModel;
        private UsersViewModel _usersViewModel;
        private AdminsViewModel _adminsViewModel;
        private readonly ListsViewModel _listsViewModel;
        private readonly ProductViewModel _productViewModel;
        private readonly StatisticsViewModel _statisticsViewModel;
        private readonly SettingsViewModel _settingsViewModel;

        public MainViewModel()
        {
            _controlPanelViewModel = new ControlPanelViewModel();
            _usersViewModel = new UsersViewModel();
            _adminsViewModel = new AdminsViewModel();
        }

        public MainViewModel(
            ControlPanelViewModel controlPanelViewModel,
            UsersViewModel usersViewModel,
            ListsViewModel listsViewModel,
            ProductViewModel productViewModel,
            StatisticsViewModel statisticsViewModel,
            SettingsViewModel settingsViewModel,
            AdminsViewModel adminViewModel)
        {
            _controlPanelViewModel = controlPanelViewModel;
            _usersViewModel = usersViewModel;
            _listsViewModel = listsViewModel;
            _productViewModel = productViewModel;
            _statisticsViewModel = statisticsViewModel;
            _settingsViewModel = settingsViewModel;
            _adminsViewModel = adminViewModel;

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
        public void ShowSettings()
        {
            Caption = "Beállítások";
            Icon = IconChar.Gear;
            CurrentChildView = _settingsViewModel;
        }



        [ObservableProperty]
        private ObservableObject _currentViewModel;

        [RelayCommand]
        public void ShowAdmins()
        {
           
        }
    }
}
