using CommunityToolkit.Mvvm.Input;
using ShoppingListAdmin.Desktop.Models;
using ShoppingListAdmin.Desktop.ViewModels.Base;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows.Input;

namespace ShoppingListAdmin.Desktop.ViewModels.Lists
{
    public class ListsViewModel : BaseViewModel
    {
        private ProductListModel _productListModel;
        private ProductModel _selectedProduct;
        private string _newProductName;
        private string _newProductCategory;
        private decimal _newProductPrice;
        private int _newProductStock;
        private bool _newProductIsAvailable;

        // Terméklisták kezelése
        public ObservableCollection<ProductModel> Products => _productListModel.Products;

        // Kiválasztott termék
        public ProductModel SelectedProduct
        {
            get => _selectedProduct;
            set
            {
                if (_selectedProduct != value)
                {
                    _selectedProduct = value;
                    OnPropertyChanged(nameof(SelectedProduct));
                }
            }
        }

        // Új termék tulajdonságai
        public string NewProductName
        {
            get => _newProductName;
            set
            {
                if (_newProductName != value)
                {
                    _newProductName = value;
                    OnPropertyChanged(nameof(NewProductName));
                }
            }
        }

        public string NewProductCategory
        {
            get => _newProductCategory;
            set
            {
                if (_newProductCategory != value)
                {
                    _newProductCategory = value;
                    OnPropertyChanged(nameof(NewProductCategory));
                }
            }
        }

        public decimal NewProductPrice
        {
            get => _newProductPrice;
            set
            {
                if (_newProductPrice != value)
                {
                    _newProductPrice = value;
                    OnPropertyChanged(nameof(NewProductPrice));
                }
            }
        }

        public int NewProductStock
        {
            get => _newProductStock;
            set
            {
                if (_newProductStock != value)
                {
                    _newProductStock = value;
                    OnPropertyChanged(nameof(NewProductStock));
                }
            }
        }

        public bool NewProductIsAvailable
        {
            get => _newProductIsAvailable;
            set
            {
                if (_newProductIsAvailable != value)
                {
                    _newProductIsAvailable = value;
                    OnPropertyChanged(nameof(NewProductIsAvailable));
                }
            }
        }

        // Parancsok
        public ICommand AddProductCommand { get; }
        public ICommand RemoveProductCommand { get; }

        // INotifyPropertyChanged implementáció
        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // Konstruktor
        public ListsViewModel()
        {
            _productListModel = new ProductListModel();
            _productListModel.PropertyChanged += ProductListModel_PropertyChanged;

            // Parancsok inicializálása
            AddProductCommand = new RelayCommand(AddProduct, CanAddProduct);
            RemoveProductCommand = new RelayCommand(RemoveProduct, CanRemoveProduct);
        }

        private void ProductListModel_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(ProductListModel.Products))
            {
                OnPropertyChanged(nameof(Products));
            }
        }

        // Új termék hozzáadása
        private void AddProduct()
        {
            var newProduct = new ProductModel(Products.Count + 1, NewProductName, NewProductCategory, NewProductPrice, NewProductStock, NewProductIsAvailable);
            _productListModel.AddProduct(newProduct);

            // Tisztítsuk az űrlapot az új termék hozzáadása után
            NewProductName = string.Empty;
            NewProductCategory = string.Empty;
            NewProductPrice = 0m;
            NewProductStock = 0;
            NewProductIsAvailable = false;
        }

        private bool CanAddProduct()
        {
            return !string.IsNullOrWhiteSpace(NewProductName) && !string.IsNullOrWhiteSpace(NewProductCategory) && NewProductPrice > 0 && NewProductStock >= 0;
        }

        // Termék eltávolítása
        private void RemoveProduct()
        {
            if (SelectedProduct != null)
            {
                _productListModel.RemoveProduct(SelectedProduct);
                SelectedProduct = null;
            }
        }

        private bool CanRemoveProduct()
        {
            return SelectedProduct != null;
        }
    }
}
