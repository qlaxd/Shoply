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

        // User statistics
        [ObservableProperty]
        private int _totalUsers;

        [ObservableProperty]
        private int _activeUsers;

        [ObservableProperty]
        private int _newUsersThisMonth;

        // List statistics
        [ObservableProperty]
        private int _totalLists;

        [ObservableProperty]
        private int _activeLists;

        [ObservableProperty]
        private int _completedLists;

        [ObservableProperty]
        private double _averageListsPerUser;

        // Product statistics
        [ObservableProperty]
        private int _totalProducts;

        [ObservableProperty]
        private double _averageProductsPerList;

        [ObservableProperty]
        private ObservableCollection<ProductStat> _mostAddedProducts;

        [ObservableProperty]
        private ObservableCollection<ProductStat> _mostPurchasedProducts;

        // Collaboration statistics
        [ObservableProperty]
        private double _averageContributorsPerList;

        [ObservableProperty]
        private double _collaborativeListsPercentage;

        // Time-based metrics
        [ObservableProperty]
        private ObservableCollection<TimeBasedStat> _dailyActiveUsers;

        [ObservableProperty]
        private ObservableCollection<TimeBasedStat> _weeklyActiveUsers;

        [ObservableProperty]
        private ObservableCollection<TimeBasedStat> _monthlyActiveUsers;

        [ObservableProperty]
        private DateTime _lastUpdated;

        public ICommand LoadStatisticsCommand { get; }

        public StatisticsViewModel(ApiService apiService)
        {
            _apiService = apiService ?? throw new ArgumentNullException(nameof(apiService));
            
            // Initialize collections
            MostAddedProducts = new ObservableCollection<ProductStat>();
            MostPurchasedProducts = new ObservableCollection<ProductStat>();
            DailyActiveUsers = new ObservableCollection<TimeBasedStat>();
            WeeklyActiveUsers = new ObservableCollection<TimeBasedStat>();
            MonthlyActiveUsers = new ObservableCollection<TimeBasedStat>();

            // Initialize commands
            LoadStatisticsCommand = new AsyncRelayCommand(ExecuteLoadStatisticsCommand);

            // Load data on initialization
            LoadStatisticsCommand.Execute(null);
        }

        private async Task ExecuteLoadStatisticsCommand()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var statistics = await _apiService.GetStatisticsAsync();

                // Update user statistics
                TotalUsers = statistics.TotalUsers;
                ActiveUsers = statistics.ActiveUsers;
                NewUsersThisMonth = statistics.NewUsersThisMonth;

                // Update list statistics
                TotalLists = statistics.TotalLists;
                ActiveLists = statistics.ActiveLists;
                CompletedLists = statistics.CompletedLists;
                AverageListsPerUser = statistics.AverageListsPerUser;

                // Update product statistics
                TotalProducts = statistics.TotalProducts;
                AverageProductsPerList = statistics.AverageProductsPerList;
                
                MostAddedProducts.Clear();
                foreach (var product in statistics.MostAddedProducts)
                {
                    MostAddedProducts.Add(product);
                }

                MostPurchasedProducts.Clear();
                foreach (var product in statistics.MostPurchasedProducts)
                {
                    MostPurchasedProducts.Add(product);
                }

                // Update collaboration statistics
                AverageContributorsPerList = statistics.AverageContributorsPerList;
                CollaborativeListsPercentage = statistics.CollaborativeListsPercentage;

                // Update time-based metrics
                DailyActiveUsers.Clear();
                foreach (var stat in statistics.DailyActiveUsers)
                {
                    DailyActiveUsers.Add(stat);
                }

                WeeklyActiveUsers.Clear();
                foreach (var stat in statistics.WeeklyActiveUsers)
                {
                    WeeklyActiveUsers.Add(stat);
                }

                MonthlyActiveUsers.Clear();
                foreach (var stat in statistics.MonthlyActiveUsers)
                {
                    MonthlyActiveUsers.Add(stat);
                }

                LastUpdated = statistics.LastUpdated;
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Error loading statistics: {ex.Message}";
                Debug.WriteLine($"Error in ExecuteLoadStatisticsCommand: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
