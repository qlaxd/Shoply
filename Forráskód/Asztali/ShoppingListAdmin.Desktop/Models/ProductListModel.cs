using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;


namespace ShoppingListAdmin.Desktop.Models
{
    public class ProductListModel
    {
        private ObservableCollection<ProductModel> _products;

        // Termékek listája
        public ObservableCollection<ProductModel> Products
        {
            get => _products;
            set
            {
                if (_products != value)
                {
                    _products = value;
                    OnPropertyChanged(nameof(Products));
                }
            }
        }

        // INotifyPropertyChanged esemény, amely értesíti a ViewModel-t a változásról
        public event PropertyChangedEventHandler PropertyChanged;

        // Esemény kiváltása, ha valamelyik property változik
        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        // Alapértelmezett konstruktor
        public ProductListModel()
        {
            Products = new ObservableCollection<ProductModel>();
        }

        // Termék hozzáadása a listához
        public void AddProduct(ProductModel product)
        {
            if (product != null)
            {
                Products.Add(product);
                OnPropertyChanged(nameof(Products));
            }
        }

        // Termék eltávolítása a listából
        public void RemoveProduct(ProductModel product)
        {
            if (product != null && Products.Contains(product))
            {
                Products.Remove(product);
                OnPropertyChanged(nameof(Products));
            }
        }

        // Adott termék keresése ID alapján
        public ProductModel FindProductById(int id)
        {
            return Products.FirstOrDefault(p => p.Id == id);
        }
    }
}
