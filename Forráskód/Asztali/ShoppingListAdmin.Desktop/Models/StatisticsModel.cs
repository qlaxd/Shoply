using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ShoppingListAdmin.Desktop.Models
{
    public class StatisticsModel
    {
        // User statistics
        [JsonPropertyName("totalUsers")]
        public int TotalUsers { get; set; }

        [JsonPropertyName("activeUsers")]
        public int ActiveUsers { get; set; }

        [JsonPropertyName("newUsersThisMonth")]
        public int NewUsersThisMonth { get; set; }

        // List statistics
        [JsonPropertyName("totalLists")]
        public int TotalLists { get; set; }

        [JsonPropertyName("activeLists")]
        public int ActiveLists { get; set; }

        [JsonPropertyName("completedLists")]
        public int CompletedLists { get; set; }

        [JsonPropertyName("averageListsPerUser")]
        public double AverageListsPerUser { get; set; }

        // Product statistics
        [JsonPropertyName("totalProducts")]
        public int TotalProducts { get; set; }

        [JsonPropertyName("averageProductsPerList")]
        public double AverageProductsPerList { get; set; }

        [JsonPropertyName("mostAddedProducts")]
        public List<ProductStat> MostAddedProducts { get; set; } = new List<ProductStat>();

        [JsonPropertyName("mostPurchasedProducts")]
        public List<ProductStat> MostPurchasedProducts { get; set; } = new List<ProductStat>();

        // Collaboration statistics
        [JsonPropertyName("averageContributorsPerList")]
        public double AverageContributorsPerList { get; set; }

        [JsonPropertyName("collaborativeListsPercentage")]
        public double CollaborativeListsPercentage { get; set; }

        // Time-based metrics
        [JsonPropertyName("dailyActiveUsers")]
        public List<TimeBasedStat> DailyActiveUsers { get; set; } = new List<TimeBasedStat>();

        [JsonPropertyName("weeklyActiveUsers")]
        public List<TimeBasedStat> WeeklyActiveUsers { get; set; } = new List<TimeBasedStat>();

        [JsonPropertyName("monthlyActiveUsers")]
        public List<TimeBasedStat> MonthlyActiveUsers { get; set; } = new List<TimeBasedStat>();

        [JsonPropertyName("lastUpdated")]
        public DateTime LastUpdated { get; set; }
    }

    public class ProductStat
    {
        [JsonPropertyName("productName")]
        public string ProductName { get; set; }

        [JsonPropertyName("count")]
        public int Count { get; set; }
    }

    public class TimeBasedStat
    {
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }

        [JsonPropertyName("weekStart")]
        public DateTime WeekStart { get; set; }

        [JsonPropertyName("monthStart")]
        public DateTime MonthStart { get; set; }

        [JsonPropertyName("count")]
        public int Count { get; set; }
    }
} 