using System;
using System.Text.Json.Serialization;

namespace ShoppingListAdmin.Desktop.Models
{
    public class ProductCatalogModel
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("category")]
        public string CategoryId { get; set; } = string.Empty;

        [JsonPropertyName("defaultUnit")]
        public string DefaultUnit { get; set; } = string.Empty;

        [JsonPropertyName("barcode")]
        public string? Barcode { get; set; }

        [JsonPropertyName("createdBy")]
        public string CreatedById { get; set; } = string.Empty;

        [JsonPropertyName("lastUsed")]
        public DateTime LastUsed { get; set; }

        [JsonPropertyName("usageCount")]
        public int UsageCount { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("isAvailable")]
        public bool IsAvailable { get; set; }
    }
}