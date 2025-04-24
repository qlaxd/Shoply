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
        private ObservableCollection<MonthlyGrowthStat> _userGrowthByMonth;

        [ObservableProperty]
        private ObservableCollection<CategoryListStat> _listsByCategory;

        [ObservableProperty]
        private ObservableCollection<CategoryProductStat> _productsByCategory;

        public bool HasError => !string.IsNullOrEmpty(ErrorMessage);

        public ICommand LoadUserStatsCommand { get; }
        public ICommand LoadListStatsCommand { get; }
        public ICommand LoadProductStatsCommand { get; }

        public StatisticsViewModel(ApiService apiService)
        {
            _apiService = apiService;

            UserGrowthByMonth = new ObservableCollection<MonthlyGrowthStat>();
            ListsByCategory = new ObservableCollection<CategoryListStat>();
            ProductsByCategory = new ObservableCollection<CategoryProductStat>();

            LoadUserStatsCommand = new AsyncRelayCommand(ExecuteLoadUserStatsCommand);
            LoadListStatsCommand = new AsyncRelayCommand(ExecuteLoadListStatsCommand);
            LoadProductStatsCommand = new AsyncRelayCommand(ExecuteLoadProductStatsCommand);

            // Load initial data
            ExecuteLoadUserStatsCommand();
            ExecuteLoadListStatsCommand();
            ExecuteLoadProductStatsCommand();
        }

        public StatisticsViewModel()
        {
        }

        private async Task ExecuteLoadUserStatsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var userStats = await _apiService.GetUserGrowthStatsAsync();
                UserGrowthByMonth.Clear();
                foreach (var stat in userStats.UserGrowthByMonth)
                {
                    UserGrowthByMonth.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading user stats: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteLoadListStatsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var listStats = await _apiService.GetListActivityStatsAsync();
                ListsByCategory.Clear();
                foreach (var stat in listStats.ListsByCategory)
                {
                    ListsByCategory.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading list stats: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteLoadProductStatsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var productStats = await _apiService.GetProductStatsAsync();
                ProductsByCategory.Clear();
                foreach (var stat in productStats.ProductsByCategory)
                {
                    ProductsByCategory.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading product stats: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
