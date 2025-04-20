using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ShoppingListAdmin.Desktop.Models
{
    // User Growth Statistics
    public class UserGrowthStatistics
    {
        [JsonPropertyName("totalUsers")]
        public int TotalUsers { get; set; }

        [JsonPropertyName("activeUsers")]
        public int ActiveUsers { get; set; }

        [JsonPropertyName("newUsersThisMonth")]
        public int NewUsersThisMonth { get; set; }

        [JsonPropertyName("userGrowthByMonth")]
        public List<MonthlyGrowthStat> UserGrowthByMonth { get; set; } = new List<MonthlyGrowthStat>();

        [JsonPropertyName("userActivityByDay")]
        public List<DailyActivityStat> UserActivityByDay { get; set; } = new List<DailyActivityStat>();

        [JsonPropertyName("userRetentionRate")]
        public double UserRetentionRate { get; set; }

        [JsonPropertyName("averageSessionDuration")]
        public TimeSpan AverageSessionDuration { get; set; }
    }

    public class MonthlyGrowthStat
    {
        [JsonPropertyName("month")]
        public DateTime Month { get; set; }

        [JsonPropertyName("newUsers")]
        public int NewUsers { get; set; }

        [JsonPropertyName("activeUsers")]
        public int ActiveUsers { get; set; }
    }

    public class DailyActivityStat
    {
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("activeUsers")]
        public int ActiveUsers { get; set; }

        [JsonPropertyName("newUsers")]
        public int NewUsers { get; set; }
    }

    // List Activity Statistics
    public class ListActivityStatistics
    {
        [JsonPropertyName("totalLists")]
        public int TotalLists { get; set; }

        [JsonPropertyName("activeLists")]
        public int ActiveLists { get; set; }

        [JsonPropertyName("completedLists")]
        public int CompletedLists { get; set; }

        [JsonPropertyName("averageListsPerUser")]
        public double AverageListsPerUser { get; set; }

        [JsonPropertyName("listCompletionRate")]
        public double ListCompletionRate { get; set; }

        [JsonPropertyName("averageCompletionTime")]
        public TimeSpan AverageCompletionTime { get; set; }

        [JsonPropertyName("listsByCategory")]
        public List<CategoryListStat> ListsByCategory { get; set; } = new List<CategoryListStat>();

        [JsonPropertyName("collaborativeLists")]
        public CollaborativeListStats CollaborativeLists { get; set; } = new CollaborativeListStats();
    }

    public class CategoryListStat
    {
        [JsonPropertyName("categoryName")]
        public string CategoryName { get; set; }

        [JsonPropertyName("totalLists")]
        public int TotalLists { get; set; }

        [JsonPropertyName("completedLists")]
        public int CompletedLists { get; set; }
    }

    public class CollaborativeListStats
    {
        [JsonPropertyName("totalCollaborativeLists")]
        public int TotalCollaborativeLists { get; set; }

        [JsonPropertyName("averageContributorsPerList")]
        public double AverageContributorsPerList { get; set; }

        [JsonPropertyName("collaborativeListsPercentage")]
        public double CollaborativeListsPercentage { get; set; }

        [JsonPropertyName("mostActiveCollaborators")]
        public List<UserCollaborationStat> MostActiveCollaborators { get; set; } = new List<UserCollaborationStat>();
    }

    public class UserCollaborationStat
    {
        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [JsonPropertyName("userName")]
        public string UserName { get; set; }

        [JsonPropertyName("collaborativeListsCount")]
        public int CollaborativeListsCount { get; set; }

        [JsonPropertyName("contributionsCount")]
        public int ContributionsCount { get; set; }
    }

    // Product Statistics
    public class ProductStatistics
    {
        [JsonPropertyName("totalProducts")]
        public int TotalProducts { get; set; }

        [JsonPropertyName("averageProductsPerList")]
        public double AverageProductsPerList { get; set; }

        [JsonPropertyName("mostAddedProducts")]
        public List<ProductStat> MostAddedProducts { get; set; } = new List<ProductStat>();

        [JsonPropertyName("mostPurchasedProducts")]
        public List<ProductStat> MostPurchasedProducts { get; set; } = new List<ProductStat>();

        [JsonPropertyName("productsByCategory")]
        public List<CategoryProductStat> ProductsByCategory { get; set; } = new List<CategoryProductStat>();

        [JsonPropertyName("priceStatistics")]
        public PriceStatistics PriceStats { get; set; } = new PriceStatistics();
    }

    public class CategoryProductStat
    {
        [JsonPropertyName("categoryName")]
        public string CategoryName { get; set; }

        [JsonPropertyName("totalProducts")]
        public int TotalProducts { get; set; }

        [JsonPropertyName("averagePrice")]
        public decimal AveragePrice { get; set; }
    }

    public class PriceStatistics
    {
        [JsonPropertyName("averagePrice")]
        public decimal AveragePrice { get; set; }

        [JsonPropertyName("highestPrice")]
        public decimal HighestPrice { get; set; }

        [JsonPropertyName("lowestPrice")]
        public decimal LowestPrice { get; set; }

        [JsonPropertyName("priceDistribution")]
        public List<PriceRangeStat> PriceDistribution { get; set; } = new List<PriceRangeStat>();
    }

    public class PriceRangeStat
    {
        [JsonPropertyName("range")]
        public string Range { get; set; }

        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("percentage")]
        public double Percentage { get; set; }
    }
} 