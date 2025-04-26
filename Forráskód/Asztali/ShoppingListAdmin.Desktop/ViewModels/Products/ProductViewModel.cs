using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.Services;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System;
using System.Diagnostics;
using System.Windows;

namespace ShoppingListAdmin.Desktop.ViewModels.Products
{
    public partial class ProductViewModel : BaseViewModel
    {
        private readonly ProductCatalogService _productCatalogService;
        private ProductCatalogModel? _selectedProduct;

        [ObservableProperty]
        private bool _isLoading;

        [ObservableProperty]
        private string _errorMessage;

        public ObservableCollection<ProductCatalogModel> Products { get; set; }

        public ProductCatalogModel? SelectedProduct
        {
            get => _selectedProduct;
            set => SetProperty(ref _selectedProduct, value);
        }

        public ProductViewModel(ProductCatalogService productCatalogService)
        {
            _productCatalogService = productCatalogService ?? throw new ArgumentNullException(nameof(productCatalogService));
            Products = new ObservableCollection<ProductCatalogModel>();
            LoadProducts();
        }

        public ProductViewModel()
        {
        }

        private async void LoadProducts()
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                var products = await _productCatalogService.GetAllProductCatalogsAsync();
                Products.Clear();
                foreach (var product in products)
                {
                    Products.Add(product);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a termékek betöltése közben: {ex.Message}";
                Debug.WriteLine($"Error in LoadProducts: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        private void ShowNewProductDialog()
        {
            MessageBox.Show(
                "Ez a funkció jelenleg fejlesztés alatt áll. Kérjük, próbálja meg később.",
                "Fejlesztés alatt",
                MessageBoxButton.OK,
                MessageBoxImage.Information
            );
        }

        [RelayCommand]
        public async Task UpdateProductAsync(ProductCatalogModel product)
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _productCatalogService.UpdateProductCatalogAsync(product.Id, product);
                LoadProducts();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a termék frissítése közben: {ex.Message}";
                Debug.WriteLine($"Error in UpdateProductAsync: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        [RelayCommand]
        public async Task DeleteProductAsync(ProductCatalogModel product)
        {
            try
            {
                IsLoading = true;
                ErrorMessage = string.Empty;

                await _productCatalogService.DeleteProductCatalogAsync(product.Id);
                LoadProducts();
            }
            catch (Exception ex)
            {
                ErrorMessage = $"Hiba a termék törlése közben: {ex.Message}";
                Debug.WriteLine($"Error in DeleteProductAsync: {ex}");
            }
            finally
            {
                IsLoading = false;
            }
        }
    }
}
