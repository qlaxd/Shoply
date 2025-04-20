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

        // User Statistics
        [ObservableProperty]
        private UserGrowthStatistics _userGrowthStatistics;

        [ObservableProperty]
        private ObservableCollection<MonthlyGrowthStat> _userGrowthByMonth;

        [ObservableProperty]
        private ObservableCollection<DailyActivityStat> _userActivityByDay;

        // List Statistics
        [ObservableProperty]
        private ListActivityStatistics _listActivityStatistics;

        [ObservableProperty]
        private ObservableCollection<CategoryListStat> _listsByCategory;

        [ObservableProperty]
        private ObservableCollection<UserCollaborationStat> _mostActiveCollaborators;

        // Product Statistics
        [ObservableProperty]
        private ProductStatistics _productStatistics;

        [ObservableProperty]
        private ObservableCollection<CategoryProductStat> _productsByCategory;

        [ObservableProperty]
        private ObservableCollection<PriceRangeStat> _priceDistribution;

        // Commands
        public ICommand LoadUserStatsCommand { get; }
        public ICommand LoadListStatsCommand { get; }
        public ICommand LoadProductStatsCommand { get; }
        public ICommand LoadAllStatsCommand { get; }

        public StatisticsViewModel(ApiService apiService)
        {
            _apiService = apiService ?? throw new ArgumentNullException(nameof(apiService));
            
            // Initialize collections
            UserGrowthByMonth = new ObservableCollection<MonthlyGrowthStat>();
            UserActivityByDay = new ObservableCollection<DailyActivityStat>();
            ListsByCategory = new ObservableCollection<CategoryListStat>();
            MostActiveCollaborators = new ObservableCollection<UserCollaborationStat>();
            ProductsByCategory = new ObservableCollection<CategoryProductStat>();
            PriceDistribution = new ObservableCollection<PriceRangeStat>();

            // Initialize commands
            LoadUserStatsCommand = new AsyncRelayCommand(ExecuteLoadUserStatsCommand);
            LoadListStatsCommand = new AsyncRelayCommand(ExecuteLoadListStatsCommand);
            LoadProductStatsCommand = new AsyncRelayCommand(ExecuteLoadProductStatsCommand);
            LoadAllStatsCommand = new AsyncRelayCommand(ExecuteLoadAllStatsCommand);

            // Load initial data
            LoadAllStatsCommand.Execute(null);
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

                UserGrowthStatistics = await _apiService.GetUserGrowthStatsAsync();

                // Update collections
                UserGrowthByMonth.Clear();
                foreach (var stat in UserGrowthStatistics.UserGrowthByMonth)
                {
                    UserGrowthByMonth.Add(stat);
                }

                UserActivityByDay.Clear();
                foreach (var stat in UserGrowthStatistics.UserActivityByDay)
                {
                    UserActivityByDay.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading user statistics: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadUserStatsCommand: {ex}");
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

                ListActivityStatistics = await _apiService.GetListActivityStatsAsync();

                // Update collections
                ListsByCategory.Clear();
                foreach (var stat in ListActivityStatistics.ListsByCategory)
                {
                    ListsByCategory.Add(stat);
                }

                MostActiveCollaborators.Clear();
                foreach (var stat in ListActivityStatistics.CollaborativeLists.MostActiveCollaborators)
                {
                    MostActiveCollaborators.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading list statistics: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadListStatsCommand: {ex}");
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

                ProductStatistics = await _apiService.GetProductStatsAsync();

                // Update collections
                ProductsByCategory.Clear();
                foreach (var stat in ProductStatistics.ProductsByCategory)
                {
                    ProductsByCategory.Add(stat);
                }

                PriceDistribution.Clear();
                foreach (var stat in ProductStatistics.PriceStats.PriceDistribution)
                {
                    PriceDistribution.Add(stat);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading product statistics: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadProductStatsCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        private async Task ExecuteLoadAllStatsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                // Load all statistics in parallel
                var userStatsTask = ExecuteLoadUserStatsCommand();
                var listStatsTask = ExecuteLoadListStatsCommand();
                var productStatsTask = ExecuteLoadProductStatsCommand();

                await Task.WhenAll(userStatsTask, listStatsTask, productStatsTask);
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading all statistics: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadAllStatsCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
