using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Services;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.ViewModels.Base;

namespace ShoppingListAdmin.Desktop.ViewModels.Products
{
    public partial class ProductViewModel : BaseViewModel
    {
        private readonly ProductCatalogService _productCatalogService;
        private ProductCatalogModel? _selectedProduct;

        public ObservableCollection<ProductCatalogModel> Products { get; set; }

        public ProductCatalogModel? SelectedProduct
        {
            get => _selectedProduct;
            set => SetProperty(ref _selectedProduct, value);
        }

        public ProductViewModel(ProductCatalogService productCatalogService)
        {
            _productCatalogService = productCatalogService;
            Products = new ObservableCollection<ProductCatalogModel>();
            LoadProducts();
        }

        private async void LoadProducts()
        {
            var products = await _productCatalogService.GetAllProductCatalogsAsync();
            Products.Clear();
            foreach (var product in products)
            {
                Products.Add(product);
            }
        }

        [RelayCommand]
        public async Task CreateProductAsync(ProductCatalogModel product)
        {
            await _productCatalogService.CreateProductCatalogAsync(product);
            LoadProducts();
        }

        [RelayCommand]
        public async Task UpdateProductAsync(ProductCatalogModel product)
        {
            await _productCatalogService.UpdateProductCatalogAsync(product.Id, product);
            LoadProducts();
        }

        [RelayCommand]
        public async Task DeleteProductAsync(ProductCatalogModel product)
        {
            await _productCatalogService.DeleteProductCatalogAsync(product.Id);
            LoadProducts();
        }
    }
}
