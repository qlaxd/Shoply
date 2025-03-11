namespace ShoppingListAdmin.Desktop.Models
{
    public class ProductCatalogModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string[] Category { get; set; }
        public string DefaultUnit { get; set; }
    }
}