using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Services;
using ShoppingListAdmin.Desktop.ViewModels.Base;

namespace ShoppingListAdmin.Desktop.ViewModels.Statistics
{
    public partial class StatisticsViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;

        [ObservableProperty]
        private bool _isLoading;

        [ObservableProperty]
        private string _errorMessage;

        [ObservableProperty]
        private StatisticsModel _statistics;

        public bool HasError => !string.IsNullOrEmpty(ErrorMessage);

        public ICommand LoadStatisticsCommand { get; }

        public StatisticsViewModel(ApiService apiService)
        {
            _apiService = apiService;
            _statistics = new StatisticsModel();

            LoadStatisticsCommand = new AsyncRelayCommand(ExecuteLoadStatisticsCommand);

            // Load initial data
            ExecuteLoadStatisticsCommand();
        }

        public StatisticsViewModel()
        {
        }

        private async Task ExecuteLoadStatisticsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                Statistics = await _apiService.GetStatisticsAsync();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a statisztikák betöltése közben: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadStatisticsCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
