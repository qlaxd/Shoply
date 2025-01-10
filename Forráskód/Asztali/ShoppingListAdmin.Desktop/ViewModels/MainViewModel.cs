using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using FontAwesome.Sharp;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using ShoppingListAdmin.Desktop.ViewModels.ControlPanel;
using ShoppingListAdmin.Desktop.ViewModels.Users;

namespace ShoppingListAdmin.Desktop.ViewModels
{
    public partial class MainViewModel : BaseViewModel
    {
        private ControlPanelViewModel _controlPanelViewModel;
        private UsersViewModel _usersViewModel;

        public MainViewModel()
        {
            _controlPanelViewModel = new ControlPanelViewModel();
            _usersViewModel = new UsersViewModel();
        }

        public MainViewModel(
            ControlPanelViewModel controlPanelViewModel,
            UsersViewModel usersViewModel 
            )
        {
            _controlPanelViewModel = controlPanelViewModel;
            _usersViewModel = usersViewModel;


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

        // [RelayCommand]
        // public void ShowLists()
        // {
        //     Caption = "Listák";
        //     Icon = IconChar.List;
        //     CurrentChildView = _listsViewModel;
        // }

        // [RelayCommand]
        // public void ShowProducts()
        // {
        //     Caption = "Termékek";
        //     Icon = IconChar.Box;
        //     CurrentChildView = _productsViewModel;
        // }

        // [RelayCommand]
        // public void ShowStatistics()
        // {
        //     Caption = "Statisztikák";
        //     Icon = IconChar.ChartBar;
        //     CurrentChildView = _statisticsViewModel;
        // }

        // [RelayCommand]
        // public void ShowSettings()
        // {
        //     Caption = "Beállítások";
        //     Icon = IconChar.Cogs;
        //     CurrentChildView = _settingsViewModel;
        // }
    }
}
