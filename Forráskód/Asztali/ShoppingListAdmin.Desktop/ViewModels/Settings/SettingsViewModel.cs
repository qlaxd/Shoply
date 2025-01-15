
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.ViewModels.Base;

namespace ShoppingListAdmin.Desktop.ViewModels.Settings
{
    public partial class SettingsViewModel : BaseViewModel
    {
        [ObservableProperty]
        private bool _isDarkTheme;

        [ObservableProperty]
        private string _fontSize;

        [ObservableProperty]
        private bool _notificationsEnabled;

        [ObservableProperty]
        private bool _soundEnabled;

        [RelayCommand]
        private void SaveSettings()
        {
            // Itt implementáld a beállítások mentését
        }

        public SettingsViewModel()
        {

        }
    }
}
